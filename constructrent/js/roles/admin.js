import { apiService } from '../services/apiService.js';
import { createStatCard } from '../components/cards.js';
import { createTable } from '../components/tables.js';
async function createAdminDashboardView() {
  try {
    const [users, tools, rentals, income] = await Promise.all([
      apiService.getUsuarios(),
      apiService.getHerramientas(),
      apiService.getReservas(),
      //apiService.getFacturas()
    ]);

    console.log(users, tools, rentals, income);

    const stats = {
      users: {
        value: users.length.toString(),
        change: { type: 'positive', icon: 'fas fa-arrow-up', text: '12% desde el mes pasado' }
      },
      tools: {
        value: tools.length.toString(),
        change: { type: 'positive', icon: 'fas fa-arrow-up', text: '8% desde el mes pasado' }
      },
      rentals: {
        value: rentals.length.toString(),
        change: { type: 'positive', icon: 'fas fa-arrow-up', text: '5% desde el mes pasado' }
      },
      income: {
        value: `$${income.reduce((sum, invoice) => sum + parseFloat(invoice.monto), 0).toFixed(2)}`,
        change: { type: 'positive', icon: 'fas fa-arrow-up', text: '15% desde el mes pasado' }
      }
    };

    const recentRentals = rentals.slice(0, 5).map(rental => [
      rental.id,
      rental.cliente.nombre,
      rental.herramienta.nombre,
      rental.fechaInicio,
      rental.fechaFin,
      `<span class="status status-${rental.estado.toLowerCase()}">${rental.estado}</span>`,
      `$${rental.precio}`,
      '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>'
    ]);

    return `
      <div class="view admin-view admin-dashboard-view">
        <div class="dashboard-header">
          <div class="dashboard-title">Panel de Administrador</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-plus"></i>
              <span>Nuevo Reporte</span>
            </button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard('Usuarios Totales', stats.users.value, 'fas fa-users', '#5e72e4', stats.users.change)}
          ${createStatCard('Herramientas Registradas', stats.tools.value, 'fas fa-tools', '#11cdef', stats.tools.change)}
          ${createStatCard('Alquileres Activos', stats.rentals.value, 'fas fa-clipboard-list', '#fb6340', stats.rentals.change)}
          ${createStatCard('Ingresos Mensuales', stats.income.value, 'fas fa-dollar-sign', '#2dce89', stats.income.change)}
        </div>
        ${createTable('Alquileres Recientes', ['ID', 'Cliente', 'Herramienta', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Monto', 'Acciones'], recentRentals)}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return `<div>Error al cargar los datos del dashboard.</div>`;
  }
}

async function createAdminUsersView() {
  try {
    const users = await apiService.getUsuarios();

    const userData = users.map(user => [
      user.id,
      user.nombre,
      user.email,
      user.rol,
      user.fechaRegistro,
      `<span class="status status-${user.estado === 'Activo' ? 'available' : 'maintenance'}">${user.estado}</span>`,
      '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i> <i class="fas fa-trash action-icon"></i>'
    ]);

    return `
      <div class="view admin-view admin-users-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Gestión de Usuarios</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-plus"></i>
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>
        ${createTable('Usuarios Registrados', ['ID', 'Nombre', 'Email', 'Rol', 'Fecha Registro', 'Estado', 'Acciones'], userData)}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching users:', error);
    return `<div>Error al cargar la lista de usuarios.</div>`;
  }
}
// Vista de Alquileres de Administrador
async function createAdminRentalsView() {
  try {
    const rentals = await apiService.getReservas();
    const providers = await apiService.getProveedores();

    const rentalData = rentals.slice(0, 5).map(rental => {
      const provider = providers.find(p => p.id === rental.proveedorId) || { nombre: 'Proveedor no encontrado' };
      return [
        rental.id,
        rental.cliente.nombre,
        provider.nombre,
        rental.herramienta.nombre,
        rental.fechaInicio,
        rental.fechaFin,
        `<span class="status status-${rental.estado.toLowerCase()}">${rental.estado}</span>`,
        `$${rental.precio}`,
        '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>'
      ];
    });

    return `
      <div class="view admin-view admin-rentals-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Historial de Alquileres</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard('Alquileres Totales', rentals.length.toString(), 'fas fa-clipboard-list', '#fb6340', { type: 'positive', icon: 'fas fa-arrow-up', text: '8% desde el mes pasado' })}
          ${createStatCard('Alquileres Activos', rentals.filter(r => r.estado === 'En Alquiler').length.toString(), 'fas fa-clock', '#11cdef', { type: 'positive', icon: 'fas fa-arrow-up', text: '5% desde el mes pasado' })}
          ${createStatCard('Devoluciones Pendientes', rentals.filter(r => r.estado === 'Pendiente').length.toString(), 'fas fa-exclamation-circle', '#fb6340', { type: 'negative', icon: 'fas fa-arrow-up', text: '12% desde el mes pasado' })}
          ${createStatCard('Reportes de Daños', rentals.filter(r => r.estado === 'Dañado').length.toString(), 'fas fa-tools', '#f5365c', { type: 'negative', icon: 'fas fa-arrow-up', text: '3% desde el mes pasado' })}
        </div>
        ${createTable('Todos los Alquileres', ['ID', 'Cliente', 'Proveedor', 'Herramienta', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Monto', 'Acciones'], rentalData)}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return `<div>Error al cargar la lista de alquileres.</div>`;
  }
}

// Vista de Reportes de Administrador
async function createAdminReportsView() {
  try {
    const [invoices, herramientas, proveedores, reservas] = await Promise.all([
      //apiService.getFacturas(),
      apiService.getHerramientas(),
      apiService.getProveedores(),
      apiService.getReservas()
    ]);

    // Validación segura
    const totalIncome = Array.isArray(invoices)
      ? invoices.reduce((sum, inv) => sum + parseFloat(inv.monto || 0), 0)
      : 0;

    // Agrupar alquileres por categoría
    const rentalsByCategory = {};
    if (Array.isArray(herramientas)) {
      herramientas.forEach(h => {
        if (!rentalsByCategory[h.categoria]) rentalsByCategory[h.categoria] = 0;
        rentalsByCategory[h.categoria]++;
      });
    }

    const mostRentedCategory = Object.entries(rentalsByCategory).reduce(
      (a, b) => (b[1] > a[1] ? b : a),
      ['', 0]
    )[0];

    // Proveedor más activo
    const activeProvider = (Array.isArray(proveedores) ? proveedores : []).sort((a, b) => {
      const countA = (Array.isArray(reservas) ? reservas.filter(r => r.proveedorId === a.id) : []).length;
      const countB = (Array.isArray(reservas) ? reservas.filter(r => r.proveedorId === b.id) : []).length;
      return countB - countA;
    })[0];

    return `
      <div class="view admin-view admin-reports-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Reportes y Estadísticas</div>
          <div class="action-buttons">
            <button class="btn btn-secondary"><i class="fas fa-calendar"></i><span>Periodo</span></button>
            <button class="btn btn-primary"><i class="fas fa-download"></i><span>Exportar</span></button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard('Ingresos Totales', `$${totalIncome.toFixed(2)}`, 'fas fa-dollar-sign', '#2dce89', { type: 'positive', icon: 'fas fa-arrow-up', text: '15% desde el año pasado' })}
          ${createStatCard('Herramientas Más Rentadas', mostRentedCategory, 'fas fa-tools', '#11cdef', { text: `${Math.round((rentalsByCategory[mostRentedCategory] / herramientas.length) * 100)}% del total de alquileres` })}
          ${createStatCard('Proveedor Más Activo', activeProvider?.nombre || 'Ninguno', 'fas fa-store', '#5e72e4', { text: `${reservas?.filter(r => r.proveedorId === activeProvider?.id)?.length || 0} alquileres este mes` })}
          ${createStatCard('Tasa de Incidencias', '3.2%', 'fas fa-exclamation-triangle', '#f5365c', { type: 'positive', icon: 'fas fa-arrow-down', text: '0.5% desde el mes pasado' })}
        </div>
        ${createTable('Rentabilidad por Categoría', ['Categoría', 'Alquileres', 'Ingresos', 'Tasa de Uso', 'Incidencias', 'Rentabilidad'], Object.entries(rentalsByCategory).map(([cat, count]) => [
      cat,
      count.toString(),
      `$${(count * 100).toFixed(2)}`,
      `${Math.min(count * 10, 100)}%`,
      `${Math.floor(Math.random() * 5)}%`,
      count > 50 ? 'Alta' : 'Media'
    ]))}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return `<div>Error al cargar reportes.</div>`;
  }
}

// Función para crear todas las vistas de administrador
export function createAdminViews() {
  return `
    ${createAdminDashboardView()}
    ${createAdminUsersView()}
    ${createAdminRentalsView()}
    ${createAdminReportsView()}
  `;
}
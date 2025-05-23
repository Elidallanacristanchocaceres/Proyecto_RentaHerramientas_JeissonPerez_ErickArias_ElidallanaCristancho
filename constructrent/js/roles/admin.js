import { apiService } from '../services/apiService.js';
import { createStatCard } from '../components/cards.js';
import { createTable } from '../components/tables.js';

// === Vista del Dashboard ===
async function createAdminDashboardView() {
  try {
    const [users, tools, rentals] = await Promise.all([
      apiService.getUsuarios(),
      apiService.getHerramientas(),
      apiService.getReservas()
    ]);

    const recentRentals = rentals.slice(0, 5).map(rental => [
      rental.id,
      rental.cliente?.nombre || 'Cliente no disponible',
      rental.herramienta?.nombre || 'Herramienta no disponible',
      rental.fechaInicio || 'No especificada',
      rental.fechaFin || 'No especificada',
      `<span class="status status-${rental.estado?.toLowerCase() || 'unknown'}">${rental.estado || 'Desconocido'}</span>`,
      `$${parseFloat(rental.precio || 0).toFixed(2)}`,
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
          ${createStatCard('Usuarios Totales', users.length.toString(), 'fas fa-users', '#5e72e4', { type: 'positive', icon: 'fas fa-arrow-up', text: '12% desde el mes pasado' })}
          ${createStatCard('Herramientas Registradas', tools.length.toString(), 'fas fa-tools', '#11cdef', { type: 'positive', icon: 'fas fa-arrow-up', text: '8% desde el mes pasado' })}
          ${createStatCard('Alquileres Activos', rentals.length.toString(), 'fas fa-clipboard-list', '#fb6340', { type: 'positive', icon: 'fas fa-arrow-up', text: '5% desde el mes pasado' })}
        </div>
        ${createTable('Alquileres Recientes', ['ID', 'Cliente', 'Herramienta', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Monto', 'Acciones'], recentRentals)}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return `<div>Error al cargar los datos del dashboard.</div>`;
  }
}

// === Vista de Usuarios ===
async function createAdminUsersView() {
  try {
    const users = await apiService.getUsuarios();

    const userData = users.map(user => [
      user.id,
      user.nombre || 'Nombre no disponible',
      user.email || 'Email no disponible',
      user.rol || 'Rol no definido',
      user.fechaRegistro || 'Fecha no registrada',
      `<span class="status status-${user.estado === 'Activo' ? 'available' : 'maintenance'}">${user.estado || 'Sin estado'}</span>`,
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

// === Vista de Alquileres ===
async function createAdminRentalsView() {
  try {
    const [rentals, providers] = await Promise.all([
      apiService.getReservas(),
      apiService.getProveedores()
    ]);

    const rentalData = rentals.map(rental => {
      const provider = providers.find(p => p.id === rental.proveedorId) || { nombre: 'Proveedor no encontrado' };
      return [
        rental.id,
        rental.cliente?.nombre || 'Cliente no disponible',
        provider.nombre,
        rental.herramienta?.nombre || 'Herramienta no disponible',
        rental.fechaInicio || 'No especificada',
        rental.fechaFin || 'No especificada',
        `<span class="status status-${rental.estado?.toLowerCase() || 'unknown'}">${rental.estado || 'Desconocido'}</span>`,
        `$${parseFloat(rental.precio || 0).toFixed(2)}`,
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
        ${createTable('Todos los Alquileres', ['ID', 'Cliente', 'Proveedor', 'Herramienta', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Monto', 'Acciones'], rentalData)}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return `<div>Error al cargar la lista de alquileres.</div>`;
  }
}

// === Vista de Reportes ===
async function createAdminReportsView() {
  try {
    const [tools, providers, reservas] = await Promise.all([
      apiService.getHerramientas(),
      apiService.getProveedores(),
      apiService.getReservas()
    ]);

    // Agrupar por categoría
    const rentalsByCategory = {};
    if (Array.isArray(tools)) {
      tools.forEach(h => {
        const categoria = h.categoria || 'Sin categoría';
        rentalsByCategory[categoria] = (rentalsByCategory[categoria] || 0) + 1;
      });
    }

    // Proveedor más activo
    const activeProvider = (Array.isArray(providers) ? providers : []).sort((a, b) => {
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
          ${createStatCard('Herramientas Más Rentadas', Object.keys(rentalsByCategory)[0] || 'Ninguna', 'fas fa-tools', '#11cdef', { text: 'Mayor uso por categoría' })}
          ${createStatCard('Proveedor Más Activo', activeProvider?.nombre || 'Ninguno', 'fas fa-store', '#5e72e4', { text: 'Mayor cantidad de alquileres' })}
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return `<div>Error al cargar reportes.</div>`;
  }
}

// === Función principal para crear todas las vistas ===
export async function createAdminViews() {
  try {
    const dashboard = await createAdminDashboardView();
    const users = await createAdminUsersView();
    const rentals = await createAdminRentalsView();
    const reports = await createAdminReportsView();

    return `${dashboard}${users}${rentals}${reports}`;
  } catch (error) {
    console.error('Error creating admin views:', error);
    return `<div>Error al cargar las vistas de administrador.</div>`;
  }
}
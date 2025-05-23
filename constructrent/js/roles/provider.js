import { apiService } from '../services/apiService.js';
import { createStatCard } from '../components/cards.js';
import { createTable } from '../components/tables.js';

async function createProviderDashboardView() {
  try {
    const [tools, rentals] = await Promise.all([
      apiService.getHerramientas(),
      apiService.getReservas()
    ]);

    const providerTools = tools.filter(tool => tool.proveedorId === 1); // Cambia por ID dinámico si es posible
    const providerRentals = rentals.filter(r => r.proveedorId === 1);

    const stats = {
      tools: {
        value: providerTools.length.toString(),
        change: { type: 'positive', icon: 'fas fa-arrow-up', text: '5% desde el mes pasado' }
      },
      rentals: {
        value: providerRentals.length.toString(),
        change: { type: 'positive', icon: 'fas fa-arrow-up', text: '12% desde el mes pasado' }
      },
      income: {
        value: `$${providerRentals.reduce((sum, r) => sum + parseFloat(r.precio || 0), 0).toFixed(2)}`,
        change: { type: 'positive', icon: 'fas fa-arrow-up', text: '8% desde el mes pasado' }
      },
      occupation: {
        value: `${Math.min(
          (providerRentals.length / Math.max(providerTools.length, 1)) * 100,
          100
        ).toFixed(0)}%`,
        change: { type: 'positive', icon: 'fas fa-arrow-up', text: '3% desde el mes pasado' }
      }
    };

    const recentRequests = providerRentals.slice(0, 3).map(rental => [
      rental.id,
      rental.cliente?.nombre || 'Cliente no disponible',
      rental.herramienta?.nombre || 'Herramienta no disponible',
      new Date().toLocaleDateString(),
      rental.fechaInicio || 'No especificada',
      rental.fechaFin || 'No especificada',
      `<span class="status status-${rental.estado?.toLowerCase() || 'unknown'}">${rental.estado || 'Desconocido'}</span>`,
      '<i class="fas fa-check-circle action-icon"></i> <i class="fas fa-times-circle action-icon"></i>'
    ]);

    return `
      <div class="view provider-view provider-dashboard-view">
        <div class="dashboard-header">
          <div class="dashboard-title">Panel de Proveedor</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
            <button class="btn btn-primary" id="addToolBtn">
              <i class="fas fa-plus"></i>
              <span>Nueva Herramienta</span>
            </button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard('Herramientas Totales', stats.tools.value, 'fas fa-tools', '#11cdef', stats.tools.change)}
          ${createStatCard('Alquileres Activos', stats.rentals.value, 'fas fa-clipboard-list', '#fb6340', stats.rentals.change)}
          ${createStatCard('Ingresos Mensuales', stats.income.value, 'fas fa-dollar-sign', '#2dce89', stats.income.change)}
          ${createStatCard('Tasa de Ocupación', stats.occupation.value, 'fas fa-percentage', '#5e72e4', stats.occupation.change)}
        </div>
        ${createTable('Solicitudes Recientes', ['ID', 'Cliente', 'Herramienta', 'Fecha Solicitud', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Acciones'], recentRequests)}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching provider dashboard data:', error);
    return `<div>Error al cargar los datos del dashboard.</div>`;
  }
}

async function createProviderToolsView() {
  try {
    const tools = await apiService.getHerramientas();
    const myTools = tools.filter(tool => tool.proveedorId === 1); // Cambiar según proveedor logueado

    const available = myTools.filter(t => t.estado === 'Disponible').length;
    const rented = myTools.filter(t => t.estado === 'En Alquiler').length;
    const maintenance = myTools.filter(t => t.estado === 'Mantenimiento').length;

    const toolCards = myTools.slice(0, 5).map(tool => `
      <div class="tool-card">
        <img src="https://via.placeholder.com/300x180?text= ${encodeURIComponent(tool.nombre)}" alt="${tool.nombre}" />
        <div class="tool-info">
          <h3>${tool.nombre}</h3>
          <p><strong>Categoría:</strong> ${tool.categoria || 'Sin categoría'}</p>
          <p><strong>Precio:</strong> $${parseFloat(tool.precio || 0).toFixed(2)} / día</p>
          <p><strong>Estado:</strong> 
            <span class="status status-${tool.estado?.toLowerCase() || 'unknown'}">
              ${tool.estado || 'Desconocido'}
            </span>
          </p>
          <div class="actions">
            <button class="btn btn-secondary"><i class="fas fa-edit"></i> Editar</button>
            <button class="btn btn-primary"><i class="fas fa-eye"></i> Detalles</button>
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="view provider-view provider-tools-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Mis Herramientas</div>
          <div class="action-buttons">
            <button class="btn btn-secondary">
              <i class="fas fa-filter"></i>
              <span>Filtrar</span>
            </button>
            <button class="btn btn-primary" id="addToolBtn">
              <i class="fas fa-plus"></i>
              <span>Nueva Herramienta</span>
            </button>
          </div>
        </div>
        <div class="stats-container">
          ${createStatCard('Herramientas Disponibles', available.toString(), 'fas fa-check-circle', '#11cdef', { text: `${Math.round((available / Math.max(myTools.length, 1)) * 100)}% del inventario` })}
          ${createStatCard('Herramientas Alquiladas', rented.toString(), 'fas fa-clock', '#fb6340', { text: `${Math.round((rented / Math.max(myTools.length, 1)) * 100)}% del inventario` })}
          ${createStatCard('En Mantenimiento', maintenance.toString(), 'fas fa-tools', '#f5365c', { type: 'negative', icon: 'fas fa-arrow-up', text: '2 más que el mes pasado' })}
          ${createStatCard('Categorías', [...new Set(myTools.map(t => t.categoria))].length.toString(), 'fas fa-tags', '#5e72e4', { type: 'positive', icon: 'fas fa-arrow-up', text: '1 nueva categoría' })}
        </div>
        <div class="tools-grid">
          ${toolCards}
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error fetching tools:', error);
    return `<div>Error al cargar tus herramientas.</div>`;
  }
}

async function createProviderRentalsView() {
  try {
    const [rentals, tools] = await Promise.all([
      apiService.getReservas(),
      apiService.getHerramientas()
    ]);

    const providerRentals = rentals.filter(r => r.proveedorId === 1); // Cambiar por ID real

    const pending = providerRentals.filter(r => r.estado === 'Pendiente').length;
    const active = providerRentals.filter(r => r.estado === 'En Alquiler').length;
    const completed = providerRentals.filter(r => r.estado === 'Completado').length;

    const rentalRows = providerRentals.slice(0, 5).map(rental => {
      const tool = tools.find(t => t.id === rental.herramientaId) || { nombre: 'Herramienta no encontrada' };
      return [
        rental.id,
        rental.cliente?.nombre || 'Cliente no disponible',
        tool.nombre,
        new Date().toLocaleDateString(),
        rental.fechaInicio || 'No especificada',
        rental.fechaFin || 'No especificada',
        `<span class="status status-${rental.estado?.toLowerCase() || 'unknown'}">${rental.estado || 'Desconocido'}</span>`,
        '<i class="fas fa-check-circle action-icon"></i> <i class="fas fa-times-circle action-icon"></i>'
      ];
    });

    return `
      <div class="view provider-view provider-rentals-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Gestión de Reservas</div>
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
          ${createStatCard('Solicitudes Nuevas', pending.toString(), 'fas fa-bell', '#5e72e4', { type: 'positive', icon: 'fas fa-arrow-up', text: '3 más que ayer' })}
          ${createStatCard('Alquileres Activos', active.toString(), 'fas fa-clipboard-list', '#fb6340', { type: 'positive', icon: 'fas fa-arrow-up', text: '5 más que ayer' })}
          ${createStatCard('Devoluciones Hoy', completed.toString(), 'fas fa-undo', '#11cdef', { text: 'Programadas para hoy' })}
          ${createStatCard('Reportes Pendientes', '0', 'fas fa-exclamation-triangle', '#f5365c', { type: 'negative', icon: 'fas fa-arrow-up', text: '0 nuevos' })}
        </div>
        ${createTable('Solicitudes de Alquiler', ['ID', 'Cliente', 'Herramienta', 'Fecha Solicitud', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Acciones'], rentalRows)}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return `<div>Error al cargar las reservas.</div>`;
  }
}

async function createProviderBillingView() {
  try {
    const rentals = await apiService.getReservas();
    const providerRentals = rentals.filter(r => r.proveedorId === 1); // Cambiar por ID real

    const totalIncome = providerRentals.reduce((sum, r) => sum + parseFloat(r.precio || 0), 0);
    const monthlyIncome = totalIncome * 0.08; // Ejemplo: 8% del ingreso total

    const invoiceRows = providerRentals.slice(0, 3).map(rental => [
      `F-${rental.id}`,
      rental.cliente?.nombre || 'Cliente no disponible',
      new Date().toLocaleDateString(),
      rental.herramienta?.nombre || 'Herramienta no disponible',
      `$${parseFloat(rental.precio || 0).toFixed(2)}`,
      `<span class="status status-available">Pagada</span>`,
      '<i class="fas fa-eye action-icon"></i> <i class="fas fa-download action-icon"></i>'
    ]);

    return `
      <div class="view provider-view provider-billing-view hidden">
        <div class="dashboard-header">
          <div class="dashboard-title">Facturación</div>
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
          ${createStatCard('Ingresos Totales', `$${totalIncome.toFixed(2)}`, 'fas fa-dollar-sign', '#2dce89', { type: 'positive', icon: 'fas fa-arrow-up', text: '12% desde el año pasado' })}
          ${createStatCard('Ingresos Mensuales', `$${monthlyIncome.toFixed(2)}`, 'fas fa-chart-line', '#2dce89', { type: 'positive', icon: 'fas fa-arrow-up', text: '8% desde el mes pasado' })}
          ${createStatCard('Facturas Pendientes', '0', 'fas fa-file-invoice-dollar', '#fb6340', { type: 'negative', icon: 'fas fa-arrow-up', text: '0 nuevas' })}
          ${createStatCard('Comisión Plataforma', `$${(monthlyIncome * 0.1).toFixed(2)}`, 'fas fa-percentage', '#5e72e4', { text: '10% de los ingresos' })}
        </div>
        ${createTable('Facturas Recientes', ['ID Factura', 'Cliente', 'Fecha', 'Herramienta', 'Monto', 'Estado', 'Acciones'], invoiceRows)}
      </div>
    `;
  } catch (error) {
    console.error('Error fetching billing data:', error);
    return `<div>Error al cargar la facturación.</div>`;
  }
}

export async function createProviderViews() {
  return `
    ${await createProviderDashboardView()}
    ${await createProviderToolsView()}
    ${await createProviderRentalsView()}
    ${await createProviderBillingView()}
  `;
}
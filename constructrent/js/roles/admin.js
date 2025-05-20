/**
 * Vistas para el rol de Administrador
 */

// Datos para las vistas de administrador
const adminData = {
  stats: {
    users: { value: '1,248', change: { type: 'positive', icon: 'fas fa-arrow-up', text: '12% desde el mes pasado' } },
    tools: { value: '3,567', change: { type: 'positive', icon: 'fas fa-arrow-up', text: '8% desde el mes pasado' } },
    rentals: { value: '842', change: { type: 'positive', icon: 'fas fa-arrow-up', text: '5% desde el mes pasado' } },
    income: { value: '$45,289', change: { type: 'positive', icon: 'fas fa-arrow-up', text: '15% desde el mes pasado' } }
  },
  recentRentals: [
    ['1', 'Elidallana Cristancho', 'Taladro Industrial', '20/05/2025', '1/06/2025', '<span class="status status-rented">En Alquiler</span>', '$120.000', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>'],
    ['2', 'Karen Lorena', 'Mezcladora de Concreto', '14/05/2025', '20/05/2025', '<span class="status status-rented">En Alquiler</span>', '$350.000', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>'],
    ['3', 'Rosa Caceres', 'Sierra Circular', '05/05/2025', '12/05/2025', '<span class="status status-available">Completado</span>', '$85.000', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>'],
    ['4', 'Alan Corzo', 'Andamio Metálico', '10/05/2025', '15/05/2025', '<span class="status status-maintenance">Reportado</span>', '$200.000', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>'],
    ['5', 'Jorge Irreño', 'Compresor de Aire', '05/05/2025', '10/05/2025', '<span class="status status-available">Completado</span>', '$150.000', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>']
  ],
  users: [
    ['1', 'Elidallana Cristancho', 'elida@gmail.com', 'Cliente', '15/01/2025', '<span class="status status-available">Activo</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i> <i class="fas fa-trash action-icon"></i>'],
    ['2', 'Karen Lorena', 'karen@gmail.com', 'Proveedor', '20/02/2025', '<span class="status status-available">Activo</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i> <i class="fas fa-trash action-icon"></i>'],
    ['3', 'Rosa Caceres', 'rosaca@gmail.com', 'Cliente', '05/03/2025', '<span class="status status-available">Activo</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i> <i class="fas fa-trash action-icon"></i>'],
    ['4', 'Alan Corzo', 'alan@gmail.com', 'Cliente', '10/03/2025', '<span class="status status-maintenance">Suspendido</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i> <i class="fas fa-trash action-icon"></i>'],
    ['5', 'Jorge Irreño', 'jorge@gmail.com', 'Proveedor', '15/04/2025', '<span class="status status-available">Activo</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i> <i class="fas fa-trash action-icon"></i>']
  ]
};

// Vista de Dashboard de Administrador
function createAdminDashboardView() {
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
        ${createStatCard('Usuarios Totales', adminData.stats.users.value, 'fas fa-users', '#5e72e4', adminData.stats.users.change)}
        ${createStatCard('Herramientas Registradas', adminData.stats.tools.value, 'fas fa-tools', '#11cdef', adminData.stats.tools.change)}
        ${createStatCard('Alquileres Activos', adminData.stats.rentals.value, 'fas fa-clipboard-list', '#fb6340', adminData.stats.rentals.change)}
        ${createStatCard('Ingresos Mensuales', adminData.stats.income.value, 'fas fa-dollar-sign', '#2dce89', adminData.stats.income.change)}
      </div>
      
      ${createTable('Alquileres Recientes', 
        ['ID', 'Cliente', 'Herramienta', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Monto', 'Acciones'], 
        adminData.recentRentals)}
    </div>
  `;
}

// Vista de Usuarios de Administrador
function createAdminUsersView() {
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
      
      ${createTable('Usuarios Registrados', 
        ['ID', 'Nombre', 'Email', 'Rol', 'Fecha Registro', 'Estado', 'Acciones'], 
        adminData.users)}
    </div>
  `;
}

// Vista de Alquileres de Administrador
function createAdminRentalsView() {
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
        ${createStatCard('Alquileres Totales', '5,842', 'fas fa-clipboard-list', '#fb6340', { type: 'positive', icon: 'fas fa-arrow-up', text: '8% desde el mes pasado' })}
        ${createStatCard('Alquileres Activos', '842', 'fas fa-clock', '#11cdef', { type: 'positive', icon: 'fas fa-arrow-up', text: '5% desde el mes pasado' })}
        ${createStatCard('Devoluciones Pendientes', '124', 'fas fa-exclamation-circle', '#fb6340', { type: 'negative', icon: 'fas fa-arrow-up', text: '12% desde el mes pasado' })}
        ${createStatCard('Reportes de Daños', '37', 'fas fa-tools', '#f5365c', { type: 'negative', icon: 'fas fa-arrow-up', text: '3% desde el mes pasado' })}
      </div>
      
      ${createTable('Todos los Alquileres', 
        ['ID', 'Cliente', 'Proveedor', 'Herramienta', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Monto', 'Acciones'], 
        [
          ['1', 'Elidallana Cristancho', 'Herramientas Pro', 'Taladro Industrial', '15/05/2025', '26/05/2025', '<span class="status status-rented">En Alquiler</span>', '$120.00', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>'],
          ['2', 'María López', 'Construmax', 'Mezcladora de Concreto', '14/05/2025', '20/05/2025', '<span class="status status-rented">En Alquiler</span>', '$350.000', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>'],
          ['3', 'Roberto Gómez', 'Herramientas Pro', 'Sierra Circular', '10/05/2025', '15/05/2025', '<span class="status status-available">Completado</span>', '$85.000', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>'],
          ['4', 'Ana Martínez', 'Construmax', 'Andamio Metálico', '08/05/2025', '14/05/2025', '<span class="status status-maintenance">Reportado</span>', '$200.000', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>'],
          ['5', 'Juan Pérez', 'Herramientas Pro', 'Compresor de Aire', '05/05/2025', '10/05/2025', '<span class="status status-available">Completado</span>', '$150.000', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>']
        ])}
    </div>
  `;
}

// Vista de Reportes de Administrador
function createAdminReportsView() {
  return `
    <div class="view admin-view admin-reports-view hidden">
      <div class="dashboard-header">
        <div class="dashboard-title">Reportes y Estadísticas</div>
        <div class="action-buttons">
          <button class="btn btn-secondary">
            <i class="fas fa-calendar"></i>
            <span>Periodo</span>
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-download"></i>
            <span>Exportar</span>
          </button>
        </div>
      </div>
      
      <div class="stats-container">
        ${createStatCard('Ingresos Totales', '$245,289', 'fas fa-dollar-sign', '#2dce89', { type: 'positive', icon: 'fas fa-arrow-up', text: '15% desde el año pasado' })}
        ${createStatCard('Herramientas Más Rentadas', 'Taladros', 'fas fa-tools', '#11cdef', { text: '25% del total de alquileres' })}
        ${createStatCard('Proveedor Más Activo', 'Herramientas Pro', 'fas fa-store', '#5e72e4', { text: '458 alquileres este mes' })}
        ${createStatCard('Tasa de Incidencias', '3.2%', 'fas fa-exclamation-triangle', '#f5365c', { type: 'positive', icon: 'fas fa-arrow-down', text: '0.5% desde el mes pasado' })}
      </div>
      
      ${createTable('Rentabilidad por Categoría', 
        ['Categoría', 'Alquileres', 'Ingresos', 'Tasa de Uso', 'Incidencias', 'Rentabilidad'], 
        [
          ['Taladros y Perforadoras', '1,245', '$62,250', '85%', '2.1%', 'Alta'],
          ['Mezcladoras', '845', '$84,500', '75%', '4.2%', 'Alta'],
          ['Sierras y Cortadoras', '956', '$38,240', '80%', '3.5%', 'Media'],
          ['Andamios', '425', '$42,500', '65%', '1.8%', 'Media'],
          ['Compresores', '532', '$26,600', '70%', '2.9%', 'Media']
        ], false)}
    </div>
  `;
}

// Función para crear todas las vistas de administrador
function createAdminViews() {
  return `
    ${createAdminDashboardView()}
    ${createAdminUsersView()}
    ${createAdminRentalsView()}
    ${createAdminReportsView()}
  `;
}
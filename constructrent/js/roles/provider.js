/**
 * Vistas para el rol de Proveedor
 */

// Datos para las vistas de proveedor
const providerData = {
  stats: {
    tools: { value: '248', change: { type: 'positive', icon: 'fas fa-arrow-up', text: '5% desde el mes pasado' } },
    rentals: { value: '84', change: { type: 'positive', icon: 'fas fa-arrow-up', text: '12% desde el mes pasado' } },
    income: { value: '$12,845', change: { type: 'positive', icon: 'fas fa-arrow-up', text: '8% desde el mes pasado' } },
    occupation: { value: '78%', change: { type: 'positive', icon: 'fas fa-arrow-up', text: '3% desde el mes pasado' } }
  },
  tools: [
    {
      name: 'Taladro Industrial DeWalt',
      category: 'Taladros',
      price: '$40.00 / día',
      description: 'Taladro industrial de alta potencia, ideal para trabajos de construcción pesada.',
      image: 'https://via.placeholder.com/300x180?text=Taladro+Industrial',
      status: 'available',
      statusText: 'Disponible',
      actions: [
        { icon: 'fas fa-edit', class: 'btn-secondary' },
        { icon: 'fas fa-eye', class: 'btn-primary', text: 'Detalles' }
      ]
    },
    {
      name: 'Mezcladora de Concreto 350L',
      category: 'Mezcladoras',
      price: '$70.00 / día',
      description: 'Mezcladora de concreto con capacidad de 350 litros, motor de gasolina de 5HP.',
      image: 'https://via.placeholder.com/300x180?text=Mezcladora+Concreto',
      status: 'rented',
      statusText: 'En Alquiler',
      actions: [
        { icon: 'fas fa-edit', class: 'btn-secondary' },
        { icon: 'fas fa-eye', class: 'btn-primary', text: 'Detalles' }
      ]
    }
  ]
};

// Vista de Dashboard de Proveedor
function createProviderDashboardView() {
  return `
    <div class="view provider-view provider-dashboard-view hidden">
      <div class="dashboard-header">
        <div class="dashboard-title">Panel de Proveedor</div>
        <div class="action-buttons">
          <button class="btn btn-secondary">
            <i class="fas fa-download"></i>
            <span>Exportar</span>
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i>
            <span>Nueva Herramienta</span>
          </button>
        </div>
      </div>
      
      <div class="stats-container">
        ${createStatCard('Herramientas Totales', providerData.stats.tools.value, 'fas fa-tools', '#11cdef', providerData.stats.tools.change)}
        ${createStatCard('Alquileres Activos', providerData.stats.rentals.value, 'fas fa-clipboard-list', '#fb6340', providerData.stats.rentals.change)}
        ${createStatCard('Ingresos Mensuales', providerData.stats.income.value, 'fas fa-dollar-sign', '#2dce89', providerData.stats.income.change)}
        ${createStatCard('Tasa de Ocupación', providerData.stats.occupation.value, 'fas fa-percentage', '#5e72e4', providerData.stats.occupation.change)}
      </div>
      
      ${createTable('Solicitudes Recientes', 
        ['ID', 'Cliente', 'Herramienta', 'Fecha Solicitud', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Acciones'], 
        [
          ['1', 'Elidallana Cristancho', 'Taladro Industrial', '14/05/2025', '15/05/2025', '18/05/2025', '<span class="status status-rented">Pendiente</span>', '<i class="fas fa-check-circle action-icon"></i> <i class="fas fa-times-circle action-icon"></i>'],
          ['2', 'Rosa Caceres', 'Mezcladora de Concreto', '13/05/2025', '14/05/2025', '20/05/2025', '<span class="status status-available">Aprobado</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>'],
          ['3', 'Alan Corzo', 'Sierra Circular', '09/05/2025', '10/05/2025', '15/05/2025', '<span class="status status-available">Completado</span>', '<i class="fas fa-eye action-icon"></i>']
        ])}
    </div>
  `;
}

// Vista de Herramientas de Proveedor
function createProviderToolsView() {
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
        ${createStatCard('Herramientas Disponibles', '164', 'fas fa-check-circle', '#11cdef', { text: '66% del inventario' })}
        ${createStatCard('Herramientas Alquiladas', '84', 'fas fa-clock', '#fb6340', { text: '34% del inventario' })}
        ${createStatCard('En Mantenimiento', '12', 'fas fa-tools', '#f5365c', { type: 'negative', icon: 'fas fa-arrow-up', text: '2 más que el mes pasado' })}
        ${createStatCard('Categorías', '8', 'fas fa-tags', '#5e72e4', { type: 'positive', icon: 'fas fa-arrow-up', text: '1 nueva categoría' })}
      </div>
      
      <div class="tools-grid">
        ${providerData.tools.map(tool => createToolCard(tool)).join('')}
        
        ${createToolCard({
          name: 'Sierra Circular Makita',
          category: 'Sierras',
          price: '$35.00 / día',
          description: 'Sierra circular profesional con disco de 7-1/4", ideal para cortes precisos en madera.',
          image: 'https://via.placeholder.com/300x180?text=Sierra+Circular',
          status: 'available',
          statusText: 'Disponible',
          actions: [
            { icon: 'fas fa-edit', class: 'btn-secondary' },
            { icon: 'fas fa-eye', class: 'btn-primary', text: 'Detalles' }
          ]
        })}
        
        ${createToolCard({
          name: 'Andamio Metálico 3m',
          category: 'Andamios',
          price: '$50.00 / día',
          description: 'Andamio metálico de 3 metros de altura, incluye plataforma y ruedas con freno.',
          image: 'https://via.placeholder.com/300x180?text=Andamio+Metálico',
          status: 'maintenance',
          statusText: 'Mantenimiento',
          actions: [
            { icon: 'fas fa-edit', class: 'btn-secondary' },
            { icon: 'fas fa-eye', class: 'btn-primary', text: 'Detalles' }
          ]
        })}
      </div>
    </div>
  `;
}

// Vista de Reservas de Proveedor
function createProviderRentalsView() {
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
        ${createStatCard('Solicitudes Nuevas', '12', 'fas fa-bell', '#5e72e4', { type: 'positive', icon: 'fas fa-arrow-up', text: '3 más que ayer' })}
        ${createStatCard('Alquileres Activos', '84', 'fas fa-clipboard-list', '#fb6340', { type: 'positive', icon: 'fas fa-arrow-up', text: '5 más que ayer' })}
        ${createStatCard('Devoluciones Hoy', '8', 'fas fa-undo', '#11cdef', { text: 'Programadas para hoy' })}
        ${createStatCard('Reportes Pendientes', '3', 'fas fa-exclamation-triangle', '#f5365c', { type: 'negative', icon: 'fas fa-arrow-up', text: '1 más que ayer' })}
      </div>
      
      ${createTable('Solicitudes de Alquiler', 
        ['ID', 'Cliente', 'Herramienta', 'Fecha Solicitud', 'Fecha Inicio', 'Fecha Fin', 'Estado', 'Acciones'], 
        [
          ['1', 'Elidallana Cristancho', 'Taladro Industrial', '14/05/2025', '15/05/2025', '18/05/2025', '<span class="status status-rented">Pendiente</span>', '<i class="fas fa-check-circle action-icon"></i> <i class="fas fa-times-circle action-icon"></i>'],
          ['2', 'Karen Caceres', 'Mezcladora de Concreto', '13/05/2025', '14/05/2025', '20/05/2025', '<span class="status status-available">Aprobado</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-edit action-icon"></i>'],
          ['3', 'Rosa Caceres', 'Sierra Circular', '09/05/2025', '10/05/2025', '15/05/2025', '<span class="status status-available">Completado</span>', '<i class="fas fa-eye action-icon"></i>']
        ])}
    </div>
  `;
}

// Vista de Facturación de Proveedor
function createProviderBillingView() {
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
        ${createStatCard('Ingresos Totales', '$145,289', 'fas fa-dollar-sign', '#2dce89', { type: 'positive', icon: 'fas fa-arrow-up', text: '12% desde el año pasado' })}
        ${createStatCard('Ingresos Mensuales', '$12,845', 'fas fa-chart-line', '#2dce89', { type: 'positive', icon: 'fas fa-arrow-up', text: '8% desde el mes pasado' })}
        ${createStatCard('Facturas Pendientes', '5', 'fas fa-file-invoice-dollar', '#fb6340', { type: 'negative', icon: 'fas fa-arrow-up', text: '2 más que el mes pasado' })}
        ${createStatCard('Comisión Plataforma', '$1,284', 'fas fa-percentage', '#5e72e4', { text: '10% de los ingresos' })}
      </div>
      
      ${createTable('Facturas Recientes', 
        ['ID Factura', 'Cliente', 'Fecha', 'Herramientas', 'Monto', 'Estado', 'Acciones'], 
        [
          ['F-12345', 'Carlos Méndez', '18/05/2023', 'Taladro Industrial', '$120.00', '<span class="status status-available">Pagada</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-download action-icon"></i>'],
          ['F-12344', 'María López', '20/05/2023', 'Mezcladora de Concreto', '$350.00', '<span class="status status-rented">Pendiente</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-download action-icon"></i>'],
          ['F-12343', 'Roberto Gómez', '15/05/2023', 'Sierra Circular', '$85.00', '<span class="status status-available">Pagada</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-download action-icon"></i>']
        ])}
    </div>
  `;
}

// Función para crear todas las vistas de proveedor
function createProviderViews() {
  return `
    ${createProviderDashboardView()}
    ${createProviderToolsView()}
    ${createProviderRentalsView()}
    ${createProviderBillingView()}
  `;
}

const clientData = {
  stats: {
    activeRentals: { value: '2', text: 'Devolución próxima: 18/05' },
    history: { value: '12', text: 'Último: hace 2 semanas' },
    pendingPayments: { value: '1', text: 'Vence: 20/05/2023' },
    favorites: { value: '5', text: 'Añadida recientemente: Taladro' }
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
        { icon: 'fas fa-heart', class: 'btn-secondary' },
        { icon: 'fas fa-shopping-cart', class: 'btn-primary', text: 'Alquilar' }
      ]
    },
    {
      name: 'Sierra Circular Makita',
      category: 'Sierras',
      price: '$35.00 / día',
      description: 'Sierra circular profesional con disco de 7-1/4", ideal para cortes precisos en madera.',
      image: 'https://via.placeholder.com/300x180?text=Sierra+Circular',
      status: 'available',
      statusText: 'Disponible',
      actions: [
        { icon: 'fas fa-heart', class: 'btn-secondary' },
        { icon: 'fas fa-shopping-cart', class: 'btn-primary', text: 'Alquilar' }
      ]
    }
  ]
};

// Vista de Dashboard de Cliente
function createClientDashboardView() {
  return `
    <div class="view client-view client-dashboard-view hidden">
      <div class="dashboard-header">
        <div class="dashboard-title">Mi Panel</div>
        <div class="action-buttons">
          <button class="btn btn-primary">
            <i class="fas fa-search"></i>
            <span>Buscar Herramientas</span>
          </button>
        </div>
      </div>
      
      <div class="stats-container">
        ${createStatCard('Alquileres Activos', clientData.stats.activeRentals.value, 'fas fa-clipboard-list', '#fb6340', { text: clientData.stats.activeRentals.text })}
        ${createStatCard('Historial de Alquileres', clientData.stats.history.value, 'fas fa-history', '#5e72e4', { text: clientData.stats.history.text })}
        ${createStatCard('Pagos Pendientes', clientData.stats.pendingPayments.value, 'fas fa-file-invoice-dollar', '#fb6340', { text: clientData.stats.pendingPayments.text })}
        ${createStatCard('Herramientas Favoritas', clientData.stats.favorites.value, 'fas fa-heart', '#f5365c', { text: clientData.stats.favorites.text })}
      </div>
      
      ${createTable('Mis Alquileres Activos', 
        ['ID', 'Herramienta', 'Proveedor', 'Fecha Inicio', 'Fecha Fin', 'Monto', 'Estado', 'Acciones'], 
        [
          ['#12345', 'Taladro Industrial', 'Herramientas Pro', '15/05/2023', '18/05/2023', '$120.00', '<span class="status status-rented">En Alquiler</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-undo action-icon"></i>'],
          ['#12344', 'Mezcladora de Concreto', 'Construmax', '14/05/2023', '20/05/2023', '$350.00', '<span class="status status-rented">En Alquiler</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-undo action-icon"></i>']
        ], false)}
    </div>
  `;
}

// Vista de Explorar de Cliente
function createClientExploreView() {
  return `
    <div class="view client-view client-explore-view hidden">
      <div class="dashboard-header">
        <div class="dashboard-title">Explorar Herramientas</div>
        <div class="action-buttons">
          <button class="btn btn-secondary">
            <i class="fas fa-filter"></i>
            <span>Filtrar</span>
          </button>
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Buscar herramientas...">
          </div>
        </div>
      </div>
      
      <div class="tools-grid">
        ${clientData.tools.map(tool => createToolCard(tool)).join('')}
        
        ${createToolCard({
          name: 'Compresor de Aire 50L',
          category: 'Compresores',
          price: '$45.00 / día',
          description: 'Compresor de aire de 50 litros, 2HP, ideal para herramientas neumáticas.',
          image: 'https://via.placeholder.com/300x180?text=Compresor+Aire',
          status: 'available',
          statusText: 'Disponible',
          actions: [
            { icon: 'fas fa-heart', class: 'btn-secondary' },
            { icon: 'fas fa-shopping-cart', class: 'btn-primary', text: 'Alquilar' }
          ]
        })}
        
        ${createToolCard({
          name: 'Generador Eléctrico 5000W',
          category: 'Generadores',
          price: '$75.00 / día',
          description: 'Generador eléctrico de 5000W, ideal para obras sin acceso a electricidad.',
          image: 'https://via.placeholder.com/300x180?text=Generador+Eléctrico',
          status: 'available',
          statusText: 'Disponible',
          actions: [
            { icon: 'fas fa-heart', class: 'btn-secondary' },
            { icon: 'fas fa-shopping-cart', class: 'btn-primary', text: 'Alquilar' }
          ]
        })}
      </div>
    </div>
  `;
}

// Vista de Alquileres de Cliente
function createClientRentalsView() {
  return `
    <div class="view client-view client-rentals-view hidden">
      <div class="dashboard-header">
        <div class="dashboard-title">Mis Alquileres</div>
        <div class="action-buttons">
          <button class="btn btn-secondary">
            <i class="fas fa-filter"></i>
            <span>Filtrar</span>
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-search"></i>
            <span>Buscar Herramientas</span>
          </button>
        </div>
      </div>
      
      ${createTable('Alquileres Activos', 
        ['ID', 'Herramienta', 'Proveedor', 'Fecha Inicio', 'Fecha Fin', 'Monto', 'Estado', 'Acciones'], 
        [
          ['#12345', 'Taladro Industrial', 'Herramientas Pro', '15/05/2023', '18/05/2023', '$120.00', '<span class="status status-rented">En Alquiler</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-undo action-icon"></i>'],
          ['#12344', 'Mezcladora de Concreto', 'Construmax', '14/05/2023', '20/05/2023', '$350.00', '<span class="status status-rented">En Alquiler</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-undo action-icon"></i>']
        ], false)}
      
      ${createTable('Historial de Alquileres', 
        ['ID', 'Herramienta', 'Proveedor', 'Fecha Inicio', 'Fecha Fin', 'Monto', 'Estado', 'Acciones'], 
        [
          ['#12343', 'Sierra Circular', 'Herramientas Pro', '10/05/2023', '15/05/2023', '$85.00', '<span class="status status-available">Completado</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-file-invoice action-icon"></i>'],
          ['#12341', 'Compresor de Aire', 'Herramientas Pro', '05/05/2023', '10/05/2023', '$150.00', '<span class="status status-available">Completado</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-file-invoice action-icon"></i>']
        ], false)}
    </div>
  `;
}

// Vista de Pagos de Cliente
function createClientPaymentsView() {
  return `
    <div class="view client-view client-payments-view hidden">
      <div class="dashboard-header">
        <div class="dashboard-title">Mis Pagos</div>
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
        ${createStatCard('Total Pagado', '$1,245', 'fas fa-dollar-sign', '#2dce89', { text: 'Últimos 12 meses' })}
        ${createStatCard('Pagos Pendientes', '$350', 'fas fa-file-invoice-dollar', '#fb6340', { text: 'Vence: 20/05/2023' })}
        ${createStatCard('Método de Pago', 'Visa', 'fas fa-credit-card', '#5e72e4', { text: 'Termina en 4582' })}
        ${createStatCard('Facturas', '12', 'fas fa-file-invoice', '#2dce89', { text: 'Disponibles para descarga' })}
      </div>
      
      ${createTable('Historial de Pagos', 
        ['ID Factura', 'Herramienta', 'Proveedor', 'Fecha', 'Monto', 'Estado', 'Acciones'], 
        [
          ['F-12343', 'Sierra Circular', 'Herramientas Pro', '15/05/2023', '$85.00', '<span class="status status-available">Pagada</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-download action-icon"></i>'],
          ['F-12341', 'Compresor de Aire', 'Herramientas Pro', '10/05/2023', '$150.00', '<span class="status status-available">Pagada</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-download action-icon"></i>'],
          ['F-12344', 'Mezcladora de Concreto', 'Construmax', 'Pendiente', '$350.00', '<span class="status status-rented">Pendiente</span>', '<i class="fas fa-eye action-icon"></i> <i class="fas fa-credit-card action-icon"></i>']
        ])}
    </div>
  `;
}

// Función para crear todas las vistas de cliente
function createClientViews() {
  return `
    ${createClientDashboardView()}
    ${createClientExploreView()}
    ${createClientRentalsView()}
    ${createClientPaymentsView()}
  `;
}
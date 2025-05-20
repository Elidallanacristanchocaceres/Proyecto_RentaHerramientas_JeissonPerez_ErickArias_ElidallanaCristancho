/**
 * Componente de Sidebar
 */

function createSidebar(currentRole) {
  return `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="user-role-display">
          <i class="fas fa-user-tag"></i>
          <span>${currentRole === 'admin' ? 'Administrador' : 
                currentRole === 'provider' ? 'Proveedor' : 'Cliente'}</span>
        </div>
      </div>
      
      ${currentRole === 'admin' ? `
        <ul class="nav-menu">
          <li class="nav-item active" data-view="admin-dashboard">
            <i class="fas fa-tachometer-alt"></i>
            <span>Panel Principal</span>
          </li>
          <li class="nav-item" data-view="admin-users">
            <i class="fas fa-users"></i>
            <span>Usuarios</span>
          </li>
          <li class="nav-item" data-view="admin-rentals">
            <i class="fas fa-clipboard-list"></i>
            <span>Alquileres</span>
          </li>
          <li class="nav-item" data-view="admin-reports">
            <i class="fas fa-chart-bar"></i>
            <span>Reportes</span>
          </li>
          <li class="nav-item" data-view="admin-settings">
            <i class="fas fa-cog"></i>
            <span>Configuración</span>
          </li>
        </ul>
      ` : ''}
      
      ${currentRole === 'provider' ? `
        <ul class="nav-menu">
          <li class="nav-item active" data-view="provider-dashboard">
            <i class="fas fa-tachometer-alt"></i>
            <span>Panel Principal</span>
          </li>
          <li class="nav-item" data-view="provider-tools">
            <i class="fas fa-tools"></i>
            <span>Herramientas</span>
          </li>
          <li class="nav-item" data-view="provider-rentals">
            <i class="fas fa-clipboard-list"></i>
            <span>Reservas</span>
          </li>
          <li class="nav-item" data-view="provider-billing">
            <i class="fas fa-file-invoice-dollar"></i>
            <span>Facturación</span>
          </li>
          <li class="nav-item" data-view="provider-settings">
            <i class="fas fa-cog"></i>
            <span>Configuración</span>
          </li>
        </ul>
      ` : ''}
      
      ${currentRole === 'client' ? `
        <ul class="nav-menu">
          <li class="nav-item active" data-view="client-dashboard">
            <i class="fas fa-tachometer-alt"></i>
            <span>Panel Principal</span>
          </li>
          <li class="nav-item" data-view="client-explore">
            <i class="fas fa-search"></i>
            <span>Explorar</span>
          </li>
          <li class="nav-item" data-view="client-rentals">
            <i class="fas fa-clipboard-list"></i>
            <span>Mis Alquileres</span>
          </li>
          <li class="nav-item" data-view="client-payments">
            <i class="fas fa-credit-card"></i>
            <span>Pagos</span>
          </li>
          <li class="nav-item" data-view="client-settings">
            <i class="fas fa-cog"></i>
            <span>Configuración</span>
          </li>
        </ul>
      ` : ''}
    </div>
  `;
}
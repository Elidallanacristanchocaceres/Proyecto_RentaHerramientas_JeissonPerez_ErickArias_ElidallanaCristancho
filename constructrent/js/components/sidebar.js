/**
 * Componente de Sidebar
 */

function createSidebar(currentRole) {
  return `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="role-selector">
          <select id="roleSelector">
            <option value="admin" ${currentRole === 'admin' ? 'selected' : ''}>Administrador</option>
            <option value="provider" ${currentRole === 'provider' ? 'selected' : ''}>Proveedor</option>
            <option value="client" ${currentRole === 'client' ? 'selected' : ''}>Cliente</option>
          </select>
        </div>
      </div>
      
      <!-- Admin Navigation -->
      <ul class="nav-menu admin-menu ${currentRole !== 'admin' ? 'hidden' : ''}">
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
      
      <!-- Provider Navigation -->
      <ul class="nav-menu provider-menu ${currentRole !== 'provider' ? 'hidden' : ''}">
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
      
      <!-- Client Navigation -->
      <ul class="nav-menu client-menu ${currentRole !== 'client' ? 'hidden' : ''}">
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
    </div>
  `;
}
/**
 * Componente de Header
 */

function createHeader(userData) {
  return `
    <header>
      <div class="logo">
        <i class="fas fa-tools"></i>
        <span>ConstructRent</span>
      </div>
      <div class="user-info">
        <div class="notifications" id="notificationsToggle">
          <i class="fas fa-bell"></i>
          <span class="notification-badge">${userData.notifications || 0}</span>
        </div>
        <div class="user-avatar">
          <span>${userData.initials || 'US'}</span>
        </div>
        <span>${userData.name || 'Usuario'}</span>
      </div>
    </header>
  `;
}

function createNotificationsPanel() {
  return `
    <div class="notifications-panel" id="notificationsPanel">
      <div class="notifications-header">
        <div class="notifications-title">Notificaciones</div>
        <span>3 nuevas</span>
      </div>
      <div class="notifications-list">
        <div class="notification-item unread">
          <div class="notification-icon">
            <i class="fas fa-tools"></i>
          </div>
          <div class="notification-content">
            <div class="notification-message">Nueva solicitud de alquiler para Taladro Industrial</div>
            <div class="notification-time">Hace 5 minutos</div>
          </div>
        </div>
        <div class="notification-item unread">
          <div class="notification-icon">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <div class="notification-content">
            <div class="notification-message">Pago recibido por $150.00</div>
            <div class="notification-time">Hace 30 minutos</div>
          </div>
        </div>
        <div class="notification-item unread">
          <div class="notification-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="notification-content">
            <div class="notification-message">Recordatorio: Devolución de Mezcladora mañana</div>
            <div class="notification-time">Hace 1 hora</div>
          </div>
        </div>
        <div class="notification-item">
          <div class="notification-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="notification-content">
            <div class="notification-message">Alquiler completado: Sierra Circular</div>
            <div class="notification-time">Ayer</div>
          </div>
        </div>
      </div>
      <div class="notifications-footer">
        <a href="#">Ver todas las notificaciones</a>
      </div>
    </div>
  `;
}
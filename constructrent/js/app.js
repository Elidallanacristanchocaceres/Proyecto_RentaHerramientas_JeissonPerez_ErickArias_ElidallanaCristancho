const DEFAULT_USER_DATA = {
  name: 'Usuario',
  initials: 'US',
  notifications: 0
};

let appState = {
  currentRole: 'client',
  user: DEFAULT_USER_DATA
};

function initApp() {
  // Verificar autenticación
  if (!localStorage.getItem('isAuthenticated')) {
    window.location.href = 'login.html';
    return;
  }

  // Cargar datos del usuario
  loadUserData();
  
  // Obtener rol de la URL o localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  const storedRole = localStorage.getItem('userRole');
  
  // Establecer rol actual
  appState.currentRole = roleParam || storedRole || 'client';
  
  // Renderizar la aplicación
  renderApp();
  
  // Configurar eventos
  setupEvents();
}

// Función para cargar datos del usuario
function loadUserData() {
  const storedUserData = localStorage.getItem('userData');
  
  if (storedUserData) {
    try {
      const userData = JSON.parse(storedUserData);
      appState.user = {
        ...DEFAULT_USER_DATA,
        ...userData
      };
    } catch (e) {
      console.error('Error al cargar datos del usuario:', e);
    }
  }
}

// Función para renderizar la aplicación
function renderApp() {
  const appContainer = document.getElementById('app');
  
  appContainer.innerHTML = `
    <div class="container">
      ${createHeader(appState.user)}
      ${createNotificationsPanel()}
      
      <div class="main-content">
        ${createSidebar(appState.currentRole)}
        
        <div class="content">
          ${appState.currentRole === 'admin' ? createAdminViews() : ''}
          ${appState.currentRole === 'provider' ? createProviderViews() : ''}
          ${appState.currentRole === 'client' ? createClientViews() : ''}
        </div>
      </div>
      
      ${createAddToolModal()}
    </div>
  `;
}

// Función para configurar eventos
function setupEvents() {
  // Eventos para los elementos de navegación
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', handleNavItemClick);
  });
  
  // Evento para notificaciones
  const notificationsToggle = document.getElementById('notificationsToggle');
  const notificationsPanel = document.getElementById('notificationsPanel');
  
  if (notificationsToggle && notificationsPanel) {
    notificationsToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      notificationsPanel.classList.toggle('show');
    });
    
    // Cerrar panel al hacer clic fuera
    document.addEventListener('click', function(e) {
      if (!notificationsPanel.contains(e.target) && e.target !== notificationsToggle) {
        notificationsPanel.classList.remove('show');
      }
    });
  }
  
  // Evento para cerrar sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.clear();
      window.location.href = 'login.html';
    });
  }
  
  // Configurar eventos de modales
  setupModalEvents();
}

// Función para manejar clic en items de navegación
function handleNavItemClick(e) {
  const navItem = e.currentTarget;
  const viewName = navItem.getAttribute('data-view');
  
  // Remover clase activa de todos los items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Agregar clase activa al item clickeado
  navItem.classList.add('active');
  
  // Ocultar todas las vistas
  document.querySelectorAll('.view').forEach(view => {
    view.classList.add('hidden');
  });
  
  // Mostrar la vista correspondiente
  const viewToShow = document.querySelector(`.${viewName}-view`);
  if (viewToShow) {
    viewToShow.classList.remove('hidden');
  }
}

// Función para configurar eventos de modales
function setupModalEvents() {
  // Modal de agregar herramienta
  const addToolModal = document.getElementById('addToolModal');
  const addToolBtn = document.getElementById('addToolBtn');
  const closeToolModal = document.getElementById('closeToolModal');
  const cancelToolBtn = document.getElementById('cancelToolBtn');
  
  if (addToolBtn && addToolModal) {
    addToolBtn.addEventListener('click', () => {
      addToolModal.classList.add('show');
    });
  }
  
  if (closeToolModal && addToolModal) {
    closeToolModal.addEventListener('click', () => {
      addToolModal.classList.remove('show');
    });
  }
  
  if (cancelToolBtn && addToolModal) {
    cancelToolBtn.addEventListener('click', () => {
      addToolModal.classList.remove('show');
    });
  }
  
  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', (e) => {
    if (e.target === addToolModal) {
      addToolModal.classList.remove('show');
    }
  });
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initApp);
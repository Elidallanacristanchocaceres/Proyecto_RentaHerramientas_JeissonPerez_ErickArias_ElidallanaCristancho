/**
 * Lógica principal de la aplicación
 */

// Datos del usuario
const USER_DATA = {
  name: 'Elidallana Cristancho',
  initials: 'EC',
  notifications: 3
};

// Estado de la aplicación
let appState = {
  currentRole: 'admin', // Rol por defecto
  user: USER_DATA
};

// Función para inicializar la aplicación
function initApp() {
  // Cargar datos del usuario desde localStorage si existen
  loadUserData();
  
  // Renderizar la aplicación con el estado inicial
  renderApp();
  
  // Configurar eventos después de renderizar
  setupEvents();
}

// Función para cargar datos del usuario desde localStorage
function loadUserData() {
  const storedRole = localStorage.getItem('userRole');
  const storedUserData = localStorage.getItem('userData');
  
  if (storedRole) {
    appState.currentRole = storedRole;
  }
  
  if (storedUserData) {
    try {
      const userData = JSON.parse(storedUserData);
      // Combinar los datos del usuario almacenados con los datos predeterminados
      appState.user = {
        ...USER_DATA,
        name: userData.name || USER_DATA.name,
        initials: userData.initials || USER_DATA.initials,
        notifications: userData.notifications || USER_DATA.notifications
      };
    } catch (e) {
      console.error('Error al cargar datos del usuario:', e);
    }
  }
}

// Función para renderizar la aplicación
function renderApp() {
  const appContainer = document.getElementById('app');
  
  // Crear la estructura principal de la aplicación
  appContainer.innerHTML = `
    <div class="container">
      ${createHeader(appState.user)}
      ${createNotificationsPanel()}
      
      <div class="main-content">
        ${createSidebar(appState.currentRole)}
        
        <div class="content">
          ${createAdminViews()}
          ${createProviderViews()}
          ${createClientViews()}
        </div>
      </div>
      
      ${createAddToolModal()}
    </div>
  `;
}

// Función para configurar eventos
function setupEvents() {
  // Evento para cambiar de rol
  const roleSelector = $('#roleSelector');
  if (roleSelector) {
    // Establecer el valor del selector según el rol actual
    roleSelector.value = appState.currentRole;
    
    addEvent(roleSelector, 'change', handleRoleChange);
  }
  
  // Eventos para los elementos de navegación
  const navItems = $$('.nav-item');
  addEventAll(navItems, 'click', handleNavItemClick);
  
  // Evento para el toggle de notificaciones
  const notificationsToggle = $('#notificationsToggle');
  const notificationsPanel = $('#notificationsPanel');
  if (notificationsToggle && notificationsPanel) {
    addEvent(notificationsToggle, 'click', function(e) {
      e.stopPropagation();
      toggleElement(notificationsPanel);
    });
    
    // Cerrar panel de notificaciones al hacer clic fuera
    addEvent(document, 'click', function(e) {
      if (notificationsPanel.classList.contains('show') && 
          !notificationsPanel.contains(e.target) && 
          e.target !== notificationsToggle) {
        toggleElement(notificationsPanel, false);
      }
    });
  }
  
  // Eventos para modales
  setupModalEvents();
    false;
      }
   
  
  
  // Eventos para modales
  setupModalEvents();
  
  // Eventos para botones específicos
  setupButtonEvents();
  
  // Evento para cerrar sesión
  const logoutBtn = $('#logoutBtn');
  if (logoutBtn) {
    addEvent(logoutBtn, 'click', function() {
      // Limpiar localStorage
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      
      // Redirigir a la página de login
      window.location.href = 'login.html';
    });
  }


// Función para manejar el cambio de rol
function handleRoleChange(e) {
  const role = e.target.value;
  
  // Actualizar el estado de la aplicación
  appState.currentRole = role;
  
  // Guardar el rol en localStorage
  localStorage.setItem('userRole', role);
  
  // Ocultar todos los menús
  hideAll('.nav-menu');
  
  // Mostrar el menú correspondiente al rol seleccionado
  showElement($(`.${role}-menu`));
  
  // Ocultar todas las vistas
  hideAll('.view');
  
  // Mostrar la vista de dashboard del rol seleccionado
  showElement($(`.${role}-dashboard-view`));
  
  // Actualizar clases activas en los elementos de navegación
  removeClassFromAll('.nav-item', 'active');
  
  // Activar el primer elemento de navegación del rol seleccionado
  const firstNavItem = $(`.${role}-menu .nav-item[data-view="${role}-dashboard"]`);
  if (firstNavItem) {
    addClass(firstNavItem, 'active');
  }
}

// Función para manejar el clic en elementos de navegación
function handleNavItemClick(e) {
  const navItem = e.currentTarget;
  const viewName = navItem.getAttribute('data-view');
  
  // Remover clase activa de todos los elementos de navegación
  removeClassFromAll('.nav-item', 'active');
  
  // Agregar clase activa al elemento clickeado
  addClass(navItem, 'active');
  
  // Ocultar todas las vistas
  hideAll('.view');
  
  // Mostrar la vista correspondiente
  showElement($(`.${viewName}-view`));
}

// Función para configurar eventos de modales
function setupModalEvents() {
  // Modal de agregar herramienta
  const addToolModal = $('#addToolModal');
  const addToolBtn = $('#addToolBtn');
  const closeToolModal = $('#closeToolModal');
  const cancelToolBtn = $('#cancelToolBtn');
  
  if (addToolBtn && addToolModal) {
    addEvent(addToolBtn, 'click', function() {
      toggleElement(addToolModal, true);
    });
  }
  
  if (closeToolModal && addToolModal) {
    addEvent(closeToolModal, 'click', function() {
      toggleElement(addToolModal, false);
    });
  }
  
  if (cancelToolBtn && addToolModal) {
    addEvent(cancelToolBtn, 'click', function() {
      toggleElement(addToolModal, false);
    });
  }
  
  // Cerrar modal al hacer clic fuera
  if (addToolModal) {
    addEvent(window, 'click', function(e) {
      if (e.target === addToolModal) {
        toggleElement(addToolModal, false);
      }
    });
  }
}

// Función para configurar eventos de botones específicos
function setupButtonEvents() {
  // Aquí se pueden agregar eventos para botones específicos
  // Por ejemplo, botones de acción en tablas, etc.
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initApp);
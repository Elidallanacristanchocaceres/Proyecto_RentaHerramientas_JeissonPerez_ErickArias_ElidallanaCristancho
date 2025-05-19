const roleSelector = document.getElementById('roleSelector');
const adminMenu = document.querySelector('.admin-menu');
const providerMenu = document.querySelector('.provider-menu');
const clientMenu = document.querySelector('.client-menu');

const allViews = document.querySelectorAll('.view');

const adminDashboardView = document.querySelector('.admin-dashboard-view');
const adminUsersView = document.querySelector('.admin-users-view');
const adminRentalsView = document.querySelector('.admin-rentals-view');
const adminReportsView = document.querySelector('.admin-reports-view');

const providerDashboardView = document.querySelector('.provider-dashboard-view');
const providerToolsView = document.querySelector('.provider-tools-view');
const providerRentalsView = document.querySelector('.provider-rentals-view');
const providerBillingView = document.querySelector('.provider-billing-view');

const clientDashboardView = document.querySelector('.client-dashboard-view');
const clientExploreView = document.querySelector('.client-explore-view');
const clientRentalsView = document.querySelector('.client-rentals-view');
const clientPaymentsView = document.querySelector('.client-payments-view');

const addToolModal = document.getElementById('addToolModal');
const addToolBtn = document.getElementById('addToolBtn');
const closeToolModal = document.getElementById('closeToolModal');
const cancelToolBtn = document.getElementById('cancelToolBtn');

const notificationsToggle = document.getElementById('notificationsToggle');
const notificationsPanel = document.getElementById('notificationsPanel');

roleSelector.addEventListener('change', function() {
  const role = this.value;
  
  adminMenu.classList.add('hidden');
  providerMenu.classList.add('hidden');
  clientMenu.classList.add('hidden');
  
  allViews.forEach(view => view.classList.add('hidden'));
  
  if (role === 'admin') {
    adminMenu.classList.remove('hidden');
    adminDashboardView.classList.remove('hidden');
  } else if (role === 'provider') {
    providerMenu.classList.remove('hidden');
    providerDashboardView.classList.remove('hidden');
  } else if (role === 'client') {
    clientMenu.classList.remove('hidden');
    clientDashboardView.classList.remove('hidden');
  }
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  if (role === 'admin') {
    document.querySelector('.admin-menu .nav-item[data-view="admin-dashboard"]').classList.add('active');
  } else if (role === 'provider') {
    document.querySelector('.provider-menu .nav-item[data-view="provider-dashboard"]').classList.add('active');
  } else if (role === 'client') {
    document.querySelector('.client-menu .nav-item[data-view="client-dashboard"]').classList.add('active');
  }
});

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function() {
    const viewName = this.getAttribute('data-view');
    
    document.querySelectorAll('.nav-item').forEach(navItem => {
      navItem.classList.remove('active');
    });
    
    this.classList.add('active');
    
    allViews.forEach(view => view.classList.add('hidden'));
    
    document.querySelector(`.${viewName}-view`).classList.remove('hidden');
  });
});

if (addToolBtn) {
  addToolBtn.addEventListener('click', function() {
    addToolModal.classList.add('show');
  });
}

if (closeToolModal) {
  closeToolModal.addEventListener('click', function() {
    addToolModal.classList.remove('show');
  });
}

if (cancelToolBtn) {
  cancelToolBtn.addEventListener('click', function() {
    addToolModal.classList.remove('show');
  });
}

notificationsToggle.addEventListener('click', function(e) {
  e.stopPropagation();
  notificationsPanel.classList.toggle('show');
});

document.addEventListener('click', function(e) {
  if (notificationsPanel.classList.contains('show') && 
      !notificationsPanel.contains(e.target) && 
      e.target !== notificationsToggle) {
    notificationsPanel.classList.remove('show');
  }
});

window.addEventListener('click', function(e) {
  if (e.target === addToolModal) {
    addToolModal.classList.remove('show');
  }
});
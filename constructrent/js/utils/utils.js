// Función para obtener un elemento del DOM
function $(selector) {
  return document.querySelector(selector)
}

// Función para obtener múltiples elementos del DOM
function $$(selector) {
  return document.querySelectorAll(selector)
}

// Función para agregar un evento a un elemento
function addEvent(element, event, callback) {
  if (element) {
    element.addEventListener(event, callback)
  }
}

// Función para agregar eventos a múltiples elementos
function addEventAll(elements, event, callback) {
  if (elements) {
    elements.forEach((element) => {
      element.addEventListener(event, callback)
    })
  }
}

// Función para mostrar/ocultar un elemento
function toggleElement(element, show) {
  if (element) {
    if (show === undefined) {
      element.classList.toggle("show")
    } else if (show) {
      element.classList.add("show")
    } else {
      element.classList.remove("show")
    }
  }
}

// Función para ocultar todos los elementos que coincidan con un selector
function hideAll(selector) {
  const elements = $$(selector)
  elements.forEach((element) => {
    element.classList.add("hidden")
  })
}

// Función para mostrar un elemento específico
function showElement(element) {
  if (element) {
    element.classList.remove("hidden")
  }
}

// Función para remover una clase de todos los elementos que coincidan con un selector
function removeClassFromAll(selector, className) {
  const elements = $$(selector)
  elements.forEach((element) => {
    element.classList.remove(className)
  })
}

// Función para agregar una clase a un elemento específico
function addClass(element, className) {
  if (element) {
    element.classList.add(className)
  }
}

// Función para validar email
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

// Función para formatear fechas
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Función para formatear moneda
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Función para mostrar notificaciones toast
function showToast(message, type = "info") {
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
      <span>${message}</span>
    </div>
  `

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.classList.add("show")
  }, 100)

  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

// Función para confirmar acciones
function confirmAction(message, callback) {
  if (confirm(message)) {
    callback()
  }
}

// Función para debounce (útil para búsquedas)
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Exportar funciones para uso global
window.$ = $
window.$$ = $$
window.addEvent = addEvent
window.addEventAll = addEventAll
window.toggleElement = toggleElement
window.hideAll = hideAll
window.showElement = showElement
window.removeClassFromAll = removeClassFromAll
window.addClass = addClass
window.validateEmail = validateEmail
window.formatDate = formatDate
window.formatCurrency = formatCurrency
window.showToast = showToast
window.confirmAction = confirmAction
window.debounce = debounce

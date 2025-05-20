/**
 * Funciones de utilidad para la aplicación
 */

// Función para obtener un elemento del DOM
function $(selector) {
  return document.querySelector(selector);
}

// Función para obtener múltiples elementos del DOM
function $$(selector) {
  return document.querySelectorAll(selector);
}

// Función para agregar un evento a un elemento
function addEvent(element, event, callback) {
  if (element) {
    element.addEventListener(event, callback);
  }
}

// Función para agregar eventos a múltiples elementos
function addEventAll(elements, event, callback) {
  if (elements) {
    elements.forEach(element => {
      element.addEventListener(event, callback);
    });
  }
}

// Función para mostrar/ocultar un elemento
function toggleElement(element, show) {
  if (element) {
    if (show === undefined) {
      element.classList.toggle('show');
    } else if (show) {
      element.classList.add('show');
    } else {
      element.classList.remove('show');
    }
  }
}

// Función para ocultar todos los elementos que coincidan con un selector
function hideAll(selector) {
  const elements = $$(selector);
  elements.forEach(element => {
    element.classList.add('hidden');
  });
}

// Función para mostrar un elemento específico
function showElement(element) {
  if (element) {
    element.classList.remove('hidden');
  }
}

// Función para remover una clase de todos los elementos que coincidan con un selector
function removeClassFromAll(selector, className) {
  const elements = $$(selector);
  elements.forEach(element => {
    element.classList.remove(className);
  });
}

// Función para agregar una clase a un elemento específico
function addClass(element, className) {
  if (element) {
    element.classList.add(className);
  }
}

// Función para validar email
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
/**
 * Lógica para la página de login
 */

document.addEventListener('DOMContentLoaded', function() {
  // Selección de elementos
  const roleOptions = document.querySelectorAll('.role-option');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  
  // Variable para almacenar el rol seleccionado
  let selectedRole = 'client'; 
  
  // Eventos para opciones de rol
  roleOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Quitar selección de todas las opciones
      roleOptions.forEach(opt => opt.classList.remove('selected'));
      
      // Seleccionar la opción clickeada
      this.classList.add('selected');
      
      // Guardar el rol seleccionado
      selectedRole = this.getAttribute('data-role');
    });
  });
  
  // Seleccionar el rol de cliente por defecto
  document.querySelector('.role-option[data-role="client"]').classList.add('selected');
  
  // Evento para mostrar/ocultar contraseña
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      this.querySelector('i').classList.toggle('fa-eye');
      this.querySelector('i').classList.toggle('fa-eye-slash');
    });
  }
  
  // Validación de formulario
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      
      // Validar email
      if (!validateEmail(emailInput.value)) {
        emailError.style.display = 'block';
        emailInput.classList.add('shake');
        setTimeout(() => emailInput.classList.remove('shake'), 500);
        isValid = false;
      } else {
        emailError.style.display = 'none';
      }
      
      // Validar contraseña
      if (passwordInput.value.length < 6) {
        passwordError.style.display = 'block';
        passwordInput.classList.add('shake');
        setTimeout(() => passwordInput.classList.remove('shake'), 500);
        isValid = false;
      } else {
        passwordError.style.display = 'none';
      }
      
      // Si el formulario es válido, guardar el rol y redirigir
      if (isValid) {
        // Guardar el rol seleccionado en localStorage para usarlo en la página principal
        localStorage.setItem('userRole', selectedRole);
        localStorage.setItem('userEmail', emailInput.value);
        
        // Datos de usuario de ejemplo según el rol
        const userData = {
          client: {
            name: 'Elidallana Cristancho',
            initials: 'EC',
            notifications: 2
          },
          provider: {
            name: 'Karen Lorena',
            initials: 'KL',
            notifications: 5
          },
          admin: {
            name: 'Admin Principal',
            initials: 'AP',
            notifications: 8
          }
        };
        
        // Guardar datos del usuario según el rol
        localStorage.setItem('userData', JSON.stringify(userData[selectedRole]));
        
        // Redirigir a la página principal
        window.location.href = 'index.html';
      }
    });
  }
});
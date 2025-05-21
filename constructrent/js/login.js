document.addEventListener('DOMContentLoaded', function () {

  initRoleSelection();


  initPasswordToggle();


  document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

function initRoleSelection() {
  const roleOptions = document.querySelectorAll('.role-option');

  roleOptions.forEach(option => {
    option.addEventListener('click', function () {

      roleOptions.forEach(opt => opt.classList.remove('selected'));


      this.classList.add('selected');
    });
  });
}

function initPasswordToggle() {
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);


    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
  });
}

async function handleLogin(event) {
  event.preventDefault();


  clearErrors();


  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const selectedRole = document.querySelector('.role-option.selected');

  if (!validateInputs(email, password, selectedRole)) {
    return;
  }

  const role = selectedRole.dataset.role;

  try {
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando...';

    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        role
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al iniciar sesión');
    }

    const data = await response.json();


    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userRole', role);


    redirectUser(role);

  } catch (error) {
    console.error('Login error:', error);
    showError(error.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
  } finally {

    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
  }
}

function validateInputs(email, password, selectedRole) {
  let isValid = true;


  if (!email) {
    document.getElementById('emailError').textContent = 'El correo electrónico es requerido';
    document.getElementById('emailError').style.display = 'block';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    document.getElementById('emailError').textContent = 'Por favor ingresa un correo electrónico válido';
    document.getElementById('emailError').style.display = 'block';
    isValid = false;
  }


  if (!password) {
    document.getElementById('passwordError').textContent = 'La contraseña es requerida';
    document.getElementById('passwordError').style.display = 'block';
    isValid = false;
  } else if (password.length < 6) {
    document.getElementById('passwordError').textContent = 'La contraseña debe tener al menos 6 caracteres';
    document.getElementById('passwordError').style.display = 'block';
    isValid = false;
  }


  if (!selectedRole) {
    showError('Por favor selecciona un rol');
    isValid = false;
  }

  return isValid;
}

function clearErrors() {
  document.getElementById('emailError').style.display = 'none';
  document.getElementById('passwordError').style.display = 'none';
}

function showError(message) {
   const passwordError = document.getElementById('passwordError');
  if (passwordError) {
    passwordError.textContent = "contraseña o email incorrectos";
    passwordError.style.display = 'block';
    
    passwordError.classList.add('shake');
    setTimeout(() => {
      passwordError.classList.remove('shake');
    }, 500);
  } else {
    alert(message);
  }
}

function redirectUser(role) {
  switch (role) {
    case 'admin':
      window.location.href = 'dashboard.html';
      break;
    case 'provider':
      window.location.href = 'dashboard.html';
      break;
    case 'client':
      window.location.href = 'dashboard.html';
      break;
    default:
      window.location.href = 'index.html';
  }
}
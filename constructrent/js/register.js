const API_URL = 'http://localhost:8080/auth/registro';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    const userData = {
        nombre: form.nombre.value,
        email: form.correo.value,       
        password: form.contrasena.value,
        telefono: form.telefono.value,
        direccion: form.direccion.value,
        rol: document.querySelector('.role-option.selected').dataset.role
    };

    console.log('Sending:', userData);
    
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error('Error details:', errorData);
            throw new Error(errorData.message || 'Error al registrar');
        }

        alert('Registro exitoso. Redirigiendo al login...');
        window.location.href = 'login.html';
    } catch (err) {
        alert('Error al registrar usuario: ' + err.message);
        console.error(err);
    }
});

document.querySelectorAll('.role-option').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('.role-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
    });
});
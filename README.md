# Frontend ConstructRent🛠️

### ✔️Descripción del Proyecto

ConstructRent es una plataforma web para el alquiler de herramientas de construcción que permite a los usuarios (clientes, proveedores y administradores) gestionar herramientas, reservas, facturas y usuarios a través de un sistema de roles.

### ✔️Características Principales
Autenticación de usuarios con roles (Admin, Proveedor, Cliente)

Dashboard interactivo con estadísticas y resúmenes

Gestión de herramientas (CRUD completo)

Sistema de reservas con seguimiento de estado

Facturación integrada

Diseño responsive para diferentes dispositivos

Modales dinámicos para formularios

Tablas interactivas con búsqueda y filtrado

### ✔️Estructura de Archivos
````bash
constructrent/
├── css/
│   └── style.css           # Estilos principales
├── js/
│   ├── components/
│   │   ├── cards.js        # Componentes de tarjetas
│   │   ├── header.js       # Componente de cabecera
│   │   ├── modals.js       # Componentes de modales
│   │   ├── sidebar.js      # Componente de barra lateral
│   │   └── tables.js       # Componentes de tablas
│   ├── roles/
│   │   ├── admin.js        # Vistas para administrador
│   │   ├── client.js       # Vistas para cliente
│   │   └── provider.js     # Vistas para proveedor
│   ├── services/
│   │   └── apiService.js   # Servicio para llamadas API
│   ├── utils/
│   │   └── utils.js        # Funciones utilitarias
│   └── app.js              # Aplicación principal
├── assets/
│   └── favicon.png         # Icono de la aplicación
├── index.html              # Página principal
├── login.html              # Página de inicio de sesión
└── dashboard.html          # Dashboard principal
````
### ✔️Tecnologías Utilizadas
- HTML5 - Estructura de la aplicación

- CSS3 - Estilos y diseño responsive

- JavaScript (ES6+) - Lógica de la aplicación

- Fetch API - Comunicación con el backend

- Font Awesome - Iconos

- CSS Variables - Para temas y colores

- Flexbox/Grid - Diseño de layouts

### ✔️Configuración del Entorno
Clonar el repositorio

Asegurarse de que el backend esté corriendo en http://localhost:8080

Abrir el archivo index.html en un navegador moderno

### ✔️Guía de Desarrollo
Estructura de Componentes
El frontend está organizado en componentes reutilizables:

- Header: Barra superior con logo, notificaciones y perfil de usuario

- Sidebar: Navegación lateral con menú según rol de usuario

- Cards: Componentes para mostrar estadísticas y herramientas

- Tables: Tablas interactivas con paginación y búsqueda

- Modals: Ventanas emergentes para formularios y detalles

### ✔️Estilos CSS
Los estilos utilizan variables CSS para colores y sombras:

css
````bash
:root {
  --primary: #ffffff;
  --secondary: #2e4057;
  --accent: #f7c59f;
  --light: #efefef;
  --dark: #1d1d1d;
  --success: #4caf50;
  --warning: #ff9800;
  --danger: #f44336;
  --gray: #757575;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
````
API Service
El servicio apiService.js maneja todas las llamadas al backend con métodos como:

javascript
````bash
async login(credentials) {
  return this.fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}

async getHerramientas() {
  return this.fetchApi("/api/herramientas");
}

async createReserva(reserva) {
  return this.fetchApi("/api/reservas", {
    method: "POST",
    body: JSON.stringify(reserva)
  });
}
````
Vistas por Rol
### Administrador
- Dashboard con estadísticas globales

- Gestión de usuarios

- Historial de alquileres

- Reportes y análisis

- Configuración del sistema

### Proveedor
- Dashboard con herramientas y reservas

- Gestión de herramientas propias

- Facturación

- Configuración de perfil

### Cliente
- Exploración de herramientas

- Mis alquileres

- Historial de pagos

- Configuración de cuenta

### ✔️Consideraciones
El frontend espera un backend RESTful en http://localhost:8080

- Se utiliza localStorage para manejar la autenticación

- Los roles disponibles son: ADMIN, PROVEEDOR, CLIENTE

- El diseño es completamente responsive

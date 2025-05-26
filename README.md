🧩 ConstructRent

Es una plataforma completa para el alquiler de herramientas y equipos de construcción. El sistema permite a los proveedores registrar sus herramientas, mientras que los clientes pueden buscar, reservar y alquilar estos equipos. La aplicación gestiona todo el ciclo de vida del alquiler, desde la reserva inicial hasta la devolución, incluyendo pagos, facturación y notificaciones.

Características principales:

- Gestión de inventario de herramientas
- Sistema de reservas y alquileres
- Procesamiento de pagos con Stripe
- Facturación electrónica
- Notificaciones por email
- Gestión de daños y depósitos
- Reportes y estadísticas
- Panel de administración



📌 Índice
📜 Descripción

🚀 Tecnologías Utilizadas

⚙️ Arquitectura del Proyecto

🛠️ Instalación y Ejecución

📦 Estructura del Proyecto

🧪 Pruebas

🙋‍♂️ Contribuciones

📄 Licencia

📜 Descripción
Este proyecto es una aplicación web desarrollada con una arquitectura cliente-servidor. El frontend está construido con HTML, CSS y JavaScript puro, mientras que el backend utiliza Spring Boot para exponer servicios RESTful y manejar la lógica del negocio.

El objetivo principal de la aplicación es:
➡️ [Aquí coloca el objetivo, como por ejemplo: gestionar citas médicas, administrar inventario de una finca, o mostrar productos deportivos, etc.]

🚀 Tecnologías Utilizadas
Frontend:
HTML5

CSS3

JavaScript (ES6)

Backend:
🔹 Spring Boot (Última versión)

 🔹 Java |7 o superior

 🔹 Spring Security con JWT

 🔹 Spring Data JPA

 🔹 PostgreSQL


Herramientas:
Maven / Gradle

Git

IDE:  VSCode

Postman (para pruebas de API)

⚙️ Arquitectura del Proyecto
scss
Copiar
Editar
Cliente (HTML/CSS/JS) ⇄ REST API (Spring Boot) ⇄ Base de Datos (MySQL)
El cliente realiza peticiones a la API usando fetch o axios.

Spring Boot expone endpoints que reciben, procesan y responden con datos en formato JSON.

La base de datos almacena los registros necesarios y es gestionada mediante JPA/Hibernate.

🛠️ Instalación y Ejecución
1. Clonar el repositorio
bash
Copiar
Editar
git clone https://github.com/Elidallanacristanchocaceres/Proyecto_RentaHerramientas_JeissonPerez_ErickArias_ElidallanaCristancho
cd https://github.com/Elidallanacristanchocaceres/Proyecto_RentaHerramientas_JeissonPerez_ErickArias_ElidallanaCristancho
2. Configurar la base de datos
Asegúrate de tener MySQL instalado y configura el archivo application.properties:

properties
Copiar
Editar
spring.datasource.url=jdbc:mysql://localhost:3306/tu_base
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
spring.jpa.hibernate.ddl-auto=update
3. Ejecutar el backend
bash
Copiar
Editar
./mvnw spring-boot:run
4. Abrir el frontend
Puedes abrir el archivo index.html directamente en tu navegador o servirlo con un servidor local como Live Server.

##📦 Estructura del Proyecto
### 📁 frontend/
````bash
   ├── index.html
   ├── styles/
   │   └── main.css
   └── scripts/
       └── app.js
````
### 📁 backend/
````bash
 com.herramienta.herramienta_app/
│
├── HerramientaAppApplication.java (Main application class)
│
├── application/
│   └── services/
│       ├── HerramientaService.java
│       ├── NotificacionService.java
│       ├── PagoService.java
│       ├── ReporteService.java
│       └── ReservaService.java
│
├── domain/
│   ├── dtos/
│   │   ├── HerramientaDto.java
│   │   ├── ReservaDto.java
│   │   └── ReservaResponseDto.java
│   │
│   └── entities/
│       ├── Categoria.java
│       ├── Cliente.java
│       ├── Damage.java
│       ├── Factura.java
│       ├── Herramienta.java
│       ├── Notificacion.java
│       ├── Pago.java
│       ├── Proveedor.java
│       ├── Reserva.java
│       └── Usuario.java
│
└── infrastructure/
    ├── controllers/
    │   ├── FacturaController.java
    │   ├── HerramientaController.java
    │   ├── NotificacionController.java
    │   ├── PagoController.java
    │   ├── ReporteController.java
    │   └── ReservaController.java
    │
    └── repositories/
        ├── CategoriaRepository.java
        ├── ClienteRepository.java
        ├── DamageRepository.java
        ├── EmailSender.java
        ├── FacturaRepository.java
        ├── HerramientaRepository.java
        ├── NotificacionRepository.java
        ├── PagoRepository.java
        ├── ProveedorRepository.java
        ├── ReservaRepository.java
        └── UsuarioRepository.java
```` 
🧪 Pruebas
Las pruebas de backend se realizan con JUnit y Postman.

Las pruebas del frontend son manuales o puedes integrar alguna librería como Cypress para tests E2E.

🙋‍♂️ Contribuciones
¿Te gustaría contribuir? ¡Bienvenido! Por favor sigue estos pasos:

Haz un fork del repositorio.

Crea una rama nueva: git checkout -b mi-nueva-funcionalidad.

Realiza tus cambios y haz commit.

Envía un pull request.

Repositorio backend:
https://github.com/stivenpe/Renta_Heramientas_ElidallanaCristancho_ErickArias_JeissonPerez/tree/develop


📄 Licencia
Este proyecto está bajo la licencia MIT.

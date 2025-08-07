# TicketPro+

TicketPro+ es una plataforma para gestionar solicitudes y tickets de manera eficiente. Nuestra aplicación está diseñada para facilitar la comunicación entre usuarios y administradores, ofreciendo una solución integral para el soporte técnico.

## Estructura del Proyecto

```plaintext
client/                                      # Carpeta Frontend: archivos y recursos para la interfaz de usuario
├── node_modules/                            # Carpeta de dependencias externas del frontend instaladas por npm (librerías y paquetes JS).
├── src/                                     # Carpeta de código fuente y recursos principales del frontend (estilos, imágenes, scripts, páginas HTML y componentes).
│   ├── assets/                              # Carpeta de recursos estáticos del frontend: estilos CSS, imágenes y scripts JavaScript.
│   │   ├── css/                             # Carpeta de hojas de estilo CSS para la interfaz de usuario
│   │   │   ├── icons-responsive.css         # Estilos CSS responsivos para iconos y elementos de la sección de preguntas frecuentes
│   │   │   ├── tailwind.css                 # Archivo base de Tailwind CSS para utilidades y estilos personalizados
│   │   │   └── styles.css                   # Hoja de estilos principal para la apariencia y diseño general del frontend en modo desarrollo
│   │   ├── dist/                            # Carpeta de archivos CSS generados automáticamente (estilos compilados de Tailwind para producción)
│   │   │   └── styles.css                   # Hoja de estilos generales de la aplicación
│   │   ├── images/                          # Carpeta de mágenes usadas en la aplicación
│   │   │   ├── perfiles/                    # Carpeta de imágenes de perfiles de usuarios y foto predeterminada
│   │   │   │   └── default.png              # Imagen perfil predeterminado
│   │   │   ├── logoticket.png               # Imagen del logo principal
│   │   │   └── logoticket2.png              # Imagen del logo secundario
│   │   └── js/                              # Archivos JavaScript para la lógica del cliente                        
│   │       ├── dashboard.js                 # Lógica y funcionalidades del dashboard principal del usuario
│   │       ├── departamentos.js             # Lógica para cargar departamentos y municipios en formularios de usuario
│   │       ├── jquery.min.js                # Biblioteca jQuery para manipulación del DOM y AJAX
│   │       ├── loadPartials.js              # Carga dinámica de fragmentos HTML reutilizables (header, footer)
│   │       ├── login.js                     # Lógica de autenticación y envío de credenciales al backend
│   │       ├── menu.js                      # Funcionalidad y comportamiento del menú de navegación
│   │       ├── modal-priv-cookies.js        # Carga y gestión de los modales de privacidad y cookies
│   │       ├── profile.js                   # Lógica para mostrar y editar el perfil del usuario
│   │       ├── register.js                  # Lógica para el registro de nuevos usuarios
│   │       ├── togglePassword.js            # Alterna la visibilidad de los campos de contraseña
│   │       └── usuarios.js                  # Módulo de gestión de usuarios: CRUD, vistas y paginación 
│   ├── auth/                                # Páginas de autenticación y recuperación de acceso
│   │   ├── login.html                       # Formulario de inicio de sesión de usuarios
│   │   ├── password_recovery.html           # Formulario para recuperación de contraseña
│   │   └── register.html                    # Formulario de registro de nuevos usuarios 
│   ├── pages/                               # Páginas HTML principales
│   │   ├── about.html                       # Información sobre TicketPro+ y el equipo
│   │   ├── contact.html                     # Página de contacto y formulario para mensajes
│   │   ├── dashboard.html                   # Dashboard principal del usuario autenticado
│   │   ├── modal-cookies.html               # Modal con la política de cookies
│   │   ├── modal-privacidad.html            # Modal con la política de privacidad
│   ├── partials/                            # Fragmentos HTML reutilizables
│   │   ├── departamentos.html               # Campos de selección de departamento y municipio para formularios
│   │   ├── header.html                      # Encabezado principal con logo y menú de navegación
│   │   └── footer.html                      # Pie de página con enlaces legales y redes sociales
├── index.html                               # Página principal de inicio y bienvenida para los usuarios
├── package-lock.json                        # Archivo de bloqueo de dependencias npm, garantiza la instalación exacta de versiones usadas en el frontend
├── package.json                             # Configuración del proyecto frontend y scripts de npm
├── postcss.config.js                        # Configuración de PostCSS para procesar y optimizar CSS
├── tailwind.config.js                       # Configuración personalizada de Tailwind CSS 
server/                                      # Carpeta backend: lógica de negocio, controladores PHP, configuración y base de datos 
├── config/                                  # Configuración del backend 
│   └── config.php                           # Archivo de configuración de la base de datos y cabeceras CORS 
├── controller/                              # Controladores del backend en PHP 
│   ├── DashboardController.php              # Controlador para proteger el acceso al dashboard y servir datos del usuario autenticado (HTML y JSON)
│   ├── LoginController.php                  # Controlador para autenticación de usuarios y creación de sesión
│   ├── LogoutController.php                 # Controlador para cerrar la sesión del usuario
│   ├── RegisterController.php               # Controlador para registro de nuevos usuarios
│   └── UsuariosController.php               # Controlador para gestión de usuarios: crear, actualizar, consultar y cambiar estado
├── db/                                      # Archivos de base de datos
│   ├── ticketpro.sql                        # Script SQL para crear y poblar la base de datos
│   └── bdticketpro.txt                      # Script alternativo o respaldo para la estructura y datos de la base de datos
├── model/                                   # Modelos del backend en PHP (acceso y lógica de datos)
│   ├── Usuario.php                          # Modelo para la entidad Usuario
├── .gitignore                               # Archivo para excluir archivos y carpetas del control de versiones Git
├── composer.json                            # Configuración de dependencias y autoload para proyectos PHP 
README.md                                    # Descripción y estructura del proyecto
index.php                                    # Controlador de enrutamiento básico para una aplicación web
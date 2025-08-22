# TicketPro+

TicketPro+ es una plataforma cliente-servidor para gestionar solicitudes y tickets de manera eficiente. Nuestra aplicación está diseñada para facilitar la comunicación entre usuarios y administradores, ofreciendo una solución integral para el soporte técnico.

## Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3 (Tailwind CSS), JavaScript (ES6), jQuery.
- **Backend:** PHP 8+, Composer para gestión de dependencias.
- **Base de datos:** MySQL.
- **Gestión de estilos:** Tailwind CSS, PostCSS.
- **Control de dependencias:** npm (Node.js) para frontend, Composer para backend.
- **Autenticación y seguridad:** Manejo de sesiones PHP, validación y recuperación de contraseñas, verificación por correo electrónico.
- **API REST:** Comunicación entre frontend y backend mediante rutas definidas en PHP.
- **Modularidad:** Estructura MVC para el backend y componentes reutilizables en el frontend.

## Arquitectura Cliente-Servidor

TicketPro+ sigue una arquitectura cliente-servidor:
- El **frontend** se ejecuta en el navegador del usuario y realiza peticiones HTTP a la API del backend.
- El **backend** procesa las solicitudes, gestiona la base de datos y responde con datos en formato JSON o HTML según corresponda.

## Estructura del Proyecto

```plaintext

Tk/                                                       # Nombre del proyecto ubicado en la raiz localhost
├── db/                                                   # Archivos de base de datos
│   ├── ticketpro.sql                                     # Script SQL para crear y poblar la base de datos
│   └── bdticketpro.txt                                   # Script alternativo o respaldo para la estructura y datos de la base de datos 
├── node_modules/                                         # Carpeta de dependencias externas del frontend instaladas por npm (librerías y paquetes JS).
├── server/                                               # Carpeta backend: lógica de negocio, controladores PHP, configuración y base de datos 
│   ├── config/                                           # Configuración del backend 
│   │   └── config.php                                    # Archivo de configuración de la base de datos y cabeceras CORS
│   ├── controller/                                       # Controladores del backend en PHP 
│   │   ├── DashboardController.php                       # Controlador para proteger el acceso al dashboard y servir datos del usuario autenticado (HTML y JSON)
│   │   ├── LoginController.php                           # Controlador para autenticación de usuarios y creación de sesión
│   │   ├── LogoutController.php                          # Controlador para cerrar la sesión del usuario
│   │   ├── PermisosController.php                        # Controlador para gestión de permisos: CRUD, matriz de roles-permisos y actualización de estado
│   │   ├── RegisterController.php                        # Controlador para registro de nuevos usuarios
│   │   ├── RolesController.php                           # Controlador PHP para consultar y actualizar roles.
│   │   └── UsuariosController.php                        # Controlador para gestión de usuarios: crear, actualizar, consultar y cambiar estado
│   ├── model/                                            # Modelos del backend en PHP (acceso y lógica de datos)
│   │   ├── Permisos.php                                  # Modelo para la entidad Permisos
│   │   ├── Rol.php                                       # Modelo para la entidad Rol
│   │   ├── Usuario.php                                   # Modelo para la entidad Usuario
│   ├── routes/                                           # Rutas de la API backend
│   │   ├── api.php                                       # Archivo principal de rutas; gestiona peticiones y conecta módulos con sus controladores
│   ├── utils/                                            # Utilidades y helpers para el backend
│   │   ├── EmailHelper.php                               # Helper para envío de correos electrónicos (verificación y notificaciones)
│   │   └── funtion.php                                   # Funciones auxiliares y configuración de base de datos/CORS
│   └── .env                                              # Variables de entorno y credenciales de configuración
├── src/                                                  # Carpeta de código fuente y recursos principales del frontend (estilos, imágenes, scripts, páginas HTML y componentes).
│   ├── assets/                                           # Carpeta de recursos estáticos del frontend: estilos CSS, imágenes y scripts JavaScript.
│   │   ├── css/                                          # Carpeta de hojas de estilo CSS para la interfaz de usuario
│   │   │   ├── icons-responsive.css                      # Estilos CSS responsivos para iconos y elementos de la sección de preguntas frecuentes
│   │   │   ├── tailwind.css                              # Archivo base de Tailwind CSS para utilidades y estilos personalizados
│   │   │   └── styles.css                                # Hoja de estilos principal para la apariencia y diseño general del frontend en modo desarrollo
│   │   ├── dist/                                         # Carpeta de archivos CSS generados automáticamente (estilos compilados de Tailwind para producción)
│   │   │   └── styles.css                                # Hoja de estilos generales de la aplicación
│   │   ├── images/                                       # Carpeta de mágenes usadas en la aplicación
│   │   │   ├── perfiles/                                 # Carpeta de imágenes de perfiles de usuarios y foto predeterminada
│   │   │   │   └── default.png                           # Imagen perfil predeterminado
│   │   │   ├── logoticket.png                            # Imagen del logo principal
│   │   │   └── logoticket2.png                           # Imagen del logo secundario
│   │   └── js/                                           # Archivos JavaScript para la lógica del cliente
│   │       ├── api/                                      # Módulo de funciones para consumir la API desde el frontend
│   │       │   └── api.js                                # Funciones JavaScript para interactuar con la API backend (consultas y acciones de usuarios, roles, dashboard)
│   │       ├── auth/                                     # Scripts relacionados con autenticación y registro
│   │       │   ├── login.js                              # Lógica de autenticación y envío de credenciales al backend
│   │       │   ├── password_recovery.js                  # Lógica para recuperación de contraseña y envío de código de verificación
│   │       │   ├── register.js                           # Lógica para el registro de nuevos usuarios
│   │       │   └── verify-code.js                        # Verificación de códigos para recuperación y registro
│   │       ├── jquery/                                   # Librerías externas
│   │       │   └── jquery.min.js                         # Biblioteca jQuery para manipulación del DOM y AJAX
│   │       ├── modals/                                   # Scripts para gestión de modales
│   │       │   ├── modal-logout.js                       # Modal para logout
│   │       │   ├── modal-priv-cookies.js                 # Carga y gestión de los modales de privacidad y cookies
│   │       │   └── modal-verificacion.js                 # Modal para verificación de usuario
│   │       ├── pages/                                    # Scripts específicos de páginas principales
│   │       │   ├── dashboard.js                          # Lógica y funcionalidades del dashboard principal del usuario
│   │       │   ├── permisos.js                           # Lógica para mostrar y actualizar la matriz de permisos por rol
│   │       │   ├── profile.js                            # Lógica para mostrar y editar el perfil del usuario
│   │       │   ├── roles.js                              # Módulo de gestión de Roles: CRUD, vistas y paginación
│   │       │   └── usuarios.js                           # Módulo de gestión de usuarios: CRUD, vistas y paginación
│   │       ├── utils/                                    # Scripts de utilidades generales
│   │       │   ├── departamentos.js                      # Lógica para cargar departamentos y municipios en formularios de usuario
│   │       │   ├── loadPartials.js                       # Carga dinámica de fragmentos HTML reutilizables (header, footer)
│   │       │   ├── menu.js                               # Funcionalidad y comportamiento del menú de navegación
│   │       │   └── togglePassword.js                     # Alterna la visibilidad de los campos de contraseña 
│   ├── pages/                                            # Páginas HTML principales
│   │   ├── auth/                                         # Páginas de autenticación y recuperación de acceso
│   │   │   ├── login.html                                # Formulario de inicio de sesión de usuarios
│   │   │   ├── password_recovery.html                    # Formulario para recuperación de contraseña
│   │   │   ├── register.html                             # Formulario de registro de nuevos usuarios 
│   │   │   ├── verify-code.html                          # Verificación de código para recuperación y registro
│   │   ├── info/                                         # Páginas informativas institucionales
│   │   │   ├── about.html                                # Información sobre TicketPro+ y el equipo
│   │   │   └── contact.html                              # Página de contacto y formulario para mensajes
│   │   ├── modals/                                       # Modales HTML para mensajes y políticas
│   │   │   ├── modal-cookies.html                        # Modal con la política de cookies
│   │   │   ├── modal-error-login.html                    # Modal para error en inicio de sesión
│   │   │   ├── modal-error-registro.html                 # Modal para error en registro
│   │   │   ├── modal-exito-login.html                    # Modal para éxito en inicio de sesión
│   │   │   ├── modal-exito-registro.html                 # Modal para éxito en registro
│   │   │   ├── modal-logout.html                         # Modal para cierre de sesión
│   │   │   ├── modal-nueva-contraseña.html               # Modal para ingresar y confirmar nueva contraseña del usuario
│   │   │   ├── modal-nuevo-pass-exitoso.html             # Modal de confirmación para contraseña cambiada 
│   │   │   ├── modal-privacidad.html                     # Modal con la política de privacidad
│   │   │   ├── modal-verificacion-codigo.html            # Modal para verificación de código
│   │   │   └── modal-verificar-codigo-recuperacion.html  # Modal para ingresar y verificar el código de recuperación enviado por correo 
│   │   ├── partials/                                     # Fragmentos HTML reutilizables
│   │   │   ├── departamentos.html                        # Campos de selección de departamento y municipio para formularios
│   │   │   ├── header.html                               # Encabezado principal con logo y menú de navegación
│   │   │   ├── footer.html                               # Pie de página con enlaces legales y redes sociales
│       └── dashboard.html                                # Dashboard principal del usuario autenticado
├── vendor/                                               # Dependencias externas instaladas por Composer (backend PHP)
├── composer.json                                         # Configuración de dependencias y paquetes PHP del proyecto
├── composer.lock                                         # Archivo de bloqueo que garantiza versiones exactas de dependencias PHP instaladas
├── index.html                                            # Página principal de inicio y bienvenida para los usuarios
├── package-lock.json                                     # Archivo de bloqueo de dependencias npm, garantiza la instalación exacta de versiones usadas en el frontend
├── package.json                                          # Configuración del proyecto frontend y scripts de npm
├── postcss.config.js                                     # Configuración de PostCSS para procesar y optimizar CSS
├── README.md                                             # Descripción y estructura del proyecto
└── tailwind.config.js                                    # Configuración personalizada de Tailwind CSS
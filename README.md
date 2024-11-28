# TicketPro+

TicketPro+ es una plataforma para gestionar solicitudes y tickets de manera eficiente. Nuestra aplicación está diseñada para facilitar la comunicación entre usuarios y administradores, ofreciendo una solución integral para el soporte técnico.

## Estructura del Proyecto

```plaintext
client/                                      # Código del lado del cliente
├── src/                                     # Código fuente del cliente
│   ├── assets/                              # Archivos estáticos utilizados en la aplicación
│   │   ├── css/                             # Hojas de estilo CSS
│   │   │   ├── tailwind.css                 # Archivo CSS generado por Tailwind
│   │   │   └── styles.css                   # Hoja de estilos generales de la aplicación
│   │   ├── dist/                            # 
│   │   │   └── styles.css                   # Hoja de estilos generales de la aplicación
│   │   ├── images/                          # Imágenes usadas en la aplicación
│   │   │   ├── logoticket.png               # Imagen del logo principal
│   │   │   └── logoticket2.png              # Imagen del logo secundario
│   │   └── js/                              # Archivos JavaScript para la lógica del cliente                        
│   │       ├── auth_session.js              #
│   │       ├── dashboard.js                 # 
│   │       ├── programas.js                 # 
│   │       ├── tickets.js                   # 
│   │       ├── tipologias.js                # 
│   │       ├── usuarios.js                  # 
│   │       ├── departamentos.js             # 
│   │       ├── jquery.min.js                # 
│   │       ├── loadPartials.js              # 
│   │       ├── menu.js                      #
│   │       └── togglePassword.js            #
│   ├── auth/                                #
│   │   ├── login.html                       # 
│   │   ├── register.html                    # 
│   │   ├── password_recovery.html           #
│   ├── pages/                               # Páginas HTML principales
│   │   ├── info/                            # Carpeta para las páginas de "Nosotros" y "Contacto"
│   │   │   ├── about.html                   # Página de "Nosotros"
│   │   │   └── contact.html                 # Página de "Contacto"
│   │   ├── dashboard.html                   #
│   │   ├── programas.html                   #
│   │   ├── tickets.html                     #
│   │   ├── tipologias.html                  # 
│   │   └── usuarios.html                    # Página de perfil del usuario
│   ├── partials/                            # Fragmentos HTML reutilizables
│   │   ├── departamentos.html               # Barra lateral común
│   │   ├── header.html                      # Encabezado común
│   │   └── footer.html                      # Pie de página común
├── index.html                               # Punto de entrada principal del cliente
├── package-lock.json                        # Dependencias del proyecto
├── package.json                             # Dependencias del proyecto
├── postcss.config.js                        # Configuración de PostCSS
├── README.md                               # Descripción del cliente
├── tailwind.config.js                       # Configuración de Tailwind CSS
server/                                      # Código del lado del servidor
├── config/                                  # Configuraciones del servidor
│   └── config.php                           # Configuración de conexión a la base de datos
├── php/                                     # Controladores para manejar la lógica de negocio
│   ├── server_login.php                     # 
│   └── server_register.php                  # 
│   ├── server_dashboard.php                 # 
│   ├── server_programas.php                 # 
│   ├── server_tickets.php                   # 
│   ├── server_tipologias.php                # 
│   └── server_usuarios.php                  # 
├── .gitignore                               # 
├── composer.json                            # Dependencias de PHP
├── [README.md]                              # Descripción del servidor
README.md                                  # Descripción y estructura del proyecto
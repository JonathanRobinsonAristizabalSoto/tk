document.addEventListener("DOMContentLoaded", function () {
    // Utilidad para mostrar/ocultar modales
    function toggleModal(modalId, show) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList[show ? 'remove' : 'add']('hidden');
    }

    // Sidebar siempre desplegado en desktop
    function handleSidebarVisibility() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const sidebarSubmenu = document.getElementById('sidebar-submenu');
        const dashboardIcon = document.getElementById('sidebar-dashboard-icon');
        if (window.innerWidth < 768) {
            sidebar.classList.add('fixed', 'top-20', 'left-0', 'z-50', 'hidden');
            overlay.classList.add('hidden');
            if (sidebarSubmenu) sidebarSubmenu.classList.add('hidden');
            if (dashboardIcon) {
                dashboardIcon.classList.add('fa-chevron-down');
                dashboardIcon.classList.remove('fa-chevron-up');
            }
        } else {
            sidebar.classList.remove('fixed', 'top-20', 'left-0', 'z-50', 'hidden');
            overlay.classList.add('hidden');
            if (sidebarSubmenu) sidebarSubmenu.classList.remove('hidden');
            if (dashboardIcon) {
                dashboardIcon.classList.remove('fa-chevron-down');
                dashboardIcon.classList.add('fa-chevron-up');
            }
        }
    }
    handleSidebarVisibility();
    window.addEventListener('resize', handleSidebarVisibility);

    // Sidebar toggle (móvil y desktop)
    document.getElementById('sidebar-toggle').addEventListener('click', function () {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (window.innerWidth < 768) {
            sidebar.classList.toggle('hidden');
            overlay.classList.toggle('hidden');
        } else {
            sidebar.classList.toggle('hidden');
        }
    });

    // Cerrar sidebar al hacer click en el overlay
    document.getElementById('sidebar-overlay').addEventListener('click', function () {
        toggleModal('sidebar', false);
        this.classList.add('hidden');
    });

    // Menú desplegable header (web y móvil)
    function toggleHeaderMenu(btnId, iconId) {
        document.getElementById(btnId).addEventListener('click', function (e) {
            e.stopPropagation();
            const submenu = document.getElementById('header-menu-nav');
            const dashboardIcon = document.getElementById(iconId);
            submenu.classList.toggle('hidden');
            dashboardIcon.classList.toggle('fa-chevron-down');
            dashboardIcon.classList.toggle('fa-chevron-up');
        });
    }
    toggleHeaderMenu('header-menu-button', 'header-dashboard-icon');
    toggleHeaderMenu('header-menu-button-mobile', 'header-dashboard-icon-mobile');

    // Menú desplegable sidebar
    document.getElementById('sidebar-menu-button').addEventListener('click', function () {
        const submenu = document.getElementById('sidebar-submenu');
        const dashboardIcon = document.getElementById('sidebar-dashboard-icon');
        submenu.classList.toggle('hidden');
        dashboardIcon.classList.toggle('fa-chevron-down');
        dashboardIcon.classList.toggle('fa-chevron-up');
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function (e) {
        const nav = document.getElementById('header-menu-nav');
        if (!nav.classList.contains('hidden')) {
            if (!nav.contains(e.target) &&
                !document.getElementById('header-menu-button').contains(e.target) &&
                !document.getElementById('header-menu-button-mobile').contains(e.target)) {
                nav.classList.add('hidden');
                document.getElementById('header-dashboard-icon').classList.add('fa-chevron-down');
                document.getElementById('header-dashboard-icon').classList.remove('fa-chevron-up');
                document.getElementById('header-dashboard-icon-mobile').classList.add('fa-chevron-down');
                document.getElementById('header-dashboard-icon-mobile').classList.remove('fa-chevron-up');
            }
        }
    });

    // Cargar nombre y foto del usuario en el header
    fetch('/TicketProApp/server/php/server_dashboard.php')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.nombre) {
                document.getElementById('username').textContent = data.nombre;
                document.getElementById('username-mobile').textContent = data.nombre;
            }
            if (data.success && data.foto) {
                // Solo actualiza la foto del usuario logueado en header y menú móvil
                const imgWeb = document.getElementById('profile-img-web');
                const imgMobile = document.getElementById('profile-img-mobile');
                if (imgWeb) imgWeb.src = '/TicketProApp/client/src/' + data.foto;
                if (imgMobile) imgMobile.src = '/TicketProApp/client/src/' + data.foto;
            }
        });

    // --- USUARIOS MODULE ---
    function renderUsuariosModule(isMobile) {
        const mainContent = document.getElementById('main-content');
        let textoSize = "text-xs";
        let nombreSize = "text-base font-bold";
        const width = window.innerWidth;
        if (width < 640) {
            textoSize = "text-xs";
            nombreSize = "text-base font-bold";
        } else if (width < 768) {
            textoSize = "text-sm";
            nombreSize = "text-sm font-bold";
        } else if (width < 1024) {
            textoSize = "text-base";
            nombreSize = "text-base font-bold";
        } else {
            textoSize = "text-base";
            nombreSize = "text-lg font-bold";
        }

        mainContent.innerHTML = `
        <div class="flex flex-col gap-2 mb-4">
            <div class="flex justify-center mb-2">
                <h2 class="text-2xl font-semibold text-color4 text-center ${nombreSize}">Usuarios</h2>
            </div>
            <div class="flex flex-row items-center gap-2">

                <div class="flex-shrink-0">
                    <button id="openModal" class="bg-color5 text-white px-4 py-2 rounded ${textoSize} flex items-center gap-2">
                        <i class="fas fa-user-plus"></i>
                        <span>Agregar Usuario</span>
                    </button>
                </div>

                <div class="flex-grow flex justify-center">
                    <input
                        type="text"
                        id="busquedaUsuarios"
                        placeholder="Buscar usuario..."
                        class="border border-gray-300 focus:border-color5 rounded px-3 py-2 ${textoSize} w-full sm:w-80 text-center"
                        autocomplete="off"
                    >
                </div>

                <div class="flex-shrink-0 flex justify-end gap-2 mx-12" style="min-width:100px;">
                    <button id="btnVistaTarjetas" class="bg-color5 text-white p-2 rounded shadow hover:bg-green-600 transition" title="Vista tarjetas">
                        <i class="fas fa-th-large"></i>
                    </button>
                    ${!isMobile ? `
                    <button id="btnVistaTabla" class="bg-color6 text-white p-2 rounded shadow hover:bg-orange-600 transition" title="Vista tabla">
                        <i class="fa-solid fa-list"></i>
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
        <div id="dataTable"></div>
        `;

        let textoBusqueda = "";

        function iniciarModuloUsuariosConFiltro(vista, filtro = "") {
            if (typeof window.iniciarModuloUsuarios === "function") {
                window.iniciarModuloUsuarios(vista, filtro);
            } else {
                iniciarModuloUsuarios(vista, filtro);
            }
        }

        document.getElementById('busquedaUsuarios').addEventListener('input', function () {
            textoBusqueda = this.value.trim().toLowerCase();
            iniciarModuloUsuariosConFiltro('tarjetas', textoBusqueda);
        });

        document.getElementById('btnVistaTarjetas').addEventListener('click', () => iniciarModuloUsuariosConFiltro('tarjetas', textoBusqueda));
        const btnTabla = document.getElementById('btnVistaTabla');
        if (btnTabla) btnTabla.addEventListener('click', () => iniciarModuloUsuariosConFiltro('tabla', textoBusqueda));
        document.getElementById('openModal').addEventListener('click', () => toggleModal('modalCrear', true));

        // Inicializar con filtro vacío
        iniciarModuloUsuariosConFiltro('tarjetas', "");
    }

    // Mostrar módulo usuarios automáticamente si hay mensaje pendiente en localStorage
    if (localStorage.getItem("usuariosMensaje")) {
        renderUsuariosModule(window.innerWidth < 768);
        setSidebarActive('sidebar-usuarios-btn');
        return;
    }

    // --- RESALTAR MODULO ACTIVO EN SIDEBAR ---
    function setSidebarActive(id) {
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('border-2', 'border-color6', 'text-color6', 'bg-color6', 'text-white');
            link.classList.add('text-color1');
        });
        const activeLink = document.getElementById(id);
        if (activeLink) {
            activeLink.classList.add('border-2', 'border-color6', 'text-color6');
            activeLink.classList.remove('text-color1', 'bg-color6', 'text-white');
        }
    }

    // Mostrar módulo usuarios en el main al hacer clic en el botón de usuarios
    document.getElementById('sidebar-usuarios-btn').addEventListener('click', function (e) {
        e.preventDefault();
        setSidebarActive('sidebar-usuarios-btn');
        renderUsuariosModule(window.innerWidth < 768);
    });

    // Resaltar Roles
    const rolesBtn = document.getElementById('sidebar-roles-btn');
    if (rolesBtn) {
        rolesBtn.addEventListener('click', function () {
            setSidebarActive('sidebar-roles-btn');
        });
    }

    // Resaltar Tickets
    const ticketsBtn = document.getElementById('sidebar-tickets-btn');
    if (ticketsBtn) {
        ticketsBtn.addEventListener('click', function () {
            setSidebarActive('sidebar-tickets-btn');
        });
    }

    // Resaltar Tipologías
    const tipologiasBtn = document.getElementById('sidebar-tipologias-btn');
    if (tipologiasBtn) {
        tipologiasBtn.addEventListener('click', function () {
            setSidebarActive('sidebar-tipologias-btn');
        });
    }

    // Resaltar Programas
    const programasBtn = document.getElementById('sidebar-programas-btn');
    if (programasBtn) {
        programasBtn.addEventListener('click', function () {
            setSidebarActive('sidebar-programas-btn');
        });
    }

    // Cerrar modal de crear usuario
    document.getElementById('closeModalCrear').addEventListener('click', function () {
        toggleModal('modalCrear', false);
    });

    // Cerrar modal de editar usuario
    document.getElementById('closeModalEditar').addEventListener('click', function () {
        toggleModal('modalEditar', false);
    });

    // Función global para mostrar el modal de editar usuario
    window.mostrarModalEditar = function () {
        toggleModal('modalEditar', true);
    };
});
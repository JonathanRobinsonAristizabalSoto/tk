import { getDashboardUser } from "../api/api.js";

document.addEventListener("DOMContentLoaded", async function () {
    let data;
    try {
        // Verifica si el usuario está autenticado
        data = await getDashboardUser();
        if (!data.success) {
            window.location.href = "/tk/index.html";
            return;
        }
    } catch (error) {
        alert("Error de conexión. Intenta nuevamente.");
        window.location.href = "/tk/index.html";
        return;
    }

    // Muestra u oculta un modal por id
    function toggleModal(modalId, show) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList[show ? 'remove' : 'add']('hidden');
    }

    // Ajusta la visibilidad del sidebar según el tamaño de pantalla
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

    // Botón para mostrar/ocultar el sidebar en móvil
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

    // Cierra el sidebar al hacer clic en el overlay
    document.getElementById('sidebar-overlay').addEventListener('click', function () {
        toggleModal('sidebar', false);
        this.classList.add('hidden');
    });

    // Alterna el menú del header (web y móvil)
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

    // Alterna el submenú del sidebar
    document.getElementById('sidebar-menu-button').addEventListener('click', function () {
        const submenu = document.getElementById('sidebar-submenu');
        const dashboardIcon = document.getElementById('sidebar-dashboard-icon');
        submenu.classList.toggle('hidden');
        dashboardIcon.classList.toggle('fa-chevron-down');
        dashboardIcon.classList.toggle('fa-chevron-up');
    });

    // Cierra el menú del header si se hace clic fuera
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

    // Muestra el nombre y foto del usuario en el header
    if (data.success && data.nombre) {
        document.getElementById('username').textContent = data.nombre;
        document.getElementById('username-mobile').textContent = data.nombre;
    }
    if (data.success && data.foto) {
        const imgWeb = document.getElementById('profile-img-web');
        const imgMobile = document.getElementById('profile-img-mobile');
        if (imgWeb) imgWeb.src = '/tk/src/' + data.foto;
        if (imgMobile) imgMobile.src = '/tk/src/' + data.foto;
    }

    // Renderiza el módulo de roles
    function renderRolesModule(vista = "tarjetas") {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = "";
        if (typeof window.renderRoles === "function") {
            window.renderRoles(vista);
        } else if (typeof renderRoles === "function") {
            renderRoles(vista);
        } else {
            mainContent.innerHTML = "<div class='text-center text-red-600 font-bold'>No se pudo cargar el módulo de roles.</div>";
        }
    }

    // Renderiza el módulo de permisos
    function renderPermisosModule(vista = "tarjetas") {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = "";
        if (typeof window.renderPermisos === "function") {
            window.renderPermisos(vista);
        } else if (typeof renderPermisos === "function") {
            renderPermisos(vista);
        } else {
            mainContent.innerHTML = "<div class='text-center text-red-600 font-bold'>No se pudo cargar el módulo de permisos.</div>";
        }
    }

    // Renderiza el módulo de programas
    function renderProgramasModule(vista = "tarjetas") {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = "";
        if (typeof window.iniciarModuloProgramas === "function") {
            window.iniciarModuloProgramas(vista, "");
        } else if (typeof iniciarModuloProgramas === "function") {
            iniciarModuloProgramas(vista, "");
        } else {
            mainContent.innerHTML = "<div class='text-center text-red-600 font-bold'>No se pudo cargar el módulo de programas.</div>";
        }
    }

    // Marca el botón activo en el sidebar
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

    // Sidebar: muestra usuarios en tarjetas por defecto
    document.getElementById('sidebar-usuarios-btn').addEventListener('click', function (e) {
        e.preventDefault();
        setSidebarActive('sidebar-usuarios-btn');
        window.iniciarModuloUsuarios('tarjetas', "");
    });

    // Sidebar: muestra roles
    const rolesBtn = document.getElementById('sidebar-roles-btn');
    if (rolesBtn) {
        rolesBtn.addEventListener('click', function (e) {
            e.preventDefault();
            setSidebarActive('sidebar-roles-btn');
            renderRolesModule("tarjetas");
        });
    }

    // Sidebar: muestra permisos
    const permisosBtn = document.getElementById('sidebar-permisos-btn');
    if (permisosBtn) {
        permisosBtn.addEventListener('click', function (e) {
            e.preventDefault();
            setSidebarActive('sidebar-permisos-btn');
            renderPermisosModule("tarjetas");
        });
    }

    // Sidebar: muestra tickets (ajustado para renderizar el módulo)
    const ticketsBtn = document.getElementById('sidebar-tickets-btn');
    if (ticketsBtn) {
        ticketsBtn.addEventListener('click', function () {
            setSidebarActive('sidebar-tickets-btn');
            window.iniciarModuloTickets(localStorage.getItem('ticketsVista') || 'tarjetas', "");
        });
    }

    // Sidebar: muestra tipologías (ajustado para iniciar como tabla y guardar preferencia)
    const tipologiasBtn = document.getElementById('sidebar-tipologias-btn');
    if (tipologiasBtn) {
        tipologiasBtn.addEventListener('click', function () {
            setSidebarActive('sidebar-tipologias-btn');
            // Obtiene la vista guardada o inicia en tabla
            const vista = localStorage.getItem('tipologiasVista') || "tabla";
            window.iniciarModuloTipologias(vista, "");
        });
    }

    // Sidebar: muestra subtipologías
    const subtipologiasBtn = document.getElementById('sidebar-subtipologias-btn');
    if (subtipologiasBtn) {
        subtipologiasBtn.addEventListener('click', function () {
            setSidebarActive('sidebar-subtipologias-btn');
            window.iniciarModuloSubtipologias(localStorage.getItem('subtipologiasVista') || 'tarjetas');
        });
    }

    // Sidebar: muestra programas
    const programasBtn = document.getElementById('sidebar-programas-btn');
    if (programasBtn) {
        programasBtn.addEventListener('click', function () {
            setSidebarActive('sidebar-programas-btn');
            renderProgramasModule(localStorage.getItem('programasVista') || 'tarjetas');
        });
    }

    // Cierra los modales de crear y editar usuario
    document.getElementById('closeModalCrear').addEventListener('click', function () {
        toggleModal('modalCrear', false);
    });

    document.getElementById('closeModalEditar').addEventListener('click', function () {
        toggleModal('modalEditar', false);
    });

    // Muestra el modal de confirmación de logout solo cuando el usuario lo solicita
    function mostrarModalLogoutConfirm() {
        const modal = document.getElementById('modal-logout-confirm');
        if (modal) {
            modal.classList.remove('hidden');
            const btnSi = document.getElementById('btnLogoutConfirmSi');
            if (btnSi) {
                btnSi.onclick = function () {
                    window.location.href = "/tk/server/controller/LogoutController.php";
                };
            }
            const btnNo = document.getElementById('btnLogoutConfirmNo');
            if (btnNo) {
                btnNo.onclick = function () {
                    modal.classList.add('hidden');
                };
            }
        }
    }
});
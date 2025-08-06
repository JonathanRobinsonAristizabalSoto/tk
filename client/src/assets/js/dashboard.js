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
                document.querySelectorAll('img[alt="Foto de perfil"]').forEach(img => {
                    img.src = '../' + data.foto;
                });
            }
        });

    function renderUsuariosModule(isMobile) {
    const mainContent = document.getElementById('main-content');
    // Ajuste de tamaño de texto según pantalla
    let textoSize = "text-xs";
    let nombreSize = "text-base font-bold";
    let emailSize = "text-xs";
    let rolSize = "text-xs";
    let infoSize = "text-xs";
    const width = window.innerWidth;
    if (width < 640) {
        textoSize = "text-xs";
        nombreSize = "text-base font-bold";
        emailSize = "text-[10px]";
        rolSize = "text-[10px]";
        infoSize = "text-[10px]";
    } else if (width < 768) {
        textoSize = "text-sm";
        nombreSize = "text-sm font-bold";
        emailSize = "text-sm";
        rolSize = "text-sm";
        infoSize = "text-sm";
    } else if (width < 1024) {
        textoSize = "text-base";
        nombreSize = "text-base font-bold";
        emailSize = "text-base";
        rolSize = "text-base";
        infoSize = "text-base";
    } else if (width < 1280) {
        textoSize = "text-base";
        nombreSize = "text-lg font-bold";
        emailSize = "text-lg";
        rolSize = "text-lg";
        infoSize = "text-lg";
    } else {
        textoSize = "text-base";
        nombreSize = "text-lg font-bold";
        emailSize = "text-lg";
        rolSize = "text-lg";
        infoSize = "text-lg";
    }

    mainContent.innerHTML = `
        <div class="flex justify-between items-center">
            <h2 class="text-2xl font-semibold text-color4 text-center ${nombreSize}">Usuarios</h2>
            <div class="flex gap-2">
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
        <button id="openModal" class="mb-4 bg-color5 text-white p-2 rounded ${textoSize}">Agregar Usuario</button>
        <div id="dataTable"></div>
    `;
    iniciarModuloUsuarios('tarjetas');
    document.getElementById('btnVistaTarjetas').addEventListener('click', () => iniciarModuloUsuarios('tarjetas'));
    const btnTabla = document.getElementById('btnVistaTabla');
    if (btnTabla) btnTabla.addEventListener('click', () => iniciarModuloUsuarios('tabla'));
    document.getElementById('openModal').addEventListener('click', () => toggleModal('modalCrear', true));
}

    // Mostrar módulo usuarios automáticamente si hay mensaje pendiente en localStorage
    if (localStorage.getItem("usuariosMensaje")) {
        renderUsuariosModule(window.innerWidth < 768);
        return;
    }

    // Mostrar módulo usuarios en el main al hacer clic en el botón de usuarios
    document.getElementById('sidebar-usuarios-btn').addEventListener('click', function (e) {
        e.preventDefault();
        renderUsuariosModule(window.innerWidth < 768);
    });

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
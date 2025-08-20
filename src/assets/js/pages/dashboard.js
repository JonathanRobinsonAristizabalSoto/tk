import { getDashboardUser, getRoles } from "../api/api.js";

// --- NUEVO: función para obtener tipos de documento y roles desde el backend ---
async function getCatalogosUsuario() {
    try {
        const response = await fetch("/tk/server/routes/api.php?module=usuarios&action=get_catalogos");
        return await response.json();
    } catch (error) {
        return { success: false, tipos_documento: [], roles: [] };
    }
}

// Mapeo para mostrar nombres amigables de tipos de documento según la base de datos
const tipoDocumentoLabels = {
    "CC": "Cédula de Ciudadanía",
    "TI": "Tarjeta de Identidad",
    "CE": "Cédula de Extranjería",
    "PS": "Pasaporte",
    "DNI": "DNI",
    "NIT": "NIT"
};

// --- Utilidad para cargar roles en un select ---
async function cargarRolesEnSelect(selectId, selectedRolId = null) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = '<option value="">Cargando roles...</option>';
    try {
        const data = await getRoles();
        if (data.success && Array.isArray(data.roles)) {
            select.innerHTML = '';
            data.roles.forEach(rol => {
                const option = document.createElement('option');
                option.value = rol.id_rol;
                option.textContent = rol.nombre;
                if (selectedRolId && String(rol.id_rol) === String(selectedRolId)) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        } else {
            select.innerHTML = '<option value="">No hay roles disponibles</option>';
        }
    } catch (error) {
        select.innerHTML = '<option value="">Error al cargar roles</option>';
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    // Verificar autenticación antes de mostrar el dashboard
    let data;
    try {
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

    // Utilidad para mostrar/ocultar modales por id
    function toggleModal(modalId, show) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList[show ? 'remove' : 'add']('hidden');
    }

    // Sidebar siempre desplegado en desktop, oculto en móvil
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

    // Botón para mostrar/ocultar sidebar (móvil y desktop)
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

    // Cerrar sidebar al hacer click en el overlay (solo móvil)
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

    // Menú desplegable sidebar (submenú)
    document.getElementById('sidebar-menu-button').addEventListener('click', function () {
        const submenu = document.getElementById('sidebar-submenu');
        const dashboardIcon = document.getElementById('sidebar-dashboard-icon');
        submenu.classList.toggle('hidden');
        dashboardIcon.classList.toggle('fa-chevron-down');
        dashboardIcon.classList.toggle('fa-chevron-up');
    });

    // Cerrar menú header al hacer click fuera de él
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

        let usuariosHeaderHtml = "";
        if (isMobile) {
            usuariosHeaderHtml = `
            <div class="flex flex-col gap-2 my-2">
                <button id="openModal" class="bg-color5 text-white px-4 py-2 rounded ${textoSize} flex items-center gap-2 w-full justify-center">
                    <i class="fas fa-user-plus"></i>
                    <span>Agregar Usuario</span>
                </button>
                <input
                    type="text"
                    id="busquedaUsuarios"
                    placeholder="Buscar usuario..."
                    class="border border-gray-300 rounded px-3 py-2 ${textoSize} w-full text-center"
                    autocomplete="off"
                    style="outline:none;"
                    onfocus="this.style.borderColor='#22c55e';"
                    onblur="this.style.borderColor='#d1d5db';"
                >
            </div>
            `;
        } else {
            usuariosHeaderHtml = `
            <div class="flex flex-row items-center gap-2 my-2">
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
                        class="border border-gray-300 rounded px-3 py-2 ${textoSize} w-full sm:w-80 text-center"
                        autocomplete="off"
                        style="outline:none;"
                        onfocus="this.style.borderColor='#22c55e';"
                        onblur="this.style.borderColor='#d1d5db';"
                    >
                </div>
                <div class="flex-shrink-0 flex justify-end gap-2 mx-12" style="min-width:100px;">
                    <button id="btnVistaTarjetas" class="bg-color5 text-white p-2 rounded shadow hover:bg-green-600 transition" title="Vista tarjetas">
                        <i class="fas fa-th-large"></i>
                    </button>
                    <button id="btnVistaTabla" class="bg-color6 text-white p-2 rounded shadow hover:bg-orange-600 transition" title="Vista tabla">
                        <i class="fa-solid fa-list"></i>
                    </button>
                </div>
            </div>
            `;
        }

        // --- AJUSTE: el paginador SIEMPRE debe estar dentro del área dinámica ---
        mainContent.innerHTML = `
        <div class="flex flex-col gap-2 my-1">
            <div class="flex justify-center">
                <h2 class="text-2xl font-semibold text-color4 text-center ${nombreSize}">Usuarios</h2>
            </div>
            ${usuariosHeaderHtml}
        </div>
        <div id="dataTable"></div>
        <div id="usuariosPaginador" class="mt-4 flex justify-center items-center"></div>
        `;

        let textoBusqueda = "";

        function iniciarModuloUsuariosConFiltro(vista, filtro = "") {
            try {
                if (typeof window.iniciarModuloUsuarios === "function") {
                    window.iniciarModuloUsuarios(vista, filtro);
                } else {
                    iniciarModuloUsuarios(vista, filtro);
                }
            } catch (error) {
                alert("Error al cargar el módulo de usuarios.");
                console.error("Error en iniciarModuloUsuarios:", error);
            }
        }

        document.getElementById('busquedaUsuarios').addEventListener('input', function () {
            textoBusqueda = this.value.trim().toLowerCase();
            iniciarModuloUsuariosConFiltro('tarjetas', textoBusqueda);
        });

        const btnVistaTarjetas = document.getElementById('btnVistaTarjetas');
        if (btnVistaTarjetas) btnVistaTarjetas.addEventListener('click', () => iniciarModuloUsuariosConFiltro('tarjetas', textoBusqueda));
        const btnTabla = document.getElementById('btnVistaTabla');
        if (btnTabla) btnTabla.addEventListener('click', () => iniciarModuloUsuariosConFiltro('tabla', textoBusqueda));

        // --- MODIFICADO: cargar tipos de documento y roles dinámicamente al abrir el modal de crear usuario ---
        document.getElementById('openModal').addEventListener('click', async () => {
            try {
                const catalogos = await getCatalogosUsuario();
                // Tipos de documento
                const tipoDocSelect = document.getElementById("tipo_documentoCrear");
                if (tipoDocSelect) {
                    tipoDocSelect.innerHTML = "";
                    if (catalogos.success && Array.isArray(catalogos.tipos_documento)) {
                        catalogos.tipos_documento.forEach(tipo => {
                            const option = document.createElement("option");
                            option.value = tipo;
                            option.textContent = tipoDocumentoLabels[tipo] || tipo;
                            tipoDocSelect.appendChild(option);
                        });
                    } else {
                        tipoDocSelect.innerHTML = '<option value="">No hay tipos disponibles</option>';
                    }
                }
                // Roles
                await cargarRolesEnSelect("rolCrear");
            } catch (error) {
                const tipoDocSelect = document.getElementById("tipo_documentoCrear");
                if (tipoDocSelect) tipoDocSelect.innerHTML = '<option value="">Error al cargar tipos</option>';
                const rolSelect = document.getElementById("rolCrear");
                if (rolSelect) rolSelect.innerHTML = '<option value="">Error al cargar roles</option>';
                alert("Error al cargar catálogos de usuario.");
                console.error("Error al cargar catálogos:", error);
            }
            toggleModal('modalCrear', true);
        });

        iniciarModuloUsuariosConFiltro('tarjetas', "");
    }

    // --- ROLES MODULE ---
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

    // Elimina el renderizado automático de usuarios/roles al recargar
    if (localStorage.getItem("usuariosMensaje")) {
        localStorage.removeItem("usuariosMensaje");
    }

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

    document.getElementById('sidebar-usuarios-btn').addEventListener('click', function (e) {
        e.preventDefault();
        setSidebarActive('sidebar-usuarios-btn');
        renderUsuariosModule(window.innerWidth < 768);
    });

    const rolesBtn = document.getElementById('sidebar-roles-btn');
    if (rolesBtn) {
        rolesBtn.addEventListener('click', function (e) {
            e.preventDefault();
            setSidebarActive('sidebar-roles-btn');
            renderRolesModule("tarjetas");
        });
    }

    const ticketsBtn = document.getElementById('sidebar-tickets-btn');
    if (ticketsBtn) {
        ticketsBtn.addEventListener('click', function () {
            setSidebarActive('sidebar-tickets-btn');
            // Aquí puedes agregar la función para mostrar los tickets si tienes una
            // Si no, se mantiene el contenido por defecto del dashboard.html
        });
    }

    const tipologiasBtn = document.getElementById('sidebar-tipologias-btn');
    if (tipologiasBtn) {
        tipologiasBtn.addEventListener('click', function () {
            setSidebarActive('sidebar-tipologias-btn');
        });
    }

    const programasBtn = document.getElementById('sidebar-programas-btn');
    if (programasBtn) {
        programasBtn.addEventListener('click', function () {
            setSidebarActive('sidebar-programas-btn');
        });
    }

    document.getElementById('closeModalCrear').addEventListener('click', function () {
        toggleModal('modalCrear', false);
    });

    document.getElementById('closeModalEditar').addEventListener('click', function () {
        toggleModal('modalEditar', false);
    });

    // Función para cargar roles dinámicamente en el modal de edición usando el API centralizado
    window.cargarRolesEditar = async function (selectedRolId) {
        await cargarRolesEnSelect('rolEditar', selectedRolId);
    };

    window.mostrarModalEditar = function (usuario) {
        window.cargarRolesEditar(usuario && usuario.id_rol ? usuario.id_rol : null);
        toggleModal('modalEditar', true);
    };

    // --- MEJORA: Modal de confirmación al presionar atrás en el navegador ---
    // Agrega una entrada extra al historial para interceptar el primer "Atrás"
    if (window.history && window.history.pushState) {
        window.history.pushState({ dashboard: true }, '', window.location.href);
    }

    window.addEventListener('popstate', function (event) {
        // Solo mostrar el modal si estamos en dashboard
        if (location.pathname.includes('dashboard.html')) {
            mostrarModalLogoutConfirm();
            // Volver a agregar la entrada para evitar salir
            window.history.pushState({ dashboard: true }, '', window.location.href);
        }
    });

    function mostrarModalLogoutConfirm() {
        const modal = document.getElementById('modal-logout-confirm');
        if (modal) {
            modal.classList.remove('hidden');
            // Botón Sí: cerrar sesión
            const btnSi = document.getElementById('btnLogoutConfirmSi');
            if (btnSi) {
                btnSi.onclick = function () {
                    window.location.href = "/tk/server/controller/LogoutController.php";
                };
            }
            // Botón No: cerrar modal y permanecer en dashboard
            const btnNo = document.getElementById('btnLogoutConfirmNo');
            if (btnNo) {
                btnNo.onclick = function () {
                    modal.classList.add('hidden');
                };
            }
        }
    }
});
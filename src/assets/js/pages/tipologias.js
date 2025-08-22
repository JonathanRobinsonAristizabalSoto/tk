import { fetchTipologias, fetchTipologiaById, createTipologia, updateTipologia, deleteTipologia, toggleEstadoTipologia } from "../api/api.js";

// Cargar roles dinámicamente en los selects de los modales
async function cargarRolesEnSelectTipologia(selectId, selectedRolId = null) {
    const res = await fetch("/tk/server/routes/api.php?module=roles&action=fetch", { method: "POST" });
    const roles = await res.json();
    const select = document.getElementById(selectId);
    select.innerHTML = "";
    if (Array.isArray(roles)) {
        roles.forEach(rol => {
            const option = document.createElement("option");
            option.value = rol.id_rol;
            option.textContent = rol.nombre;
            if (selectedRolId && rol.id_rol == selectedRolId) option.selected = true;
            select.appendChild(option);
        });
    }
}

// Cargar tipologías base (enum) en los selects de los modales
function cargarTipologiasBaseEnSelect(selectId, selectedTipologia = null) {
    const tipologiasBase = ["Formacion", "Consultas", "Certificacion", "PQRSF", "Otro"];
    const labels = {
        "Formacion": "Formación",
        "Consultas": "Consultas",
        "Certificacion": "Certificación",
        "PQRSF": "PQRSF",
        "Otro": "Otro"
    };
    const select = document.getElementById(selectId);
    select.innerHTML = "";
    tipologiasBase.forEach(tipo => {
        const option = document.createElement("option");
        option.value = tipo;
        option.textContent = labels[tipo];
        if (selectedTipologia && tipo === selectedTipologia) option.selected = true;
        select.appendChild(option);
    });
}

// Renderizado principal y gestión de modales
function iniciarModuloTipologias(vista = "tarjetas", filtro = "") {
    const mainContent = document.getElementById('main-content');
    let tipologiasData = [];
    let paginaActual = 1;
    let tipologiasPorPagina = 8;
    let filtroBusqueda = filtro;

    // Header y estructura
    mainContent.innerHTML = `
        <div class="flex flex-col gap-2 my-1">
            <div class="flex justify-center items-center gap-2">
                <i class="fas fa-tags text-color6 text-2xl"></i>
                <h2 class="text-color4 text-center text-xl font-semibold">Tipologías</h2>
            </div>
            <div class="flex flex-row items-center gap-2">
                <button id="openModalTipologia" class="bg-color5 text-white px-4 py-2 rounded flex items-center gap-2">
                    <i class="fas fa-plus"></i>
                    <span>Agregar Tipología</span>
                </button>
                <input type="text" id="busquedaTipologias" placeholder="Buscar tipología..." class="border border-gray-300 rounded px-3 py-2 w-full sm:w-80 text-center" autocomplete="off">
            </div>
        </div>
        <div id="dataTableTipologias"></div>
        <div id="tipologiasPaginador" class="mt-4 flex justify-center items-center"></div>
    `;

    const dataTable = document.getElementById("dataTableTipologias");
    const paginador = document.getElementById("tipologiasPaginador");

    // Renderiza la lista de tipologías
    function renderTipologias() {
        dataTable.innerHTML = "";
        let tipologiasFiltradas = tipologiasData;
        if (filtroBusqueda && filtroBusqueda.length > 0) {
            tipologiasFiltradas = tipologiasData.filter(t =>
                (t.tipologia && t.tipologia.toLowerCase().includes(filtroBusqueda)) ||
                (t.subtipologia && t.subtipologia.toLowerCase().includes(filtroBusqueda))
            );
        }
        const totalPaginas = Math.max(1, Math.ceil(tipologiasFiltradas.length / tipologiasPorPagina));
        if (paginaActual > totalPaginas) paginaActual = 1;
        const inicio = (paginaActual - 1) * tipologiasPorPagina;
        const fin = inicio + tipologiasPorPagina;
        const mostrar = tipologiasFiltradas.slice(inicio, fin);

        dataTable.className = `grid grid-cols-1 sm:grid-cols-4 gap-4`;
        mostrar.forEach((t) => {
            const isActivo = t.estado_tipologia === "Activo";
            const btnColor = isActivo ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
            const btnIcon = isActivo ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>';
            const btnTitle = isActivo ? "Inhabilitar" : "Habilitar";
            const card = document.createElement("div");
            card.className = `bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex flex-col items-center text-xs`;
            card.innerHTML = `
                <div class="text-sm font-bold text-color4 text-center">${t.tipologia} - ${t.subtipologia}</div>
                <div class="text-xs text-color6 text-center">${t.rol_nombre || ""}</div>
                <div class="text-xs text-color3 text-center">${t.estado_tipologia}</div>
                <div class="flex justify-center mt-2 space-x-1">
                    <button class="flex bg-color5 text-white p-2 rounded-lg hover:bg-color6 transition duration-300" data-id="${t.id_tipologia}" data-action="ver" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="flex bg-color6 text-white p-2 rounded-lg hover:bg-color6 transition duration-300" data-id="${t.id_tipologia}" data-action="editar" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="flex ${btnColor} text-white p-2 rounded-lg transition duration-300 items-center" data-id="${t.id_tipologia}" data-action="estado" title="${btnTitle}">
                        ${btnIcon}
                    </button>
                    <button class="flex bg-red-500 text-white p-2 rounded-lg transition duration-300 items-center" data-id="${t.id_tipologia}" data-action="eliminar" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            dataTable.appendChild(card);
        });

        renderPaginador(tipologiasFiltradas.length);

        // Eventos de acciones en las tarjetas
        dataTable.querySelectorAll("button[data-action]").forEach(btn => {
            const id = btn.getAttribute("data-id");
            const action = btn.getAttribute("data-action");
            if (action === "ver") btn.onclick = () => viewTipologia(id);
            if (action === "editar") btn.onclick = () => editTipologia(id);
            if (action === "estado") btn.onclick = () => confirmEstadoTipologia(id);
            if (action === "eliminar") btn.onclick = () => eliminarTipologia(id);
        });
    }

    // Paginador
    function renderPaginador(total) {
        paginador.innerHTML = "";
        const totalPaginas = Math.max(1, Math.ceil(total / tipologiasPorPagina));
        let html = `<nav class="flex justify-center items-center gap-1 m-1">`;
        html += `<button class="px-2 py-1 rounded bg-color5 text-white text-xs font-semibold hover:bg-color6 transition ${paginaActual === 1 ? "opacity-50 cursor-not-allowed" : ""}" ${paginaActual === 1 ? "disabled" : ""} id="btnPagAnteriorTipologias">Anterior</button>`;
        for (let i = 1; i <= totalPaginas; i++) {
            html += `<button class="px-2 py-1 rounded ${i === paginaActual ? "bg-color6 text-white" : "bg-white text-color5 border border-color5"} text-xs font-semibold hover:bg-color5 hover:text-white transition" data-pagina="${i}">${i}</button>`;
        }
        html += `<button class="px-2 py-1 rounded bg-color5 text-white text-xs font-semibold hover:bg-color6 transition ${paginaActual === totalPaginas ? "opacity-50 cursor-not-allowed" : ""}" ${paginaActual === totalPaginas ? "disabled" : ""} id="btnPagSiguienteTipologias">Siguiente</button>`;
        html += `</nav>`;
        paginador.innerHTML = html;

        document.getElementById("btnPagAnteriorTipologias")?.addEventListener("click", () => {
            if (paginaActual > 1) {
                paginaActual--;
                renderTipologias();
            }
        });
        document.getElementById("btnPagSiguienteTipologias")?.addEventListener("click", () => {
            if (paginaActual < totalPaginas) {
                paginaActual++;
                renderTipologias();
            }
        });
        paginador.querySelectorAll("button[data-pagina]").forEach(btn => {
            btn.addEventListener("click", () => {
                paginaActual = parseInt(btn.getAttribute("data-pagina"));
                renderTipologias();
            });
        });
    }

    // Buscador
    document.getElementById('busquedaTipologias')?.addEventListener('input', function () {
        filtroBusqueda = this.value.trim().toLowerCase();
        renderTipologias();
    });

    // Modal Crear Tipología
    const modalCrear = document.getElementById("modalCrearTipologia");
    const abrirModalCrear = document.getElementById("openModalTipologia");
    const cerrarModalCrear = document.getElementById("closeModalCrearTipologia");
    const formCrear = document.getElementById("formCrearTipologia");

    if (abrirModalCrear) {
        abrirModalCrear.addEventListener("click", async () => {
            cargarTipologiasBaseEnSelect("tipologiaCrear");
            await cargarRolesEnSelectTipologia("rolCrearTipologia");
            formCrear.reset();
            modalCrear.classList.remove("hidden");
        });
    }
    if (cerrarModalCrear) cerrarModalCrear.addEventListener("click", () => modalCrear.classList.add("hidden"));
    if (formCrear) {
        formCrear.addEventListener("submit", async function (e) {
            e.preventDefault();
            const data = {
                tipologia: document.getElementById("tipologiaCrear").value,
                subtipologia: document.getElementById("subtipologiaCrear").value,
                id_rol: document.getElementById("rolCrearTipologia").value,
                estado_tipologia: document.getElementById("estadoTipologiaCrear").value
            };
            const res = await createTipologia(data);
            if (res.success) {
                modalCrear.classList.add("hidden");
                mostrarMensajeTipologia("exito", "Tipología creada exitosamente.");
                cargarTipologias();
            } else {
                mostrarMensajeTipologia("error", res.message || "Error al crear tipología.");
            }
        });
    }

    // Modal Editar Tipología
    const modalEditar = document.getElementById("modalEditarTipologia");
    const cerrarModalEditar = document.getElementById("closeModalEditarTipologia");
    const formEditar = document.getElementById("formEditarTipologia");

    async function editTipologia(id) {
        const t = await fetchTipologiaById(id);
        cargarTipologiasBaseEnSelect("tipologiaEditar", t.tipologia);
        await cargarRolesEnSelectTipologia("rolEditarTipologia", t.id_rol);
        document.getElementById("subtipologiaEditar").value = t.subtipologia;
        document.getElementById("estadoTipologiaEditar").value = t.estado_tipologia;
        document.getElementById("id_tipologiaEditar").value = t.id_tipologia;
        modalEditar.classList.remove("hidden");
    }
    if (cerrarModalEditar) cerrarModalEditar.addEventListener("click", () => modalEditar.classList.add("hidden"));
    if (formEditar) {
        formEditar.addEventListener("submit", async function (e) {
            e.preventDefault();
            const id = document.getElementById("id_tipologiaEditar").value;
            const data = {
                tipologia: document.getElementById("tipologiaEditar").value,
                subtipologia: document.getElementById("subtipologiaEditar").value,
                id_rol: document.getElementById("rolEditarTipologia").value,
                estado_tipologia: document.getElementById("estadoTipologiaEditar").value
            };
            const res = await updateTipologia(id, data);
            if (res.success) {
                modalEditar.classList.add("hidden");
                mostrarMensajeTipologia("exito", "Tipología actualizada exitosamente.");
                cargarTipologias();
            } else {
                mostrarMensajeTipologia("error", res.message || "Error al actualizar tipología.");
            }
        });
    }

    // Modal Ver Tipología
    const modalVer = document.getElementById("modalVerTipologia");
    const cerrarModalVer = document.getElementById("closeModalVerTipologia");
    async function viewTipologia(id) {
        const t = await fetchTipologiaById(id);
        document.getElementById("verTipologia").textContent = t.tipologia;
        document.getElementById("verSubtipologia").textContent = t.subtipologia;
        document.getElementById("verRolTipologia").textContent = t.rol_nombre;
        document.getElementById("verEstadoTipologia").textContent = t.estado_tipologia;
        modalVer.classList.remove("hidden");
    }
    if (cerrarModalVer) cerrarModalVer.addEventListener("click", () => modalVer.classList.add("hidden"));

    // Modal Estado Tipología
    const modalEstado = document.getElementById("modalEstadoTipologia");
    const btnEstadoConfirmar = document.getElementById("btnEstadoTipologiaConfirmar");
    const btnEstadoCancelar = document.getElementById("btnEstadoTipologiaCancelar");
    let currentIdToEstado = null;
    async function confirmEstadoTipologia(id) {
        currentIdToEstado = id;
        const t = await fetchTipologiaById(id);
        const isActivo = t.estado_tipologia === "Activo";
        document.getElementById("modalEstadoTipologiaTexto").textContent = isActivo
            ? "¿Seguro que deseas inhabilitar esta tipología?"
            : "¿Seguro que deseas habilitar esta tipología?";
        document.getElementById("modalEstadoTipologiaConfirmarText").textContent = isActivo ? "Inhabilitar" : "Habilitar";
        document.getElementById("modalEstadoTipologiaConfirmarIcon").className = isActivo ? "fas fa-times" : "fas fa-check";
        document.getElementById("modalEstadoTipologiaIcon").innerHTML = isActivo
            ? '<i class="fas fa-times text-red-600"></i>'
            : '<i class="fas fa-check text-green-600"></i>';
        modalEstado.classList.remove("hidden");
    }
    if (btnEstadoConfirmar) btnEstadoConfirmar.addEventListener("click", async () => {
        if (currentIdToEstado) {
            const t = await fetchTipologiaById(currentIdToEstado);
            const nuevoEstado = t.estado_tipologia === "Activo" ? "Inactivo" : "Activo";
            const res = await toggleEstadoTipologia(currentIdToEstado, nuevoEstado);
            if (res.success) {
                modalEstado.classList.add("hidden");
                mostrarMensajeTipologia("exito", "Estado actualizado correctamente.");
                cargarTipologias();
            } else {
                mostrarMensajeTipologia("error", res.message || "Error al actualizar estado.");
            }
            currentIdToEstado = null;
        }
    });
    if (btnEstadoCancelar) btnEstadoCancelar.addEventListener("click", () => {
        modalEstado.classList.add("hidden");
        currentIdToEstado = null;
    });

    // Eliminar tipología
    async function eliminarTipologia(id) {
        if (confirm("¿Seguro que deseas eliminar esta tipología?")) {
            const res = await deleteTipologia(id);
            if (res.success) {
                mostrarMensajeTipologia("exito", "Tipología eliminada correctamente.");
                cargarTipologias();
            } else {
                mostrarMensajeTipologia("error", res.message || "Error al eliminar tipología.");
            }
        }
    }

    // Mensaje emergente para tipologías
    function mostrarMensajeTipologia(tipo, mensaje) {
        let modal = document.getElementById("modalMensaje");
        let mensajeBox = document.getElementById("mensajeBox");
        let mensajeTexto = document.getElementById("mensajeTexto");
        mensajeTexto.innerHTML = mensaje;
        if (tipo === "exito") {
            mensajeBox.classList.remove("border-red-500", "bg-red-50");
            mensajeBox.classList.add("border-color5", "bg-white");
            mensajeBox.querySelector("svg").classList.remove("text-red-500");
            mensajeBox.querySelector("svg").classList.add("text-color5");
            mensajeTexto.classList.remove("text-red-500", "text-green-700");
            mensajeTexto.classList.add("text-color4");
        } else {
            mensajeBox.classList.remove("border-color5", "bg-white");
            mensajeBox.classList.add("border-red-500", "bg-red-50");
            mensajeBox.querySelector("svg").classList.remove("text-color5");
            mensajeBox.querySelector("svg").classList.add("text-red-500");
            mensajeTexto.classList.remove("text-color4");
            mensajeTexto.classList.add("text-red-500");
        }
        modal.classList.remove("hidden");
        setTimeout(() => {
            modal.classList.add("hidden");
        }, 2200);
    }

    // Cierra los modales al hacer click fuera de ellos
    window.addEventListener("click", function (event) {
        if (event.target === modalCrear) modalCrear.classList.add("hidden");
        if (event.target === modalEditar) modalEditar.classList.add("hidden");
        if (event.target === modalVer) modalVer.classList.add("hidden");
        if (event.target === modalEstado) modalEstado.classList.add("hidden");
    });

    // Carga inicial de tipologías
    function cargarTipologias() {
        fetchTipologias()
            .then((data) => {
                tipologiasData = data;
                paginaActual = 1;
                renderTipologias();
            })
            .catch((error) => {
                mostrarMensajeTipologia("error", "Error al cargar tipologías. Inténtalo nuevamente.");
                console.error("Error al cargar tipologías:", error);
            });
    }

    // Inicializa la carga
    cargarTipologias();
}

// Exporta la función para inicializar el módulo desde dashboard.js
window.iniciarModuloTipologias = iniciarModuloTipologias;
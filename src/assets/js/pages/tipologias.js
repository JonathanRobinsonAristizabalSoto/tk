import {
    fetchTipologias,
    fetchTipologiaById,
    createTipologia,
    updateTipologia,
    deleteTipologia,
    toggleEstadoTipologia
} from "../api/api.js";

// Renderizado principal y gestión de modales
function iniciarModuloTipologias(vista = null, filtro = "") {
    let vistaActual = localStorage.getItem('tipologiasVista');
    if (!vistaActual) {
        vistaActual = "tabla";
        localStorage.setItem('tipologiasVista', vistaActual);
    }
    if (vista) {
        vistaActual = vista;
        localStorage.setItem('tipologiasVista', vistaActual);
    }

    const mainContent = document.getElementById('main-content');
    let tipologiasData = [];
    let paginaActual = 1;
    let tipologiasPorPagina = 9;
    let filtroBusqueda = filtro;

    // Responsive: tamaños de texto e íconos según ancho de pantalla
    let textoSize = "text-xs";
    let iconSize = "text-xl";
    const width = window.innerWidth;
    if (width < 640) {
        textoSize = "text-xs";
        iconSize = "text-lg";
    } else if (width < 768) {
        textoSize = "text-sm";
        iconSize = "text-xl";
    } else if (width < 1024) {
        textoSize = "text-base";
        iconSize = "text-2xl";
    } else {
        textoSize = "text-base";
        iconSize = "text-3xl";
    }

    // Header y estructura
    let tipologiasHeaderHtml = `
        <div class="flex flex-col gap-2 my-2">
            <div class="flex justify-center mb-1">
                <span class="text-color4 text-sm text-center">
                    Consulta, busca y gestiona las tipologías registradas en el sistema.
                </span>
            </div>
            <div class="flex flex-row items-center gap-2">
                <div class="flex-shrink-0">
                    <button id="openModalTipologia" class="bg-color5 text-white px-4 py-2 rounded ${textoSize} flex items-center gap-2">
                        <i class="fas fa-layer-group ${iconSize}"></i>
                        <span>Agregar Tipología</span>
                    </button>
                </div>
                <div class="flex-grow flex justify-center">
                    <input
                        type="text"
                        id="busquedaTipologias"
                        placeholder="Buscar tipología..."
                        class="border border-gray-300 rounded px-3 py-2 ${textoSize} w-full sm:w-80 text-center"
                        autocomplete="off"
                        style="outline:none;"
                        onfocus="this.style.borderColor='#22c55e';"
                        onblur="this.style.borderColor='#d1d5db';"
                    >
                </div>
                <div class="flex-shrink-0 flex justify-end gap-2 mx-12" style="min-width:100px;">
                    <button id="btnVistaTarjetasTipologias" class="bg-color5 text-white p-2 rounded shadow hover:bg-green-600 transition" title="Vista tarjetas">
                        <i class="fas fa-th-large"></i>
                    </button>
                    <button id="btnVistaTablaTipologias" class="bg-color6 text-white p-2 rounded shadow hover:bg-orange-600 transition" title="Vista tabla">
                        <i class="fa-solid fa-list"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    mainContent.innerHTML = `
        <div class="flex flex-col gap-2 my-1">
            <div class="flex justify-center items-center gap-2">
                <i class="fas fa-tags text-color6 text-2xl"></i>
                <h2 class="text-color4 text-center text-xl font-semibold">Tipologías</h2>
            </div>
            ${tipologiasHeaderHtml}
        </div>
        <div id="dataTableTipologias"></div>
        <div id="tipologiasPaginador" class="mt-4 flex justify-center items-center"></div>
    `;

    const dataTable = document.getElementById("dataTableTipologias");
    const paginador = document.getElementById("tipologiasPaginador");

    // Renderiza la lista de tipologías en tarjetas o tabla
    function renderTipologias() {
        dataTable.innerHTML = "";
        let tipologiasFiltradas = Array.isArray(tipologiasData) ? tipologiasData : [];
        if (filtroBusqueda && filtroBusqueda.length > 0) {
            tipologiasFiltradas = tipologiasFiltradas.filter(t =>
                (t.nombre && t.nombre.toLowerCase().includes(filtroBusqueda)) ||
                (t.descripcion && t.descripcion.toLowerCase().includes(filtroBusqueda))
            );
        }
        const totalPaginas = Math.max(1, Math.ceil(tipologiasFiltradas.length / tipologiasPorPagina));
        if (paginaActual > totalPaginas) paginaActual = 1;
        const inicio = (paginaActual - 1) * tipologiasPorPagina;
        const fin = inicio + tipologiasPorPagina;
        const mostrar = tipologiasFiltradas.slice(inicio, fin);

        vistaActual = localStorage.getItem('tipologiasVista') || "tabla";

        if (vistaActual === "tarjetas") {
            dataTable.className = `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4`;
            mostrar.forEach((t) => {
                const isActivo = t.estado_tipologia === "Activo";
                const btnEstadoColor = isActivo ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
                const btnEstadoIcon = isActivo ? '<i class="fas fa-check text-xs"></i>' : '<i class="fas fa-times text-xs"></i>';
                const btnEstadoTitle = isActivo ? "Inhabilitar" : "Habilitar";
                const estadoColor = isActivo ? "bg-green-100 text-green-700 px-2 py-1 rounded font-semibold text-xs" : "bg-red-100 text-red-700 px-2 py-1 rounded font-semibold text-xs";
                const card = document.createElement("div");
                card.className = `bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col items-center text-xs mb-2`;
                card.innerHTML = `
                    <div class="text-base font-bold text-color4 text-center mb-1">${t.nombre}</div>
                    <div class="text-xs font-semibold text-color6 text-center mb-1">Descripción:</div>
                    <div class="text-xs text-gray-500 text-center mb-2">${t.descripcion || ""}</div>
                    <div class="text-xs font-semibold text-color6 text-center mb-1">Estado:</div>
                    <div class="${estadoColor} text-center mb-2">${t.estado_tipologia}</div>
                    <div class="flex justify-center mt-2 gap-1">
                        <button class="flex p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg items-center justify-center" style="width:24px;height:24px;" data-id="${t.id_tipologia}" data-action="ver" title="Ver">
                            <i class="fas fa-eye text-xs"></i>
                        </button>
                        <button class="flex p-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg items-center justify-center" style="width:24px;height:24px;" data-id="${t.id_tipologia}" data-action="editar" title="Editar">
                            <i class="fas fa-edit text-xs"></i>
                        </button>
                        <button class="flex p-2 ${btnEstadoColor} text-white rounded-lg items-center justify-center" style="width:24px;height:24px;" data-id="${t.id_tipologia}" data-action="estado" title="${btnEstadoTitle}">
                            ${btnEstadoIcon}
                        </button>
                        <button class="flex p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg items-center justify-center" style="width:24px;height:24px;" data-id="${t.id_tipologia}" data-action="eliminar" title="Eliminar">
                            <i class="fas fa-trash text-xs"></i>
                        </button>
                    </div>
                `;
                dataTable.appendChild(card);
            });
        }
        if (vistaActual === "tabla") {
            dataTable.className = "overflow-x-auto";
            const tabla = document.createElement("table");
            tabla.className = "min-w-full bg-white border border-gray-200 rounded-lg shadow-sm text-xs";
            tabla.innerHTML = `
        <thead>
            <tr>
                <th class="p-2 border-b border-r text-center">Nombre</th>
                <th class="p-2 border-b border-r text-center">Descripción</th>
                <th class="p-2 border-b border-r text-center">Estado</th>
                <th class="p-2 border-b text-center">Acciones</th>
            </tr>
        </thead>
        <tbody>
            ${mostrar.map(t => {
                const isActivo = t.estado_tipologia === "Activo";
                const btnEstadoColor = isActivo ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
                const btnEstadoIcon = isActivo ? '<i class="fas fa-check text-xs"></i>' : '<i class="fas fa-times text-xs"></i>';
                const btnEstadoTitle = isActivo ? "Inhabilitar" : "Habilitar";
                const estadoColor = isActivo ? "bg-green-100 text-green-700 px-2 py-1 rounded font-semibold text-xs" : "bg-red-100 text-red-700 px-2 py-1 rounded font-semibold text-xs";
                return `
                    <tr>
                        <td class="p-2 border-b border-r text-center">${t.nombre}</td>
                        <td class="p-2 border-b border-r text-center">${t.descripcion || ""}</td>
                        <td class="p-2 border-b border-r text-center"><span class="${estadoColor}">${t.estado_tipologia}</span></td>
                        <td class="p-2 border-b text-center">
                            <div class="flex justify-center gap-2">
                                <button class="flex p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg items-center justify-center" style="width:24px;height:24px;" data-id="${t.id_tipologia}" data-action="ver" title="Ver"><i class="fas fa-eye text-xs"></i></button>
                                <button class="flex p-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg items-center justify-center" style="width:24px;height:24px;" data-id="${t.id_tipologia}" data-action="editar" title="Editar"><i class="fas fa-edit text-xs"></i></button>
                                <button class="flex p-2 ${btnEstadoColor} text-white rounded-lg items-center justify-center" style="width:24px;height:24px;" data-id="${t.id_tipologia}" data-action="estado" title="${btnEstadoTitle}">
                                    ${btnEstadoIcon}
                                </button>
                                <button class="flex p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg items-center justify-center" style="width:24px;height:24px;" data-id="${t.id_tipologia}" data-action="eliminar" title="Eliminar">
                                    <i class="fas fa-trash text-xs"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
            dataTable.appendChild(tabla);
        }
        renderPaginador(tipologiasFiltradas.length);

        // Eventos de acciones en las tarjetas/tabla
        dataTable.querySelectorAll("button[data-action]").forEach(btn => {
            const id = btn.getAttribute("data-id");
            const action = btn.getAttribute("data-action");
            if (action === "ver") btn.onclick = () => viewTipologia(id);
            if (action === "editar") btn.onclick = () => editTipologia(id);
            if (action === "estado") btn.onclick = () => confirmEstadoTipologia(id);
            if (action === "eliminar") btn.onclick = () => showModalEliminarTipologia(id);
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

    // Botón para cambiar a vista tarjetas
    document.getElementById('btnVistaTarjetasTipologias')?.addEventListener('click', function () {
        vistaActual = "tarjetas";
        localStorage.setItem('tipologiasVista', "tarjetas");
        renderTipologias();
    });

    // Botón para cambiar a vista tabla
    document.getElementById('btnVistaTablaTipologias')?.addEventListener('click', function () {
        vistaActual = "tabla";
        localStorage.setItem('tipologiasVista', "tabla");
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
            formCrear.reset();
            modalCrear.classList.remove("hidden");
        });
    }
    if (cerrarModalCrear) cerrarModalCrear.addEventListener("click", () => modalCrear.classList.add("hidden"));
    if (formCrear) {
        formCrear.addEventListener("submit", async function (e) {
            e.preventDefault();
            const data = {
                nombre: document.getElementById("tipologiaCrear").value,
                descripcion: document.getElementById("descripcionTipologiaCrear").value,
                estado_tipologia: document.getElementById("estadoTipologiaCrear").value,
                id_rol: document.getElementById("idRolTipologiaCrear")?.value || 1 // Ajusta según tu formulario
            };
            const res = await createTipologia(data);
            if (res.success) {
                modalCrear.classList.add("hidden");
                mostrarMensajeTipologia("exito", "Tipología creada exitosamente.");
                cargarTipologias();
            } else {
                mostrarMensajeTipologia("error", res.error || "Error al crear tipología.");
            }
        });
    }

    // Modal Editar Tipología
    const modalEditar = document.getElementById("modalEditarTipologia");
    const cerrarModalEditar = document.getElementById("closeModalEditarTipologia");
    const formEditar = document.getElementById("formEditarTipologia");

    async function editTipologia(id) {
        const t = await fetchTipologiaById(id);
        cargarTipologiasBaseEnSelect("tipologiaEditar", t.nombre);
        document.getElementById("descripcionTipologiaEditar").value = t.descripcion;
        document.getElementById("estadoTipologiaEditar").value = t.estado_tipologia;
        document.getElementById("id_tipologiaEditar").value = t.id_tipologia;
        document.getElementById("idRolTipologiaEditar") && (document.getElementById("idRolTipologiaEditar").value = t.id_rol || 1);
        modalEditar.classList.remove("hidden");
    }
    if (cerrarModalEditar) cerrarModalEditar.addEventListener("click", () => modalEditar.classList.add("hidden"));
    if (formEditar) {
        formEditar.addEventListener("submit", async function (e) {
            e.preventDefault();
            const id = document.getElementById("id_tipologiaEditar").value;
            const data = {
                nombre: document.getElementById("tipologiaEditar").value,
                descripcion: document.getElementById("descripcionTipologiaEditar").value,
                estado_tipologia: document.getElementById("estadoTipologiaEditar").value,
                id_rol: document.getElementById("idRolTipologiaEditar")?.value || 1
            };
            const res = await updateTipologia(id, data);
            if (res.success) {
                modalEditar.classList.add("hidden");
                mostrarMensajeTipologia("exito", "Tipología actualizada exitosamente.");
                cargarTipologias();
            } else {
                mostrarMensajeTipologia("error", res.error || "Error al actualizar tipología.");
            }
        });
    }

    // Modal Ver Tipología
    const modalVer = document.getElementById("modalVerTipologia");
    document.querySelectorAll("#closeModalVerTipologia").forEach(btn => {
        btn.addEventListener("click", () => {
            modalVer.classList.add("hidden");
        });
    });
    const cerrarModalVerTop = document.getElementById("closeModalVerTipologiaTop");
    async function viewTipologia(id) {
        const t = await fetchTipologiaById(id);
        document.getElementById("verTipologia").textContent = t.nombre;
        document.getElementById("verDescripcionTipologia").textContent = t.descripcion;
        const estadoContainer = document.getElementById("verEstadoTipologia");
        if (estadoContainer) {
            if (t.estado_tipologia === "Activo") {
                estadoContainer.innerHTML = `<span class="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold text-xs">${t.estado_tipologia}</span>`;
            } else {
                estadoContainer.innerHTML = `<span class="bg-red-100 text-red-700 px-2 py-1 rounded font-semibold text-xs">${t.estado_tipologia}</span>`;
            }
        }
        modalVer.classList.remove("hidden");
    }
    if (cerrarModalVerTop) cerrarModalVerTop.addEventListener("click", () => modalVer.classList.add("hidden"));

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
                mostrarMensajeTipologia("error", res.error || "Error al actualizar estado.");
            }
            currentIdToEstado = null;
        }
    });
    if (btnEstadoCancelar) btnEstadoCancelar.addEventListener("click", () => {
        modalEstado.classList.add("hidden");
        currentIdToEstado = null;
    });

    // Modal Eliminar Tipología
    const modalEliminar = document.getElementById("modalEliminarTipologia");
    const btnEliminarConfirmar = document.getElementById("btnEliminarTipologiaConfirmar");
    const btnEliminarCancelar = document.getElementById("btnEliminarTipologiaCancelar");
    let currentIdToEliminar = null;

    function showModalEliminarTipologia(id) {
        currentIdToEliminar = id;
        modalEliminar.classList.remove("hidden");
    }

    if (btnEliminarConfirmar) btnEliminarConfirmar.addEventListener("click", async () => {
        if (currentIdToEliminar) {
            const res = await deleteTipologia(currentIdToEliminar);
            if (res.success) {
                modalEliminar.classList.add("hidden");
                mostrarMensajeTipologia("exito", "Tipología eliminada correctamente.");
                cargarTipologias();
            } else {
                mostrarMensajeTipologia("error", res.error || "Error al eliminar tipología.");
            }
            currentIdToEliminar = null;
        }
    });

    if (btnEliminarCancelar) btnEliminarCancelar.addEventListener("click", () => {
        modalEliminar.classList.add("hidden");
        currentIdToEliminar = null;
    });

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
        if (event.target === modalEliminar) modalEliminar.classList.add("hidden");
    });

    // Carga inicial de tipologías
    function cargarTipologias() {
        fetchTipologias()
            .then((data) => {
                tipologiasData = Array.isArray(data) ? data : [];
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

// Exporta la función para inicializar el módulo desde dashboard.js
window.iniciarModuloTipologias = iniciarModuloTipologias;
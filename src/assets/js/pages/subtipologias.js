import {
    fetchSubtipologias,
    createSubtipologia,
    updateSubtipologia,
    deleteSubtipologia
} from "../api/api.js";
import { fetchTipologias } from "../api/api.js";

// Inicializa el módulo de subtipologías
export async function iniciarModuloSubtipologias(vista = "tarjetas", filtro = "") {
    localStorage.setItem('subtipologiasVista', vista);
    await renderSubtipologias(vista, filtro);
}

// Renderiza el módulo principal
export async function renderSubtipologias(vista = "tarjetas", filtro = "") {
    const mainContent = document.getElementById("main-content");
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

    let subtipologiasHeaderHtml = `
        <div class="flex flex-col gap-2 my-2">
            <div class="flex justify-center mb-1">
                <span class="text-color4 text-sm text-center">
                    Consulta, busca y gestiona las subtipologías registradas en el sistema.
                </span>
            </div>
            <div class="flex flex-row items-center gap-2">
                <div class="flex-shrink-0">
                    <button id="btnAbrirModalCrearSubtipologia" class="bg-color5 text-white px-4 py-2 rounded ${textoSize} flex items-center gap-2">
                        <i class="fas fa-layer-group ${iconSize}"></i>
                        <span>Agregar Subtipología</span>
                    </button>
                </div>
                <div class="flex-grow flex justify-center">
                    <input
                        type="text"
                        id="busquedaSubtipologias"
                        placeholder="Buscar subtipología..."
                        class="border border-gray-300 rounded px-3 py-2 ${textoSize} w-full sm:w-80 text-center"
                        autocomplete="off"
                        style="outline:none;"
                        onfocus="this.style.borderColor='#22c55e';"
                        onblur="this.style.borderColor='#d1d5db';"
                    >
                </div>
                <div class="flex-shrink-0 flex justify-end gap-2 mx-12" style="min-width:100px;">
                    <button id="btnVistaTarjetasSubtipologias" class="bg-color5 text-white p-2 rounded shadow hover:bg-green-600 transition" title="Vista tarjetas">
                        <i class="fas fa-th-large"></i>
                    </button>
                    <button id="btnVistaTablaSubtipologias" class="bg-color6 text-white p-2 rounded shadow hover:bg-orange-600 transition" title="Vista tabla">
                        <i class="fa-solid fa-list"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    mainContent.innerHTML = `
        <div class="flex flex-col gap-2 my-1">
            <div class="flex justify-center items-center gap-2">
                <i class="fas fa-layer-group text-color6 text-2xl"></i>
                <h2 class="text-color4 text-center text-xl font-semibold">Subtipologías</h2>
            </div>
            ${subtipologiasHeaderHtml}
        </div>
        <div id="subtipologiasDataTable"></div>
        <div id="subtipologiasPaginador" class="mt-4 flex justify-center items-center"></div>
    `;

    // Renderiza la vista seleccionada
    await renderVistaSubtipologias(vista, filtro);

    // Botones de cambio de vista
    document.getElementById("btnVistaTarjetasSubtipologias").onclick = () => {
        localStorage.setItem('subtipologiasVista', 'tarjetas');
        renderSubtipologias('tarjetas', document.getElementById('busquedaSubtipologias').value.trim().toLowerCase());
    };
    document.getElementById("btnVistaTablaSubtipologias").onclick = () => {
        localStorage.setItem('subtipologiasVista', 'tabla');
        renderSubtipologias('tabla', document.getElementById('busquedaSubtipologias').value.trim().toLowerCase());
    };

    // Botón para abrir modal crear
    document.getElementById("btnAbrirModalCrearSubtipologia").onclick = () => {
        document.getElementById("modalCrearSubtipologia").classList.remove("hidden");
        cargarTipologiasEnSelect("tipologiaSubtipologiaCrear");
    };

    // Eventos para cerrar modales
    document.getElementById("closeModalCrearSubtipologia").onclick = () => {
        document.getElementById("modalCrearSubtipologia").classList.add("hidden");
    };
    document.getElementById("closeModalEditarSubtipologia").onclick = () => {
        document.getElementById("modalEditarSubtipologia").classList.add("hidden");
    };
    // Cerrar modal de ver subtipología (ambos botones)
    document.querySelectorAll("#closeModalVerSubtipologia").forEach(btn => {
        btn.onclick = () => {
            document.getElementById("modalVerSubtipologia").classList.add("hidden");
        };
    });
    document.getElementById("btnEliminarSubtipologiaCancelar").onclick = () => {
        document.getElementById("modalEliminarSubtipologia").classList.add("hidden");
    };
    document.getElementById("btnEstadoSubtipologiaCancelar").onclick = () => {
        document.getElementById("modalEstadoSubtipologia").classList.add("hidden");
    };

    // Evento submit crear
    document.getElementById("formCrearSubtipologia").onsubmit = async function (e) {
        e.preventDefault();
        const data = {
            nombre: this.nombre.value,
            descripcion: this.descripcion.value,
            id_tipologia: this.id_tipologia.value,
            estado: this.estado.value
        };
        await createSubtipologia(data);
        document.getElementById("modalCrearSubtipologia").classList.add("hidden");
        await renderVistaSubtipologias(localStorage.getItem('subtipologiasVista') || 'tarjetas', document.getElementById('busquedaSubtipologias').value.trim().toLowerCase());
        this.reset();
    };

    // Evento submit editar
    document.getElementById("formEditarSubtipologia").onsubmit = async function (e) {
        e.preventDefault();
        const id = this.id_subtipologia.value;
        const data = {
            nombre: this.nombre.value,
            descripcion: this.descripcion.value,
            id_tipologia: this.id_tipologia.value,
            estado: this.estado.value
        };
        await updateSubtipologia(id, data);
        document.getElementById("modalEditarSubtipologia").classList.add("hidden");
        await renderVistaSubtipologias(localStorage.getItem('subtipologiasVista') || 'tarjetas', document.getElementById('busquedaSubtipologias').value.trim().toLowerCase());
    };

    // Buscador
    document.getElementById('busquedaSubtipologias')?.addEventListener('input', function () {
        renderVistaSubtipologias(localStorage.getItem('subtipologiasVista') || 'tarjetas', this.value.trim().toLowerCase());
    });
}

// Renderiza la vista en tarjetas o tabla con paginador (máximo 6 tarjetas por página, 3 por fila; tabla: 10 filas por página)
async function renderVistaSubtipologias(vista = "tarjetas", filtro = "") {
    const subtipologias = await fetchSubtipologias();
    const tipologias = await fetchTipologias();
    const tipologiasMap = {};
    tipologias.forEach(t => {
        tipologiasMap[t.id_tipologia] = t.nombre;
    });

    const container = document.getElementById("subtipologiasDataTable");
    const paginador = document.getElementById("subtipologiasPaginador");
    container.innerHTML = "";
    if (paginador) paginador.innerHTML = "";

    // Filtrado por búsqueda
    let subtipologiasFiltradas = Array.isArray(subtipologias) ? subtipologias : [];
    if (filtro && filtro.length > 0) {
        subtipologiasFiltradas = subtipologiasFiltradas.filter(st =>
            (st.nombre && st.nombre.toLowerCase().includes(filtro)) ||
            (st.descripcion && st.descripcion.toLowerCase().includes(filtro)) ||
            (tipologiasMap[st.id_tipologia] && tipologiasMap[st.id_tipologia].toLowerCase().includes(filtro))
        );
    }

    // Paginación
    let paginaActual = window.subtipologiasPaginaActual || 1;
    const subtipologiasPorPagina = vista === "tarjetas" ? 6 : 10;
    const totalPaginas = Math.max(1, Math.ceil(subtipologiasFiltradas.length / subtipologiasPorPagina));
    if (paginaActual > totalPaginas) paginaActual = 1;
    window.subtipologiasPaginaActual = paginaActual;
    const inicio = (paginaActual - 1) * subtipologiasPorPagina;
    const fin = inicio + subtipologiasPorPagina;
    const mostrar = subtipologiasFiltradas.slice(inicio, fin);

    // --- Tarjetas ---
    if (vista === "tarjetas") {
        container.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
        mostrar.forEach(st => {
            const isActivo = st.estado === "Activo";
            const estadoColor = isActivo ? "bg-green-100 text-green-700 px-2 py-1 rounded font-semibold text-xs" : "bg-red-100 text-red-700 px-2 py-1 rounded font-semibold text-xs";
            const btnEstadoColor = isActivo ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
            const btnEstadoIcon = isActivo ? '<i class="fas fa-check text-xs"></i>' : '<i class="fas fa-times text-xs"></i>';
            const btnEstadoTitle = isActivo ? "Inhabilitar" : "Habilitar";
            const tipologiaNombre = tipologiasMap[st.id_tipologia] || "";
            const card = document.createElement("div");
            card.className = "bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col items-center text-xs mb-2";
            card.innerHTML = `
                <div class="text-base font-bold text-color4 text-center mb-1">${st.nombre}</div>
                <div class="text-xs font-semibold text-color6 text-center mb-1">Tipología principal:</div>
                <div class="text-xs text-color4 text-center mb-2">${tipologiaNombre}</div>
                <div class="text-xs font-semibold text-color6 text-center mb-1">Descripción:</div>
                <div class="text-xs text-gray-500 text-center mb-2">${st.descripcion || ""}</div>
                <div class="text-xs font-semibold text-color6 text-center mb-1">Estado:</div>
                <div class="${estadoColor} text-center mb-2">${st.estado}</div>
                <div class="flex justify-center mt-2 space-x-1">
                    <button class="flex p-2 bg-green-600 hover:bg-green-700 text-white p-1 rounded-lg items-center justify-center ver-subtipologia-btn" style="width:24px;height:24px;" data-id="${st.id_subtipologia}" title="Ver">
                        <i class="fas fa-eye text-xs"></i>
                    </button>
                    <button class="flex p-2 bg-orange-400 hover:bg-orange-500 text-white p-1 rounded-lg items-center justify-center edit-subtipologia-btn" style="width:24px;height:24px;" data-id="${st.id_subtipologia}" title="Editar">
                        <i class="fas fa-edit text-xs"></i>
                    </button>
                    <button class="flex p-2 ${btnEstadoColor} text-white p-1 rounded-lg items-center justify-center estado-subtipologia-btn" style="width:24px;height:24px;" data-id="${st.id_subtipologia}" title="${btnEstadoTitle}">
                        ${btnEstadoIcon}
                    </button>
                    <button class="flex p-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg items-center justify-center delete-subtipologia-btn" style="width:24px;height:24px;" data-id="${st.id_subtipologia}" title="Eliminar">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    } else {
        // --- Tabla ---
        container.className = "overflow-x-auto";
        let tabla = document.createElement("table");
        tabla.className = "min-w-full bg-white border border-gray-200 rounded-lg shadow-sm text-xs";
        tabla.innerHTML = `
            <thead>
                <tr>
                    <th class="p-2 border-b border-r text-center">Nombre</th>
                    <th class="p-2 border-b border-r text-center">Descripción</th>
                    <th class="p-2 border-b border-r text-center">Tipología</th>
                    <th class="p-2 border-b border-r text-center">Estado</th>
                    <th class="p-2 border-b text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${mostrar.map(st => {
                    const isActivo = st.estado === "Activo";
                    const estadoColor = isActivo ? "bg-green-100 text-green-700 px-2 py-1 rounded font-semibold text-xs" : "bg-red-100 text-red-700 px-2 py-1 rounded font-semibold text-xs";
                    const btnEstadoColor = isActivo ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
                    const btnEstadoIcon = isActivo ? '<i class="fas fa-check text-xs"></i>' : '<i class="fas fa-times text-xs"></i>';
                    const btnEstadoTitle = isActivo ? "Inhabilitar" : "Habilitar";
                    const tipologiaNombre = tipologiasMap[st.id_tipologia] || "";
                    return `
                        <tr>
                            <td class="p-2 border-b border-r text-center">${st.nombre}</td>
                            <td class="p-2 border-b border-r text-center">${st.descripcion || ""}</td>
                            <td class="p-2 border-b border-r text-center">${tipologiaNombre}</td>
                            <td class="p-2 border-b border-r text-center"><span class="${estadoColor}">${st.estado}</span></td>
                            <td class="p-2 border-b text-center">
                                <div class="flex justify-center gap-2">
                                    <button class="flex bg-green-600 hover:bg-green-700 text-white p-1 rounded-lg items-center justify-center ver-subtipologia-btn" style="width:24px;height:24px;" data-id="${st.id_subtipologia}" title="Ver">
                                        <i class="fas fa-eye text-xs"></i>
                                    </button>
                                    <button class="flex bg-orange-400 hover:bg-orange-500 text-white p-1 rounded-lg items-center justify-center edit-subtipologia-btn" style="width:24px;height:24px;" data-id="${st.id_subtipologia}" title="Editar">
                                        <i class="fas fa-edit text-xs"></i>
                                    </button>
                                    <button class="flex ${btnEstadoColor} text-white p-1 rounded-lg items-center justify-center estado-subtipologia-btn" style="width:24px;height:24px;" data-id="${st.id_subtipologia}" title="${btnEstadoTitle}">
                                        ${btnEstadoIcon}
                                    </button>
                                    <button class="flex bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg items-center justify-center delete-subtipologia-btn" style="width:24px;height:24px;" data-id="${st.id_subtipologia}" title="Eliminar">
                                        <i class="fas fa-trash text-xs"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        `;
        container.appendChild(tabla);
    }

    // Paginador
    if (paginador) {
        let html = `<nav class="flex justify-center items-center gap-1 m-1">`;
        html += `<button class="px-2 py-1 rounded bg-color5 text-white text-xs font-semibold hover:bg-color6 transition ${paginaActual === 1 ? "opacity-50 cursor-not-allowed" : ""}" ${paginaActual === 1 ? "disabled" : ""} id="btnPagAnteriorSubtipologias">Anterior</button>`;
        for (let i = 1; i <= totalPaginas; i++) {
            html += `<button class="px-2 py-1 rounded ${i === paginaActual ? "bg-color6 text-white" : "bg-white text-color5 border border-color5"} text-xs font-semibold hover:bg-color5 hover:text-white transition" data-pagina="${i}">${i}</button>`;
        }
        html += `<button class="px-2 py-1 rounded bg-color5 text-white text-xs font-semibold hover:bg-color6 transition ${paginaActual === totalPaginas ? "opacity-50 cursor-not-allowed" : ""}" ${paginaActual === totalPaginas ? "disabled" : ""} id="btnPagSiguienteSubtipologias">Siguiente</button>`;
        html += `</nav>`;
        paginador.innerHTML = html;

        document.getElementById("btnPagAnteriorSubtipologias")?.addEventListener("click", () => {
            if (paginaActual > 1) {
                window.subtipologiasPaginaActual = paginaActual - 1;
                renderVistaSubtipologias(vista, filtro);
            }
        });
        document.getElementById("btnPagSiguienteSubtipologias")?.addEventListener("click", () => {
            if (paginaActual < totalPaginas) {
                window.subtipologiasPaginaActual = paginaActual + 1;
                renderVistaSubtipologias(vista, filtro);
            }
        });
        paginador.querySelectorAll("button[data-pagina]").forEach(btn => {
            btn.addEventListener("click", () => {
                window.subtipologiasPaginaActual = parseInt(btn.getAttribute("data-pagina"));
                renderVistaSubtipologias(vista, filtro);
            });
        });
    }

    // Eventos para ver, editar, eliminar y cambiar estado
    container.querySelectorAll(".ver-subtipologia-btn").forEach(btn => {
        btn.onclick = () => mostrarModalVerSubtipologia(btn.dataset.id, subtipologiasFiltradas, tipologiasMap);
    });
    container.querySelectorAll(".edit-subtipologia-btn").forEach(btn => {
        btn.onclick = () => mostrarModalEditarSubtipologia(btn.dataset.id, subtipologiasFiltradas);
    });
    container.querySelectorAll(".delete-subtipologia-btn").forEach(btn => {
        btn.onclick = () => mostrarModalEliminarSubtipologia(btn.dataset.id);
    });
    container.querySelectorAll(".estado-subtipologia-btn").forEach(btn => {
        btn.onclick = () => mostrarModalEstadoSubtipologia(btn.dataset.id, subtipologiasFiltradas);
    });

    // Evento eliminar
    document.getElementById("btnEliminarSubtipologiaConfirmar").onclick = async function () {
        const id = this.getAttribute("data-id");
        await deleteSubtipologia(id);
        document.getElementById("modalEliminarSubtipologia").classList.add("hidden");
        await renderVistaSubtipologias(localStorage.getItem('subtipologiasVista') || 'tarjetas', document.getElementById('busquedaSubtipologias').value.trim().toLowerCase());
    };

    // Evento cambiar estado
    document.getElementById("btnEstadoSubtipologiaConfirmar").onclick = async function () {
        const id = this.getAttribute("data-id");
        const st = subtipologiasFiltradas.find(s => s.id_subtipologia == id);
        if (!st) return;
        const nuevoEstado = st.estado === "Activo" ? "Inactivo" : "Activo";
        await updateSubtipologia(id, { ...st, estado: nuevoEstado });
        document.getElementById("modalEstadoSubtipologia").classList.add("hidden");
        await renderVistaSubtipologias(localStorage.getItem('subtipologiasVista') || 'tarjetas', document.getElementById('busquedaSubtipologias').value.trim().toLowerCase());
    };
}

// Modal Ver
function mostrarModalVerSubtipologia(id, subtipologias, tipologiasMap) {
    const st = subtipologias.find(s => s.id_subtipologia == id);
    if (!st) return;
    document.getElementById("verNombreSubtipologia").textContent = st.nombre;
    document.getElementById("verDescripcionSubtipologia").textContent = st.descripcion || "";
    document.getElementById("verTipologiaSubtipologia").textContent = tipologiasMap ? (tipologiasMap[st.id_tipologia] || "") : "";
    document.getElementById("verEstadoSubtipologia").innerHTML = st.estado === "Activo"
        ? `<span class="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold text-xs">${st.estado}</span>`
        : `<span class="bg-red-100 text-red-700 px-2 py-1 rounded font-semibold text-xs">${st.estado}</span>`;
    document.getElementById("modalVerSubtipologia").classList.remove("hidden");
}

// Modal Editar
async function mostrarModalEditarSubtipologia(id, subtipologias) {
    const st = subtipologias.find(s => s.id_subtipologia == id);
    if (!st) return;
    document.getElementById("id_subtipologiaEditar").value = st.id_subtipologia;
    document.getElementById("nombreSubtipologiaEditar").value = st.nombre;
    document.getElementById("descripcionSubtipologiaEditar").value = st.descripcion || "";
    await cargarTipologiasEnSelect("tipologiaSubtipologiaEditar", st.id_tipologia);
    document.getElementById("estadoSubtipologiaEditar").value = st.estado;
    document.getElementById("modalEditarSubtipologia").classList.remove("hidden");
}

// Modal Eliminar
function mostrarModalEliminarSubtipologia(id) {
    document.getElementById("btnEliminarSubtipologiaConfirmar").setAttribute("data-id", id);
    document.getElementById("modalEliminarSubtipologia").classList.remove("hidden");
}

// Modal Cambiar Estado
function mostrarModalEstadoSubtipologia(id, subtipologias) {
    const st = subtipologias.find(s => s.id_subtipologia == id);
    if (!st) return;
    document.getElementById("btnEstadoSubtipologiaConfirmar").setAttribute("data-id", id);
    const isActivo = st.estado === "Activo";
    document.getElementById("modalEstadoSubtipologiaTexto").textContent = isActivo
        ? "¿Seguro que deseas inhabilitar esta subtipología?"
        : "¿Seguro que deseas habilitar esta subtipología?";
    document.getElementById("modalEstadoSubtipologiaConfirmarText").textContent = isActivo ? "Inhabilitar" : "Habilitar";
    document.getElementById("modalEstadoSubtipologiaConfirmarIcon").className = isActivo ? "fas fa-times" : "fas fa-check";
    document.getElementById("modalEstadoSubtipologiaIcon").innerHTML = isActivo
        ? '<i class="fas fa-times text-red-600"></i>'
        : '<i class="fas fa-check text-green-600"></i>';
    document.getElementById("modalEstadoSubtipologia").classList.remove("hidden");
}

// Cargar tipologías en select
async function cargarTipologiasEnSelect(selectId, selectedId = null) {
    const tipologias = await fetchTipologias();
    const select = document.getElementById(selectId);
    select.innerHTML = "";
    tipologias.forEach(t => {
        const option = document.createElement("option");
        option.value = t.id_tipologia;
        option.textContent = t.nombre;
        if (selectedId && t.id_tipologia == selectedId) option.selected = true;
        select.appendChild(option);
    });
}

// Exporta la función global para el dashboard
window.iniciarModuloSubtipologias = iniciarModuloSubtipologias;
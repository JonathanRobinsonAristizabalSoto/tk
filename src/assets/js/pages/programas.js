import {
    fetchProgramas,
    createPrograma,
    updatePrograma,
    deletePrograma,
    fetchTipologias,
    fetchSubtipologias
} from "../api/api.js";

// Inicializa el módulo de programas
export async function iniciarModuloProgramas(vista = "tarjetas", filtro = "") {
    localStorage.setItem('programasVista', vista);
    await renderProgramas(vista, filtro);
}

// Renderiza el módulo principal
export async function renderProgramas(vista = "tarjetas", filtro = "") {
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

    let programasHeaderHtml = `
        <div class="flex flex-col gap-2 my-2">
            <div class="flex justify-center mb-1">
                <span class="text-color4 text-sm text-center">
                    Consulta, busca y gestiona los programas registrados en el sistema.
                </span>
            </div>
            <div class="flex flex-row items-center gap-2">
                <div class="flex-shrink-0">
                    <button id="btnAbrirModalCrearPrograma" class="bg-color5 text-white px-4 py-2 rounded ${textoSize} flex items-center gap-2">
                        <i class="fas fa-graduation-cap ${iconSize}"></i>
                        <span>Agregar Programa</span>
                    </button>
                </div>
                <div class="flex-grow flex justify-center">
                    <input
                        type="text"
                        id="busquedaProgramas"
                        placeholder="Buscar programa..."
                        class="border border-gray-300 rounded px-3 py-2 ${textoSize} w-full sm:w-80 text-center"
                        autocomplete="off"
                        style="outline:none;"
                        onfocus="this.style.borderColor='#22c55e';"
                        onblur="this.style.borderColor='#d1d5db';"
                    >
                </div>
                <div class="flex-shrink-0 flex justify-end gap-2 mx-12" style="min-width:100px;">
                    <button id="btnVistaTarjetasProgramas" class="bg-color5 text-white p-2 rounded shadow hover:bg-green-600 transition" title="Vista tarjetas">
                        <i class="fas fa-th-large"></i>
                    </button>
                    <button id="btnVistaTablaProgramas" class="bg-color6 text-white p-2 rounded shadow hover:bg-orange-600 transition" title="Vista tabla">
                        <i class="fa-solid fa-list"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    mainContent.innerHTML = `
        <div class="flex flex-col gap-2 my-1">
            <div class="flex justify-center items-center gap-2">
                <i class="fas fa-graduation-cap text-color6 text-2xl"></i>
                <h2 class="text-color4 text-center text-xl font-semibold">Programas</h2>
            </div>
            ${programasHeaderHtml}
        </div>
        <div id="programasDataTable"></div>
        <div id="programasPaginador" class="mt-4 flex justify-center items-center"></div>
    `;

    // Renderiza la vista seleccionada
    await renderVistaProgramas(vista, filtro);

    // Botones de cambio de vista
    document.getElementById("btnVistaTarjetasProgramas").onclick = () => {
        localStorage.setItem('programasVista', 'tarjetas');
        renderProgramas('tarjetas', document.getElementById('busquedaProgramas').value.trim().toLowerCase());
    };
    document.getElementById("btnVistaTablaProgramas").onclick = () => {
        localStorage.setItem('programasVista', 'tabla');
        renderProgramas('tabla', document.getElementById('busquedaProgramas').value.trim().toLowerCase());
    };

    // Botón para abrir modal crear
    document.getElementById("btnAbrirModalCrearPrograma").onclick = async () => {
        document.getElementById("modalCrearPrograma").classList.remove("hidden");
        await cargarTipologiasEnSelect("tipologiaProgramaCrear");
        await cargarSubtipologiasEnSelect("subtipologiaProgramaCrear");
    };

    // Eventos para cerrar modales
    document.getElementById("closeModalCrearPrograma").onclick = () => {
        document.getElementById("modalCrearPrograma").classList.add("hidden");
    };
    document.getElementById("closeModalEditarPrograma").onclick = () => {
        document.getElementById("modalEditarPrograma").classList.add("hidden");
    };
    document.querySelectorAll("#closeModalVerPrograma").forEach(btn => {
        btn.onclick = () => {
            document.getElementById("modalVerPrograma").classList.add("hidden");
        };
    });
    document.getElementById("btnEliminarProgramaCancelar").onclick = () => {
        document.getElementById("modalEliminarPrograma").classList.add("hidden");
    };
    document.getElementById("btnEstadoProgramaCancelar").onclick = () => {
        document.getElementById("modalEstadoPrograma").classList.add("hidden");
    };

    // Evento submit crear
    document.getElementById("formCrearPrograma").onsubmit = async function (e) {
        e.preventDefault();
        const data = {
            codigo: this.codigo.value,
            version: this.version.value,
            nombre: this.nombre.value,
            descripcion: this.descripcion.value,
            duracion: this.duracion.value,
            linea_tecnologica: this.linea_tecnologica.value,
            red_tecnologica: this.red_tecnologica.value,
            red_de_conocimiento: this.red_de_conocimiento.value,
            modalidad: this.modalidad.value,
            id_tipologia: this.id_tipologia.value,
            id_subtipologia: this.id_subtipologia.value,
            estado: this.estado.value
        };
        await createPrograma(data);
        document.getElementById("modalCrearPrograma").classList.add("hidden");
        await renderVistaProgramas(localStorage.getItem('programasVista') || 'tarjetas', document.getElementById('busquedaProgramas').value.trim().toLowerCase());
        this.reset();
    };

    // Evento submit editar
    document.getElementById("formEditarPrograma").onsubmit = async function (e) {
        e.preventDefault();
        const id = this.id_programa.value;
        const data = {
            codigo: this.codigo.value,
            version: this.version.value,
            nombre: this.nombre.value,
            descripcion: this.descripcion.value,
            duracion: this.duracion.value,
            linea_tecnologica: this.linea_tecnologica.value,
            red_tecnologica: this.red_tecnologica.value,
            red_de_conocimiento: this.red_de_conocimiento.value,
            modalidad: this.modalidad.value,
            id_tipologia: this.id_tipologia.value,
            id_subtipologia: this.id_subtipologia.value,
            estado: this.estado.value
        };
        await updatePrograma(id, data);
        document.getElementById("modalEditarPrograma").classList.add("hidden");
        await renderVistaProgramas(localStorage.getItem('programasVista') || 'tarjetas', document.getElementById('busquedaProgramas').value.trim().toLowerCase());
    };

    // Buscador
    document.getElementById('busquedaProgramas')?.addEventListener('input', function () {
        renderVistaProgramas(localStorage.getItem('programasVista') || 'tarjetas', this.value.trim().toLowerCase());
    });
}

// Renderiza la vista en tarjetas o tabla con paginador (máximo 6 tarjetas por página, 3 por fila; tabla: 10 filas por página)
async function renderVistaProgramas(vista = "tarjetas", filtro = "") {
    const programasRes = await fetchProgramas();
    const programas = Array.isArray(programasRes.data) ? programasRes.data : [];
    const tipologias = await fetchTipologias();
    const subtipologias = await fetchSubtipologias();
    const tipologiasMap = {};
    const subtipologiasMap = {};
    tipologias.forEach(t => {
        tipologiasMap[t.id_tipologia] = t.nombre;
    });
    subtipologias.forEach(st => {
        subtipologiasMap[st.id_subtipologia] = st.nombre;
    });

    const container = document.getElementById("programasDataTable");
    const paginador = document.getElementById("programasPaginador");
    container.innerHTML = "";
    if (paginador) paginador.innerHTML = "";

    // Filtrado por búsqueda
    let programasFiltrados = Array.isArray(programas) ? programas : [];
    if (filtro && filtro.length > 0) {
        programasFiltrados = programasFiltrados.filter(p =>
            (p.nombre && p.nombre.toLowerCase().includes(filtro)) ||
            (p.descripcion && p.descripcion.toLowerCase().includes(filtro)) ||
            (p.codigo && p.codigo.toLowerCase().includes(filtro)) ||
            (tipologiasMap[p.id_tipologia] && tipologiasMap[p.id_tipologia].toLowerCase().includes(filtro)) ||
            (subtipologiasMap[p.id_subtipologia] && subtipologiasMap[p.id_subtipologia].toLowerCase().includes(filtro))
        );
    }

    // Paginación
    let paginaActual = window.programasPaginaActual || 1;
    const programasPorPagina = vista === "tarjetas" ? 6 : 10;
    const totalPaginas = Math.max(1, Math.ceil(programasFiltrados.length / programasPorPagina));
    if (paginaActual > totalPaginas) paginaActual = 1;
    window.programasPaginaActual = paginaActual;
    const inicio = (paginaActual - 1) * programasPorPagina;
    const fin = inicio + programasPorPagina;
    const mostrar = programasFiltrados.slice(inicio, fin);

    // --- Tarjetas ---
    if (vista === "tarjetas") {
        container.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
        mostrar.forEach(p => {
            const isActivo = p.estado === "Activo";
            const estadoColor = isActivo ? "bg-green-100 text-green-700 px-2 py-1 rounded font-semibold text-xs" : "bg-red-100 text-red-700 px-2 py-1 rounded font-semibold text-xs";
            const btnEstadoColor = isActivo ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
            const btnEstadoIcon = isActivo ? '<i class="fas fa-check text-xs"></i>' : '<i class="fas fa-times text-xs"></i>';
            const btnEstadoTitle = isActivo ? "Inhabilitar" : "Habilitar";
            const tipologiaNombre = tipologiasMap[p.id_tipologia] || "";
            const subtipologiaNombre = subtipologiasMap[p.id_subtipologia] || "";
            const card = document.createElement("div");
            card.className = "bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col items-center text-xs mb-2";
            card.innerHTML = `
                <div class="text-base font-bold text-color4 text-center mb-1">${p.nombre}</div>
                <div class="text-xs font-semibold text-color6 text-center mb-1">Descripción:</div>
                <div class="text-xs text-gray-500 text-center mb-2">${p.descripcion || ""}</div>
                <div class="text-xs font-semibold text-color6 text-center mb-1">Código:</div>
                <div class="text-xs text-color4 text-center mb-2">${p.codigo}</div>
                <div class="text-xs font-semibold text-color6 text-center mb-1">Tipología:</div>
                <div class="text-xs text-color4 text-center mb-2">${tipologiaNombre}</div>
                <div class="text-xs font-semibold text-color6 text-center mb-1">Subtipología:</div>
                <div class="text-xs text-color4 text-center mb-2">${subtipologiaNombre}</div>
                <div class="text-xs font-semibold text-color6 text-center mb-1">Estado:</div>
                <div class="${estadoColor} text-center mb-2">${p.estado}</div>
                <div class="flex justify-center mt-2 space-x-1">
                    <button class="flex p-2 bg-green-600 hover:bg-green-700 text-white p-1 rounded-lg items-center justify-center ver-programa-btn" style="width:24px;height:24px;" data-id="${p.id_programa}" title="Ver">
                        <i class="fas fa-eye text-xs"></i>
                    </button>
                    <button class="flex p-2 bg-orange-400 hover:bg-orange-500 text-white p-1 rounded-lg items-center justify-center edit-programa-btn" style="width:24px;height:24px;" data-id="${p.id_programa}" title="Editar">
                        <i class="fas fa-edit text-xs"></i>
                    </button>
                    <button class="flex p-2 ${btnEstadoColor} text-white p-1 rounded-lg items-center justify-center estado-programa-btn" style="width:24px;height:24px;" data-id="${p.id_programa}" title="${btnEstadoTitle}">
                        ${btnEstadoIcon}
                    </button>
                    <button class="flex p-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg items-center justify-center delete-programa-btn" style="width:24px;height:24px;" data-id="${p.id_programa}" title="Eliminar">
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
                    <th class="p-2 border-b border-r text-center">Código</th>
                    <th class="p-2 border-b border-r text-center">Nombre</th>
                    <th class="p-2 border-b border-r text-center">Descripción</th>
                    <th class="p-2 border-b border-r text-center">Tipología</th>
                    <th class="p-2 border-b border-r text-center">Subtipología</th>
                    <th class="p-2 border-b border-r text-center">Estado</th>
                    <th class="p-2 border-b text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${mostrar.map(p => {
                    const isActivo = p.estado === "Activo";
                    const estadoColor = isActivo ? "bg-green-100 text-green-700 px-2 py-1 rounded font-semibold text-xs" : "bg-red-100 text-red-700 px-2 py-1 rounded font-semibold text-xs";
                    const btnEstadoColor = isActivo ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
                    const btnEstadoIcon = isActivo ? '<i class="fas fa-check text-xs"></i>' : '<i class="fas fa-times text-xs"></i>';
                    const btnEstadoTitle = isActivo ? "Inhabilitar" : "Habilitar";
                    const tipologiaNombre = tipologiasMap[p.id_tipologia] || "";
                    const subtipologiaNombre = subtipologiasMap[p.id_subtipologia] || "";
                    return `
                        <tr>
                            <td class="p-2 border-b border-r text-center">${p.codigo}</td>
                            <td class="p-2 border-b border-r text-center">${p.nombre}</td>
                            <td class="p-2 border-b border-r text-center">${p.descripcion || ""}</td>
                            <td class="p-2 border-b border-r text-center">${tipologiaNombre}</td>
                            <td class="p-2 border-b border-r text-center">${subtipologiaNombre}</td>
                            <td class="p-2 border-b border-r text-center"><span class="${estadoColor}">${p.estado}</span></td>
                            <td class="p-2 border-b text-center">
                                <div class="flex justify-center gap-2">
                                    <button class="flex bg-green-600 hover:bg-green-700 text-white p-1 rounded-lg items-center justify-center ver-programa-btn" style="width:24px;height:24px;" data-id="${p.id_programa}" title="Ver">
                                        <i class="fas fa-eye text-xs"></i>
                                    </button>
                                    <button class="flex bg-orange-400 hover:bg-orange-500 text-white p-1 rounded-lg items-center justify-center edit-programa-btn" style="width:24px;height:24px;" data-id="${p.id_programa}" title="Editar">
                                        <i class="fas fa-edit text-xs"></i>
                                    </button>
                                    <button class="flex ${btnEstadoColor} text-white p-1 rounded-lg items-center justify-center estado-programa-btn" style="width:24px;height:24px;" data-id="${p.id_programa}" title="${btnEstadoTitle}">
                                        ${btnEstadoIcon}
                                    </button>
                                    <button class="flex bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg items-center justify-center delete-programa-btn" style="width:24px;height:24px;" data-id="${p.id_programa}" title="Eliminar">
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
        html += `<button class="px-2 py-1 rounded bg-color5 text-white text-xs font-semibold hover:bg-color6 transition ${paginaActual === 1 ? "opacity-50 cursor-not-allowed" : ""}" ${paginaActual === 1 ? "disabled" : ""} id="btnPagAnteriorProgramas">Anterior</button>`;
        for (let i = 1; i <= totalPaginas; i++) {
            html += `<button class="px-2 py-1 rounded ${i === paginaActual ? "bg-color6 text-white" : "bg-white text-color5 border border-color5"} text-xs font-semibold hover:bg-color5 hover:text-white transition" data-pagina="${i}">${i}</button>`;
        }
        html += `<button class="px-2 py-1 rounded bg-color5 text-white text-xs font-semibold hover:bg-color6 transition ${paginaActual === totalPaginas ? "opacity-50 cursor-not-allowed" : ""}" ${paginaActual === totalPaginas ? "disabled" : ""} id="btnPagSiguienteProgramas">Siguiente</button>`;
        html += `</nav>`;
        paginador.innerHTML = html;

        document.getElementById("btnPagAnteriorProgramas")?.addEventListener("click", () => {
            if (paginaActual > 1) {
                window.programasPaginaActual = paginaActual - 1;
                renderVistaProgramas(vista, filtro);
            }
        });
        document.getElementById("btnPagSiguienteProgramas")?.addEventListener("click", () => {
            if (paginaActual < totalPaginas) {
                window.programasPaginaActual = paginaActual + 1;
                renderVistaProgramas(vista, filtro);
            }
        });
        paginador.querySelectorAll("button[data-pagina]").forEach(btn => {
            btn.addEventListener("click", () => {
                window.programasPaginaActual = parseInt(btn.getAttribute("data-pagina"));
                renderVistaProgramas(vista, filtro);
            });
        });
    }

    // Eventos para ver, editar, eliminar y cambiar estado
    container.querySelectorAll(".ver-programa-btn").forEach(btn => {
        btn.onclick = () => mostrarModalVerPrograma(btn.dataset.id, programasFiltrados, tipologiasMap, subtipologiasMap);
    });
    container.querySelectorAll(".edit-programa-btn").forEach(btn => {
        btn.onclick = () => mostrarModalEditarPrograma(btn.dataset.id, programasFiltrados);
    });
    container.querySelectorAll(".delete-programa-btn").forEach(btn => {
        btn.onclick = () => mostrarModalEliminarPrograma(btn.dataset.id);
    });
    container.querySelectorAll(".estado-programa-btn").forEach(btn => {
        btn.onclick = () => mostrarModalEstadoPrograma(btn.dataset.id, programasFiltrados);
    });

    // Evento eliminar
    document.getElementById("btnEliminarProgramaConfirmar").onclick = async function () {
        const id = this.getAttribute("data-id");
        await deletePrograma(id);
        document.getElementById("modalEliminarPrograma").classList.add("hidden");
        await renderVistaProgramas(localStorage.getItem('programasVista') || 'tarjetas', document.getElementById('busquedaProgramas').value.trim().toLowerCase());
    };

    // Evento cambiar estado
    document.getElementById("btnEstadoProgramaConfirmar").onclick = async function () {
        const id = this.getAttribute("data-id");
        const p = programasFiltrados.find(s => s.id_programa == id);
        if (!p) return;
        const nuevoEstado = p.estado === "Activo" ? "Inactivo" : "Activo";
        await updatePrograma(id, { ...p, estado: nuevoEstado });
        document.getElementById("modalEstadoPrograma").classList.add("hidden");
        await renderVistaProgramas(localStorage.getItem('programasVista') || 'tarjetas', document.getElementById('busquedaProgramas').value.trim().toLowerCase());
    };
}

// Modal Ver
function mostrarModalVerPrograma(id, programas, tipologiasMap, subtipologiasMap) {
    const p = programas.find(s => s.id_programa == id);
    if (!p) return;
    document.getElementById("verCodigoPrograma").textContent = p.codigo;
    document.getElementById("verVersionPrograma").textContent = p.version;
    document.getElementById("verNombrePrograma").textContent = p.nombre;
    document.getElementById("verDescripcionPrograma").textContent = p.descripcion || "";
    document.getElementById("verDuracionPrograma").textContent = p.duracion;
    document.getElementById("verLineaTecnologicaPrograma").textContent = p.linea_tecnologica;
    document.getElementById("verRedTecnologicaPrograma").textContent = p.red_tecnologica;
    document.getElementById("verRedConocimientoPrograma").textContent = p.red_de_conocimiento;
    document.getElementById("verModalidadPrograma").textContent = p.modalidad;
    document.getElementById("verTipologiaPrograma").textContent = tipologiasMap ? (tipologiasMap[p.id_tipologia] || "") : "";
    document.getElementById("verSubtipologiaPrograma").textContent = subtipologiasMap ? (subtipologiasMap[p.id_subtipologia] || "") : "";
    document.getElementById("verEstadoPrograma").innerHTML = p.estado === "Activo"
        ? `<span class="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold text-xs">${p.estado}</span>`
        : `<span class="bg-red-100 text-red-700 px-2 py-1 rounded font-semibold text-xs">${p.estado}</span>`;
    document.getElementById("modalVerPrograma").classList.remove("hidden");
}

// Modal Editar
async function mostrarModalEditarPrograma(id, programas) {
    const p = programas.find(s => s.id_programa == id);
    if (!p) return;
    document.getElementById("id_programaEditar").value = p.id_programa;
    document.getElementById("codigoProgramaEditar").value = p.codigo;
    document.getElementById("versionProgramaEditar").value = p.version;
    document.getElementById("nombreProgramaEditar").value = p.nombre;
    document.getElementById("descripcionProgramaEditar").value = p.descripcion || "";
    document.getElementById("duracionProgramaEditar").value = p.duracion;
    document.getElementById("lineaTecnologicaProgramaEditar").value = p.linea_tecnologica;
    document.getElementById("redTecnologicaProgramaEditar").value = p.red_tecnologica;
    document.getElementById("redConocimientoProgramaEditar").value = p.red_de_conocimiento;
    document.getElementById("modalidadProgramaEditar").value = p.modalidad;
    await cargarTipologiasEnSelect("tipologiaProgramaEditar", p.id_tipologia);
    await cargarSubtipologiasEnSelect("subtipologiaProgramaEditar", p.id_subtipologia);
    document.getElementById("estadoProgramaEditar").value = p.estado;
    document.getElementById("modalEditarPrograma").classList.remove("hidden");
}

// Modal Eliminar
function mostrarModalEliminarPrograma(id) {
    document.getElementById("btnEliminarProgramaConfirmar").setAttribute("data-id", id);
    document.getElementById("modalEliminarPrograma").classList.remove("hidden");
}

// Modal Cambiar Estado
function mostrarModalEstadoPrograma(id, programas) {
    const p = programas.find(s => s.id_programa == id);
    if (!p) return;
    document.getElementById("btnEstadoProgramaConfirmar").setAttribute("data-id", id);
    const isActivo = p.estado === "Activo";
    document.getElementById("modalEstadoProgramaTexto").textContent = isActivo
        ? "¿Seguro que deseas inhabilitar este programa?"
        : "¿Seguro que deseas habilitar este programa?";
    document.getElementById("modalEstadoProgramaConfirmarText").textContent = isActivo ? "Inhabilitar" : "Habilitar";
    document.getElementById("modalEstadoProgramaConfirmarIcon").className = isActivo ? "fas fa-times" : "fas fa-check";
    document.getElementById("modalEstadoProgramaIcon").innerHTML = isActivo
        ? '<i class="fas fa-times text-red-600"></i>'
        : '<i class="fas fa-check text-green-600"></i>';
    document.getElementById("modalEstadoPrograma").classList.remove("hidden");
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

// Cargar subtipologías en select
async function cargarSubtipologiasEnSelect(selectId, selectedId = null) {
    const subtipologias = await fetchSubtipologias();
    const select = document.getElementById(selectId);
    select.innerHTML = "";
    subtipologias.forEach(st => {
        const option = document.createElement("option");
        option.value = st.id_subtipologia;
        option.textContent = st.nombre;
        if (selectedId && st.id_subtipologia == selectedId) option.selected = true;
        select.appendChild(option);
    });
}

// Exporta la función global para el dashboard
window.iniciarModuloProgramas = iniciarModuloProgramas;
import {
    fetchTickets,
    fetchTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    changeTicketState,
    addTicketComment,
    addTicketAttachment,
    addTicketEvent,
    assignTicketResponsible,
    fetchProgramas,
    fetchTipologias,
    fetchSubtipologias,
    fetchUsuarios
} from "../api/api.js";

// Inicializa el módulo de tickets
export async function iniciarModuloTickets(vista = "tarjetas", filtro = "") {
    localStorage.setItem('ticketsVista', vista);
    await renderTickets(vista, filtro);
}

// Renderiza el módulo principal
export async function renderTickets(vista = "tarjetas", filtro = "") {
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

    let ticketsHeaderHtml = `
        <div class="flex flex-col gap-2 my-2">
            <div class="flex justify-center mb-1">
                <span class="text-color4 text-sm text-center">
                    Consulta, busca y gestiona los tickets registrados en el sistema.
                </span>
            </div>
            <div class="flex flex-row items-center gap-2">
                <div class="flex-shrink-0">
                    <button id="btnAbrirModalCrearTicket" class="bg-color5 text-white px-4 py-2 rounded ${textoSize} flex items-center gap-2">
                        <i class="fas fa-ticket-alt ${iconSize}"></i>
                        <span>Crear Ticket</span>
                    </button>
                </div>
                <div class="flex-grow flex justify-center">
                    <input
                        type="text"
                        id="busquedaTickets"
                        placeholder="Buscar ticket..."
                        class="border border-gray-300 rounded px-3 py-2 ${textoSize} w-full sm:w-80 text-center"
                        autocomplete="off"
                        style="outline:none;"
                        onfocus="this.style.borderColor='#22c55e';"
                        onblur="this.style.borderColor='#d1d5db';"
                    >
                </div>
                <div class="flex-shrink-0 flex justify-end gap-2 mx-12" style="min-width:100px;">
                    <button id="btnVistaTarjetasTickets" class="bg-color5 text-white p-2 rounded shadow hover:bg-green-600 transition" title="Vista tarjetas">
                        <i class="fas fa-th-large"></i>
                    </button>
                    <button id="btnVistaTablaTickets" class="bg-color6 text-white p-2 rounded shadow hover:bg-orange-600 transition" title="Vista tabla">
                        <i class="fa-solid fa-list"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    mainContent.innerHTML = `
        <div class="flex flex-col gap-2 my-1">
            <div class="flex justify-center items-center gap-2">
                <i class="fas fa-ticket-alt text-color6 text-2xl"></i>
                <h2 class="text-color4 text-center text-xl font-semibold">Tickets</h2>
            </div>
            ${ticketsHeaderHtml}
        </div>
        <div id="ticketsDataTable"></div>
        <div id="ticketsPaginador" class="mt-4 flex justify-center items-center"></div>
    `;

    // Renderiza la vista seleccionada
    await renderVistaTickets(vista, filtro);

    // Botones de cambio de vista
    document.getElementById("btnVistaTarjetasTickets").onclick = () => {
        localStorage.setItem('ticketsVista', 'tarjetas');
        renderTickets('tarjetas', document.getElementById('busquedaTickets').value.trim().toLowerCase());
    };
    document.getElementById("btnVistaTablaTickets").onclick = () => {
        localStorage.setItem('ticketsVista', 'tabla');
        renderTickets('tabla', document.getElementById('busquedaTickets').value.trim().toLowerCase());
    };

    // Botón para abrir modal crear
    document.getElementById("btnAbrirModalCrearTicket").onclick = async () => {
        document.getElementById("modalCrearTicket").classList.remove("hidden");
        await cargarProgramasEnSelect("programaTicketCrear");
        await cargarTipologiasEnSelect("tipologiaTicketCrear");
        await cargarSubtipologiasEnSelect("subtipologiaTicketCrear");
    };

    // Eventos para cerrar modales
    document.getElementById("closeModalCrearTicket").onclick = () => {
        document.getElementById("modalCrearTicket").classList.add("hidden");
    };
    document.getElementById("closeModalEditarTicket").onclick = () => {
        document.getElementById("modalEditarTicket").classList.add("hidden");
    };
    document.getElementById("closeModalVerTicket").onclick = () => {
        document.getElementById("modalVerTicket").classList.add("hidden");
    };
    document.getElementById("closeModalComentarioTicket").onclick = () => {
        document.getElementById("modalComentarioTicket").classList.add("hidden");
    };
    document.getElementById("closeModalAdjuntoTicket").onclick = () => {
        document.getElementById("modalAdjuntoTicket").classList.add("hidden");
    };
    document.getElementById("closeModalAsignarTicket").onclick = () => {
        document.getElementById("modalAsignarTicket").classList.add("hidden");
    };
    document.getElementById("btnEliminarTicketCancelar").onclick = () => {
        document.getElementById("modalEliminarTicket").classList.add("hidden");
    };
    document.getElementById("btnEstadoTicketCancelar").onclick = () => {
        document.getElementById("modalEstadoTicket").classList.add("hidden");
    };

    // Evento submit crear
    document.getElementById("formCrearTicket").onsubmit = async function (e) {
        e.preventDefault();
        const data = {
            id_usuario: window.dashboardUserId || 1,
            descripcion: this.descripcion.value,
            prioridad: this.prioridad.value,
            estado: this.estado.value,
            id_programa: this.id_programa.value,
            id_tipologia: this.id_tipologia.value,
            id_subtipologia: this.id_subtipologia.value,
            id_rol: 1 // Ajusta según el rol del usuario
        };
        await createTicket(data);
        document.getElementById("modalCrearTicket").classList.add("hidden");
        await renderVistaTickets(localStorage.getItem('ticketsVista') || 'tarjetas', document.getElementById('busquedaTickets').value.trim().toLowerCase());
        this.reset();
    };

    // Evento submit editar
    document.getElementById("formEditarTicket").onsubmit = async function (e) {
        e.preventDefault();
        const id = this.id_ticket.value;
        const data = {
            descripcion: this.descripcion.value,
            prioridad: this.prioridad.value,
            estado: this.estado.value,
            id_programa: this.id_programa.value,
            id_tipologia: this.id_tipologia.value,
            id_subtipologia: this.id_subtipologia.value,
            id_rol: 1 // Ajusta según el rol del usuario
        };
        await updateTicket(id, data);
        document.getElementById("modalEditarTicket").classList.add("hidden");
        await renderVistaTickets(localStorage.getItem('ticketsVista') || 'tarjetas', document.getElementById('busquedaTickets').value.trim().toLowerCase());
    };

    // Buscador
    document.getElementById('busquedaTickets')?.addEventListener('input', function () {
        renderVistaTickets(localStorage.getItem('ticketsVista') || 'tarjetas', this.value.trim().toLowerCase());
    });
}

// Renderiza la vista en tarjetas o tabla con paginador
async function renderVistaTickets(vista = "tarjetas", filtro = "") {
    const ticketsRes = await fetchTickets();
    const tickets = Array.isArray(ticketsRes.data) ? ticketsRes.data : [];

    // --- CORRECCIÓN: obtener los arrays de los objetos de respuesta ---
    const programasRes = await fetchProgramas();
    const programas = Array.isArray(programasRes.data) ? programasRes.data : [];
    const tipologiasRes = await fetchTipologias();
    const tipologias = Array.isArray(tipologiasRes.data) ? tipologiasRes.data : [];
    const subtipologiasRes = await fetchSubtipologias();
    const subtipologias = Array.isArray(subtipologiasRes.data) ? subtipologiasRes.data : [];
    const usuariosRes = await fetchUsuarios();
    const usuarios = Array.isArray(usuariosRes.data) ? usuariosRes.data : [];

    const programasMap = {};
    const tipologiasMap = {};
    const subtipologiasMap = {};
    const usuariosMap = {};
    programas.forEach(p => { programasMap[p.id_programa] = p.nombre; });
    tipologias.forEach(t => { tipologiasMap[t.id_tipologia] = t.nombre; });
    subtipologias.forEach(st => { subtipologiasMap[st.id_subtipologia] = st.nombre; });
    usuarios.forEach(u => { usuariosMap[u.id_usuario] = `${u.nombre} ${u.apellido}`; });

    const container = document.getElementById("ticketsDataTable");
    const paginador = document.getElementById("ticketsPaginador");
    container.innerHTML = "";
    if (paginador) paginador.innerHTML = "";

    // Filtrado por búsqueda
    let ticketsFiltrados = Array.isArray(tickets) ? tickets : [];
    if (filtro && filtro.length > 0) {
        ticketsFiltrados = ticketsFiltrados.filter(t =>
            (t.numero_ticket && t.numero_ticket.toLowerCase().includes(filtro)) ||
            (t.descripcion && t.descripcion.toLowerCase().includes(filtro)) ||
            (t.prioridad && t.prioridad.toLowerCase().includes(filtro)) ||
            (t.estado && t.estado.toLowerCase().includes(filtro)) ||
            (programasMap[t.id_programa] && programasMap[t.id_programa].toLowerCase().includes(filtro)) ||
            (tipologiasMap[t.id_tipologia] && tipologiasMap[t.id_tipologia].toLowerCase().includes(filtro)) ||
            (subtipologiasMap[t.id_subtipologia] && subtipologiasMap[t.id_subtipologia].toLowerCase().includes(filtro)) ||
            (usuariosMap[t.id_usuario] && usuariosMap[t.id_usuario].toLowerCase().includes(filtro))
        );
    }

    // Paginación
    let paginaActual = window.ticketsPaginaActual || 1;
    const ticketsPorPagina = vista === "tarjetas" ? 6 : 10;
    const totalPaginas = Math.max(1, Math.ceil(ticketsFiltrados.length / ticketsPorPagina));
    if (paginaActual > totalPaginas) paginaActual = 1;
    window.ticketsPaginaActual = paginaActual;
    const inicio = (paginaActual - 1) * ticketsPorPagina;
    const fin = inicio + ticketsPorPagina;
    const mostrar = ticketsFiltrados.slice(inicio, fin);

    // --- Tarjetas ---
if (vista === "tarjetas") {
    container.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
    mostrar.forEach(t => {
        const estadoColor = t.estado === "Abierto" ? "bg-green-100 text-green-700" :
            t.estado === "Progreso" ? "bg-blue-100 text-blue-700" :
            t.estado === "Pendiente" ? "bg-yellow-100 text-yellow-700" :
            t.estado === "Resuelto" ? "bg-purple-100 text-purple-700" :
            "bg-gray-100 text-gray-700";
        const card = document.createElement("div");
        card.className = "bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col items-center text-xs mb-2";
        card.innerHTML = `
            <div class="text-base font-bold text-color4 text-center mb-1">${t.numero_ticket}</div>
            <div class="text-xs font-semibold text-color6 text-center mb-1">Descripción:</div>
            <div class="text-xs text-gray-500 text-center mb-2">${t.descripcion || ""}</div>
            <div class="text-xs font-semibold text-color6 text-center mb-1">Prioridad:</div>
            <div class="text-xs text-color4 text-center mb-2">${t.prioridad}</div>
            <div class="text-xs font-semibold text-color6 text-center mb-1">Programa:</div>
            <div class="text-xs text-color4 text-center mb-2">${t.programa_nombre || ""}</div>
            <div class="text-xs font-semibold text-color6 text-center mb-1">Tipología:</div>
            <div class="text-xs text-color4 text-center mb-2">${t.tipologia_nombre || ""}</div>
            <div class="text-xs font-semibold text-color6 text-center mb-1">Subtipología:</div>
            <div class="text-xs text-color4 text-center mb-2">${t.subtipologia_nombre || ""}</div>
            <div class="text-xs font-semibold text-color6 text-center mb-1">Usuario:</div>
            <div class="text-xs text-color4 text-center mb-2">${t.usuario_nombre || ""} ${t.usuario_apellido || ""}</div>
            <div class="text-xs font-semibold text-color6 text-center mb-1">Estado:</div>
            <div class="${estadoColor} px-2 py-1 rounded font-semibold text-xs text-center mb-2">${t.estado}</div>
            <div class="flex justify-center mt-2 space-x-1">
                <button class="flex p-2 bg-green-600 hover:bg-green-700 text-white p-1 rounded-lg items-center justify-center ver-ticket-btn" style="width:24px;height:24px;" data-id="${t.id_ticket}" title="Ver">
                    <i class="fas fa-eye text-xs"></i>
                </button>
                <button class="flex p-2 bg-orange-400 hover:bg-orange-500 text-white p-1 rounded-lg items-center justify-center edit-ticket-btn" style="width:24px;height:24px;" data-id="${t.id_ticket}" title="Editar">
                    <i class="fas fa-edit text-xs"></i>
                </button>
                <button class="flex p-2 bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-lg items-center justify-center estado-ticket-btn" style="width:24px;height:24px;" data-id="${t.id_ticket}" title="Cambiar estado">
                    <i class="fas fa-exchange-alt text-xs"></i>
                </button>
                <button class="flex p-2 bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-lg items-center justify-center comentario-ticket-btn" style="width:24px;height:24px;" data-id="${t.id_ticket}" title="Comentar">
                    <i class="fas fa-comment-dots text-xs"></i>
                </button>
                <button class="flex p-2 bg-purple-500 hover:bg-purple-600 text-white p-1 rounded-lg items-center justify-center adjunto-ticket-btn" style="width:24px;height:24px;" data-id="${t.id_ticket}" title="Adjuntar">
                    <i class="fas fa-paperclip text-xs"></i>
                </button>
                <button class="flex p-2 bg-cyan-500 hover:bg-cyan-600 text-white p-1 rounded-lg items-center justify-center asignar-ticket-btn" style="width:24px;height:24px;" data-id="${t.id_ticket}" title="Asignar responsable">
                    <i class="fas fa-user-check text-xs"></i>
                </button>
                <button class="flex p-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg items-center justify-center delete-ticket-btn" style="width:24px;height:24px;" data-id="${t.id_ticket}" title="Eliminar">
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
                <th class="p-2 border-b border-r text-center">Número</th>
                <th class="p-2 border-b border-r text-center">Descripción</th>
                <th class="p-2 border-b border-r text-center">Prioridad</th>
                <th class="p-2 border-b border-r text-center">Programa</th>
                <th class="p-2 border-b border-r text-center">Tipología</th>
                <th class="p-2 border-b border-r text-center">Subtipología</th>
                <th class="p-2 border-b border-r text-center">Usuario</th>
                <th class="p-2 border-b border-r text-center">Estado</th>
                <th class="p-2 border-b text-center">Acciones</th>
            </tr>
        </thead>
        <tbody>
            ${mostrar.map(t => {
                const estadoColor = t.estado === "Abierto" ? "bg-green-100 text-green-700 px-2 py-1 rounded font-semibold text-xs" :
                    t.estado === "Progreso" ? "bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold text-xs" :
                    t.estado === "Pendiente" ? "bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold text-xs" :
                    t.estado === "Resuelto" ? "bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold text-xs" :
                    "bg-gray-100 text-gray-700 px-2 py-1 rounded font-semibold text-xs";
                return `
                    <tr>
                        <td class="p-2 border-b border-r text-center">${t.numero_ticket}</td>
                        <td class="p-2 border-b border-r text-center">${t.descripcion || ""}</td>
                        <td class="p-2 border-b border-r text-center">${t.prioridad}</td>
                        <td class="p-2 border-b border-r text-center">${t.programa_nombre || ""}</td>
                        <td class="p-2 border-b border-r text-center">${t.tipologia_nombre || ""}</td>
                        <td class="p-2 border-b border-r text-center">${t.subtipologia_nombre || ""}</td>
                        <td class="p-2 border-b border-r text-center">${t.usuario_nombre || ""} ${t.usuario_apellido || ""}</td>
                        <td class="p-2 border-b border-r text-center"><span class="${estadoColor}">${t.estado}</span></td>
                        <td class="p-2 border-b text-center">
                            <div class="flex justify-center gap-2">
                                <button class="flex bg-green-600 hover:bg-green-700 text-white p-1 rounded-lg items-center justify-center ver-ticket-btn" style="width:24px;height:24px;" data-id="${t.id_ticket}" title="Ver">
                                    <i class="fas fa-eye text-xs"></i>
                                </button>
                                <button class="flex bg-orange-400 hover:bg-orange-500 text-white p-1 rounded-lg items-center justify-center edit-ticket-btn" style="width:24px;height:24px;" data-id="${t.id_ticket}" title="Editar">
                                    <i class="fas fa-edit text-xs"></i>
                                </button>
                                <button class="flex bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-lg items-center justify-center estado-ticket-btn" style="width:24px;height:24px;" data-id="${t.id_ticket}" title="Cambiar estado">
                                    <i class="fas fa-exchange-alt text-xs"></i>
                                </button>
                                <button class="flex bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-lg items-center justify-center comentario-ticket-btn" style="width:24px;height:24px;" data-id="${t.id_ticket}" title="Comentar">
                                    <i class="fas fa-comment-dots text-xs"></i>
                                </button>
                                <button class="flex bg-purple-500 hover:bg-purple-600 text-white p-1 rounded-lg items-center justify-center adjunto-ticket-btn" style="width:24px;height:24px;" data-id="${t.id_ticket}" title="Adjuntar">
                                    <i class="fas fa-paperclip text-xs"></i>
                                </button>
                                <button class="flex bg-cyan-500 hover:bg-cyan-600 text-white p-1 rounded-lg items-center justify-center asignar-ticket-btn" style="width:24px;height:24px;" data-id="${t.id_ticket}" title="Asignar responsable">
                                    <i class="fas fa-user-check text-xs"></i>
                                </button>
                                <button class="flex bg-red-500 hover:bg-red-600 text-white p-1 rounded-lg items-center justify-center delete-ticket-btn" style="width:24px;height:24px;" data-id="${t.id_ticket}" title="Eliminar">
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
        html += `<button class="px-2 py-1 rounded bg-color5 text-white text-xs font-semibold hover:bg-color6 transition ${paginaActual === 1 ? "opacity-50 cursor-not-allowed" : ""}" ${paginaActual === 1 ? "disabled" : ""} id="btnPagAnteriorTickets">Anterior</button>`;
        for (let i = 1; i <= totalPaginas; i++) {
            html += `<button class="px-2 py-1 rounded ${i === paginaActual ? "bg-color6 text-white" : "bg-white text-color5 border border-color5"} text-xs font-semibold hover:bg-color5 hover:text-white transition" data-pagina="${i}">${i}</button>`;
        }
        html += `<button class="px-2 py-1 rounded bg-color5 text-white text-xs font-semibold hover:bg-color6 transition ${paginaActual === totalPaginas ? "opacity-50 cursor-not-allowed" : ""}" ${paginaActual === totalPaginas ? "disabled" : ""} id="btnPagSiguienteTickets">Siguiente</button>`;
        html += `</nav>`;
        paginador.innerHTML = html;

        document.getElementById("btnPagAnteriorTickets")?.addEventListener("click", () => {
            if (paginaActual > 1) {
                window.ticketsPaginaActual = paginaActual - 1;
                renderVistaTickets(vista, filtro);
            }
        });
        document.getElementById("btnPagSiguienteTickets")?.addEventListener("click", () => {
            if (paginaActual < totalPaginas) {
                window.ticketsPaginaActual = paginaActual + 1;
                renderVistaTickets(vista, filtro);
            }
        });
        paginador.querySelectorAll("button[data-pagina]").forEach(btn => {
            btn.addEventListener("click", () => {
                window.ticketsPaginaActual = parseInt(btn.getAttribute("data-pagina"));
                renderVistaTickets(vista, filtro);
            });
        });
    }

    // Eventos para ver, editar, eliminar y acciones
    container.querySelectorAll(".ver-ticket-btn").forEach(btn => {
        btn.onclick = () => mostrarModalVerTicket(btn.dataset.id);
    });
    container.querySelectorAll(".edit-ticket-btn").forEach(btn => {
        btn.onclick = () => mostrarModalEditarTicket(btn.dataset.id, ticketsFiltrados);
    });
    container.querySelectorAll(".delete-ticket-btn").forEach(btn => {
        btn.onclick = () => mostrarModalEliminarTicket(btn.dataset.id);
    });
    container.querySelectorAll(".estado-ticket-btn").forEach(btn => {
        btn.onclick = () => mostrarModalEstadoTicket(btn.dataset.id, ticketsFiltrados);
    });
    container.querySelectorAll(".comentario-ticket-btn").forEach(btn => {
        btn.onclick = () => mostrarModalComentarioTicket(btn.dataset.id);
    });
    container.querySelectorAll(".adjunto-ticket-btn").forEach(btn => {
        btn.onclick = () => mostrarModalAdjuntoTicket(btn.dataset.id);
    });
    container.querySelectorAll(".asignar-ticket-btn").forEach(btn => {
        btn.onclick = () => mostrarModalAsignarTicket(btn.dataset.id);
    });

    // Evento eliminar
    document.getElementById("btnEliminarTicketConfirmar").onclick = async function () {
        const id = this.getAttribute("data-id");
        await deleteTicket(id);
        document.getElementById("modalEliminarTicket").classList.add("hidden");
        await renderVistaTickets(localStorage.getItem('ticketsVista') || 'tarjetas', document.getElementById('busquedaTickets').value.trim().toLowerCase());
    };

    // Evento cambiar estado
    document.getElementById("btnEstadoTicketConfirmar").onclick = async function () {
        const id = this.getAttribute("data-id");
        const t = ticketsFiltrados.find(s => s.id_ticket == id);
        if (!t) return;
        const nuevoEstado = t.estado === "Abierto" ? "Progreso" : t.estado === "Progreso" ? "Pendiente" : t.estado === "Pendiente" ? "Resuelto" : t.estado === "Resuelto" ? "Cerrado" : "Abierto";
        await changeTicketState(id, nuevoEstado, window.dashboardUserId || 1);
        document.getElementById("modalEstadoTicket").classList.add("hidden");
        await renderVistaTickets(localStorage.getItem('ticketsVista') || 'tarjetas', document.getElementById('busquedaTickets').value.trim().toLowerCase());
    };
}

// Modal Ver
async function mostrarModalVerTicket(id) {
    const res = await fetchTicketById(id);
    if (!res.success || !res.data) return;
    const t = res.data;
    document.getElementById("verNumeroTicket").textContent = t.numero_ticket;
    document.getElementById("verEstadoTicket").textContent = t.estado;
    document.getElementById("verPrioridadTicket").textContent = t.prioridad;
    document.getElementById("verProgramaTicket").textContent = t.programa_nombre || "";
    document.getElementById("verTipologiaTicket").textContent = t.tipologia_nombre || "";
    document.getElementById("verSubtipologiaTicket").textContent = t.subtipologia_nombre || "";
    document.getElementById("verUsuarioTicket").textContent = `${t.usuario_nombre || ""} ${t.usuario_apellido || ""}`;
    document.getElementById("verDescripcionTicket").textContent = t.descripcion || "";
    // Adjuntos
    const adjuntosDiv = document.getElementById("verAdjuntosTicket");
    adjuntosDiv.innerHTML = "";
    if (Array.isArray(t.adjuntos)) {
        t.adjuntos.forEach(adj => {
            adjuntosDiv.innerHTML += `<a href="${adj.ruta_archivo}" target="_blank" class="text-blue-600 underline">${adj.nombre_archivo}</a>`;
        });
    }
    // Historial de estados
    const historialDiv = document.getElementById("verHistorialEstadosTicket");
    historialDiv.innerHTML = "";
    if (Array.isArray(t.historial_estados)) {
        t.historial_estados.forEach(h => {
            historialDiv.innerHTML += `<div>${h.estado_anterior} → ${h.estado_nuevo} por ${h.usuario_nombre || ""} ${h.usuario_apellido || ""} (${h.fecha_cambio})</div>`;
        });
    }
    // Comentarios
    const comentariosDiv = document.getElementById("verComentariosTicket");
    comentariosDiv.innerHTML = "";
    if (Array.isArray(t.comentarios)) {
        t.comentarios.forEach(c => {
            comentariosDiv.innerHTML += `<div><b>${c.usuario_nombre || ""} ${c.usuario_apellido || ""}:</b> ${c.comentario} <span class="text-gray-400">(${c.fecha_creacion})</span></div>`;
        });
    }
    // Asignaciones
    const asignacionesDiv = document.getElementById("verAsignacionesTicket");
    asignacionesDiv.innerHTML = "";
    if (Array.isArray(t.asignaciones)) {
        t.asignaciones.forEach(a => {
            asignacionesDiv.innerHTML += `<div>${a.usuario_nombre || ""} ${a.usuario_apellido || ""} <span class="text-gray-400">(${a.fecha_asignacion})</span></div>`;
        });
    }
    // Eventos
    const eventosDiv = document.getElementById("verEventosTicket");
    eventosDiv.innerHTML = "";
    if (Array.isArray(t.eventos)) {
        t.eventos.forEach(e => {
            eventosDiv.innerHTML += `<div>${e.accion} por ${e.usuario_nombre || ""} ${e.usuario_apellido || ""} <span class="text-gray-400">(${e.fecha_evento})</span></div>`;
        });
    }
    document.getElementById("modalVerTicket").classList.remove("hidden");
}

// Modal Editar
async function mostrarModalEditarTicket(id, tickets) {
    const t = tickets.find(s => s.id_ticket == id);
    if (!t) return;
    document.getElementById("id_ticketEditar").value = t.id_ticket;
    document.getElementById("descripcionTicketEditar").value = t.descripcion || "";
    document.getElementById("prioridadTicketEditar").value = t.prioridad;
    document.getElementById("estadoTicketEditar").value = t.estado;
    await cargarProgramasEnSelect("programaTicketEditar", t.id_programa);
    await cargarTipologiasEnSelect("tipologiaTicketEditar", t.id_tipologia);
    await cargarSubtipologiasEnSelect("subtipologiaTicketEditar", t.id_subtipologia);
    document.getElementById("modalEditarTicket").classList.remove("hidden");
}

// Modal Eliminar
function mostrarModalEliminarTicket(id) {
    document.getElementById("btnEliminarTicketConfirmar").setAttribute("data-id", id);
    document.getElementById("modalEliminarTicket").classList.remove("hidden");
}

// Modal Cambiar Estado
function mostrarModalEstadoTicket(id, tickets) {
    const t = tickets.find(s => s.id_ticket == id);
    if (!t) return;
    document.getElementById("btnEstadoTicketConfirmar").setAttribute("data-id", id);
    document.getElementById("modalEstadoTicketTexto").textContent = `¿Seguro que deseas cambiar el estado del ticket? Estado actual: ${t.estado}`;
    document.getElementById("modalEstadoTicket").classList.remove("hidden");
}

// Modal Comentario
function mostrarModalComentarioTicket(id) {
    document.getElementById("id_ticketComentario").value = id;
    document.getElementById("modalComentarioTicket").classList.remove("hidden");
    document.getElementById("formComentarioTicket").onsubmit = async function (e) {
        e.preventDefault();
        const id_ticket = this.id_ticket.value;
        const comentario = this.comentario.value;
        const prioridad = this.prioridad.value;
        const categoria = this.categoria.value;
        await addTicketComment(id_ticket, window.dashboardUserId || 1, comentario, prioridad, categoria);
        document.getElementById("modalComentarioTicket").classList.add("hidden");
        await renderVistaTickets(localStorage.getItem('ticketsVista') || 'tarjetas', document.getElementById('busquedaTickets').value.trim().toLowerCase());
        this.reset();
    };
}

// Modal Adjunto
function mostrarModalAdjuntoTicket(id) {
    document.getElementById("id_ticketAdjunto").value = id;
    document.getElementById("modalAdjuntoTicket").classList.remove("hidden");
    document.getElementById("formAdjuntoTicket").onsubmit = async function (e) {
        e.preventDefault();
        const id_ticket = this.id_ticket.value;
        const id_comentario = this.id_comentario.value || null;
        const archivo = this.archivo.files[0];
        const nombre_archivo = this.nombre_archivo.value;
        const tipo_archivo = this.tipo_archivo.value;
        await addTicketAttachment(id_ticket, id_comentario, archivo, nombre_archivo, tipo_archivo);
        document.getElementById("modalAdjuntoTicket").classList.add("hidden");
        await renderVistaTickets(localStorage.getItem('ticketsVista') || 'tarjetas', document.getElementById('busquedaTickets').value.trim().toLowerCase());
        this.reset();
    };
}

// Modal Asignar Responsable
async function mostrarModalAsignarTicket(id) {
    document.getElementById("id_ticketAsignar").value = id;
    await cargarUsuariosEnSelect("usuarioAsignarTicket");
    document.getElementById("modalAsignarTicket").classList.remove("hidden");
    document.getElementById("formAsignarTicket").onsubmit = async function (e) {
        e.preventDefault();
        const id_ticket = this.id_ticket.value;
        const id_usuario = this.id_usuario.value;
        await assignTicketResponsible(id_ticket, id_usuario);
        document.getElementById("modalAsignarTicket").classList.add("hidden");
        await renderVistaTickets(localStorage.getItem('ticketsVista') || 'tarjetas', document.getElementById('busquedaTickets').value.trim().toLowerCase());
        this.reset();
    };
}

// Cargar programas en select
async function cargarProgramasEnSelect(selectId, selectedId = null) {
    const programasRes = await fetchProgramas();
    const programas = Array.isArray(programasRes.data) ? programasRes.data : [];
    const select = document.getElementById(selectId);
    select.innerHTML = "";
    programas.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id_programa;
        option.textContent = p.nombre;
        if (selectedId && p.id_programa == selectedId) option.selected = true;
        select.appendChild(option);
    });
}

// Cargar tipologías en select
async function cargarTipologiasEnSelect(selectId, selectedId = null) {
    const tipologiasRes = await fetchTipologias();
    const tipologias = Array.isArray(tipologiasRes.data) ? tipologiasRes.data : [];
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
    const subtipologiasRes = await fetchSubtipologias();
    const subtipologias = Array.isArray(subtipologiasRes.data) ? subtipologiasRes.data : [];
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

// Cargar usuarios en select
async function cargarUsuariosEnSelect(selectId, selectedId = null) {
    const usuariosRes = await fetchUsuarios();
    const usuarios = Array.isArray(usuariosRes.data) ? usuariosRes.data : [];
    const select = document.getElementById(selectId);
    select.innerHTML = "";
    usuarios.forEach(u => {
        const option = document.createElement("option");
        option.value = u.id_usuario;
        option.textContent = `${u.nombre} ${u.apellido}`;
        if (selectedId && u.id_usuario == selectedId) option.selected = true;
        select.appendChild(option);
    });
}

// Exporta la función global para el dashboard
window.iniciarModuloTickets = iniciarModuloTickets;
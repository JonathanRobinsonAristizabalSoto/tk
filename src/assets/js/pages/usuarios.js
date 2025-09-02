import { fetchUsuarios as apiFetchUsuarios, fetchUsuarioById, getRoles } from "../api/api.js";

// Mapeo de tipos de documento para mostrar nombres amigables
const tipoDocumentoLabels = {
    "CC": "Cédula de Ciudadanía",
    "TI": "Tarjeta de Identidad",
    "CE": "Cédula de Extranjería",
    "PS": "Pasaporte",
    "DNI": "DNI",
    "NIT": "NIT"
};

// Carga los roles en un elemento select (crear/editar usuario)
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
        mostrarMensaje("error", "No se pudieron cargar los roles. Intenta nuevamente.");
        console.error("Error al cargar roles:", error);
    }
}

// Carga los tipos de documento en un elemento select (crear/editar usuario)
async function cargarTiposDocumentoEnSelect(selectId, selectedTipo = null) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = '<option value="">Cargando tipos...</option>';
    try {
        const response = await fetch("/tk/server/routes/api.php?module=usuarios&action=get_catalogos");
        const data = await response.json();
        if (data.success && Array.isArray(data.tipos_documento)) {
            select.innerHTML = '';
            data.tipos_documento.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo;
                option.textContent = tipoDocumentoLabels[tipo] || tipo;
                if (selectedTipo && tipo === selectedTipo) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        } else {
            select.innerHTML = '<option value="">No hay tipos disponibles</option>';
        }
    } catch (error) {
        select.innerHTML = '<option value="">Error al cargar tipos</option>';
        mostrarMensaje("error", "No se pudieron cargar los tipos de documento.");
    }
}

// Inicializa el módulo de usuarios: estructura visual, eventos, renderizado y lógica principal
function iniciarModuloUsuarios(vista, filtro = "") {
    // Configura la vista inicial
    if (!vista) {
        vista = 'tarjetas';
        localStorage.setItem('usuariosVista', 'tarjetas');
    } else {
        localStorage.setItem('usuariosVista', vista);
    }

    // Responsive: tamaños de texto e íconos según ancho de pantalla
    const mainContent = document.getElementById('main-content');
    let textoSize = "text-xs";
    let nombreSize = "text-base font-bold";
    let iconSize = "text-xl";
    const width = window.innerWidth;
    if (width < 640) {
        textoSize = "text-xs";
        nombreSize = "text-base font-bold";
        iconSize = "text-lg";
    } else if (width < 768) {
        textoSize = "text-sm";
        nombreSize = "text-sm font-bold";
        iconSize = "text-xl";
    } else if (width < 1024) {
        textoSize = "text-base";
        nombreSize = "text-base font-bold";
        iconSize = "text-2xl";
    } else {
        textoSize = "text-base";
        nombreSize = "text-lg font-bold";
        iconSize = "text-3xl";
    }

    // Header de usuarios (buscador, botones de vista, agregar usuario)
    let usuariosHeaderHtml = "";
    if (width < 768) {
        usuariosHeaderHtml = `
        <div class="flex flex-col gap-2 my-2">
            <div class="flex justify-center mb-1">
                <span class="text-color4 text-sm text-center">
                    Consulta, busca y gestiona los usuarios registrados en el sistema.
                </span>
            </div>
            <button id="openModal" class="bg-color5 text-white px-4 py-2 rounded ${textoSize} flex items-center gap-2 w-full justify-center">
                <i class="fas fa-user-plus ${iconSize}"></i>
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
        <div class="flex flex-col gap-2 my-2">
            <div class="flex justify-center mb-1">
                <span class="text-color4 text-sm text-center">
                    Consulta, busca y gestiona los usuarios registrados en el sistema.
                </span>
            </div>
            <div class="flex flex-row items-center gap-2">
                <div class="flex-shrink-0">
                    <button id="openModal" class="bg-color5 text-white px-4 py-2 rounded ${textoSize} flex items-center gap-2">
                        <i class="fas fa-user-plus ${iconSize}"></i>
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
        </div>
        `;
    }

    // Renderiza la estructura principal
    mainContent.innerHTML = `
    <div class="flex flex-col gap-2 my-1">
        <div class="flex justify-center items-center gap-2">
            <i class="fas fa-users text-color6 text-2xl"></i>
            <h2 class="text-color4 text-center text-xl font-semibold">Usuarios</h2>
        </div>
        ${usuariosHeaderHtml}
    </div>
    <div id="dataTable"></div>
    <div id="usuariosPaginador" class="mt-4 flex justify-center items-center"></div>
    `;

    // Elementos principales y variables de estado
    const modalCrear = document.getElementById("modalCrear");
    const modalEditar = document.getElementById("modalEditar");
    const modalVer = document.getElementById("modalVer");
    const modalEstadoUsuario = document.getElementById("modalEstadoUsuario");
    const abrirModalCrear = document.getElementById("openModal");
    const cerrarModalCrear = document.getElementById("closeModalCrear");
    const cerrarModalEditar = document.getElementById("closeModalEditar");
    const cerrarModalVer = document.getElementById("closeModalVer");
    const btnEstadoUsuarioConfirmar = document.getElementById("btnEstadoUsuarioConfirmar");
    const btnEstadoUsuarioCancelar = document.getElementById("btnEstadoUsuarioCancelar");
    const dataFormCrear = document.getElementById("dataFormCrear");
    const dataFormEditar = document.getElementById("dataFormEditar");
    const dataTable = document.getElementById("dataTable");
    const modalMensaje = document.getElementById("modalMensaje");
    const mensajeTexto = document.getElementById("mensajeTexto");
    const mensajeBox = document.getElementById("mensajeBox");
    const paginador = document.getElementById("usuariosPaginador");

    let currentIdToEstado = null;
    let usuarioActualEditar = null;
    let estadoUsuarioActual = "Activo";
    let usuariosData = [];
    let paginaActual = 1;
    let usuariosPorPagina = 8;
    let filtroBusqueda = filtro;

    // Evento para abrir el modal de creación de usuario
    if (abrirModalCrear) {
        abrirModalCrear.addEventListener("click", async () => {
            modalCrear.classList.remove("hidden");
            dataFormCrear.reset();
            document.getElementById("id_usuarioCrear").value = "";
            await cargarTiposDocumentoEnSelect("tipo_documentoCrear");
            await cargarRolesEnSelect("rolCrear");
            if (typeof cargarDepartamentosMunicipios === "function") {
                cargarDepartamentosMunicipios("departamentoCrear", "municipioCrear");
            }
            const departamentoSelect = document.getElementById("departamentoCrear");
            if (departamentoSelect) {
                departamentoSelect.onchange = function () {
                    cargarDepartamentosMunicipios("departamentoCrear", "municipioCrear", this.value);
                };
            }
        });
    }
    // Eventos para cerrar modales
    if (cerrarModalCrear) cerrarModalCrear.addEventListener("click", () => modalCrear.classList.add("hidden"));
    if (cerrarModalEditar) cerrarModalEditar.addEventListener("click", () => modalEditar.classList.add("hidden"));
    if (cerrarModalVer) cerrarModalVer.addEventListener("click", () => modalVer.classList.add("hidden"));
    if (btnEstadoUsuarioCancelar) btnEstadoUsuarioCancelar.addEventListener("click", () => {
        modalEstadoUsuario.classList.add("hidden");
        currentIdToEstado = null;
    });

    // Eventos de envío de formularios (crear/editar usuario)
    if (dataFormCrear) dataFormCrear.addEventListener("submit", enviarDatosCrear);
    if (dataFormEditar) dataFormEditar.addEventListener("submit", enviarDatosEditar);

    // Evento para confirmar cambio de estado de usuario (activo/inactivo)
    if (btnEstadoUsuarioConfirmar) {
        btnEstadoUsuarioConfirmar.addEventListener("click", async () => {
            if (currentIdToEstado) {
                try {
                    const usuario = await fetchUsuarioById(currentIdToEstado);
                    const nuevoEstado = usuario.estado === "Activo" ? "Inactivo" : "Activo";
                    const formData = new URLSearchParams();
                    formData.append("action", "toggle_estado");
                    formData.append("id_usuario", currentIdToEstado);
                    formData.append("estado", nuevoEstado);

                    const response = await fetch("/tk/server/routes/api.php?module=usuarios&action=toggle_estado", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: formData.toString(),
                    });
                    const data = await response.json();
                    mostrarMensaje(data.success ? "exito" : "error", data.message);
                    if (data.success) fetchUsuarios();
                } catch (error) {
                    mostrarMensaje("error", "Error al cambiar el estado del usuario. Inténtalo nuevamente.");
                    console.error("Error al cambiar estado:", error);
                } finally {
                    modalEstadoUsuario.classList.add("hidden");
                    currentIdToEstado = null;
                }
            }
        });
    }

    // Cierra los modales al hacer click fuera de ellos
    window.addEventListener("click", function (event) {
        if (event.target === modalCrear) modalCrear.classList.add("hidden");
        if (event.target === modalEditar) modalEditar.classList.add("hidden");
        if (event.target === modalVer) modalVer.classList.add("hidden");
        if (event.target === modalEstadoUsuario) modalEstadoUsuario.classList.add("hidden");
    });

    // Envío de datos para crear usuario
    function enviarDatosCrear(event) {
        event.preventDefault();
        try {
            const formData = new FormData(dataFormCrear);
            formData.append("action", "add");
            formData.append("departamento", formData.get("departamentoCrear"));
            formData.append("municipio", formData.get("municipioCrear"));
            formData.append("tipo_documento", formData.get("tipo_documentoCrear"));
            formData.append("documento", formData.get("documentoCrear"));
            formData.append("nombre", formData.get("nombreCrear"));
            formData.append("apellido", formData.get("apellidoCrear"));
            formData.append("email", formData.get("emailCrear"));
            formData.append("telefono", formData.get("telefonoCrear"));
            formData.append("id_rol", formData.get("rolCrear"));
            formData.append("password", formData.get("passwordCrear"));
            formData.delete("departamentoCrear");
            formData.delete("municipioCrear");
            formData.delete("tipo_documentoCrear");
            formData.delete("documentoCrear");
            formData.delete("nombreCrear");
            formData.delete("apellidoCrear");
            formData.delete("emailCrear");
            formData.delete("telefonoCrear");
            formData.delete("rolCrear");
            formData.delete("passwordCrear");
            formData.delete("confirmarPasswordCrear");

            // Validación de contraseñas
            if (formData.get("password") !== dataFormCrear.confirmarPasswordCrear.value) {
                mostrarMensaje("error", "Las contraseñas no coinciden.");
                return;
            }

            // Mensaje de éxito para mostrar y guardar en localStorage
            const cambios = [
                `Usuario creado: ${formData.get("nombre")} ${formData.get("apellido")}`,
                `Email: ${formData.get("email")}`,
                `Rol: ${document.getElementById("rolCrear").selectedOptions[0].text}`
            ];
            localStorage.setItem("usuariosMensaje", JSON.stringify({
                tipo: "exito",
                mensaje: `¡Usuario creado exitosamente!\n${cambios.join('\n')}`
            }));

            fetch("/tk/server/routes/api.php?module=usuarios&action=add", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        modalCrear.classList.add("hidden");
                        mostrarMensaje("exito", `¡Usuario creado exitosamente!\n${cambios.join('\n')}`);
                        setTimeout(() => {
                            window.location.reload();
                        }, 2500);
                    } else {
                        mostrarMensaje("error", data.message);
                    }
                })
                .catch((error) => {
                    mostrarMensaje("error", "Error al enviar datos. Inténtalo nuevamente.");
                    console.error("Error al crear usuario:", error);
                });
        } catch (error) {
            mostrarMensaje("error", "Error inesperado al crear usuario.");
            console.error("Error inesperado en crear usuario:", error);
        }
    }

    // Envío de datos para editar usuario
    function enviarDatosEditar(event) {
        event.preventDefault();
        try {
            const tipoDocSelect = document.getElementById("tipo_documentoEditar");
            const documentoInput = document.getElementById("documentoEditar");
            if (tipoDocSelect) tipoDocSelect.setAttribute("disabled", "disabled");
            if (documentoInput) documentoInput.setAttribute("readonly", "readonly");

            const formData = new FormData(dataFormEditar);
            formData.append("action", "update");
            formData.append("id_usuario", formData.get("id_usuarioEditar"));
            formData.append("departamento", formData.get("departamentoEditar"));
            formData.append("municipio", formData.get("municipioEditar"));
            formData.append("tipo_documento", formData.get("tipo_documentoEditar"));
            formData.append("documento", formData.get("documentoEditar"));
            formData.append("nombre", formData.get("nombreEditar"));
            formData.append("apellido", formData.get("apellidoEditar"));
            formData.append("email", formData.get("emailEditar"));
            formData.append("telefono", formData.get("telefonoEditar"));
            formData.append("id_rol", formData.get("rolEditar"));

            // Foto de perfil (si se actualiza)
            const fotoInput = document.getElementById("fotoEditar");
            if (fotoInput && fotoInput.files && fotoInput.files[0]) {
                formData.append("foto", fotoInput.files[0]);
            } else if (usuarioActualEditar && usuarioActualEditar.foto) {
                formData.append("foto_actual", usuarioActualEditar.foto);
            }

            formData.delete("id_usuarioEditar");
            formData.delete("departamentoEditar");
            formData.delete("municipioEditar");
            formData.delete("tipo_documentoEditar");
            formData.delete("documentoEditar");
            formData.delete("nombreEditar");
            formData.delete("apellidoEditar");
            formData.delete("emailEditar");
            formData.delete("telefonoEditar");
            formData.delete("rolEditar");

            // Detecta cambios para mostrar en el mensaje
            const cambios = [];
            if (usuarioActualEditar.nombre !== dataFormEditar.nombreEditar.value) cambios.push("Nombre");
            if (usuarioActualEditar.apellido !== dataFormEditar.apellidoEditar.value) cambios.push("Apellido");
            if (usuarioActualEditar.email !== dataFormEditar.emailEditar.value) cambios.push("Email");
            if ((usuarioActualEditar.telefono || "") !== dataFormEditar.telefonoEditar.value) cambios.push("Teléfono");
            if ((usuarioActualEditar.departamento || "") !== dataFormEditar.departamentoEditar.value) cambios.push("Departamento");
            if ((usuarioActualEditar.municipio || "") !== dataFormEditar.municipioEditar.value) cambios.push("Municipio");
            if (usuarioActualEditar.id_rol != dataFormEditar.rolEditar.value) cambios.push("Rol");
            if (fotoInput && fotoInput.files && fotoInput.files[0]) cambios.push("Foto de perfil");

            let mensaje = "";
            if (cambios.length) {
                mensaje = `<div class="font-bold mb-2 text-color5 text-lg">DATOS EDITADOS EXITOSAMENTE</div>
                  <ul class="pl-0">
                    ${cambios.map(campo => `
                      <li class="list-none flex items-center mb-1">
                        <span class="text-color5 text-lg mr-2"><i class="fas fa-check-circle"></i></span>
                        <span class="text-color4">${campo}</span>
                      </li>
                    `).join('')}
                  </ul>`;
            } else {
                mensaje = `<span class="text-color4">No hubo modificaciones.</span>`;
            }

            localStorage.setItem("usuariosMensaje", JSON.stringify({
                tipo: "exito",
                mensaje: mensaje
            }));

            fetch("/tk/server/routes/api.php?module=usuarios&action=update", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        modalEditar.classList.add("hidden");
                        if (data.foto) {
                            const img = document.querySelector(`img[data-user-id="${formData.get("id_usuario")}"]`);
                            if (img) {
                                img.src = "/tk/src/" + data.foto + "?t=" + new Date().getTime();
                            }
                        }
                        mostrarMensaje("exito", mensaje);
                        setTimeout(() => {
                            window.location.reload();
                        }, 2500);
                    } else {
                        mostrarMensaje("error", data.message);
                    }
                })
                .catch((error) => {
                    mostrarMensaje("error", "Error al enviar datos. Inténtalo nuevamente.");
                    console.error("Error al editar usuario:", error);
                });
        } catch (error) {
            mostrarMensaje("error", "Error inesperado al editar usuario.");
            console.error("Error inesperado en editar usuario:", error);
        }
    }

    // Renderiza la lista de usuarios en tarjetas o tabla según la vista seleccionada
    function renderUsuarios() {
        dataTable.innerHTML = "";
        let vistaActual = localStorage.getItem('usuariosVista') || 'tarjetas';
        let tarjetasPorPagina = 8;
        let tablaPorPagina = 10;
        let usuariosFiltrados = usuariosData;
        // Aplica filtro de búsqueda
        if (filtroBusqueda && filtroBusqueda.length > 0) {
            usuariosFiltrados = usuariosData.filter(usuario =>
                (usuario.nombre && usuario.nombre.toLowerCase().includes(filtroBusqueda)) ||
                (usuario.apellido && usuario.apellido.toLowerCase().includes(filtroBusqueda)) ||
                (usuario.email && usuario.email.toLowerCase().includes(filtroBusqueda))
            );
        }

        if (vistaActual === 'tarjetas') {
            usuariosPorPagina = tarjetasPorPagina;
        } else {
            usuariosPorPagina = tablaPorPagina;
        }

        const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / usuariosPorPagina));
        if (paginaActual > totalPaginas) paginaActual = 1;

        // Vista tarjetas
        if (vistaActual === 'tarjetas') {
            dataTable.className = `grid grid-cols-1 sm:grid-cols-4 gap-4`;
            const inicio = (paginaActual - 1) * usuariosPorPagina;
            const fin = inicio + usuariosPorPagina;
            const usuariosMostrar = usuariosFiltrados.slice(inicio, fin);

            usuariosMostrar.forEach((usuario) => {
                const isActivo = usuario.estado === "Activo";
                const btnColor = isActivo ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
                const btnIcon = isActivo
                    ? '<i class="fas fa-user-check"></i>'
                    : '<i class="fas fa-user-times"></i>';
                const btnTitle = isActivo ? "Inhabilitar" : "Habilitar";

                const card = document.createElement("div");
                card.className = `bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex flex-col items-center text-xs`;
                card.innerHTML = `
                    <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-color5 mb-2">
                        <img src="/tk/src/${usuario.foto || 'assets/images/perfiles/default.png'}" alt="Foto de perfil" class="object-cover w-full h-full" data-user-id="${usuario.id_usuario}">
                    </div>
                    <div class="text-sm font-bold text-color4 text-center">${usuario.nombre} ${usuario.apellido}</div>
                    <div class="text-xs text-color6 text-center">${usuario.rol_nombre || "Usuario"}</div>
                    <div class="text-xs text-color3 text-center">${usuario.email}</div>
                    <div class="mt-1 text-xs text-color3 text-center">${usuario.departamento}, ${usuario.municipio}</div>
                    <div class="text-xs text-color3 text-center">${usuario.telefono || ""}</div>
                    <div class="flex justify-center mt-2 space-x-1">
                        <button class="flex bg-color5 text-white p-2 rounded-lg hover:bg-color6 transition duration-300" onclick="viewUsuario(${usuario.id_usuario}, ${usuario.id_rol})" title="Ver">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="flex bg-color6 text-white p-2 rounded-lg hover:bg-color6 transition duration-300" onclick="editUsuario(${usuario.id_usuario})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="flex ${btnColor} text-white p-2 rounded-lg transition duration-300 items-center" onclick="confirmEstadoUsuario(${usuario.id_usuario})" title="${btnTitle}">
                            ${btnIcon}
                        </button>
                    </div>
                `;
                dataTable.appendChild(card);
            });
        }
        // Vista tabla
        else if (vistaActual === 'tabla') {
            dataTable.className = "overflow-x-auto";
            const inicio = (paginaActual - 1) * usuariosPorPagina;
            const fin = inicio + usuariosPorPagina;
            const usuariosMostrar = usuariosFiltrados.slice(inicio, fin);

            let tabla = document.createElement("table");
            tabla.className = "min-w-full bg-white border border-gray-200 rounded-lg shadow-sm text-xs sm:text-xs";
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th class="p-2 border-b border-r text-center">Nombre</th>
                        <th class="p-2 border-b border-r text-center">Email</th>
                        <th class="p-2 border-b border-r text-center">Departamento</th>
                        <th class="p-2 border-b border-r text-center">Municipio</th>
                        <th class="p-2 border-b border-r text-center">Teléfono</th>
                        <th class="p-2 border-b border-r text-center">Rol</th>
                        <th class="p-2 border-b border-r text-center">Estado</th>
                        <th class="p-2 border-b text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${usuariosMostrar.map(usuario => {
                const isActivo = usuario.estado === "Activo";
                const btnColor = isActivo ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
                const btnIcon = isActivo
                    ? '<i class="fas fa-user-check"></i>'
                    : '<i class="fas fa-user-times"></i>';
                const btnTitle = isActivo ? "Inhabilitar" : "Habilitar";
                return `
                            <tr>
                                <td class="p-2 border-b border-r text-center">${usuario.nombre} ${usuario.apellido}</td>
                                <td class="p-2 border-b border-r text-center">${usuario.email}</td>
                                <td class="p-2 border-b border-r text-center">${usuario.departamento}</td>
                                <td class="p-2 border-b border-r text-center">${usuario.municipio}</td>
                                <td class="p-2 border-b border-r text-center">${usuario.telefono || ""}</td>
                                <td class="p-2 border-b border-r text-center">${usuario.rol_nombre || "Usuario"}</td>
                                <td class="p-2 border-b border-r text-center">${usuario.estado || "Activo"}</td>
                                <td class="p-2 border-b text-center">
                                    <button class="bg-color5 text-white p-1 rounded-lg mr-1" onclick="viewUsuario(${usuario.id_usuario}, ${usuario.id_rol})" title="Ver"><i class="fas fa-eye"></i></button>
                                    <button class="bg-color6 text-white p-1 rounded-lg mr-1" onclick="editUsuario(${usuario.id_usuario})" title="Editar"><i class="fas fa-edit"></i></button>
                                    <button class="${btnColor} text-white p-1 rounded-lg items-center" onclick="confirmEstadoUsuario(${usuario.id_usuario})" title="${btnTitle}">
                                        ${btnIcon}
                                    </button>
                                </td>
                            </tr>
                        `;
            }).join('')}
                </tbody>
            `;
            dataTable.appendChild(tabla);
        }
        renderPaginador(usuariosFiltrados.length);
    }

    // Renderiza el paginador para la lista de usuarios
    function renderPaginador(totalUsuarios) {
        if (!paginador) return;
        paginador.innerHTML = "";
        const totalPaginas = Math.max(1, Math.ceil(totalUsuarios / usuariosPorPagina));
        paginador.style.display = "flex";

        let html = `<nav class="flex justify-center items-center gap-1 m-1">`;
        html += `<button class="px-2 py-1 rounded bg-color5 text-white text-xs font-semibold hover:bg-color6 transition ${paginaActual === 1 ? "opacity-50 cursor-not-allowed" : ""}" ${paginaActual === 1 ? "disabled" : ""} id="btnPagAnterior">Anterior</button>`;
        for (let i = 1; i <= totalPaginas; i++) {
            html += `<button class="px-2 py-1 rounded ${i === paginaActual ? "bg-color6 text-white" : "bg-white text-color5 border border-color5"} text-xs font-semibold hover:bg-color5 hover:text-white transition" data-pagina="${i}">${i}</button>`;
        }
        html += `<button class="px-2 py-1 rounded bg-color5 text-white text-xs font-semibold hover:bg-color6 transition ${paginaActual === totalPaginas ? "opacity-50 cursor-not-allowed" : ""}" ${paginaActual === totalPaginas ? "disabled" : ""} id="btnPagSiguiente">Siguiente</button>`;
        html += `</nav>`;
        paginador.innerHTML = html;

        document.getElementById("btnPagAnterior")?.addEventListener("click", () => {
            if (paginaActual > 1) {
                paginaActual--;
                renderUsuarios();
            }
        });
        document.getElementById("btnPagSiguiente")?.addEventListener("click", () => {
            if (paginaActual < totalPaginas) {
                paginaActual++;
                renderUsuarios();
            }
        });
        paginador.querySelectorAll("button[data-pagina]").forEach(btn => {
            btn.addEventListener("click", () => {
                paginaActual = parseInt(btn.getAttribute("data-pagina"));
                renderUsuarios();
            });
        });
    }

    // Carga los usuarios desde el servidor y los muestra
    function fetchUsuarios() {
        apiFetchUsuarios()
            .then((data) => {
                usuariosData = data;
                paginaActual = 1;
                renderUsuarios();

                // Muestra mensaje guardado en localStorage (por ejemplo, tras crear/editar usuario)
                const mensajeGuardado = localStorage.getItem("usuariosMensaje");
                if (mensajeGuardado) {
                    const obj = JSON.parse(mensajeGuardado);
                    mostrarMensaje(obj.tipo, obj.mensaje);
                    localStorage.removeItem("usuariosMensaje");
                }
            })
            .catch((error) => {
                mostrarMensaje("error", "Error al cargar usuarios. Inténtalo nuevamente.");
                console.error("Error al cargar usuarios:", error);
            });
    }

    // Función global para editar usuario (abre modal y carga datos)
    window.editUsuario = async function (id) {
        try {
            const usuario = await fetchUsuarioById(id);
            usuarioActualEditar = usuario;
            if (typeof cargarDepartamentosMunicipios === "function") {
                cargarDepartamentosMunicipios(
                    "departamentoEditar",
                    "municipioEditar",
                    usuario.departamento
                );
                setTimeout(() => {
                    document.getElementById("departamentoEditar").value = usuario.departamento;
                    cargarDepartamentosMunicipios(
                        "departamentoEditar",
                        "municipioEditar",
                        usuario.departamento
                    );
                    setTimeout(() => {
                        document.getElementById("municipioEditar").value = usuario.municipio;
                    }, 200);
                }, 200);
            }
            document.getElementById("id_usuarioEditar").value = usuario.id_usuario;
            document.getElementById("nombreEditar").value = usuario.nombre;
            document.getElementById("apellidoEditar").value = usuario.apellido;
            document.getElementById("emailEditar").value = usuario.email;
            document.getElementById("telefonoEditar").value = usuario.telefono || "";

            await cargarRolesEnSelect("rolEditar", usuario.id_rol);

            if (document.getElementById("fotoEditar")) {
                document.getElementById("fotoEditar").value = "";
            }
            modalEditar.classList.remove("hidden");
        } catch (error) {
            mostrarMensaje("error", "Error al cargar datos del usuario para editar.");
            console.error("Error al cargar usuario para editar:", error);
        }
    };

    // Función global para confirmar cambio de estado de usuario (abre modal)
    window.confirmEstadoUsuario = async function (id) {
        try {
            currentIdToEstado = id;
            const usuario = await fetchUsuarioById(id);
            estadoUsuarioActual = usuario.estado;
            const isActivo = usuario.estado === "Activo";
            const texto = isActivo
                ? "¿Seguro que deseas inhabilitar este usuario?"
                : "¿Seguro que deseas habilitar este usuario?";
            const btnText = isActivo ? "Inhabilitar" : "Habilitar";
            const btnIcon = isActivo ? "fa-user-times" : "fa-user-check";
            const btnColor = isActivo ? "bg-red-600 hover:bg-red-700 border-red-600" : "bg-green-600 hover:bg-green-700 border-green-600";
            document.getElementById("modalEstadoUsuarioTexto").textContent = texto;
            document.getElementById("modalEstadoUsuarioConfirmarText").textContent = btnText;
            document.getElementById("modalEstadoUsuarioConfirmarIcon").className = `fas ${btnIcon}`;
            document.getElementById("btnEstadoUsuarioConfirmar").className =
                `flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-semibold text-base transition duration-200 shadow text-white border-2 ${btnColor}`;
            document.getElementById("btnEstadoUsuarioCancelar").className =
                "flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-semibold text-base transition duration-200 shadow bg-color1 hover:bg-color2 text-color4 border-2 border-color4";
            document.getElementById("modalEstadoUsuarioIcon").innerHTML = isActivo
                ? '<i class="fas fa-user-times text-red-600"></i>'
                : '<i class="fas fa-user-check text-green-600"></i>';
            modalEstadoUsuario.classList.remove("hidden");
        } catch (error) {
            mostrarMensaje("error", "Error al cargar datos del usuario para cambiar estado.");
            console.error("Error al cargar usuario para estado:", error);
        }
    };

    // Función global para ver usuario (abre modal y muestra datos)
    window.viewUsuario = async function (id, id_rol) {
        try {
            const usuario = await fetchUsuarioById(id);
            document.getElementById("verFoto").src = "/tk/src/" + (usuario.foto || "assets/images/perfiles/default.png");
            document.getElementById("verNombreCompleto").textContent = `${usuario.nombre} ${usuario.apellido}`;
            document.getElementById("verEmail").textContent = usuario.email;
            document.getElementById("verRol").textContent = usuario.rol_nombre || "Usuario";
            document.getElementById("verDocumento").textContent = usuario.documento || "";
            document.getElementById("verTelefono").textContent = usuario.telefono || "";
            document.getElementById("verDepartamento").textContent = usuario.departamento || "";
            document.getElementById("verMunicipio").textContent = usuario.municipio || "";
            modalVer.classList.remove("hidden");

            if (document.getElementById("closeModalVer")) {
                document.getElementById("closeModalVer").onclick = () => modalVer.classList.add("hidden");
            }
            if (document.getElementById("closeModalVerBtn")) {
                document.getElementById("closeModalVerBtn").onclick = () => modalVer.classList.add("hidden");
            }
        } catch (error) {
            mostrarMensaje("error", "Error al cargar datos del usuario para ver.");
            console.error("Error al cargar usuario para ver:", error);
        }
    };

    // Muestra mensajes emergentes en pantalla (éxito/error)
    function mostrarMensaje(tipo, mensaje) {
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
        modalMensaje.classList.remove("hidden");
        setTimeout(() => {
            modalMensaje.classList.add("hidden");
        }, 2200);
    }

    // Buscador de usuarios (filtra en tiempo real)
    document.getElementById('busquedaUsuarios')?.addEventListener('input', function () {
        filtroBusqueda = this.value.trim().toLowerCase();
        renderUsuarios();
    });

    // Botón para cambiar a vista tarjetas
    document.getElementById('btnVistaTarjetas')?.addEventListener('click', function () {
        localStorage.setItem('usuariosVista', 'tarjetas');
        renderUsuarios();
    });

    // Botón para cambiar a vista tabla
    document.getElementById('btnVistaTabla')?.addEventListener('click', function () {
        localStorage.setItem('usuariosVista', 'tabla');
        renderUsuarios();
    });

    // Carga inicial de usuarios
    fetchUsuarios();
}

// Exporta la función para inicializar el módulo desde otros archivos
window.iniciarModuloUsuarios = iniciarModuloUsuarios;
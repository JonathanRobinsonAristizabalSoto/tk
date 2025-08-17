document.addEventListener("DOMContentLoaded", function () {
    const btnPerfil = document.getElementById("btnMiPerfil");
    const modalPerfil = document.getElementById("modalPerfil");
    const formPerfil = document.getElementById("formPerfilUsuario");

    // Inputs y spans
    const perfilNombreCompleto = document.getElementById("perfilNombreCompleto");
    const inputPerfilNombreCompleto = document.getElementById("inputPerfilNombreCompleto");
    const perfilEmail = document.getElementById("perfilEmail");
    const inputPerfilEmail = document.getElementById("inputPerfilEmail");
    const perfilTelefono = document.getElementById("perfilTelefono");
    const inputPerfilTelefono = document.getElementById("inputPerfilTelefono");
    const perfilDepartamento = document.getElementById("perfilDepartamento");
    const inputPerfilDepartamento = document.getElementById("inputPerfilDepartamento"); // select
    const perfilMunicipio = document.getElementById("perfilMunicipio");
    const inputPerfilMunicipio = document.getElementById("inputPerfilMunicipio"); // select
    const perfilFoto = document.getElementById("perfilFoto");
    const inputPerfilFoto = document.getElementById("inputPerfilFoto");
    const perfilRol = document.getElementById("perfilRol");
    const perfilDocumento = document.getElementById("perfilDocumento");

    // Título y descripción para edición
    const tituloEdicion = document.getElementById("tituloEditarPerfil");
    const descripcionEdicion = document.getElementById("descripcionEditarPerfil");

    // Botones
    const btnEditarPerfil = document.getElementById("btnEditarPerfil");
    const btnGuardarPerfil = document.getElementById("btnGuardarPerfil");
    const btnCancelarEdicionPerfil = document.getElementById("btnCancelarEdicionPerfil");
    const btnCerrarPerfil = document.getElementById("closeModalPerfil");
    const btnCerrarPerfil2 = document.getElementById("closeModalPerfilBtn");

    // Modal de mensaje (éxito/error)
    const modalMensaje = document.getElementById("modalMensaje");
    const mensajeTexto = document.getElementById("mensajeTexto");
    const mensajeBox = document.getElementById("mensajeBox");

    let usuarioActual = null;

    // Mostrar datos en modo solo lectura
    function mostrarDatos(usuario) {
        const nombre = usuario.nombre || "";
        const apellido = usuario.apellido || "";
        perfilNombreCompleto.textContent = (nombre + " " + apellido).trim();
        perfilEmail.textContent = usuario.email || "";
        perfilRol.textContent = usuario.rol_nombre || "Usuario";
        perfilDocumento.textContent = usuario.documento || "";
        perfilTelefono.textContent = usuario.telefono || "";
        perfilDepartamento.textContent = usuario.departamento || "";
        perfilMunicipio.textContent = usuario.municipio || "";
        perfilFoto.src = usuario.foto && usuario.foto.startsWith("/") ? usuario.foto : "/tk/client/src/" + (usuario.foto || "assets/images/perfiles/default.png");

        // Oculta inputs, muestra spans
        inputPerfilNombreCompleto.classList.add("hidden");
        perfilNombreCompleto.classList.remove("hidden");
        inputPerfilEmail.classList.add("hidden");
        perfilEmail.classList.remove("hidden");
        inputPerfilTelefono.classList.add("hidden");
        perfilTelefono.classList.remove("hidden");
        inputPerfilDepartamento.classList.add("hidden");
        perfilDepartamento.classList.remove("hidden");
        inputPerfilMunicipio.classList.add("hidden");
        perfilMunicipio.classList.remove("hidden");
        inputPerfilFoto.classList.add("hidden");

        // Mostrar la foto en modo solo lectura
        perfilFoto.classList.remove("hidden");

        // Oculta título y descripción de edición
        if (tituloEdicion) tituloEdicion.classList.add("hidden");
        if (descripcionEdicion) descripcionEdicion.classList.add("hidden");

        // Botones
        btnEditarPerfil.classList.remove("hidden");
        btnGuardarPerfil.classList.add("hidden");
        btnCancelarEdicionPerfil.classList.add("hidden");
    }

    // Mostrar datos en modo edición
    function habilitarEdicion(usuario) {
        // Inputs con valores actuales
        inputPerfilNombreCompleto.value = (usuario.nombre + " " + (usuario.apellido || "")).trim();
        inputPerfilEmail.value = usuario.email || "";
        inputPerfilTelefono.value = usuario.telefono || "";

        // Mostrar selects y cargar departamentos/municipios dinámicamente
        inputPerfilDepartamento.classList.remove("hidden");
        perfilDepartamento.classList.add("hidden");
        inputPerfilMunicipio.classList.remove("hidden");
        perfilMunicipio.classList.add("hidden");

        // Cargar departamentos y municipios usando el JS dinámico
        if (typeof cargarDepartamentosMunicipios === "function") {
            cargarDepartamentosMunicipios("inputPerfilDepartamento", "inputPerfilMunicipio", usuario.departamento, usuario.municipio);
        }

        // Mostrar inputs, ocultar spans
        inputPerfilNombreCompleto.classList.remove("hidden");
        perfilNombreCompleto.classList.add("hidden");
        inputPerfilEmail.classList.remove("hidden");
        perfilEmail.classList.add("hidden");
        inputPerfilTelefono.classList.remove("hidden");
        perfilTelefono.classList.add("hidden");
        inputPerfilFoto.classList.remove("hidden");

        // Ocultar la foto en modo edición
        perfilFoto.classList.add("hidden");

        // Mostrar título y descripción de edición
        if (tituloEdicion) tituloEdicion.classList.remove("hidden");
        if (descripcionEdicion) descripcionEdicion.classList.remove("hidden");

        // Botones
        btnEditarPerfil.classList.add("hidden");
        btnGuardarPerfil.classList.remove("hidden");
        btnCancelarEdicionPerfil.classList.remove("hidden");
    }

    // Mostrar modal de mensaje (éxito o error)
    function mostrarMensaje(tipo, mensaje) {
        if (!modalMensaje || !mensajeTexto || !mensajeBox) {
            alert(mensaje); // fallback
            return;
        }
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

    // Cargar datos al abrir el modal
    if (btnPerfil) {
        btnPerfil.addEventListener("click", function (e) {
            e.preventDefault();
            fetch("/tk/server/controller/DashboardController.php", {
                credentials: "include",
                headers: {
                    "Accept": "application/json"
                }
            })
                .then(res => res.json())
                .then(usuario => {
                    usuarioActual = usuario;
                    mostrarDatos(usuario);
                    modalPerfil.classList.remove("hidden");
                });
        });
    }

    // Botón Editar
    if (btnEditarPerfil) {
        btnEditarPerfil.onclick = function () {
            if (usuarioActual) habilitarEdicion(usuarioActual);
        };
    }

    // Botón Cancelar
    if (btnCancelarEdicionPerfil) {
        btnCancelarEdicionPerfil.onclick = function () {
            if (usuarioActual) mostrarDatos(usuarioActual);
        };
    }

    // Botón Guardar (envía datos al backend)
    if (formPerfil) {
        formPerfil.onsubmit = function (e) {
            e.preventDefault();
            const formData = new FormData();
            // Separar nombre y apellido si es necesario
            let nombreCompleto = inputPerfilNombreCompleto.value.trim().split(" ");
            let nombre = nombreCompleto.shift() || "";
            let apellido = nombreCompleto.join(" ") || "";

            formData.append("action", "update_perfil");
            formData.append("nombre", nombre);
            formData.append("apellido", apellido);
            formData.append("email", inputPerfilEmail.value.trim());
            formData.append("telefono", inputPerfilTelefono.value.trim());
            // Usar los valores seleccionados en los selects
            formData.append("departamento", inputPerfilDepartamento.value);
            formData.append("municipio", inputPerfilMunicipio.value);
            formData.append("foto_actual", usuarioActual.foto || "");
            if (inputPerfilFoto.files.length > 0) {
                formData.append("foto", inputPerfilFoto.files[0]);
            }
            formData.append("documento", usuarioActual.documento);

            fetch("/tk/server/controller/UsuariosController.php", {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(resp => {
                    if (resp.success) {
                        // Recargar datos del usuario
                        fetch("/tk/server/controller/DashboardController.php", {
                            credentials: "include",
                            headers: {
                                "Accept": "application/json"
                            }
                        })
                            .then(res => res.json())
                            .then(usuario => {
                                usuarioActual = usuario;
                                mostrarDatos(usuario);
                                mostrarMensaje("exito", `<span class="font-bold text-color4">¡Perfil actualizado exitosamente!</span>`);
                            });
                    } else {
                        mostrarMensaje("error", resp.message || "Error al actualizar perfil.");
                    }
                })
                .catch(() => mostrarMensaje("error", "Error de conexión al actualizar perfil."));
        };
    }

    // Cerrar modal desde los botones de cierre
    if (btnCerrarPerfil) {
        btnCerrarPerfil.onclick = () => modalPerfil.classList.add("hidden");
    }
    if (btnCerrarPerfil2) {
        btnCerrarPerfil2.onclick = () => modalPerfil.classList.add("hidden");
    }
});
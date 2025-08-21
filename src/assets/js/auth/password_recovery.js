function mostrarModalVerificarCodigo() {
    let modal = document.getElementById("modal-verificar-codigo-recuperacion");
    if (!modal) {
        $("#modal-verificar-codigo-recuperacion-placeholder").load(
            "/tk/src/pages/modals/modal-verificar-codigo-recuperacion.html",
            function () {
                modal = document.getElementById("modal-verificar-codigo-recuperacion");
                if (modal) {
                    modal.classList.remove("hidden");
                    asignarCerrarModal();
                }
            }
        );
    } else {
        modal.classList.remove("hidden");
    }
}

function ocultarModalVerificarCodigo() {
    const modal = document.getElementById("modal-verificar-codigo-recuperacion");
    if (modal) modal.classList.add("hidden");
}

function mostrarModalNuevaContraseña() {
    let modal = document.getElementById("modal-nueva-contraseña");
    if (!modal) {
        $("#modal-verificar-codigo-recuperacion-placeholder").after('<div id="modal-nueva-contraseña-placeholder"></div>');
        $("#modal-nueva-contraseña-placeholder").load(
            "/tk/src/pages/modals/modal-nueva-contraseña.html",
            function () {
                modal = document.getElementById("modal-nueva-contraseña");
                if (modal) {
                    modal.classList.remove("hidden");
                    asignarCerrarModalNuevaContraseña();
                }
            }
        );
    } else {
        modal.classList.remove("hidden");
    }
}

function ocultarModalNuevaContraseña() {
    const modal = document.getElementById("modal-nueva-contraseña");
    if (modal) modal.classList.add("hidden");
}

// Modal para mostrar mensajes de éxito o error
function mostrarModalNuevoPassExitoso() {
    let modal = document.getElementById("modal-nuevo-pass-exitoso");
    if (!modal) {
        $("body").append('<div id="modal-nuevo-pass-exitoso-placeholder"></div>');
        $("#modal-nuevo-pass-exitoso-placeholder").load(
            "/tk/src/pages/modals/modal-nuevo-pass-exitoso.html",
            function () {
                modal = document.getElementById("modal-nuevo-pass-exitoso");
                if (modal) {
                    modal.classList.remove("hidden");
                    asignarCerrarModalNuevoPassExitoso();
                }
            }
        );
    } else {
        modal.classList.remove("hidden");
    }
}

function ocultarModalNuevoPassExitoso() {
    const modal = document.getElementById("modal-nuevo-pass-exitoso");
    if (modal) modal.classList.add("hidden");
}

function mostrarModalMensaje(texto, tipo = "info") {
    let modal = document.getElementById("modal-mensaje");
    if (!modal) {
        $("body").append('<div id="modal-mensaje-placeholder"></div>');
        $("#modal-mensaje-placeholder").load(
            "/tk/src/pages/modals/modal-mensaje.html",
            function () {
                modal = document.getElementById("modal-mensaje");
                if (modal) {
                    document.getElementById("mensaje-modal-texto").textContent = texto;
                    modal.classList.remove("hidden");
                    asignarCerrarModalMensaje();
                    modal.classList.remove("border-green-500", "border-red-500");
                    if (tipo === "success") modal.classList.add("border-green-500");
                    if (tipo === "error") modal.classList.add("border-red-500");
                }
            }
        );
    } else {
        document.getElementById("mensaje-modal-texto").textContent = texto;
        modal.classList.remove("hidden");
        modal.classList.remove("border-green-500", "border-red-500");
        if (tipo === "success") modal.classList.add("border-green-500");
        if (tipo === "error") modal.classList.add("border-red-500");
    }
}

function ocultarModalMensaje() {
    const modal = document.getElementById("modal-mensaje");
    if (modal) modal.classList.add("hidden");
}

function asignarCerrarModal() {
    const cerrarModalBtn = document.getElementById("cerrar-modal-verificar-codigo");
    if (cerrarModalBtn) cerrarModalBtn.onclick = ocultarModalVerificarCodigo;
}

function asignarCerrarModalNuevaContraseña() {
    const cerrarModalBtn = document.getElementById("cerrar-modal-nueva-contraseña");
    if (cerrarModalBtn) cerrarModalBtn.onclick = ocultarModalNuevaContraseña;
}

function asignarCerrarModalMensaje() {
    const cerrarModalBtn = document.getElementById("cerrar-modal-mensaje");
    if (cerrarModalBtn) cerrarModalBtn.onclick = ocultarModalMensaje;
}

function asignarCerrarModalNuevoPassExitoso() {
    const cerrarModalBtn = document.getElementById("cerrar-modal-nuevo-pass-exitoso");
    if (cerrarModalBtn) {
        cerrarModalBtn.onclick = function () {
            ocultarModalNuevoPassExitoso();
            window.location.href = "./login.html";
        };
    }
}

document.addEventListener("DOMContentLoaded", function () {
    asignarCerrarModal();

    const formRecuperacion = document.getElementById("formRecuperacion");
    if (formRecuperacion) {
        formRecuperacion.addEventListener("submit", async function (e) {
            e.preventDefault();
            const email = document.getElementById("emailRecuperacion").value.trim();
            const errorDiv = document.getElementById("error-recuperacion");
            errorDiv.textContent = "";

            if (!email) {
                errorDiv.textContent = "Ingresa tu correo electrónico.";
                return;
            }

            try {
                const res = await fetch("/tk/server/routes/api.php?module=usuarios&action=sendRecoveryCode", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });

                if (!res.ok) {
                    errorDiv.textContent = "Error de conexión con el servidor.";
                    return;
                }

                const data = await res.json();

                if (data.success) {
                    mostrarModalVerificarCodigo();
                } else {
                    errorDiv.textContent = data.message || "No se pudo enviar el código.";
                }
            } catch {
                errorDiv.textContent = "Error de conexión.";
            }
        });
    }

    // Verifica el código ingresado en el modal
    $(document).on("submit", "#codigoRecuperacionForm", async function (e) {
        e.preventDefault();
        const codigo = document.getElementById("codigo").value.trim();
        const email = document.getElementById("emailRecuperacion").value.trim();
        const errorDiv = document.getElementById("error-codigo-recuperacion");
        errorDiv.textContent = "";

        if (!codigo || !email) {
            errorDiv.textContent = "Ingresa el código de verificación.";
            return;
        }

        try {
            const res = await fetch("/tk/server/routes/api.php?module=usuarios&action=verifyRecoveryCode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, codigo })
            });

            if (!res.ok) {
                errorDiv.textContent = "Error de conexión con el servidor.";
                return;
            }

            const data = await res.json();

            if (data.success) {
                ocultarModalVerificarCodigo();
                mostrarModalNuevaContraseña();
            } else {
                errorDiv.textContent = data.message || "Código incorrecto.";
                mostrarModalMensaje(errorDiv.textContent, "error");
            }
        } catch {
            errorDiv.textContent = "Error de conexión.";
            mostrarModalMensaje(errorDiv.textContent, "error");
        }
    });

    // Evento para cambiar la contraseña
    $(document).on("submit", "#formNuevaContraseña", async function (e) {
        e.preventDefault();
        const nuevaPassword = document.getElementById("nuevaPassword").value.trim();
        const confirmarPassword = document.getElementById("confirmarPassword").value.trim();
        const email = document.getElementById("emailRecuperacion").value.trim();
        const codigo = document.getElementById("codigo").value.trim();
        const errorDiv = document.getElementById("error-nueva-contraseña");
        errorDiv.textContent = "";

        if (!nuevaPassword || !confirmarPassword) {
            errorDiv.textContent = "Completa ambos campos.";
            mostrarModalMensaje(errorDiv.textContent, "error");
            return;
        }
        if (nuevaPassword !== confirmarPassword) {
            errorDiv.textContent = "Las contraseñas no coinciden.";
            mostrarModalMensaje(errorDiv.textContent, "error");
            return;
        }
        if (nuevaPassword.length < 6) {
            errorDiv.textContent = "La contraseña debe tener al menos 6 caracteres.";
            mostrarModalMensaje(errorDiv.textContent, "error");
            return;
        }

        try {
            const res = await fetch("/tk/server/routes/api.php?module=usuarios&action=changePassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, codigo, password: nuevaPassword })
            });

            if (!res.ok) {
                errorDiv.textContent = "Error de conexión con el servidor.";
                mostrarModalMensaje(errorDiv.textContent, "error");
                return;
            }

            const data = await res.json();

            if (data.success) {
                ocultarModalNuevaContraseña();
                mostrarModalNuevoPassExitoso();
            } else {
                errorDiv.textContent = data.message || "No se pudo cambiar la contraseña.";
                mostrarModalMensaje(errorDiv.textContent, "error");
            }
        } catch {
            errorDiv.textContent = "Error de conexión.";
            mostrarModalMensaje(errorDiv.textContent, "error");
        }
    });
});
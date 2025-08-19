import { getCatalogosUsuario } from "../api/api.js";

async function cargarModalesLogin() {
    // Cargar modal de error
    const errorRes = await fetch("/tk/src/pages/modals/modal-error-login.html");
    document.getElementById("modal-error-login-placeholder").innerHTML = await errorRes.text();

    // Cargar modal de éxito
    const exitoRes = await fetch("/tk/src/pages/modals/modal-exito-login.html");
    document.getElementById("modal-exito-login-placeholder").innerHTML = await exitoRes.text();

    // Cerrar modal de error
    document.getElementById("cerrar-modal-error-login").onclick = function () {
        document.getElementById("modal-error-login").classList.add("hidden");
    };
}
cargarModalesLogin();

document.addEventListener("DOMContentLoaded", function () {
    const nombresTipoDocumento = {
        CC: "Cédula de Ciudadanía",
        TI: "Tarjeta de Identidad",
        CE: "Cédula de Extranjería",
        PS: "Pasaporte",
        DNI: "DNI",
        NIT: "NIT"
    };

    async function cargarCatalogos() {
        try {
            const data = await getCatalogosUsuario();

            const tipoDocSelect = document.getElementById("typeDocument");
            if (tipoDocSelect && Array.isArray(data.tipos_documento)) {
                tipoDocSelect.innerHTML = "";
                data.tipos_documento.forEach(tipo => {
                    const opt = document.createElement("option");
                    opt.value = tipo;
                    opt.textContent = nombresTipoDocumento[tipo] || tipo;
                    tipoDocSelect.appendChild(opt);
                });
            }

            const rolSelect = document.getElementById("user-type");
            if (rolSelect && Array.isArray(data.roles)) {
                rolSelect.innerHTML = "";
                data.roles.forEach(rol => {
                    const opt = document.createElement("option");
                    opt.value = rol.id_rol;
                    opt.textContent = rol.nombre;
                    rolSelect.appendChild(opt);
                });
            }
        } catch (e) {
            // Si falla, no mostrar nada
        }
    }

    cargarCatalogos();

    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(loginForm);

        try {
            const response = await fetch("/tk/server/routes/api.php?module=login&action=login", {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            const data = await response.json();

            if (data.success) {
                // Mostrar modal de éxito
                document.getElementById("usuario-nombre-login").textContent = data.nombre || "";
                document.getElementById("modal-exito-login").classList.remove("hidden");
                setTimeout(() => {
                    window.location.href = "/tk/src/pages/dashboard.html";
                }, 2000);
            } else {
                // Mostrar modal de error
                document.getElementById("error-login-msg").textContent = data.message;
                document.getElementById("modal-error-login").classList.remove("hidden");
            }
        } catch (error) {
            document.getElementById("error-login-msg").textContent = "Error al iniciar sesión. Inténtalo nuevamente.";
            document.getElementById("modal-error-login").classList.remove("hidden");
        }
    });
});

function onGoogleSignIn(response) {
    console.log("Google Sign-In response:", response);
    // fetch("/tk/server/routes/api.php?module=login&action=login", { ... })
}
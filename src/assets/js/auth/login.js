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
    async function cargarCatalogos() {
        try {
            const data = await getCatalogosUsuario();

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

        const identificador = document.getElementById("identificador").value.trim();
        const password = document.getElementById("password").value.trim();
        const id_rol = document.getElementById("user-type").value;

        const formData = new FormData();
        formData.append("identificador", identificador);
        formData.append("password", password);
        formData.append("user-type", id_rol);

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
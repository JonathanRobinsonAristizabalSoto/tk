import { getCatalogosUsuario } from "../api/api.js";

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

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(loginForm);

        fetch("/tk/server/controller/LoginController.php", {
            method: "POST",
            body: formData,
            credentials: "include"
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    window.location.href = "/tk/src/pages/dashboard.html";
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => {
                alert("Error al iniciar sesión. Inténtalo nuevamente.");
            });
    });
});

function onGoogleSignIn(response) {
    console.log("Google Sign-In response:", response);
    // fetch("/tk/server/controller/LoginController.php", { ... })
}
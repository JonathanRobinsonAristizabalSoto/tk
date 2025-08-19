import { getCatalogosUsuario } from "../api/api.js";

document.addEventListener("DOMContentLoaded", function () {
    // Diccionario para mostrar nombres bonitos de tipo de documento
    const nombresTipoDocumento = {
        CC: "Cédula de Ciudadanía",
        TI: "Tarjeta de Identidad",
        CE: "Cédula de Extranjería",
        PS: "Pasaporte",
        DNI: "DNI",
        NIT: "NIT"
    };

    // Cargar roles y tipos de documento dinámicamente usando el API centralizado
    async function cargarCatalogos() {
        try {
            const data = await getCatalogosUsuario();

            // Tipos de documento
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

            // Roles
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

    // Lógica de login
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

// Función para Google Identity Services
function onGoogleSignIn(response) {
    // Aquí puedes manejar el objeto de respuesta de Google
    console.log("Google Sign-In response:", response);
    // Ejemplo: enviar el token al backend para validación
    // fetch("/tk/server/controller/LoginController.php", { ... })
}
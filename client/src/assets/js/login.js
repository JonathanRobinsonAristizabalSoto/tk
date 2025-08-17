document.addEventListener("DOMContentLoaded", function () {
    // Cargar roles y tipos de documento dinámicamente
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
            const res = await fetch("/tk/server/controller/UsuariosController.php", {
                method: "POST",
                body: new URLSearchParams({ action: "get_catalogos" }),
            });
            const data = await res.json();

            // Tipos de documento
            const tipoDocSelect = document.getElementById("typeDocument");
            if (tipoDocSelect) {
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
            if (rolSelect) {
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
                    window.location.href = "/tk/client/src/pages/dashboard.html";
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => {
                alert("Error al iniciar sesión. Inténtalo nuevamente.");
            });
    });
});
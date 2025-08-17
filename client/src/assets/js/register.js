document.addEventListener("DOMContentLoaded", function () {
  // Mapeo de valores a nombres legibles para tipo de documento
  const nombresTipoDocumento = {
    CC: "Cédula de Ciudadanía",
    TI: "Tarjeta de Identidad",
    CE: "Cédula de Extranjería",
    PS: "Pasaporte",
    DNI: "DNI",
    NIT: "NIT"
  };

  // Cargar roles y tipos de documento dinámicamente
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
      const rolSelect = document.getElementById("tipoUsuario");
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

  // Inicializa los selects de departamento y municipio
  if (typeof cargarDepartamentosMunicipios === "function") {
    cargarDepartamentosMunicipios("departamentoRegistro", "municipioRegistro");
  }

  // Actualiza municipios al cambiar el departamento
  const departamentoSelect = document.getElementById("departamentoRegistro");
  const municipioSelect = document.getElementById("municipioRegistro");
  if (departamentoSelect && municipioSelect) {
    departamentoSelect.addEventListener("change", function () {
      cargarDepartamentosMunicipios("departamentoRegistro", "municipioRegistro", this.value);
    });
  }

  const form = document.getElementById("form-registro");
  const errorDiv = document.getElementById("registro-error");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validación de contraseñas iguales
    const pass = form.querySelector('[name="password"]');
    const pass2 = form.querySelector('[name="confirm-password"]');
    if (pass2 && pass.value !== pass2.value) {
      errorDiv.textContent = "Las contraseñas no coinciden.";
      pass.value = "";
      pass2.value = "";
      pass.focus();
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch("/tk/server/controller/RegisterController.php", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        errorDiv.textContent = "";
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        window.location.href = "./login.html";
      } else {
        errorDiv.textContent = data.message;
      }
    } catch (error) {
      errorDiv.textContent = "Error de conexión con el servidor.";
    }
  });
});
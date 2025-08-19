import { getCatalogosUsuario } from "../api/api.js";

// Helpers para mostrar/ocultar modales
function mostrarModalExito() {
  const modal = document.getElementById("modal-exito-registro");
  if (modal) modal.classList.remove("hidden");
}
function ocultarModalExito() {
  const modal = document.getElementById("modal-exito-registro");
  if (modal) modal.classList.add("hidden");
}
function mostrarModalError(mensaje) {
  const modal = document.getElementById("modal-error-registro");
  const mensajeDiv = document.getElementById("modal-error-mensaje");
  if (modal && mensajeDiv) {
    mensajeDiv.textContent = mensaje;
    modal.classList.remove("hidden");
  }
}
function ocultarModalError() {
  const modal = document.getElementById("modal-error-registro");
  if (modal) modal.classList.add("hidden");
}

// Cargar los modales en los placeholders
async function cargarModales() {
  // Modal de éxito
  const exitoRes = await fetch("/tk/src/pages/modals/modal-exito-registro.html");
  document.getElementById("modal-exito-registro-placeholder").innerHTML = await exitoRes.text();
  // Modal de error
  const errorRes = await fetch("/tk/src/pages/modals/modal-error-registro.html");
  document.getElementById("modal-error-registro-placeholder").innerHTML = await errorRes.text();
}

document.addEventListener("DOMContentLoaded", async function () {
  await cargarModales();

  // Botón cerrar éxito
  const btnCerrarExito = document.getElementById("cerrar-modal-exito-registro");
  if (btnCerrarExito) {
    btnCerrarExito.addEventListener("click", function () {
      ocultarModalExito();
      window.location.href = "./login.html";
    });
  }

  // Botón cerrar error
  const btnCerrarError = document.getElementById("cerrar-modal-error-registro");
  if (btnCerrarError) {
    btnCerrarError.addEventListener("click", ocultarModalError);
  }

  // Cargar selects dinámicos
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
      const rolSelect = document.getElementById("tipoUsuario");
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
      mostrarModalError("Error al cargar catálogos.");
    }
  }
  cargarCatalogos();

  // Departamento y municipio
  if (typeof cargarDepartamentosMunicipios === "function") {
    cargarDepartamentosMunicipios("departamentoRegistro", "municipioRegistro");
  }
  const departamentoSelect = document.getElementById("departamentoRegistro");
  if (departamentoSelect) {
    departamentoSelect.addEventListener("change", function () {
      cargarDepartamentosMunicipios("departamentoRegistro", "municipioRegistro", this.value);
    });
  }

  // Formulario registro
  const form = document.getElementById("form-registro");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validación de contraseñas iguales
    const pass = form.querySelector('[name="password"]');
    const pass2 = form.querySelector('[name="confirm-password"]');
    if (pass2 && pass.value !== pass2.value) {
      mostrarModalError("Las contraseñas no coinciden.");
      pass.value = "";
      pass2.value = "";
      pass.focus();
      return;
    }

    const formData = new FormData(form);

    try {
      // AJUSTE: Enviar a la API central, no al controlador directo
      const response = await fetch("/tk/server/routes/api.php?module=register&action=register", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        mostrarModalExito();
      } else {
        mostrarModalError(data.message || "Error en el registro.");
      }
    } catch (error) {
      mostrarModalError("Error de conexión con el servidor.");
    }
  });
});
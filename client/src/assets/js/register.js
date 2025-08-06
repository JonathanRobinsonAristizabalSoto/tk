document.addEventListener("DOMContentLoaded", function () {
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
      const response = await fetch("/TicketProApp/server/php/server_register.php", {
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
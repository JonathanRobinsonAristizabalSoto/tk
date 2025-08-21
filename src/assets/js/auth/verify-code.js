import { apiPost } from "../api/api.js";

// Selecciona el formulario de verificación
const form = document.getElementById("verify-code-form");
const errorDiv = document.getElementById("error-message");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Obtiene el código ingresado y el usuario pendiente del localStorage
    const code = document.getElementById("code").value.trim();
    const user = localStorage.getItem("pendingUser");

    if (!code || !user) {
      errorDiv.textContent = "Debes ingresar el código de verificación.";
      console.error("Error: Código o usuario no definido.");
      return;
    }

    try {
      // Envía el código y el usuario al backend usando la ruta correcta de la API
      const res = await apiPost({
        module: "usuarios",
        action: "verifyCode",
        user,
        code
      });

      if (res.success) {
        // Redirige al login después de verificar el código
        window.location.href = "./login.html";
      } else {
        errorDiv.textContent = res.message || "Código incorrecto o expirado.";
        console.error("Error de verificación:", res);
      }
    } catch (error) {
      errorDiv.textContent = error.message || "Error al verificar el código.";
      console.error("Error de conexión:", error);
    }
  });
}
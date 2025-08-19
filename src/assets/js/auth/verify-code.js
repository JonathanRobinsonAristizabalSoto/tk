
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
      return;
    }

    try {
      // Envía el código y el usuario al backend
      const res = await apiPost(`${API_BASE}/tk/server/auth/verify-code`, { user, code });

      if (res.token) {
        localStorage.setItem("token", res.token);
        window.location.href = "../dashboard/dashboard.html";
      } else {
        errorDiv.textContent = res.message || "Código incorrecto o expirado.";
      }
    } catch (error) {
      errorDiv.textContent = error.message || "Error al verificar el código.";
    }
  });
}
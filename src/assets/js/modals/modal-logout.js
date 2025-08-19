// Carga el HTML del modal de logout en el placeholder
async function cargarModalLogout() {
    const placeholder = document.getElementById("modal-logout-placeholder");
    if (!placeholder) return;
    try {
        const response = await fetch("/tk/src/pages/modals/modal-logout.html");
        const html = await response.text();
        placeholder.innerHTML = html;
    } catch (error) {
        console.error("No se pudo cargar el modal de logout:", error);
    }
}

// Muestra el modal de logout
function mostrarModalLogout() {
    const modal = document.getElementById("modal-logout");
    if (modal) modal.classList.remove("hidden");
}

// Oculta el modal de logout
function ocultarModalLogout() {
    const modal = document.getElementById("modal-logout");
    if (modal) modal.classList.add("hidden");
}

// Intercepta el submit del formulario de logout para mostrar el modal
function interceptarLogoutForm() {
    const logoutForm = document.getElementById("logoutForm");
    if (logoutForm) {
        logoutForm.addEventListener("submit", function (e) {
            e.preventDefault();
            mostrarModalLogout();
            setTimeout(() => {
                logoutForm.submit();
            }, 1500);
        });
    }
}

// Inicializa el modal al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarModalLogout();
    window.mostrarModalLogout = mostrarModalLogout;
    window.ocultarModalLogout = ocultarModalLogout;
    interceptarLogoutForm();
});
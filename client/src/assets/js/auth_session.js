document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(loginForm);

        fetch("../../../../server/php/server_login.php", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (data.success) {
                    window.location.href = "/client/src/pages/dashboard.html"; // Redirigir al dashboard o página principal
                } else {
                    alert(data.message); // Mostrar mensaje de error
                }
            })
            .catch((error) => {
                alert("Error al iniciar sesión. Inténtalo nuevamente.");
            });
    });
});
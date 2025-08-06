document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(loginForm);

        fetch("/TicketProApp/server/php/server_login.php", {
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
                    window.location.href = "/TicketProApp/server/php/dashboard.php"; // Redirigir al dashboard protegido
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => {
                alert("Error al iniciar sesión. Inténtalo nuevamente.");
            });
    });
});
$(document).ready(function () {
    // Cargar el contenido del encabezado
    $("#header-placeholder").load("../partials/header.html");

    // Cargar el contenido del pie de página
    $("#footer-placeholder").load("../partials/footer.html");

    // Cargar el contenido de los campos de departamento y municipio
    $("#departamento-municipio-placeholder").load("../partials/departamentos.html");
});
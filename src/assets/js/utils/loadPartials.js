$(document).ready(function () {
    // Usar ruta absoluta correcta para los parciales
    function getPartialPath(partial) {
        return '/tk/src/pages/partials/' + partial;
    }

    $("#header-placeholder").load(getPartialPath('header.html'));
    $("#footer-placeholder").load(getPartialPath('footer.html'));
});
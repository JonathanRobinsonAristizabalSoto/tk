$(document).ready(function () {
    // Detectar cuántos niveles subir según la ubicación del archivo actual
    function getPartialPath(partial) {
        var path = window.location.pathname;
        // Si no está en /src/, asume que está en la raíz (index.html)
        if (!/src[\/\\]/.test(path)) {
            return 'src/partials/' + partial;
        }
        // Busca la carpeta 'src' y cuenta los subdirectorios después de ella
        var match = path.match(/src[\/\\](.*)[^\/\\]*$/);
        var subPath = match ? match[1] : '';
        var levels = subPath ? subPath.split(/[\/\\]/).length - 1 : 0;
        var prefix = '';
        for (var i = 0; i < levels; i++) {
            prefix += '../';
        }
        return prefix + 'partials/' + partial;
    }

    $("#header-placeholder").load(getPartialPath('header.html'));
    $("#footer-placeholder").load(getPartialPath('footer.html'));
});
<?php
if (!function_exists('limpiar')) {
    function limpiar($valor) {
        return htmlspecialchars(trim($valor), ENT_QUOTES, 'UTF-8');
    }
}
?>
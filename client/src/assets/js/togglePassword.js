// Script para alternar la visibilidad de la contraseña
$(document).ready(function () {
    $('#togglePassword').on('click', function () {
        const $passwordField = $(this).prev('input');
        const type = $passwordField.attr('type') === 'password' ? 'text' : 'password';
        $passwordField.attr('type', type);
        $(this).toggleClass('fa-eye fa-eye-slash');
    });
});
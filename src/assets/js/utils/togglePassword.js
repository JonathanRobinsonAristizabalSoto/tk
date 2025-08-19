// Script para alternar la visibilidad de la contraseña
$(document).ready(function () {
    $('#togglePassword').on('click', function () {
        const $passwordField = $(this).prev('input');
        const type = $passwordField.attr('type') === 'password' ? 'text' : 'password';
        $passwordField.attr('type', type);
        $(this).toggleClass('fa-eye fa-eye-slash');
    });

    $('#toggleConfirmPassword').on('click', function () {
        const $confirmPasswordField = $(this).prev('input');
        const type = $confirmPasswordField.attr('type') === 'password' ? 'text' : 'password';
        $confirmPasswordField.attr('type', type);
        $(this).toggleClass('fa-eye fa-eye-slash');
    });
});
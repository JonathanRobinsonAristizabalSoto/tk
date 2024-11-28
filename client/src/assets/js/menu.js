// Ruta: assets/js/menu.js

$(function () {
    // Manejar clic en el ícono de menú
    $('#menu-icon').on('click', function () {
        // Alternar clase 'hidden' en el menú de navegación
        $('#menu-nav').toggleClass('hidden');
        
        // Alternar clase 'open' para la animación del ícono
        $(this).toggleClass('open');

        // Si el menú está visible, iniciar temporizador para ocultarlo
        if (!$('#menu-nav').hasClass('hidden')) {
            let hideMenuTimeout = setTimeout(function () {
                if (!$('#menu-nav').hasClass('hidden') && !$('#menu-nav').is(':hover')) {
                    $('#menu-nav').addClass('hidden');
                    $('#menu-icon').removeClass('open');
                }
            }, 3000); // 3 segundos

            // Cancelar el temporizador si el mouse está sobre el menú
            $('#menu-nav').hover(
                function () {
                    clearTimeout(hideMenuTimeout);
                },
                function () {
                    hideMenuTimeout = setTimeout(function () {
                        if (!$('#menu-nav').hasClass('hidden') && !$('#menu-nav').is(':hover')) {
                            $('#menu-nav').addClass('hidden');
                            $('#menu-icon').removeClass('open');
                        }
                    }, 3000); // 3 segundos
                }
            );
        }
    });
});
// Ruta: assets/js/menu.js

$(function () {
    let hideMenuTimeout = null;

    function startHideMenuTimer(time = 5000) {
        clearTimeout(hideMenuTimeout);
        hideMenuTimeout = setTimeout(function () {
            // Si el menú sigue abierto y no se está manipulando
            if (!$('#menu-nav').hasClass('hidden') && !$('#menu-nav').is(':hover')) {
                $('#menu-nav').addClass('hidden');
                $('#menu-icon').removeClass('open');
            }
        }, time);
    }

    // Manejar clic en el ícono de menú
    $('#menu-icon').on('click', function () {
        $('#menu-nav').toggleClass('hidden');
        $(this).toggleClass('open');

        // Si el menú está visible, iniciar temporizador para ocultarlo
        if (!$('#menu-nav').hasClass('hidden')) {
            startHideMenuTimer(5000);

            // En móviles, reiniciar temporizador si se toca dentro del menú
            $('#menu-nav').off('touchstart').on('touchstart', function () {
                clearTimeout(hideMenuTimeout);
            });
            $('#menu-nav').off('touchend').on('touchend', function () {
                startHideMenuTimer(5000);
            });

            // En desktop, hover pausa el temporizador
            $('#menu-nav').off('mouseenter mouseleave').hover(
                function () {
                    clearTimeout(hideMenuTimeout);
                },
                function () {
                    startHideMenuTimer(3000);
                }
            );
        } else {
            clearTimeout(hideMenuTimeout);
        }
    });

    // Si se hace scroll o resize, cerrar el menú (opcional)
    $(window).on('scroll resize', function () {
        $('#menu-nav').addClass('hidden');
        $('#menu-icon').removeClass('open');
        clearTimeout(hideMenuTimeout);
    });
});
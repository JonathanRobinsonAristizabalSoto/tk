function getModalPath(modal) {
  // Usar siempre ruta absoluta para evitar errores de ubicación
  return '/tk/src/pages/modals/' + modal;
}

$("#modal-privacidad-placeholder").load(getModalPath('modal-privacidad.html'));
$("#modal-cookies-placeholder").load(getModalPath('modal-cookies.html'));
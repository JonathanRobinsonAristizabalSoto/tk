// Carga los modales de privacidad y cookies en sus respectivos contenedores del DOM

function getModalPath(modal) {
  // Si estamos en la raíz (index.html)
  if (!/src[\/\\]/.test(window.location.pathname)) {
    return 'src/pages/' + modal;
  }
  // Si estamos en src o subcarpetas
  return '../pages/' + modal;
}

$("#modal-privacidad-placeholder").load(getModalPath('modal-privacidad.html'));
$("#modal-cookies-placeholder").load(getModalPath('modal-cookies.html'));
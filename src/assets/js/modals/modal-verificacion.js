/**
 * Muestra el modal de verificación y arranca el contador.
 */
export function mostrarModalVerificacion() {
  const modal = document.getElementById("verify-modal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    iniciarContadorVerificacion(); // Inicia el contador cada vez que se muestra el modal
  }
}

/**
 * Oculta el modal de verificación y detiene el contador.
 */
export function ocultarModalVerificacion() {
  const modal = document.getElementById("verify-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    clearInterval(timerInterval); // Detiene el contador al cerrar el modal
  }
}

/**
 * Permite auto-avance entre inputs, pegado rápido y navegación con teclado.
 */
export function activarAutoAvanceInputs() {
  const inputs = document.querySelectorAll('#verify-modal input[type="text"]');
  inputs.forEach((input, idx, arr) => {
    // Solo permite números y avanza automáticamente
    input.addEventListener('input', function (e) {
      let value = this.value.replace(/\D/g, '');
      if (value.length > 1) value = value[0];
      this.value = value;

      if (value && idx < arr.length - 1) {
        arr[idx + 1].focus();
      }
    });

    // Permite pegar el código completo o parcial
    input.addEventListener('paste', function (e) {
      const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      if (paste.length > 0) {
        arr.forEach((inp, i) => {
          inp.value = paste[i] || '';
        });
        arr[Math.min(paste.length, arr.length) - 1].focus();
        e.preventDefault();
      }
    });

    // Retrocede al anterior si borras, avanza si escribes número con casilla llena
    input.addEventListener('keydown', function (e) {
      if (e.key === "Backspace" && !this.value && idx > 0) {
        arr[idx - 1].focus();
      } else if (e.key.match(/^[0-9]$/) && this.value && idx < arr.length - 1) {
        this.value = e.key;
        arr[idx + 1].focus();
        e.preventDefault();
      }
    });
  });
}

/**
 * Asigna eventos a los botones de cierre del modal de verificación.
 */
export function asignarEventosCerrarModalVerificacion() {
  const btnX = document.getElementById("close-verify-modal");
  const btnCancelar = document.getElementById("close-verify-modal-2");
  if (btnX) {
    btnX.onclick = ocultarModalVerificacion;
  }
  if (btnCancelar) {
    btnCancelar.onclick = ocultarModalVerificacion;
  }
}

// ----------------------
// Contador y reenviar código
// ----------------------

let timerInterval;
let tiempoRestante = 300; // 5 minutos en segundos

/**
 * Inicia el contador regresivo para el código de verificación.
 * Al expirar, muestra el botón de reenviar código.
 */
export function iniciarContadorVerificacion() {
  const timer = document.getElementById('verify-timer');
  const resendBtn = document.getElementById('resend-code-btn');
  tiempoRestante = 300;
  resendBtn.classList.add('hidden');
  resendBtn.disabled = true;
  timer.classList.remove('text-red-500');
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const min = Math.floor(tiempoRestante / 60);
    const sec = tiempoRestante % 60;
    timer.textContent = `Tiempo restante: ${min}:${sec.toString().padStart(2, '0')}`;
    if (tiempoRestante <= 0) {
      clearInterval(timerInterval);
      timer.textContent = "El código ha expirado.";
      timer.classList.add('text-red-500');
      resendBtn.classList.remove('hidden');
      resendBtn.disabled = false;
    }
    tiempoRestante--;
  }, 1000);
}

/**
 * Evento para reenviar código solo cuando el tiempo ha expirado.
 * Reinicia el contador y oculta el botón tras reenviar.
 * Ahora envía correo y documento.
 * MEJORA: Maneja el error de límite de reenvíos (HTTP 429) y muestra el mensaje del backend.
 */
document.addEventListener('DOMContentLoaded', () => {
  const resendBtn = document.getElementById('resend-code-btn');
  if (resendBtn) {
    // Elimina eventos anteriores
    resendBtn.replaceWith(resendBtn.cloneNode(true));
    const newResendBtn = document.getElementById('resend-code-btn');
    newResendBtn.addEventListener('click', async function () {
      newResendBtn.disabled = true;
      const correoReenviar = localStorage.getItem('pendingEmail') || data.correo;
      const documentoReenviar = document.getElementById("document")?.value?.trim() || data.documento;
      try {
        const resp = await fetch(`${API_BASE}/tk/server/auth/resend-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: correoReenviar, documento: documentoReenviar })
        });
        if (resp.status === 429) {
          console.log('429 detectado');
          const errorMsgDiv = document.getElementById("verify-error-msg");
          if (errorMsgDiv) {
            errorMsgDiv.textContent = "Has alcanzado el límite de reenvíos de código. Intenta nuevamente en 1 hora.";
          } else {
            alert("Has alcanzado el límite de reenvíos de código. Intenta nuevamente en 1 hora.");
          }
          newResendBtn.disabled = false;
          return;
        }
        if (!resp.ok) {
          const result = await resp.json();
          document.getElementById("verify-error-msg").textContent = result.message || "No se pudo reenviar el código. Intenta de nuevo.";
          newResendBtn.disabled = false;
          return;
        }
        document.getElementById("verify-error-msg").textContent = "¡Código reenviado! Revisa tu correo.";
        limpiarInputsVerificacion();
      } catch (e) {
        document.getElementById("verify-error-msg").textContent = "No se pudo reenviar el código. Intenta de nuevo.";
      }
      newResendBtn.disabled = false;
    });
  }
});
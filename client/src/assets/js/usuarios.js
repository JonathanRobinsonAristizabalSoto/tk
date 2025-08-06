function iniciarModuloUsuarios(vista) {
  if (!vista) {
    vista = localStorage.getItem('usuariosVista') || 'tabla';
  } else {
    localStorage.setItem('usuariosVista', vista);
  }

  const modalCrear = document.getElementById("modalCrear");
  const modalEditar = document.getElementById("modalEditar");
  const modalVer = document.getElementById("modalVer");
  const modalEstadoUsuario = document.getElementById("modalEstadoUsuario");
  const abrirModalCrear = document.getElementById("openModal");
  const cerrarModalCrear = document.getElementById("closeModalCrear");
  const cerrarModalEditar = document.getElementById("closeModalEditar");
  const cerrarModalVer = document.getElementById("closeModalVer");
  const btnEstadoUsuarioConfirmar = document.getElementById("btnEstadoUsuarioConfirmar");
  const btnEstadoUsuarioCancelar = document.getElementById("btnEstadoUsuarioCancelar");
  const dataFormCrear = document.getElementById("dataFormCrear");
  const dataFormEditar = document.getElementById("dataFormEditar");
  const dataTable = document.getElementById("dataTable");
  const modalMensaje = document.getElementById("modalMensaje");
  const mensajeTexto = document.getElementById("mensajeTexto");
  const mensajeBox = document.getElementById("mensajeBox");
  const paginador = document.getElementById("usuariosPaginador");
  let currentIdToEstado = null;
  let usuarioActualEditar = null;
  let estadoUsuarioAccion = "inhabilitar";
  let estadoUsuarioActual = "Activo";
  let usuariosData = [];
  let paginaActual = 1;
  let usuariosPorPagina = 10; // tabla: 10 por página

  if (abrirModalCrear) {
    abrirModalCrear.addEventListener("click", () => {
      modalCrear.classList.remove("hidden");
      dataFormCrear.reset();
      document.getElementById("id_usuarioCrear").value = "";
      if (typeof cargarDepartamentosMunicipios === "function") {
        cargarDepartamentosMunicipios("departamentoCrear", "municipioCrear");
      }
      const departamentoSelect = document.getElementById("departamentoCrear");
      if (departamentoSelect) {
        departamentoSelect.onchange = function () {
          cargarDepartamentosMunicipios("departamentoCrear", "municipioCrear", this.value);
        };
      }
    });
  }

  if (cerrarModalCrear) cerrarModalCrear.addEventListener("click", () => modalCrear.classList.add("hidden"));
  if (cerrarModalEditar) cerrarModalEditar.addEventListener("click", () => modalEditar.classList.add("hidden"));
  if (cerrarModalVer) cerrarModalVer.addEventListener("click", () => modalVer.classList.add("hidden"));
  if (btnEstadoUsuarioCancelar) btnEstadoUsuarioCancelar.addEventListener("click", () => {
    modalEstadoUsuario.classList.add("hidden");
    currentIdToEstado = null;
  });

  if (dataFormCrear) dataFormCrear.addEventListener("submit", enviarDatosCrear);
  if (dataFormEditar) dataFormEditar.addEventListener("submit", enviarDatosEditar);

  if (btnEstadoUsuarioConfirmar) {
    btnEstadoUsuarioConfirmar.addEventListener("click", () => {
      if (currentIdToEstado) {
        fetch("/TicketProApp/server/php/server_usuarios.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `action=fetch&id_usuario=${currentIdToEstado}`,
        })
          .then((response) => response.json())
          .then((usuario) => {
            const nuevoEstado = usuario.estado === "Activo" ? "Inactivo" : "Activo";
            fetch("/TicketProApp/server/php/server_usuarios.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `action=toggle_estado&id_usuario=${currentIdToEstado}&estado=${nuevoEstado}`,
            })
              .then((response) => response.json())
              .then((data) => {
                mostrarMensaje(data.success ? "exito" : "error", data.message);
                if (data.success) fetchUsuarios();
                modalEstadoUsuario.classList.add("hidden");
                currentIdToEstado = null;
              })
              .catch(() => {
                mostrarMensaje("error", "Error al cambiar el estado del usuario. Inténtalo nuevamente.");
                modalEstadoUsuario.classList.add("hidden");
                currentIdToEstado = null;
              });
          });
      }
    });
  }

  window.addEventListener("click", function (event) {
    if (event.target === modalCrear) modalCrear.classList.add("hidden");
    if (event.target === modalEditar) modalEditar.classList.add("hidden");
    if (event.target === modalVer) modalVer.classList.add("hidden");
    if (event.target === modalEstadoUsuario) modalEstadoUsuario.classList.add("hidden");
  });

  function enviarDatosCrear(event) {
    event.preventDefault();
    const formData = new FormData(dataFormCrear);
    formData.append("action", "add");
    formData.append("departamento", formData.get("departamentoCrear"));
    formData.append("municipio", formData.get("municipioCrear"));
    formData.append("tipo_documento", formData.get("tipo_documentoCrear"));
    formData.append("documento", formData.get("documentoCrear"));
    formData.append("nombre", formData.get("nombreCrear"));
    formData.append("apellido", formData.get("apellidoCrear"));
    formData.append("email", formData.get("emailCrear"));
    formData.append("telefono", formData.get("telefonoCrear"));
    formData.append("id_rol", formData.get("rolCrear"));
    formData.append("password", formData.get("passwordCrear"));
    formData.delete("departamentoCrear");
    formData.delete("municipioCrear");
    formData.delete("tipo_documentoCrear");
    formData.delete("documentoCrear");
    formData.delete("nombreCrear");
    formData.delete("apellidoCrear");
    formData.delete("emailCrear");
    formData.delete("telefonoCrear");
    formData.delete("rolCrear");
    formData.delete("passwordCrear");
    formData.delete("confirmarPasswordCrear");

    if (formData.get("password") !== dataFormCrear.confirmarPasswordCrear.value) {
      mostrarMensaje("error", "Las contraseñas no coinciden.");
      return;
    }

    const cambios = [
      `Usuario creado: ${formData.get("nombre")} ${formData.get("apellido")}`,
      `Email: ${formData.get("email")}`,
      `Rol: ${document.getElementById("rolCrear").selectedOptions[0].text}`
    ];

    localStorage.setItem("usuariosMensaje", JSON.stringify({
      tipo: "exito",
      mensaje: `¡Usuario creado exitosamente!\n${cambios.join('\n')}`
    }));

    fetch("/TicketProApp/server/php/server_usuarios.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          modalCrear.classList.add("hidden");
          window.location.reload();
        } else {
          mostrarMensaje("error", data.message);
        }
      })
      .catch(() => {
        mostrarMensaje("error", "Error al enviar datos. Inténtalo nuevamente.");
      });
  }

  function enviarDatosEditar(event) {
    event.preventDefault();
    const tipoDocSelect = document.getElementById("tipo_documentoEditar");
    const documentoInput = document.getElementById("documentoEditar");
    if (tipoDocSelect) tipoDocSelect.setAttribute("disabled", "disabled");
    if (documentoInput) documentoInput.setAttribute("readonly", "readonly");

    const formData = new FormData(dataFormEditar);
    formData.append("action", "update");
    formData.append("id_usuario", formData.get("id_usuarioEditar"));
    formData.append("departamento", formData.get("departamentoEditar"));
    formData.append("municipio", formData.get("municipioEditar"));
    formData.append("tipo_documento", formData.get("tipo_documentoEditar"));
    formData.append("documento", formData.get("documentoEditar"));
    formData.append("nombre", formData.get("nombreEditar"));
    formData.append("apellido", formData.get("apellidoEditar"));
    formData.append("email", formData.get("emailEditar"));
    formData.append("telefono", formData.get("telefonoEditar"));
    formData.append("id_rol", formData.get("rolEditar"));

    const fotoInput = document.getElementById("fotoEditar");
    if (fotoInput && fotoInput.files && fotoInput.files[0]) {
      formData.append("foto", fotoInput.files[0]);
    } else if (usuarioActualEditar && usuarioActualEditar.foto) {
      formData.append("foto_actual", usuarioActualEditar.foto);
    }

    formData.delete("id_usuarioEditar");
    formData.delete("departamentoEditar");
    formData.delete("municipioEditar");
    formData.delete("tipo_documentoEditar");
    formData.delete("documentoEditar");
    formData.delete("nombreEditar");
    formData.delete("apellidoEditar");
    formData.delete("emailEditar");
    formData.delete("telefonoEditar");
    formData.delete("rolEditar");

    const cambios = [];
    if (usuarioActualEditar.nombre !== dataFormEditar.nombreEditar.value) cambios.push("Nombre");
    if (usuarioActualEditar.apellido !== dataFormEditar.apellidoEditar.value) cambios.push("Apellido");
    if (usuarioActualEditar.email !== dataFormEditar.emailEditar.value) cambios.push("Email");
    if ((usuarioActualEditar.telefono || "") !== dataFormEditar.telefonoEditar.value) cambios.push("Teléfono");
    if ((usuarioActualEditar.departamento || "") !== dataFormEditar.departamentoEditar.value) cambios.push("Departamento");
    if ((usuarioActualEditar.municipio || "") !== dataFormEditar.municipioEditar.value) cambios.push("Municipio");
    if (usuarioActualEditar.id_rol != dataFormEditar.rolEditar.value) cambios.push("Rol");
    if (fotoInput && fotoInput.files && fotoInput.files[0]) cambios.push("Foto de perfil");

    let mensaje = "";
    if (cambios.length) {
      mensaje = `<div class="font-bold mb-2 text-color5 text-lg">DATOS EDITADOS EXITOSAMENTE</div>
        <ul class="pl-0">
          ${cambios.map(campo => `
            <li class="list-none flex items-center mb-1">
              <span class="text-color5 text-lg mr-2"><i class="fas fa-check-circle"></i></span>
              <span class="text-color4">${campo}</span>
            </li>
          `).join('')}
        </ul>`;
    } else {
      mensaje = `<span class="text-color4">No hubo modificaciones.</span>`;
    }

    localStorage.setItem("usuariosMensaje", JSON.stringify({
      tipo: "exito",
      mensaje: mensaje
    }));

    fetch("/TicketProApp/server/php/server_usuarios.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          modalEditar.classList.add("hidden");
          window.location.reload();
        } else {
          mostrarMensaje("error", data.message);
        }
      })
      .catch(() => {
        mostrarMensaje("error", "Error al enviar datos. Inténtalo nuevamente.");
      });
  }

  function renderPaginador(totalUsuarios) {
    if (!paginador) return;
    paginador.innerHTML = "";
    const totalPaginas = Math.ceil(totalUsuarios / usuariosPorPagina);
    if (totalPaginas <= 1) return;

    let html = `<nav class="flex justify-center items-center gap-1">`;
    html += `<button class="px-2 py-1 rounded bg-color5 text-white text-xs font-semibold hover:bg-color6 transition ${paginaActual === 1 ? "opacity-50 cursor-not-allowed" : ""}" ${paginaActual === 1 ? "disabled" : ""} id="btnPagAnterior">Anterior</button>`;
    for (let i = 1; i <= totalPaginas; i++) {
      html += `<button class="px-2 py-1 rounded ${i === paginaActual ? "bg-color6 text-white" : "bg-white text-color5 border border-color5"} text-xs font-semibold hover:bg-color5 hover:text-white transition" data-pagina="${i}">${i}</button>`;
    }
    html += `<button class="px-2 py-1 rounded bg-color5 text-white text-xs font-semibold hover:bg-color6 transition ${paginaActual === totalPaginas ? "opacity-50 cursor-not-allowed" : ""}" ${paginaActual === totalPaginas ? "disabled" : ""} id="btnPagSiguiente">Siguiente</button>`;
    html += `</nav>`;
    paginador.innerHTML = html;

    document.getElementById("btnPagAnterior")?.addEventListener("click", () => {
      if (paginaActual > 1) {
        paginaActual--;
        renderUsuarios();
      }
    });
    document.getElementById("btnPagSiguiente")?.addEventListener("click", () => {
      const totalPaginas = Math.ceil(usuariosData.length / usuariosPorPagina);
      if (paginaActual < totalPaginas) {
        paginaActual++;
        renderUsuarios();
      }
    });
    paginador.querySelectorAll("button[data-pagina]").forEach(btn => {
      btn.addEventListener("click", () => {
        paginaActual = parseInt(btn.getAttribute("data-pagina"));
        renderUsuarios();
      });
    });
  }

  function renderUsuarios() {
    dataTable.innerHTML = "";
    const width = window.innerWidth;
    let vistaActual = localStorage.getItem('usuariosVista') || 'tabla';
    let tarjetasPorFila = 4; // máximo 4 por fila
    let textoSize = "text-xs";
    let nombreSize = "text-sm font-bold";
    let emailSize = "text-xs";
    let rolSize = "text-xs";
    let infoSize = "text-xs";
    let tarjetasPorPagina = 8; // máximo 8 por página en tarjetas

    // SIEMPRE 4 columnas por fila en tarjetas, 8 por página (2 filas)
    tarjetasPorFila = 4;
    tarjetasPorPagina = 8;

    if (vistaActual === 'tarjetas') {
      usuariosPorPagina = tarjetasPorPagina;
      dataTable.className = `grid grid-cols-1 sm:grid-cols-4 gap-4`;

      const inicio = (paginaActual - 1) * usuariosPorPagina;
      const fin = inicio + usuariosPorPagina;
      const usuariosMostrar = usuariosData.slice(inicio, fin);

      usuariosMostrar.forEach((usuario) => {
        const isActivo = usuario.estado === "Activo";
        const btnColor = isActivo ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
        const btnIcon = isActivo
          ? '<i class="fas fa-user-check"></i>'
          : '<i class="fas fa-user-times"></i>';
        const btnTitle = isActivo ? "Inhabilitar" : "Habilitar";

        const card = document.createElement("div");
        card.className = `bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex flex-col items-center ${textoSize}`;
        card.innerHTML = `
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-color5 mb-2">
          <img src="../${usuario.foto || 'assets/images/perfiles/default.png'}" alt="Foto de perfil" class="object-cover w-full h-full">
        </div>
        <div class="${nombreSize} text-color4 text-center">${usuario.nombre} ${usuario.apellido}</div>
        <div class="${rolSize} text-color6 text-center"> ${usuario.rol_nombre || "Usuario"}</div>
        <div class="${emailSize} text-color3 text-center">${usuario.email}</div>
        <div class="mt-1 ${infoSize} text-color3 text-center">${usuario.departamento}, ${usuario.municipio}</div>
        <div class="${infoSize} text-color3 text-center">${usuario.telefono || ""}</div> 
        <div class="flex justify-center mt-2 space-x-1">
            <button class="flex bg-color5 text-white p-2 rounded-lg hover:bg-color6 transition duration-300" onclick="viewUsuario(${usuario.id_usuario}, ${usuario.id_rol})" title="Ver">
                <i class="fas fa-eye"></i>
            </button>
            <button class="flex bg-color6 text-white p-2 rounded-lg hover:bg-color6 transition duration-300" onclick="editUsuario(${usuario.id_usuario})" title="Editar">
                <i class="fas fa-edit"></i>
            </button>
            <button class="flex ${btnColor} text-white p-2 rounded-lg transition duration-300 items-center" onclick="confirmEstadoUsuario(${usuario.id_usuario})" title="${btnTitle}">
                ${btnIcon}
            </button>
        </div>
      `;
        dataTable.appendChild(card);
      });
    } else if (vistaActual === 'tabla') {
      usuariosPorPagina = 10; // máximo 10 por página en tabla
      dataTable.className = "overflow-x-auto";
      const inicio = (paginaActual - 1) * usuariosPorPagina;
      const fin = inicio + usuariosPorPagina;
      const usuariosMostrar = usuariosData.slice(inicio, fin);

      let tabla = document.createElement("table");
      tabla.className = "min-w-full bg-white border border-gray-200 rounded-lg shadow-sm text-xs sm:text-sm";
      tabla.innerHTML = `
      <thead>
        <tr>
          <th class="p-2 border-b border-r text-center">Nombre</th>
          <th class="p-2 border-b border-r text-center">Email</th>
          <th class="p-2 border-b border-r text-center">Departamento</th>
          <th class="p-2 border-b border-r text-center">Municipio</th>
          <th class="p-2 border-b border-r text-center">Teléfono</th>
          <th class="p-2 border-b border-r text-center">Rol</th>
          <th class="p-2 border-b border-r text-center">Estado</th>
          <th class="p-2 border-b text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${usuariosMostrar.map(usuario => {
        const isActivo = usuario.estado === "Activo";
        const btnColor = isActivo ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
        const btnIcon = isActivo
          ? '<i class="fas fa-user-check"></i>'
          : '<i class="fas fa-user-times"></i>';
        const btnTitle = isActivo ? "Inhabilitar" : "Habilitar";
        return `
          <tr>
            <td class="p-2 border-b border-r text-center">${usuario.nombre} ${usuario.apellido}</td>
            <td class="p-2 border-b border-r text-center">${usuario.email}</td>
            <td class="p-2 border-b border-r text-center">${usuario.departamento}</td>
            <td class="p-2 border-b border-r text-center">${usuario.municipio}</td>
            <td class="p-2 border-b border-r text-center">${usuario.telefono || ""}</td>
            <td class="p-2 border-b border-r text-center">${usuario.rol_nombre || "Usuario"}</td>
            <td class="p-2 border-b border-r text-center">${usuario.estado || "Activo"}</td>
            <td class="p-2 border-b text-center">
              <button class="bg-color5 text-white p-1 rounded-lg mr-1" onclick="viewUsuario(${usuario.id_usuario}, ${usuario.id_rol})" title="Ver"><i class="fas fa-eye"></i></button>
              <button class="bg-color6 text-white p-1 rounded-lg mr-1" onclick="editUsuario(${usuario.id_usuario})" title="Editar"><i class="fas fa-edit"></i></button>
              <button class="${btnColor} text-white p-1 rounded-lg items-center" onclick="confirmEstadoUsuario(${usuario.id_usuario})" title="${btnTitle}">
                ${btnIcon}
              </button>
            </td>
          </tr>
        `;
      }).join('')}
      </tbody>
    `;
      dataTable.appendChild(tabla);
    }
    renderPaginador(usuariosData.length);
  }

  function fetchUsuarios() {
    fetch("/TicketProApp/server/php/server_usuarios.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "action=fetch",
    })
      .then((response) => response.json())
      .then((data) => {
        usuariosData = data;
        paginaActual = 1;
        renderUsuarios();

        const mensajeGuardado = localStorage.getItem("usuariosMensaje");
        if (mensajeGuardado) {
          const obj = JSON.parse(mensajeGuardado);
          mostrarMensaje(obj.tipo, obj.mensaje);
          localStorage.removeItem("usuariosMensaje");
        }
      })
      .catch(() => {
        mostrarMensaje("error", "Error al cargar usuarios. Inténtalo nuevamente.");
      });
  }

  window.editUsuario = function (id) {
    fetch("/TicketProApp/server/php/server_usuarios.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `action=fetch&id_usuario=${id}`,
    })
      .then((response) => response.json())
      .then((usuario) => {
        usuarioActualEditar = usuario;
        if (typeof cargarDepartamentosMunicipios === "function") {
          cargarDepartamentosMunicipios(
            "departamentoEditar",
            "municipioEditar",
            usuario.departamento
          );
          setTimeout(() => {
            document.getElementById("departamentoEditar").value = usuario.departamento;
            cargarDepartamentosMunicipios(
              "departamentoEditar",
              "municipioEditar",
              usuario.departamento
            );
            setTimeout(() => {
              document.getElementById("municipioEditar").value = usuario.municipio;
            }, 200);
          }, 200);
        }
        document.getElementById("id_usuarioEditar").value = usuario.id_usuario;
        document.getElementById("nombreEditar").value = usuario.nombre;
        document.getElementById("apellidoEditar").value = usuario.apellido;
        document.getElementById("emailEditar").value = usuario.email;
        document.getElementById("telefonoEditar").value = usuario.telefono || "";
        if (document.getElementById("tipo_documentoEditar")) {
          document.getElementById("tipo_documentoEditar").value = usuario.tipo_documento;
          document.getElementById("tipo_documentoEditar").setAttribute("disabled", "disabled");
        }
        if (document.getElementById("documentoEditar")) {
          document.getElementById("documentoEditar").value = usuario.documento;
          document.getElementById("documentoEditar").setAttribute("readonly", "readonly");
        }
        if (document.getElementById("fotoEditar")) {
          document.getElementById("fotoEditar").value = "";
        }
        if (document.getElementById("rolEditar")) {
          let rolSelect = document.getElementById("rolEditar");
          for (let i = 0; i < rolSelect.options.length; i++) {
            if (rolSelect.options[i].value == usuario.id_rol) {
              rolSelect.selectedIndex = i;
              break;
            }
          }
        }
        modalEditar.classList.remove("hidden");
      });
  };

  window.confirmEstadoUsuario = function (id) {
    currentIdToEstado = id;
    fetch("/TicketProApp/server/php/server_usuarios.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `action=fetch&id_usuario=${id}`,
    })
      .then((response) => response.json())
      .then((usuario) => {
        estadoUsuarioActual = usuario.estado;
        const isActivo = usuario.estado === "Activo";
        const texto = isActivo
          ? "¿Seguro que deseas inhabilitar este usuario?"
          : "¿Seguro que deseas habilitar este usuario?";
        const btnText = isActivo ? "Inhabilitar" : "Habilitar";
        const btnIcon = isActivo ? "fa-user-times" : "fa-user-check";
        const btnColor = isActivo ? "bg-red-600 hover:bg-red-700 border-red-600" : "bg-green-600 hover:bg-green-700 border-green-600";
        document.getElementById("modalEstadoUsuarioTexto").textContent = texto;
        document.getElementById("modalEstadoUsuarioConfirmarText").textContent = btnText;
        document.getElementById("modalEstadoUsuarioConfirmarIcon").className = `fas ${btnIcon}`;
        document.getElementById("btnEstadoUsuarioConfirmar").className =
          `flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-semibold text-base transition duration-200 shadow text-white border-2 ${btnColor}`;
        document.getElementById("btnEstadoUsuarioCancelar").className =
          "flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-semibold text-base transition duration-200 shadow bg-color1 hover:bg-color2 text-color4 border-2 border-color4";
        document.getElementById("modalEstadoUsuarioIcon").innerHTML = isActivo
          ? '<i class="fas fa-user-times text-red-600"></i>'
          : '<i class="fas fa-user-check text-green-600"></i>';
        modalEstadoUsuario.classList.remove("hidden");
      });
  };

  window.viewUsuario = function (id, id_rol) {
    fetch("/TicketProApp/server/php/server_usuarios.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `action=fetch&id_usuario=${id}&id_rol=${id_rol}`,
    })
      .then((response) => response.json())
      .then((usuario) => {
        document.getElementById("verFoto").src = "../" + (usuario.foto || "assets/images/perfiles/default.png");
        document.getElementById("verNombreCompleto").textContent = `${usuario.nombre} ${usuario.apellido}`;
        document.getElementById("verEmail").textContent = usuario.email;
        document.getElementById("verRol").textContent = usuario.rol_nombre || "Usuario";
        document.getElementById("verDocumento").textContent = usuario.documento || "";
        document.getElementById("verTelefono").textContent = usuario.telefono || "";
        document.getElementById("verDepartamento").textContent = usuario.departamento || "";
        document.getElementById("verMunicipio").textContent = usuario.municipio || "";
        modalVer.classList.remove("hidden");
      });
    if (document.getElementById("closeModalVer")) {
      document.getElementById("closeModalVer").onclick = () => modalVer.classList.add("hidden");
    }
    if (document.getElementById("closeModalVerBtn")) {
      document.getElementById("closeModalVerBtn").onclick = () => modalVer.classList.add("hidden");
    }
  };

  function mostrarMensaje(tipo, mensaje) {
    mensajeTexto.innerHTML = mensaje;
    if (tipo === "exito") {
      mensajeBox.classList.remove("border-red-500", "bg-red-50");
      mensajeBox.classList.add("border-color5", "bg-white");
      mensajeBox.querySelector("svg").classList.remove("text-red-500");
      mensajeBox.querySelector("svg").classList.add("text-color5");
      mensajeTexto.classList.remove("text-red-500", "text-green-700");
      mensajeTexto.classList.add("text-color4");
    } else {
      mensajeBox.classList.remove("border-color5", "bg-white");
      mensajeBox.classList.add("border-red-500", "bg-red-50");
      mensajeBox.querySelector("svg").classList.remove("text-color5");
      mensajeBox.querySelector("svg").classList.add("text-red-500");
      mensajeTexto.classList.remove("text-color4");
      mensajeTexto.classList.add("text-red-500");
    }
    modalMensaje.classList.remove("hidden");
    setTimeout(() => {
      modalMensaje.classList.add("hidden");
    }, 2200);
  }

  fetchUsuarios();
}
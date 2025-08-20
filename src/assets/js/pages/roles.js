import { getRoles, updateDescripcionRol } from "../api/api.js";

// ...helpers y modales...

let rolesData = [];
let rolActualEditar = null;
let paginaActual = 1;
let rolesPorPagina = 6;
let vistaActual = "tarjetas";

// --- RENDER ROLES ---
function renderRoles(vista = "tarjetas") {
  vistaActual = vista;
  paginaActual = 1; // Reinicia la página cada vez que se renderiza el módulo
  const mainContent = document.getElementById("main-content");
  if (!mainContent) return;

  let html = `
    <div class="flex flex-col gap-2 my-1">
      <div class="flex justify-center">
        <h2 class="text-lg font-semibold text-color4 text-center">Roles</h2>
      </div>
      <div class="flex flex-row items-center justify-center gap-4 my-4">
        <input
          type="text"
          id="busquedaRoles"
          placeholder="Buscar rol..."
          class="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-80 text-center"
          autocomplete="off"
          style="outline:none;"
          onfocus="this.style.borderColor='#22c55e';"
          onblur="this.style.borderColor='#d1d5db';"
        >
        <div class="flex gap-2">
          <button id="btnVistaTarjetasRol" class="bg-color5 text-white p-2 rounded shadow hover:bg-green-600 transition" title="Vista tarjetas">
            <i class="fas fa-th-large"></i>
          </button>
          <button id="btnVistaTablaRol" class="bg-color6 text-white p-2 rounded shadow hover:bg-orange-600 transition" title="Vista tabla">
            <i class="fa-solid fa-list"></i>
          </button>
        </div>
      </div>
    </div>
    <div id="dataTableRol"></div>
  `;
  mainContent.innerHTML = html;

  let textoBusqueda = "";

  document.getElementById("busquedaRoles").addEventListener("input", function () {
    textoBusqueda = this.value.trim().toLowerCase();
    renderRolesVista(vistaActual, textoBusqueda);
  });

  document.getElementById("btnVistaTarjetasRol").addEventListener("click", () => {
    renderRolesVista("tarjetas", textoBusqueda);
  });
  document.getElementById("btnVistaTablaRol").addEventListener("click", () => {
    renderRolesVista("tabla", textoBusqueda);
  });

  renderRolesVista(vistaActual, textoBusqueda);
}

function formatFecha(fecha) {
  if (!fecha) return "";
  const d = new Date(fecha.replace(' ', 'T'));
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function renderRolesVista(vista, filtro = "") {
  const dataTableRol = document.getElementById("dataTableRol");
  if (!dataTableRol) return;

  let rolesFiltrados = rolesData;
  if (filtro && filtro.length > 0) {
    rolesFiltrados = rolesData.filter(rol =>
      rol.nombre && rol.nombre.toLowerCase().includes(filtro)
    );
  }

  // Sin paginador: muestra todos los roles filtrados
  const rolesMostrar = rolesFiltrados;

  if (vista === "tarjetas") {
    dataTableRol.className = "grid grid-cols-1 sm:grid-cols-3 gap-4";
    dataTableRol.innerHTML = "";
    rolesMostrar.forEach(rol => {
      const isActivo = rol.estado === "Activo";
      const btnColor = isActivo ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
      const btnIcon = isActivo
        ? '<i class="fas fa-user-check"></i>'
        : '<i class="fas fa-user-times"></i>';
      const btnTitle = isActivo ? "Inhabilitar" : "Habilitar";
      const card = document.createElement("div");
      card.className = "bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col items-center";
      card.innerHTML = `
        <div class="text-color5 text-3xl mb-2">
          <i class="fas fa-user-shield ${isActivo ? 'text-green-600' : 'text-red-600'}"></i>
        </div>
        <div class="text-base font-bold text-color4 text-center mb-1">${rol.nombre}</div>
        <div class="text-sm text-center mb-2">
          <span class="${isActivo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-3 py-1 rounded">${rol.estado}</span>
        </div>
        <div class="text-xs text-center mb-2 text-color6">${rol.descripcion || ""}</div>
        <div class="text-xs text-center mb-2 text-gray-500">Actualizado: ${formatFecha(rol.fecha_actualizacion)}</div>
        <div class="flex justify-center mt-2 space-x-2">
          <button class="flex bg-color5 text-white p-2 rounded-lg hover:bg-color6 transition duration-300" title="Ver" onclick="window.viewRol(${rol.id_rol})">
            <i class="fas fa-eye"></i>
          </button>
          <button class="flex bg-color6 text-white p-2 rounded-lg hover:bg-color6 transition duration-300" title="Editar" onclick="window.editRol(${rol.id_rol})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="flex ${btnColor} text-white p-2 rounded-lg transition duration-300 items-center" title="${btnTitle}" onclick="window.confirmEstadoRol(${rol.id_rol})">
            ${btnIcon}
          </button>
        </div>
      `;
      dataTableRol.appendChild(card);
    });
  } else {
    dataTableRol.className = "overflow-x-auto";
    let tabla = document.createElement("table");
    tabla.className = "min-w-full bg-white border border-gray-200 rounded-lg shadow-sm text-xs sm:text-xs";
    tabla.innerHTML = `
      <thead>
        <tr>
          <th class="p-2 border-b border-r text-center">Nombre</th>
          <th class="p-2 border-b border-r text-center">Descripción</th>
          <th class="p-2 border-b border-r text-center">Estado</th>
          <th class="p-2 border-b border-r text-center">Actualización</th>
          <th class="p-2 border-b text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${rolesMostrar.map(rol => {
          const isActivo = rol.estado === "Activo";
          const btnColor = isActivo ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
          const btnIcon = isActivo
            ? '<i class="fas fa-user-check"></i>'
            : '<i class="fas fa-user-times"></i>';
          const btnTitle = isActivo ? "Inhabilitar" : "Habilitar";
          return `
            <tr>
              <td class="p-2 border-b border-r text-center">${rol.nombre}</td>
              <td class="p-2 border-b border-r text-center">${rol.descripcion || ""}</td>
              <td class="p-2 border-b border-r text-center">
                <span class="${isActivo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-3 py-1 rounded">${rol.estado}</span>
              </td>
              <td class="p-2 border-b border-r text-center">${formatFecha(rol.fecha_actualizacion)}</td>
              <td class="p-2 border-b text-center">
                <button class="bg-color5 text-white p-1 rounded-lg mr-1" title="Ver" onclick="window.viewRol(${rol.id_rol})"><i class="fas fa-eye"></i></button>
                <button class="bg-color6 text-white p-1 rounded-lg mr-1" title="Editar" onclick="window.editRol(${rol.id_rol})"><i class="fas fa-edit"></i></button>
                <button class="${btnColor} text-white p-1 rounded-lg items-center" title="${btnTitle}" onclick="window.confirmEstadoRol(${rol.id_rol})">
                  ${btnIcon}
                </button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    `;
    dataTableRol.innerHTML = "";
    dataTableRol.appendChild(tabla);
  }
}

// --- ACTUALIZAR DESCRIPCIÓN Y FECHA ---
async function actualizarDescripcionRol(id_rol, descripcion) {
  // Usar la función del API centralizada
  return await updateDescripcionRol(id_rol, descripcion);
}

// --- FUNCIONES MODALES ROLES ---
window.viewRol = function(id_rol) {
  const rol = rolesData.find(r => r.id_rol == id_rol);
  if (!rol) return;
  const modal = document.getElementById("modalVerRol");
  modal.innerHTML = `
    <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border-4 border-color5 flex flex-col items-center relative">
      <button type="button" id="closeModalVerRol"
        class="absolute top-5 right-5 text-red-500 text-2xl font-bold hover:text-red-700 transition-colors duration-200">&times;</button>
      <div class="flex flex-col items-center mb-6">
        <span class="mb-3">
          <i class="fas fa-user-shield ${rol.estado === "Activo" ? "text-color5" : "text-red-500"} text-5xl drop-shadow"></i>
        </span>
        <h2 class="font-bold text-gray-800 text-center mb-1 text-base">${rol.nombre}</h2>
        <span class="inline-block px-4 py-1 rounded mb-2 text-sm font-semibold ${rol.estado === "Activo" ? "bg-green-100 text-color5 border border-green-400" : "bg-red-100 text-red-700 border border-red-400"} shadow">
          ${rol.estado}
        </span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-4">
        <div class="bg-gray-50 rounded-lg border border-color2 p-4 flex flex-col items-center w-full">
          <span class="font-bold text-color6 text-sm mb-1">Descripción:</span>
          <span class="text-color4 text-sm text-center">${rol.descripcion || "<span class='italic text-color2'>Sin descripción</span>"}</span>
        </div>
        <div class="bg-gray-50 rounded-lg border border-color2 p-4 flex flex-col items-center w-full">
          <span class="font-bold text-color6 text-sm mb-1">Actualización:</span>
          <span class="text-color4 text-sm text-center">${rol.fecha_actualizacion ? formatFecha(rol.fecha_actualizacion) : ""}</span>
        </div>
      </div>
      <button type="button" id="closeModalVerRolBtn"
        class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-xl w-full font-bold text-base shadow transition mt-2">Cerrar</button>
    </div>
  `;
  modal.classList.remove("hidden");
  document.getElementById("closeModalVerRol").onclick = () => modal.classList.add("hidden");
  document.getElementById("closeModalVerRolBtn").onclick = () => modal.classList.add("hidden");
};

window.editRol = function(id_rol) {
  const rol = rolesData.find(r => r.id_rol == id_rol);
  if (!rol) return;
  rolActualEditar = rol;
  document.getElementById("id_rolEditar").value = rol.id_rol;
  document.getElementById("descripcionEditarRol").value = rol.descripcion || "";
  document.getElementById("modalEditarRol").classList.remove("hidden");
  document.getElementById("closeModalEditarRol").onclick = () => {
    document.getElementById("modalEditarRol").classList.add("hidden");
  };
  document.getElementById("formEditarRol").onsubmit = async function(e) {
    e.preventDefault();
    const nuevaDescripcion = document.getElementById("descripcionEditarRol").value;
    const idRol = document.getElementById("id_rolEditar").value;
    const resp = await actualizarDescripcionRol(idRol, nuevaDescripcion);
    if (resp.success) {
      mostrarMensajeRol("exito", "Descripción del rol actualizada.");
      await fetchRoles(); // Recarga los datos y actualiza la fecha
      document.getElementById("modalEditarRol").classList.add("hidden");
    } else {
      mostrarMensajeRol("error", "No se pudo actualizar.");
    }
  };
};

window.confirmEstadoRol = function(id_rol) {
  const rol = rolesData.find(r => r.id_rol == id_rol);
  if (!rol) return;
  const isActivo = rol.estado === "Activo";
  document.getElementById("modalEstadoRolTexto").textContent = isActivo
    ? "¿Seguro que deseas inhabilitar este rol?"
    : "¿Seguro que deseas habilitar este rol?";
  document.getElementById("modalEstadoRolConfirmarText").textContent = isActivo ? "Inhabilitar" : "Habilitar";
  document.getElementById("modalEstadoRolConfirmarIcon").className = isActivo ? "fas fa-user-times" : "fas fa-user-check";
  document.getElementById("modalEstadoRolIcon").innerHTML = isActivo
    ? '<i class="fas fa-user-times text-red-600"></i>'
    : '<i class="fas fa-user-check text-green-600"></i>';
  document.getElementById("modalEstadoRol").classList.remove("hidden");

  document.getElementById("btnEstadoRolCancelar").onclick = () => {
    document.getElementById("modalEstadoRol").classList.add("hidden");
  };
  document.getElementById("btnEstadoRolConfirmar").onclick = () => {
    rol.estado = isActivo ? "Inactivo" : "Activo";
    document.getElementById("modalEstadoRol").classList.add("hidden");
    mostrarMensajeRol("exito", `Rol ${isActivo ? "inhabilitado" : "habilitado"} correctamente.`);
    renderRolesVista(vistaActual);
  };
};

// --- MENSAJE MODAL ---
function mostrarMensajeRol(tipo, mensaje) {
  const modal = document.getElementById("modalMensajeRol");
  const mensajeBox = document.getElementById("mensajeBoxRol");
  const mensajeTexto = document.getElementById("mensajeTextoRol");
  mensajeTexto.textContent = mensaje;
  mensajeBox.className = tipo === "exito"
    ? "rounded-xl shadow-lg px-6 py-6 w-[90vw] max-w-sm mx-auto text-center border-2 border-color5 bg-white flex flex-col items-center gap-3"
    : "rounded-xl shadow-lg px-6 py-6 w-[90vw] max-w-sm mx-auto text-center border-2 border-red-500 bg-red-50 flex flex-col items-center gap-3";
  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 1800);
}

// --- FETCH ROLES ---
async function fetchRoles() {
  try {
    const data = await getRoles();
    rolesData = Array.isArray(data.roles) ? data.roles : [];
    renderRolesVista(vistaActual);
  } catch (error) {
    mostrarMensajeRol("error", "Error al cargar roles.");
  }
}

// Exportar la función principal al objeto global para que dashboard.js la pueda usar tras recargar
window.renderRoles = async function(vista = "tarjetas") {
  await fetchRoles();
  renderRoles(vista);
};
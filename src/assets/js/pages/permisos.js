import { fetchRolesPermisosMatrix, updateRolPermiso } from "../api/api.js";

// --- RENDER MATRIZ DE ROLES Y PERMISOS ---
async function renderPermisosMatriz() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div class="flex flex-col gap-2 my-1">
            <div class="flex justify-center">
                <h2 class="text-sm sm:text-lg font-bold text-color4 text-center mb-2 flex items-center gap-2">
                    <i class="fas fa-key text-color6 text-base sm:text-base"></i>
                    Gestión de Permisos por Rol
                </h2>
            </div>
            <div class="flex justify-center">
                <p class="text-xs sm:text-sm text-color4 text-center max-w-[400px] mb-2">
                    Para cambiar los permisos de cada rol, haz clic sobre los íconos de check (<i class="fas fa-check text-color5"></i>) o equis (<i class="fas fa-times text-color6"></i>) en la tabla. El cambio se guarda automáticamente.
                </p>
            </div>
            <div id="matrizPermisos" class="w-full"></div>
        </div>
    `;

    const resp = await fetchRolesPermisosMatrix();
    if (!resp.success || !Array.isArray(resp.matrix)) {
        document.getElementById("matrizPermisos").innerHTML = "<div class='text-color6'>No se pudo cargar la matriz.</div>";
        return;
    }

    // Procesar datos para construir la matriz
    const roles = [];
    const permisos = [];
    const matrix = {};

    resp.matrix.forEach(row => {
        if (!roles.some(r => r.id_rol === row.id_rol)) roles.push({ id_rol: row.id_rol, nombre: row.rol });
        if (!permisos.some(p => p.id_permiso === row.id_permiso)) permisos.push({ id_permiso: row.id_permiso, nombre: row.permiso });
        matrix[`${row.id_permiso}_${row.id_rol}`] = row.activo;
    });

    // --- DISEÑO RESPONSIVO ---
    if (window.innerWidth < 640) {
        // --- TARJETAS EN MÓVIL ---
        let html = `
        <div class="flex flex-col gap-6">
            ${roles.map(rol => `
                <div class="bg-color4 rounded-xl shadow-lg p-4 border-2 border-color5">
                    <div class="flex items-center gap-2 mb-3">
                        <i class="fas fa-user-shield text-color6 text-sm"></i>
                        <span class="font-bold text-color5 text-sm">${rol.nombre}</span>
                    </div>
                    <div class="flex flex-col gap-3">
                        ${permisos.map(permiso => {
                            const key = `${permiso.id_permiso}_${rol.id_rol}`;
                            const activo = matrix[key] === 1;
                            return `<label class="flex items-center gap-3 bg-color1 rounded-lg px-3 py-2 shadow hover:shadow-md transition">
                                <input type="checkbox"
                                    class="form-checkbox h-5 w-5 text-color6 border-color5 rounded focus:ring-2 focus:ring-color6 transition"
                                    data-id-rol="${rol.id_rol}"
                                    data-id-permiso="${permiso.id_permiso}"
                                    ${activo ? "checked" : ""}
                                />
                                <span class="font-semibold text-color4 text-xs">${permiso.nombre}</span>
                                <span class="${activo ? 'text-color5' : 'text-color6'} ml-2 text-sm">
                                    ${activo ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>'}
                                </span>
                            </label>`;
                        }).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="mt-6 flex flex-col gap-2 items-center text-xs">
            <span class="flex items-center gap-2">
                <span class="rounded-full w-5 h-5 flex items-center justify-center bg-color5 text-white"><i class="fas fa-check text-xs"></i></span>
                <span class="text-color5 font-semibold text-xs">Sí tiene permiso</span>
            </span>
            <span class="flex items-center gap-2">
                <span class="rounded-full w-5 h-5 flex items-center justify-center bg-color6 text-white"><i class="fas fa-times text-xs"></i></span>
                <span class="text-color6 font-semibold text-xs">No tiene permiso</span>
            </span>
        </div>
        `;
        document.getElementById("matrizPermisos").innerHTML = html;

        document.querySelectorAll("#matrizPermisos input[type=checkbox]").forEach(chk => {
            chk.addEventListener("change", async function () {
                const id_rol = this.getAttribute("data-id-rol");
                const id_permiso = this.getAttribute("data-id-permiso");
                const activo = this.checked ? 1 : 0;
                await updateRolPermiso(id_rol, id_permiso, activo);
                // Actualiza el icono visualmente
                const iconSpan = this.parentElement.querySelector("span:last-child");
                if (iconSpan) {
                    iconSpan.innerHTML = activo ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>';
                    iconSpan.className = `${activo ? 'text-color5' : 'text-color6'} ml-2 text-sm`;
                }
            });
        });
        return;
    }

    // --- TABLA EN WEB ---
    let html = `<div class="flex justify-center">
        <div class="w-full sm:w-[600px]">
            <table class="w-full bg-color1 rounded-tl-2xl rounded-tr-xl rounded-bl-xl rounded-br-2xl shadow-lg text-xs sm:text-sm mx-auto">
            <thead>
                <tr class="bg-color5 text-white">
                    <th class="p-3 border-b border-r text-center font-semibold sticky left-0 bg-color5 z-10 rounded-tl-2xl text-sm">Permiso / Rol</th>
                    ${roles.map((r, idx) => `
                        <th class="p-3 border-b border-r text-center font-semibold text-sm bg-color5 ${idx === roles.length-1 ? 'rounded-tr-xl' : ''}">
                            <span title="${r.nombre}">
                                <i class="fas fa-user-shield text-color6 mr-1 text-sm"></i>${r.nombre}
                            </span>
                        </th>
                    `).join('')}
                </tr>
            </thead>
            <tbody>
                ${permisos.map((permiso, idx) => `
                    <tr>
                        <td class="p-3 border-b border-r text-center font-bold sticky left-0 bg-color1 z-10 text-color4 text-sm ${idx === permisos.length-1 ? 'rounded-bl-xl' : ''}">${permiso.nombre}</td>
                        ${roles.map((rol, rIdx) => {
                            const key = `${permiso.id_permiso}_${rol.id_rol}`;
                            const activo = matrix[key] === 1;
                            // Bordes redondeados en las esquinas inferiores
                            let rounded = "";
                            if (idx === permisos.length-1 && rIdx === roles.length-1) rounded = "rounded-br-2xl";
                            return `<td class="p-3 border-b border-r text-center ${rounded}">
                                <button
                                    class="rounded-full w-7 h-7 flex items-center justify-center mx-auto transition
                                        ${activo ? 'bg-color5 text-white' : 'bg-color6 text-white'}
                                        hover:bg-color4"
                                    data-id-rol="${rol.id_rol}"
                                    data-id-permiso="${permiso.id_permiso}"
                                    aria-label="${activo ? 'Activo' : 'Inactivo'}"
                                    style="font-size:0.95rem;"
                                >
                                    ${activo ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>'}
                                </button>
                            </td>`;
                        }).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="mt-6 flex flex-row gap-6 items-center justify-center text-xs sm:text-sm">
            <span class="flex items-center gap-2">
                <span class="rounded-full w-5 h-5 flex items-center justify-center bg-color5 text-white"><i class="fas fa-check text-xs"></i></span>
                <span class="text-color5 font-semibold text-xs">Sí tiene permiso</span>
            </span>
            <span class="flex items-center gap-2">
                <span class="rounded-full w-5 h-5 flex items-center justify-center bg-color6 text-white"><i class="fas fa-times text-xs"></i></span>
                <span class="text-color6 font-semibold text-xs">No tiene permiso</span>
            </span>
        </div>
        </div>
    </div>`;

    document.getElementById("matrizPermisos").innerHTML = html;

    // Evento para actualizar permisos en tabla
    document.querySelectorAll("#matrizPermisos button").forEach(btn => {
        btn.addEventListener("click", async function () {
            const id_rol = this.getAttribute("data-id-rol");
            const id_permiso = this.getAttribute("data-id-permiso");
            const activo = this.classList.contains("bg-color5") ? 0 : 1;
            await updateRolPermiso(id_rol, id_permiso, activo);
            // Actualiza el botón visualmente
            if (activo) {
                this.classList.remove("bg-color6");
                this.classList.add("bg-color5");
                this.innerHTML = '<i class="fas fa-check"></i>';
            } else {
                this.classList.remove("bg-color5");
                this.classList.add("bg-color6");
                this.innerHTML = '<i class="fas fa-times"></i>';
            }
        });
    });
}

// Exporta la función principal para dashboard.js
window.renderPermisos = function () {
    renderPermisosMatriz();
};
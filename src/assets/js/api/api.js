const API_BASE = "/tk/server/routes/api.php";

/**
 * Solicita los roles activos
 */
export async function getRoles() {
    const res = await fetch(`${API_BASE}?module=roles&action=get_roles`);
    return await res.json();
}

/**
 * Actualiza la descripción de un rol y la fecha de actualización
 */
export async function updateDescripcionRol(id_rol, descripcion) {
    const res = await fetch(`${API_BASE}?module=roles&action=update_descripcion`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id_rol=${encodeURIComponent(id_rol)}&descripcion=${encodeURIComponent(descripcion)}`
    });
    return await res.json();
}

/**
 * Solicita los tipos de documento y roles (catálogos de usuario)
 */
export async function getCatalogosUsuario() {
    const res = await fetch(`${API_BASE}?module=usuarios&action=get_catalogos`);
    return await res.json();
}

/**
 * Solicita los datos del usuario actual (dashboard)
 */
export async function getDashboardUser() {
    const res = await fetch(`${API_BASE}?module=dashboard&action=get_user`, {
        credentials: "include",
        headers: { "Accept": "application/json" }
    });
    return await res.json();
}

/**
 * Solicita la lista de usuarios
 */
export async function fetchUsuarios() {
    const res = await fetch(`${API_BASE}?module=usuarios&action=fetch`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "action=fetch"
    });
    return await res.json();
}

/**
 * Solicita los datos de un usuario por ID
 */
export async function fetchUsuarioById(id) {
    const res = await fetch(`${API_BASE}?module=usuarios&action=fetch`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=fetch&id_usuario=${id}`
    });
    return await res.json();
}

/**
 * Realiza una petición POST genérica (útil para verificación de código, registro, etc.)
 */
export async function apiPost(data) {
    const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return await res.json();
}

/**
 * --- PERMISOS ---
 * Solicita la lista de permisos
 */
export async function fetchPermisos() {
    const res = await fetch(`${API_BASE}?module=permisos&action=fetch`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "action=fetch"
    });
    return await res.json();
}

/**
 * Solicita los datos de un permiso por ID
 */
export async function fetchPermisoById(id) {
    const res = await fetch(`${API_BASE}?module=permisos&action=fetch`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=fetch&id_permiso=${id}`
    });
    return await res.json();
}

/**
 * Actualiza el estado de un permiso (activar/inactivar)
 */
export async function updateEstadoPermiso(id_permiso, estado) {
    const res = await fetch(`${API_BASE}?module=permisos&action=update_estado`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id_permiso=${encodeURIComponent(id_permiso)}&estado=${encodeURIComponent(estado)}`
    });
    return await res.json();
}

/**
 * Actualiza la descripción de un permiso
 */
export async function updateDescripcionPermiso(id_permiso, descripcion) {
    const res = await fetch(`${API_BASE}?module=permisos&action=update_descripcion`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id_permiso=${encodeURIComponent(id_permiso)}&descripcion=${encodeURIComponent(descripcion)}`
    });
    return await res.json();
}

/**
 * Crea un nuevo permiso
 */
export async function createPermiso(data) {
    const res = await fetch(`${API_BASE}?module=permisos&action=create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return await res.json();
}

/**
 * Elimina un permiso por ID
 */
export async function deletePermiso(id_permiso) {
    const res = await fetch(`${API_BASE}?module=permisos&action=delete`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id_permiso=${encodeURIComponent(id_permiso)}`
    });
    return await res.json();
}

/**
 * Consulta la matriz de roles y permisos
 */
export async function fetchRolesPermisosMatrix() {
    const res = await fetch(`${API_BASE}?module=permisos&action=fetch_matrix`);
    return await res.json();
}

/**
 * Actualiza el permiso de un rol (activo/inactivo)
 */
export async function updateRolPermiso(id_rol, id_permiso, activo) {
    const res = await fetch(`${API_BASE}?module=permisos&action=update_rol_permiso`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id_rol=${encodeURIComponent(id_rol)}&id_permiso=${encodeURIComponent(id_permiso)}&activo=${activo ? 1 : 0}`
    });
    return await res.json();
}

/**
 * --- TIPOLOGIAS ---
 * Solicita la lista de tipologías
 */
export async function fetchTipologias() {
    const res = await fetch(`${API_BASE}?module=tipologias&action=fetch`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "action=fetch"
    });
    return await res.json();
}

/**
 * Solicita los datos de una tipología por ID
 */
export async function fetchTipologiaById(id) {
    const res = await fetch(`${API_BASE}?module=tipologias&action=fetch`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=fetch&id_tipologia=${id}`
    });
    return await res.json();
}

/**
 * Crea una nueva tipología
 */
export async function createTipologia(data) {
    const res = await fetch(`${API_BASE}?module=tipologias&action=add`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString()
    });
    return await res.json();
}

/**
 * Actualiza una tipología
 */
export async function updateTipologia(id, data) {
    data.id_tipologia = id;
    const res = await fetch(`${API_BASE}?module=tipologias&action=update`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString()
    });
    return await res.json();
}

/**
 * Elimina una tipología por ID (eliminación lógica)
 */
export async function deleteTipologia(id) {
    const res = await fetch(`${API_BASE}?module=tipologias&action=delete`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id_tipologia=${id}`
    });
    return await res.json();
}

/**
 * Cambia el estado de una tipología (activar/inactivar)
 */
export async function toggleEstadoTipologia(id, estado) {
    const res = await fetch(`${API_BASE}?module=tipologias&action=toggle_estado`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id_tipologia=${id}&estado_tipologia=${estado}`
    });
    return await res.json();
}

// ...agrega aquí más funciones para otros módulos y acciones...
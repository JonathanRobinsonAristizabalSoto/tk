const API_BASE = "/tk/server/routes/api.php";

/**
 * Solicita los roles activos
 */
export async function getRoles() {
    const res = await fetch(`${API_BASE}?module=roles&action=get_roles`);
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

// ...agrega aquí más funciones para otros módulos y acciones...
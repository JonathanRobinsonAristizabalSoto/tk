<?php
// Incluye archivos de configuración y controladores principales
require_once("../config/config.php");
require_once("../controller/RolesController.php");
require_once("../controller/UsuariosController.php");
require_once("../controller/DashboardController.php");

// Obtiene el módulo y la acción solicitados de forma segura (GET o POST)
$action = $_GET['action'] ?? $_POST['action'] ?? '';
$module = $_GET['module'] ?? $_POST['module'] ?? '';

// Define los módulos válidos y sus controladores asociados
$validModules = [
    'roles'      => RolesController::class,
    'usuarios'   => UsuariosController::class,
    'dashboard'  => DashboardController::class,
    // Puedes agregar aquí otros módulos si los necesitas
];

// Establece el tipo de respuesta como JSON
header('Content-Type: application/json; charset=utf-8');

// Verifica que el módulo solicitado sea válido
if (!isset($validModules[$module])) {
    echo json_encode(['success' => false, 'message' => 'Módulo no válido.']);
    exit;
}

try {
    // Instancia el controlador correspondiente al módulo
    $controllerClass = $validModules[$module];
    $controller = new $controllerClass($pdo);

    // Verifica que el controlador tenga el método handle
    if (!method_exists($controller, 'handle')) {
        echo json_encode(['success' => false, 'message' => 'Método handle no implementado.']);
        exit;
    }

    // Ejecuta la acción solicitada usando el método handle del controlador
    $controller->handle($action);
} catch (Throwable $e) {
    // Manejo global de errores: responde con mensaje y detalle del error
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor.',
        'error'   => $e->getMessage()
    ]);
}
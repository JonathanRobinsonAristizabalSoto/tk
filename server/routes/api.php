<?php
// Incluye archivos de configuración y controladores principales
require_once("../config/config.php");
require_once("../controller/RolesController.php");
require_once("../controller/UsuariosController.php");
require_once("../controller/DashboardController.php");
require_once("../controller/RegisterController.php");
require_once("../controller/LoginController.php");
require_once("../controller/PermisosController.php");
require_once("../controller/TipologiasController.php");
require_once("../controller/SubtipologiasController.php");
require_once("../controller/ProgramasController.php");
require_once("../controller/TicketsController.php");

// Obtiene el módulo y la acción solicitados de forma segura (GET, POST o JSON)
$action = $_GET['action'] ?? $_POST['action'] ?? '';
$module = $_GET['module'] ?? $_POST['module'] ?? '';

// Si la petición es JSON, decodifica el cuerpo
if ($_SERVER['REQUEST_METHOD'] === 'POST' && empty($module)) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (is_array($input)) {
        $action = $input['action'] ?? $action;
        $module = $input['module'] ?? $module;
        // Puedes pasar otros datos al controlador si lo necesitas
        $_POST = array_merge($_POST, $input);
    }
}

// Define los módulos válidos y sus controladores asociados
$validModules = [
    'roles'      => RolesController::class,
    'usuarios'   => UsuariosController::class,
    'dashboard'  => DashboardController::class,
    'register'   => RegisterController::class,
    'login'      => LoginController::class,
    'permisos'   => PermisosController::class,
    'tipologias' => TipologiasController::class,
    'subtipologias' => SubtipologiasController::class,
    'programas' => ProgramasController::class,
    'tickets' => TicketsController::class,
    // Agrega aquí otros módulos si los necesitas
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
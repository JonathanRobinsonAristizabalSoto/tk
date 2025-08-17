<?php
header('Access-Control-Allow-Origin: http://localhost'); // Cambia por tu dominio si es diferente
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Manejo de preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();

try {
    require_once("../config/config.php");

    // Sanitizar datos
    function limpiar($valor) {
        return htmlspecialchars(trim($valor), ENT_QUOTES, 'UTF-8');
    }

    $tipo_documento = limpiar($_POST['typeDocument'] ?? '');
    $documento = limpiar($_POST['documento'] ?? '');
    $password = $_POST['password'] ?? '';
    $id_rol = limpiar($_POST['user-type'] ?? '');

    if ($tipo_documento && $documento && $password && $id_rol) {
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE tipo_documento = ? AND documento = ? AND id_rol = ? AND estado = 'Activo' AND eliminado = 0");
        $stmt->execute([$tipo_documento, $documento, $id_rol]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario && password_verify($password, $usuario['password'])) {
            $_SESSION['documento'] = $usuario['documento'];
            $_SESSION['nombre'] = $usuario['nombre'];
            $_SESSION['id_rol'] = $usuario['id_rol'];
            $_SESSION['email'] = $usuario['email'];
            echo json_encode(['success' => true, 'message' => 'Inicio de sesión exitoso.']);
            exit;
        } else {
            echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas o usuario inactivo/eliminado.']);
            exit;
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
        exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
    exit;
}
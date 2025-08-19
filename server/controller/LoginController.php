<?php
header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once("../config/config.php");
require_once("../utils/functions.php"); // <-- Aquí incluyes la función limpiar

class LoginController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function handle($action) {
        if ($action === "login" && $_SERVER["REQUEST_METHOD"] === "POST") {
            $this->login();
        } else {
            echo json_encode(['success' => false, 'message' => 'Acción o método no permitido.']);
        }
    }

    public function login() {
        $tipo_documento = limpiar($_POST['typeDocument'] ?? '');
        $documento = limpiar($_POST['documento'] ?? '');
        $password = $_POST['password'] ?? '';
        $id_rol = limpiar($_POST['user-type'] ?? '');

        if ($tipo_documento && $documento && $password && $id_rol) {
            $stmt = $this->pdo->prepare("SELECT * FROM usuarios WHERE tipo_documento = ? AND documento = ? AND id_rol = ? AND estado = 'Activo' AND eliminado = 0");
            $stmt->execute([$tipo_documento, $documento, $id_rol]);
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($usuario && password_verify($password, $usuario['password'])) {
                $_SESSION['documento'] = $usuario['documento'];
                $_SESSION['nombre'] = $usuario['nombre'];
                $_SESSION['id_rol'] = $usuario['id_rol'];
                $_SESSION['email'] = $usuario['email'];
                echo json_encode([
                    'success' => true,
                    'message' => 'Inicio de sesión exitoso.',
                    'nombre' => $usuario['nombre']
                ]);
                exit;
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Credenciales incorrectas o usuario inactivo/eliminado.'
                ]);
                exit;
            }
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Todos los campos son obligatorios.'
            ]);
            exit;
        }
    }
}
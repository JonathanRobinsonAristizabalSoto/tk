<?php
session_start();

// Regenerar el ID de sesión para mayor seguridad
if (!isset($_SESSION['regenerado'])) {
    session_regenerate_id(true);
    $_SESSION['regenerado'] = true;
}

require_once("../config/config.php");

class DashboardController {
    private $pdo;
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function handle($action) {
        switch ($action) {
            case 'get_user':
                header('Content-Type: application/json');
                if (!isset($_SESSION['documento']) || empty($_SESSION['documento'])) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'No autenticado',
                        'redirect' => '/tk/index.html'
                    ]);
                    exit;
                }

                try {
                    $documento = $_SESSION['documento'];
                    $stmt = $this->pdo->prepare(
                        "SELECT u.nombre, u.apellido, u.email, u.documento, u.telefono, u.departamento, u.municipio, u.foto, r.nombre AS rol_nombre
                         FROM usuarios u
                         LEFT JOIN roles r ON u.id_rol = r.id_rol
                         WHERE u.documento = ?"
                    );
                    $stmt->execute([$documento]);
                    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

                    if ($usuario) {
                        if (!$usuario['foto']) {
                            $usuario['foto'] = 'assets/images/perfiles/default.png';
                        }
                        $usuario['success'] = true;
                        echo json_encode($usuario);
                    } else {
                        echo json_encode([
                            'success' => false,
                            'message' => 'Usuario no encontrado',
                            'redirect' => '/tk/index.html'
                        ]);
                    }
                } catch (PDOException $e) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Error de conexión. Contacte al administrador.',
                        'redirect' => '/tk/index.html'
                    ]);
                }
                break;

            default:
                // Si la petición es normal (HTML)
                if (!isset($_SESSION['documento']) || empty($_SESSION['documento'])) {
                    header("Location: /tk/index.html");
                    exit;
                }
                readfile("../../src/pages/dashboard.html");
                break;
        }
    }
}
<?php
require_once("../model/Rol.php");

/**
 * Controlador para gestión de roles.
 * Solo permite consultar roles, ya que los roles son predeterminados y no se crean ni eliminan desde la aplicación.
 */
class RolesController {
    private $rolModel;

    /**
     * Constructor: recibe la conexión PDO y crea el modelo de roles.
     * @param PDO $pdo Conexión a la base de datos
     */
    public function __construct($pdo) {
        $this->rolModel = new Rol($pdo);
    }

    /**
     * Maneja las acciones solicitadas para el módulo roles.
     * @param string $action Acción a ejecutar (get_roles, get_all, get_by_id)
     */
    public function handle($action) {
        try {
            switch ($action) {
                case 'get_roles':
                    // Obtiene los roles activos
                    $roles = $this->rolModel->obtenerActivos();
                    echo json_encode([
                        'success' => true,
                        'roles' => $roles
                    ]);
                    break;
                case 'get_all':
                    // Obtiene todos los roles no eliminados
                    $roles = $this->rolModel->obtenerTodos();
                    echo json_encode([
                        'success' => true,
                        'roles' => $roles
                    ]);
                    break;
                case 'get_by_id':
                    // Obtiene un rol por su ID
                    $id_rol = intval($_POST['id_rol'] ?? $_GET['id_rol'] ?? 0);
                    if ($id_rol <= 0) {
                        echo json_encode(['success' => false, 'message' => 'ID de rol inválido.']);
                        break;
                    }
                    $rol = $this->rolModel->obtenerPorId($id_rol);
                    echo json_encode([
                        'success' => $rol ? true : false,
                        'rol' => $rol
                    ]);
                    break;
                default:
                    // Acción no válida para este módulo
                    echo json_encode([
                        'success' => false,
                        'message' => 'Acción no válida para roles.'
                    ]);
            }
        } catch (Throwable $e) {
            // Manejo global de errores
            echo json_encode([
                'success' => false,
                'message' => 'Error en el controlador de roles.',
                'error' => $e->getMessage()
            ]);
        }
    }
}
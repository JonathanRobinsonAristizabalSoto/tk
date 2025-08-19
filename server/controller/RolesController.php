<?php
header('Content-Type: application/json');
require_once("../model/Rol.php");

/**
 * Controlador para gestión de roles.
 * Permite consultar y actualizar la descripción de los roles.
 */
class RolesController
{
    private $rolModel;

    /**
     * Constructor: recibe la conexión PDO y crea el modelo de roles.
     * @param PDO $pdo Conexión a la base de datos
     */
    public function __construct($pdo)
    {
        $this->rolModel = new Rol($pdo);
    }

    /**
     * Maneja las acciones solicitadas para el módulo roles.
     * @param string $action Acción a ejecutar (get_roles, get_all, get_by_id, update_descripcion)
     */
    public function handle($action)
    {
        try {
            switch ($action) {
                case 'get_roles':
                    $roles = $this->rolModel->obtenerActivos();
                    $roles = array_map(function ($rol) {
                        return [
                            'id_rol'              => $rol['id_rol'] ?? null,
                            'nombre'              => $rol['nombre'] ?? '',
                            'estado'              => $rol['estado'] ?? '',
                            'descripcion'         => $rol['descripcion'] ?? '',
                            'fecha_actualizacion' => $rol['fecha_actualizacion'] ?? ''
                        ];
                    }, $roles);
                    echo json_encode([
                        'success' => true,
                        'roles' => $roles
                    ]);
                    exit;
                case 'get_all':
                    $roles = $this->rolModel->obtenerTodos();
                    $roles = array_map(function ($rol) {
                        return [
                            'id_rol'              => $rol['id_rol'] ?? null,
                            'nombre'              => $rol['nombre'] ?? '',
                            'estado'              => $rol['estado'] ?? '',
                            'descripcion'         => $rol['descripcion'] ?? '',
                            'fecha_actualizacion' => $rol['fecha_actualizacion'] ?? ''
                        ];
                    }, $roles);
                    echo json_encode([
                        'success' => true,
                        'roles' => $roles
                    ]);
                    exit;
                case 'get_by_id':
                    $id_rol = intval($_POST['id_rol'] ?? $_GET['id_rol'] ?? 0);
                    if ($id_rol <= 0) {
                        echo json_encode(['success' => false, 'message' => 'ID de rol inválido.']);
                        exit;
                    }
                    $rol = $this->rolModel->obtenerPorId($id_rol);
                    if ($rol) {
                        $rol = [
                            'id_rol'              => $rol['id_rol'] ?? null,
                            'nombre'              => $rol['nombre'] ?? '',
                            'estado'              => $rol['estado'] ?? '',
                            'descripcion'         => $rol['descripcion'] ?? '',
                            'fecha_actualizacion' => $rol['fecha_actualizacion'] ?? ''
                        ];
                    }
                    echo json_encode([
                        'success' => $rol ? true : false,
                        'rol' => $rol
                    ]);
                    exit;
                case 'update_descripcion':
                    $id_rol = intval($_POST['id_rol'] ?? 0);
                    $descripcion = $_POST['descripcion'] ?? '';
                    if ($id_rol <= 0 || $descripcion === '') {
                        echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
                        exit;
                    }
                    $exito = $this->rolModel->actualizarDescripcion($id_rol, $descripcion);
                    echo json_encode(['success' => $exito]);
                    exit;
                default:
                    echo json_encode([
                        'success' => false,
                        'message' => 'Acción no válida para roles.'
                    ]);
                    exit;
            }
        } catch (Throwable $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Error en el controlador de roles.',
                'error' => $e->getMessage()
            ]);
            exit;
        }
    }
}
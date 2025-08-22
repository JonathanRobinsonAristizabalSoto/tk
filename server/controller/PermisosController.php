<?php

require_once(__DIR__ . '/../model/Permisos.php');

class PermisosController
{
    private $pdo;
    private $model;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
        $this->model = new Permisos($pdo);
    }

    public function handle($action)
    {
        switch ($action) {
            case 'fetch':
                $this->fetch();
                break;
            case 'get':
                $this->get();
                break;
            case 'create':
                $this->create();
                break;
            case 'update_descripcion':
                $this->updateDescripcion();
                break;
            case 'update_estado':
                $this->updateEstado();
                break;
            case 'delete':
                $this->delete();
                break;
            case 'fetch_matrix':
                $this->fetchMatrix();
                break;
            case 'update_rol_permiso':
                $this->updateRolPermiso();
                break;
            default:
                echo json_encode(['success' => false, 'message' => 'Acción no válida en permisos.']);
        }
    }

    // Obtener todos los permisos
    private function fetch()
    {
        $permisos = $this->model->getAll();
        echo json_encode(['success' => true, 'permisos' => $permisos]);
    }

    // Obtener un permiso por ID
    private function get()
    {
        $id_permiso = $_GET['id_permiso'] ?? $_POST['id_permiso'] ?? null;
        if (!$id_permiso) {
            echo json_encode(['success' => false, 'message' => 'ID de permiso requerido.']);
            return;
        }
        $permiso = $this->model->getById($id_permiso);
        if ($permiso) {
            echo json_encode(['success' => true, 'permiso' => $permiso]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Permiso no encontrado.']);
        }
    }

    // Crear un nuevo permiso
    private function create()
    {
        $nombre = $_POST['nombre'] ?? '';
        $descripcion = $_POST['descripcion'] ?? '';
        if (!$nombre) {
            echo json_encode(['success' => false, 'message' => 'Nombre requerido.']);
            return;
        }
        $result = $this->model->create($nombre, $descripcion);
        echo json_encode(['success' => $result]);
    }

    // Actualizar la descripción de un permiso
    private function updateDescripcion()
    {
        $id_permiso = $_POST['id_permiso'] ?? null;
        $descripcion = $_POST['descripcion'] ?? '';
        if (!$id_permiso) {
            echo json_encode(['success' => false, 'message' => 'ID de permiso requerido.']);
            return;
        }
        $result = $this->model->updateDescripcion($id_permiso, $descripcion);
        echo json_encode(['success' => $result]);
    }

    // Actualizar el estado de un permiso
    private function updateEstado()
    {
        $id_permiso = $_POST['id_permiso'] ?? null;
        $estado = $_POST['estado'] ?? '';
        if (!$id_permiso || !$estado) {
            echo json_encode(['success' => false, 'message' => 'ID y estado requeridos.']);
            return;
        }
        $result = $this->model->updateEstado($id_permiso, $estado);
        echo json_encode(['success' => $result]);
    }

    // Eliminar (soft delete) un permiso
    private function delete()
    {
        $id_permiso = $_POST['id_permiso'] ?? null;
        if (!$id_permiso) {
            echo json_encode(['success' => false, 'message' => 'ID de permiso requerido.']);
            return;
        }
        $result = $this->model->delete($id_permiso);
        echo json_encode(['success' => $result]);
    }

    // --- MATRIZ DE ROLES Y PERMISOS ---
    private function fetchMatrix()
    {
        $matrix = $this->model->getRolesPermisosMatrix();
        echo json_encode(['success' => true, 'matrix' => $matrix]);
    }

    // Actualiza el permiso de un rol (activar/inactivar)
    private function updateRolPermiso()
    {
        $id_rol = $_POST['id_rol'] ?? null;
        $id_permiso = $_POST['id_permiso'] ?? null;
        $activo = $_POST['activo'] ?? null;
        if (!$id_rol || !$id_permiso || !isset($activo)) {
            echo json_encode(['success' => false, 'message' => 'Datos requeridos.']);
            return;
        }
        // Si activo=1, inserta o reactiva la relación; si activo=0, marca eliminado=1
        if ($activo == 1) {
            $stmt = $this->pdo->prepare("INSERT INTO rolpermisos (id_rol, id_permiso, eliminado) VALUES (?, ?, 0)
                ON DUPLICATE KEY UPDATE eliminado=0");
            $result = $stmt->execute([$id_rol, $id_permiso]);
        } else {
            $stmt = $this->pdo->prepare("UPDATE rolpermisos SET eliminado=1 WHERE id_rol=? AND id_permiso=?");
            $result = $stmt->execute([$id_rol, $id_permiso]);
        }
        echo json_encode(['success' => $result]);
    }
}
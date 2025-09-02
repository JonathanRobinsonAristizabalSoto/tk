<?php

require_once(__DIR__ . '/../model/Programas.php');

class ProgramasController
{
    private $model;

    public function __construct($pdo)
    {
        $this->model = new Programas($pdo);
    }

    // Maneja las acciones del API
    public function handle($action)
    {
        switch ($action) {
            case 'getAll':
                $this->getAll();
                break;
            case 'getById':
                $this->getById();
                break;
            case 'create':
                $this->create();
                break;
            case 'update':
                $this->update();
                break;
            case 'delete':
                $this->delete();
                break;
            default:
                echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
        }
    }

    // Obtener todos los programas
    private function getAll()
    {
        $data = $this->model->getAll();
        echo json_encode(['success' => true, 'data' => $data]);
    }

    // Obtener un programa por ID
    private function getById()
    {
        $id = $_GET['id'] ?? $_POST['id'] ?? null;
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'ID requerido.']);
            return;
        }
        $data = $this->model->getById($id);
        echo json_encode(['success' => true, 'data' => $data]);
    }

    // Crear un nuevo programa
    private function create()
    {
        $data = $_POST;
        if (empty($data)) {
            $data = json_decode(file_get_contents('php://input'), true);
        }
        if (!$data) {
            echo json_encode(['success' => false, 'message' => 'Datos requeridos.']);
            return;
        }
        $programa = $this->model->create($data);
        echo json_encode(['success' => true, 'data' => $programa]);
    }

    // Actualizar un programa
    private function update()
    {
        $id = $_POST['id'] ?? null;
        $data = $_POST;
        if (empty($data)) {
            $data = json_decode(file_get_contents('php://input'), true);
            $id = $data['id'] ?? $id;
        }
        if (!$id || !$data) {
            echo json_encode(['success' => false, 'message' => 'ID y datos requeridos.']);
            return;
        }
        $programa = $this->model->update($id, $data);
        echo json_encode(['success' => true, 'data' => $programa]);
    }

    // Eliminar (soft delete) un programa
    private function delete()
    {
        $id = $_POST['id'] ?? null;
        if (!$id) {
            $input = json_decode(file_get_contents('php://input'), true);
            $id = $input['id'] ?? null;
        }
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'ID requerido.']);
            return;
        }
        $result = $this->model->delete($id);
        echo json_encode(['success' => $result]);
    }
}
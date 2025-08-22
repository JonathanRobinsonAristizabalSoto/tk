<?php
require_once("../model/Tipologias.php");

class TipologiasController
{
    private $model;

    public function __construct($pdo)
    {
        $this->model = new Tipologias($pdo);
    }

    public function handle($action)
    {
        try {
            switch ($action) {
                case 'add':
                    $data = $_POST;
                    $result = $this->model->crear($data);
                    echo json_encode(['success' => $result, 'message' => $result ? 'Tipología creada.' : 'Error al crear']);
                    break;
                case 'update':
                    $id = $_POST['id_tipologia'] ?? null;
                    $data = $_POST;
                    $result = $this->model->actualizar($id, $data);
                    echo json_encode(['success' => $result, 'message' => $result ? 'Tipología actualizada.' : 'Error al actualizar']);
                    break;
                case 'delete':
                    $id = $_POST['id_tipologia'] ?? null;
                    $result = $this->model->eliminarLogico($id);
                    echo json_encode(['success' => $result, 'message' => $result ? 'Tipología eliminada.' : 'Error al eliminar']);
                    break;
                case 'toggle_estado':
                    $id = $_POST['id_tipologia'] ?? null;
                    $estado = $_POST['estado_tipologia'] ?? 'Activo';
                    $result = $this->model->cambiarEstado($id, $estado);
                    echo json_encode(['success' => $result, 'message' => $result ? 'Estado actualizado.' : 'Error al actualizar estado']);
                    break;
                case 'fetch':
                    if (!empty($_POST['id_tipologia'])) {
                        $data = $this->model->obtenerPorId($_POST['id_tipologia']);
                        echo json_encode($data);
                    } else {
                        $data = $this->model->obtenerTodos();
                        echo json_encode($data);
                    }
                    break;
                default:
                    echo json_encode(['success' => false, 'message' => 'Acción no válida']);
            }
        } catch (Throwable $e) {
            echo json_encode(['success' => false, 'message' => 'Error en Tipologias', 'error' => $e->getMessage()]);
        }
    }
}
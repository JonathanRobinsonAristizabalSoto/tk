<?php
require_once("../model/Subtipologias.php");

class SubtipologiasController
{
    private $model;

    public function __construct($pdo)
    {
        $this->model = new Subtipologias($pdo);
    }

    public function handle($action)
    {
        switch ($action) {
            case 'listar':
                echo json_encode($this->model->listar());
                break;
            case 'crear':
                $data = $_POST;
                echo json_encode($this->model->crear($data));
                break;
            case 'actualizar':
                $id = $_POST['id_subtipologia'];
                $data = $_POST;
                echo json_encode($this->model->actualizar($id, $data));
                break;
            case 'eliminar':
                $id = $_POST['id_subtipologia'];
                echo json_encode($this->model->eliminar($id));
                break;
            default:
                echo json_encode(['error' => 'Acción no válida']);
        }
    }
}
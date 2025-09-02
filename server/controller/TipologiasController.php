<?php
require_once("../model/Tipologias.php");

class TipologiasController
{
    private $model;

    public function __construct($pdo)
    {
        $this->model = new Tipologias($pdo);
    }

    // Método requerido por api.php
    public function handle($action)
    {
        switch ($action) {
            case 'fetch':
                if (!empty($_POST['id_tipologia'])) {
                    $data = $this->obtenerPorId($_POST['id_tipologia']);
                    echo json_encode($data ?: []);
                } else {
                    $data = $this->obtenerTodas();
                    echo json_encode($data ?: []);
                }
                break;
            case 'add':
                $result = $this->crear($_POST);
                echo json_encode($result);
                break;
            case 'update':
                $result = $this->actualizar($_POST['id_tipologia'], $_POST);
                echo json_encode($result);
                break;
            case 'delete':
                $result = $this->eliminarLogico($_POST['id_tipologia']);
                echo json_encode($result);
                break;
            case 'toggle_estado':
                $result = $this->cambiarEstado($_POST['id_tipologia'], $_POST['estado_tipologia']);
                echo json_encode($result);
                break;
            default:
                echo json_encode(['success' => false, 'message' => 'Acción no válida']);
        }
    }

    public function obtenerTodas()
    {
        return $this->model->obtenerTodos();
    }

    public function obtenerPorId($id_tipologia)
    {
        return $this->model->obtenerPorId($id_tipologia);
    }

    public function crear($data)
    {
        if (
            empty($data['nombre']) ||
            !isset($data['descripcion']) ||
            empty($data['id_rol'])
        ) {
            return ['success' => false, 'error' => 'Datos incompletos'];
        }
        $result = $this->model->crear($data);
        return $result ? ['success' => true] : ['success' => false, 'error' => 'No se pudo crear'];
    }

    public function actualizar($id_tipologia, $data)
    {
        if (
            empty($data['nombre']) ||
            !isset($data['descripcion']) ||
            empty($data['id_rol'])
        ) {
            return ['success' => false, 'error' => 'Datos incompletos'];
        }
        $result = $this->model->actualizar($id_tipologia, $data);
        return $result ? ['success' => true] : ['success' => false, 'error' => 'No se pudo actualizar'];
    }

    public function eliminarLogico($id_tipologia)
    {
        $result = $this->model->eliminarLogico($id_tipologia);
        return $result ? ['success' => true] : ['success' => false, 'error' => 'No se pudo eliminar'];
    }

    public function cambiarEstado($id_tipologia, $estado)
    {
        $result = $this->model->cambiarEstado($id_tipologia, $estado);
        return $result ? ['success' => true] : ['success' => false, 'error' => 'No se pudo cambiar el estado'];
    }
}
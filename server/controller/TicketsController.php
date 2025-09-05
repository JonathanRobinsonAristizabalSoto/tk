<?php

require_once __DIR__ . '/../model/Ticket.php';

class TicketsController
{
    private $model;

    public function __construct($db)
    {
        $this->model = new Ticket($db);
    }

    // Listar tickets
    public function listar($params = [])
    {
        $tickets = $this->model->listar($params);
        echo json_encode(['success' => true, 'data' => $tickets]);
        exit;
    }

    // Obtener ticket por ID
    public function obtener($params = [])
    {
        if (!isset($params['id_ticket'])) {
            echo json_encode(['success' => false, 'message' => 'ID de ticket faltante']);
            exit;
        }
        $ticket = $this->model->obtener($params['id_ticket']);
        if ($ticket) {
            $ticket['comentarios'] = $this->model->comentarios($params['id_ticket']);
            $ticket['adjuntos'] = $this->model->adjuntos($params['id_ticket']);
            $ticket['historial_estados'] = $this->model->historialEstados($params['id_ticket']);
            $ticket['eventos'] = $this->model->eventos($params['id_ticket']);
            $ticket['asignaciones'] = $this->model->asignaciones($params['id_ticket']);
            echo json_encode(['success' => true, 'data' => $ticket]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Ticket no encontrado']);
        }
        exit;
    }

    // Crear ticket
    public function crear($params = [])
    {
        if (empty($params['id_usuario']) || empty($params['descripcion']) || empty($params['prioridad']) || empty($params['estado'])) {
            echo json_encode(['success' => false, 'message' => 'Datos obligatorios faltantes']);
            exit;
        }
        $params['numero_ticket'] = 'TK-' . time() . '-' . rand(100, 999);
        $id = $this->model->crear($params);
        echo json_encode(['success' => true, 'id_ticket' => $id]);
        exit;
    }

    // Editar ticket
    public function editar($params = [])
    {
        if (!isset($params['id_ticket']) || !isset($params['data'])) {
            echo json_encode(['success' => false, 'message' => 'Datos faltantes']);
            exit;
        }
        $res = $this->model->editar($params['id_ticket'], $params['data']);
        echo json_encode(['success' => $res ? true : false]);
        exit;
    }

    // Eliminar ticket
    public function eliminar($params = [])
    {
        if (!isset($params['id_ticket'])) {
            echo json_encode(['success' => false, 'message' => 'ID de ticket faltante']);
            exit;
        }
        $res = $this->model->eliminar($params['id_ticket']);
        echo json_encode(['success' => $res ? true : false]);
        exit;
    }

    // Cambiar estado
    public function cambiarEstado($params = [])
    {
        if (!isset($params['id_ticket'], $params['estado_nuevo'], $params['id_usuario'])) {
            echo json_encode(['success' => false, 'message' => 'Datos faltantes']);
            exit;
        }
        $res = $this->model->cambiarEstado($params['id_ticket'], $params['estado_nuevo'], $params['id_usuario']);
        echo json_encode(['success' => $res ? true : false]);
        exit;
    }

    // Agregar comentario
    public function agregarComentario($params = [])
    {
        if (!isset($params['id_ticket'], $params['id_usuario'], $params['comentario'])) {
            echo json_encode(['success' => false, 'message' => 'Datos faltantes']);
            exit;
        }
        $id = $this->model->agregarComentario(
            $params['id_ticket'],
            $params['id_usuario'],
            $params['comentario'],
            $params['prioridad'] ?? null,
            $params['categoria'] ?? null
        );
        echo json_encode(['success' => true, 'id_comentario' => $id]);
        exit;
    }

    // Agregar adjunto
    public function agregarAdjunto($params = [])
    {
        if (!isset($params['id_ticket'], $params['id_comentario'], $params['nombre_archivo'], $params['ruta_archivo'], $params['tipo_archivo'])) {
            echo json_encode(['success' => false, 'message' => 'Datos faltantes']);
            exit;
        }
        $id = $this->model->agregarAdjunto(
            $params['id_ticket'],
            $params['id_comentario'],
            $params['nombre_archivo'],
            $params['ruta_archivo'],
            $params['tipo_archivo']
        );
        echo json_encode(['success' => true, 'id_adjunto' => $id]);
        exit;
    }

    // Agregar evento
    public function agregarEvento($params = [])
    {
        if (!isset($params['id_ticket'], $params['accion'], $params['id_usuario'])) {
            echo json_encode(['success' => false, 'message' => 'Datos faltantes']);
            exit;
        }
        $id = $this->model->agregarEvento(
            $params['id_ticket'],
            $params['accion'],
            $params['id_usuario'],
            $params['categoria'] ?? null
        );
        echo json_encode(['success' => true, 'id_evento' => $id]);
        exit;
    }

    // Asignar responsable
    public function asignarResponsable($params = [])
    {
        if (!isset($params['id_ticket'], $params['id_usuario'])) {
            echo json_encode(['success' => false, 'message' => 'Datos faltantes']);
            exit;
        }
        $id = $this->model->asignarResponsable($params['id_ticket'], $params['id_usuario']);
        echo json_encode(['success' => true, 'id_asignacion' => $id]);
        exit;
    }

    // Método para manejar las acciones desde la API
    public function handle($action, $params = [])
    {
        switch ($action) {
            case 'listar':
                $this->listar($params);
                break;
            case 'obtener':
                $this->obtener($params);
                break;
            case 'crear':
                $this->crear($params);
                break;
            case 'editar':
                $this->editar($params);
                break;
            case 'eliminar':
                $this->eliminar($params);
                break;
            case 'cambiarEstado':
                $this->cambiarEstado($params);
                break;
            case 'agregarComentario':
                $this->agregarComentario($params);
                break;
            case 'agregarAdjunto':
                $this->agregarAdjunto($params);
                break;
            case 'agregarEvento':
                $this->agregarEvento($params);
                break;
            case 'asignarResponsable':
                $this->asignarResponsable($params);
                break;
            default:
                echo json_encode(['success' => false, 'message' => 'Acción no soportada']);
                exit;
        }
    }
}
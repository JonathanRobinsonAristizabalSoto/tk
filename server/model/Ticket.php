<?php

class Ticket
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    // Crear un ticket
    public function crear($data)
    {
        $sql = "INSERT INTO ticket (
            id_usuario, numero_ticket, descripcion, prioridad, estado, id_rol, id_programa, id_tipologia, id_subtipologia
        ) VALUES (
            :id_usuario, :numero_ticket, :descripcion, :prioridad, :estado, :id_rol, :id_programa, :id_tipologia, :id_subtipologia
        )";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id_usuario'      => $data['id_usuario'],
            ':numero_ticket'   => $data['numero_ticket'],
            ':descripcion'     => $data['descripcion'],
            ':prioridad'       => $data['prioridad'],
            ':estado'          => $data['estado'],
            ':id_rol'          => $data['id_rol'],
            ':id_programa'     => $data['id_programa'],
            ':id_tipologia'    => $data['id_tipologia'],
            ':id_subtipologia' => $data['id_subtipologia']
        ]);
        return $this->db->lastInsertId();
    }

    // Obtener todos los tickets (con filtros opcionales)
    public function listar($filtros = [])
    {
        $sql = "SELECT t.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido, p.nombre AS programa_nombre, tip.nombre AS tipologia_nombre, subtip.nombre AS subtipologia_nombre
                FROM ticket t
                LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
                LEFT JOIN programas p ON t.id_programa = p.id_programa
                LEFT JOIN tipologias tip ON t.id_tipologia = tip.id_tipologia
                LEFT JOIN subtipologias subtip ON t.id_subtipologia = subtip.id_subtipologia
                WHERE t.eliminado = 0";
        $params = [];
        if (!empty($filtros['estado'])) {
            $sql .= " AND t.estado = :estado";
            $params[':estado'] = $filtros['estado'];
        }
        if (!empty($filtros['prioridad'])) {
            $sql .= " AND t.prioridad = :prioridad";
            $params[':prioridad'] = $filtros['prioridad'];
        }
        if (!empty($filtros['id_usuario'])) {
            $sql .= " AND t.id_usuario = :id_usuario";
            $params[':id_usuario'] = $filtros['id_usuario'];
        }
        if (!empty($filtros['id_programa'])) {
            $sql .= " AND t.id_programa = :id_programa";
            $params[':id_programa'] = $filtros['id_programa'];
        }
        $sql .= " ORDER BY t.fecha_creacion DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result ?: []; // Siempre retorna array
    }

    // Obtener un ticket por ID (con detalle)
    public function obtener($id_ticket)
    {
        $sql = "SELECT t.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido, p.nombre AS programa_nombre, tip.nombre AS tipologia_nombre, subtip.nombre AS subtipologia_nombre
                FROM ticket t
                LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
                LEFT JOIN programas p ON t.id_programa = p.id_programa
                LEFT JOIN tipologias tip ON t.id_tipologia = tip.id_tipologia
                LEFT JOIN subtipologias subtip ON t.id_subtipologia = subtip.id_subtipologia
                WHERE t.id_ticket = :id_ticket AND t.eliminado = 0";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id_ticket' => $id_ticket]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: []; // Siempre retorna array
    }

    // Editar un ticket
    public function editar($id_ticket, $data)
    {
        $sql = "UPDATE ticket SET
            descripcion = :descripcion,
            prioridad = :prioridad,
            estado = :estado,
            id_rol = :id_rol,
            id_programa = :id_programa,
            id_tipologia = :id_tipologia,
            id_subtipologia = :id_subtipologia,
            fecha_actualizacion = NOW()
            WHERE id_ticket = :id_ticket AND eliminado = 0";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':descripcion'     => $data['descripcion'],
            ':prioridad'       => $data['prioridad'],
            ':estado'          => $data['estado'],
            ':id_rol'          => $data['id_rol'],
            ':id_programa'     => $data['id_programa'],
            ':id_tipologia'    => $data['id_tipologia'],
            ':id_subtipologia' => $data['id_subtipologia'],
            ':id_ticket'       => $id_ticket
        ]);
        return $stmt->rowCount();
    }

    // Eliminar (soft delete) un ticket
    public function eliminar($id_ticket)
    {
        $sql = "UPDATE ticket SET eliminado = 1 WHERE id_ticket = :id_ticket";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id_ticket' => $id_ticket]);
        return $stmt->rowCount();
    }

    // Cambiar estado y guardar en historial
    public function cambiarEstado($id_ticket, $estado_nuevo, $id_usuario)
    {
        // Obtener estado anterior
        $ticket = $this->obtener($id_ticket);
        $estado_anterior = $ticket ? $ticket['estado'] : null;

        // Actualizar estado
        $sql = "UPDATE ticket SET estado = :estado, fecha_actualizacion = NOW() WHERE id_ticket = :id_ticket";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':estado'    => $estado_nuevo,
            ':id_ticket' => $id_ticket
        ]);

        // Guardar historial
        $sqlHist = "INSERT INTO ticket_estado_historial (id_ticket, estado_anterior, estado_nuevo, id_usuario) VALUES (:id_ticket, :estado_anterior, :estado_nuevo, :id_usuario)";
        $stmtHist = $this->db->prepare($sqlHist);
        $stmtHist->execute([
            ':id_ticket'      => $id_ticket,
            ':estado_anterior'=> $estado_anterior,
            ':estado_nuevo'   => $estado_nuevo,
            ':id_usuario'     => $id_usuario
        ]);
        return true;
    }

    // Listar historial de estados
    public function historialEstados($id_ticket)
    {
        $sql = "SELECT h.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido
                FROM ticket_estado_historial h
                LEFT JOIN usuarios u ON h.id_usuario = u.id_usuario
                WHERE h.id_ticket = :id_ticket AND h.eliminado = 0
                ORDER BY h.fecha_cambio DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id_ticket' => $id_ticket]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result ?: [];
    }

    // Listar comentarios de un ticket
    public function comentarios($id_ticket)
    {
        $sql = "SELECT c.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido
                FROM comentario c
                LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
                WHERE c.id_ticket = :id_ticket AND c.eliminado = 0
                ORDER BY c.fecha_creacion ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id_ticket' => $id_ticket]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result ?: [];
    }

    // Agregar comentario
    public function agregarComentario($id_ticket, $id_usuario, $comentario, $prioridad = null, $categoria = null)
    {
        $sql = "INSERT INTO comentario (id_ticket, id_usuario, comentario, prioridad, categoria) VALUES (:id_ticket, :id_usuario, :comentario, :prioridad, :categoria)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id_ticket'   => $id_ticket,
            ':id_usuario'  => $id_usuario,
            ':comentario'  => $comentario,
            ':prioridad'   => $prioridad,
            ':categoria'   => $categoria
        ]);
        return $this->db->lastInsertId();
    }

    // Listar adjuntos de un ticket
    public function adjuntos($id_ticket)
    {
        $sql = "SELECT * FROM adjuntos WHERE id_ticket = :id_ticket AND eliminado = 0 ORDER BY fecha_subida DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id_ticket' => $id_ticket]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result ?: [];
    }

    // Agregar adjunto
    public function agregarAdjunto($id_ticket, $id_comentario, $nombre_archivo, $ruta_archivo, $tipo_archivo)
    {
        $sql = "INSERT INTO adjuntos (id_ticket, id_comentario, nombre_archivo, ruta_archivo, tipo_archivo) VALUES (:id_ticket, :id_comentario, :nombre_archivo, :ruta_archivo, :tipo_archivo)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id_ticket'      => $id_ticket,
            ':id_comentario'  => $id_comentario,
            ':nombre_archivo' => $nombre_archivo,
            ':ruta_archivo'   => $ruta_archivo,
            ':tipo_archivo'   => $tipo_archivo
        ]);
        return $this->db->lastInsertId();
    }

    // Listar eventos de un ticket
    public function eventos($id_ticket)
    {
        $sql = "SELECT e.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido
                FROM evento e
                LEFT JOIN usuarios u ON e.id_usuario = u.id_usuario
                WHERE e.id_ticket = :id_ticket AND e.eliminado = 0
                ORDER BY e.fecha_evento DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id_ticket' => $id_ticket]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result ?: [];
    }

    // Agregar evento
    public function agregarEvento($id_ticket, $accion, $id_usuario, $categoria = null)
    {
        $sql = "INSERT INTO evento (id_ticket, accion, id_usuario, categoria) VALUES (:id_ticket, :accion, :id_usuario, :categoria)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id_ticket' => $id_ticket,
            ':accion'    => $accion,
            ':id_usuario'=> $id_usuario,
            ':categoria' => $categoria
        ]);
        return $this->db->lastInsertId();
    }

    // Asignar responsable a ticket
    public function asignarResponsable($id_ticket, $id_usuario)
    {
        $sql = "INSERT INTO ticket_asignacion (id_ticket, id_usuario) VALUES (:id_ticket, :id_usuario)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id_ticket' => $id_ticket,
            ':id_usuario'=> $id_usuario
        ]);
        return $this->db->lastInsertId();
    }

    // Listar asignaciones de ticket
    public function asignaciones($id_ticket)
    {
        $sql = "SELECT ta.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido
                FROM ticket_asignacion ta
                LEFT JOIN usuarios u ON ta.id_usuario = u.id_usuario
                WHERE ta.id_ticket = :id_ticket AND ta.eliminado = 0
                ORDER BY ta.fecha_asignacion DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id_ticket' => $id_ticket]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result ?: [];
    }
}
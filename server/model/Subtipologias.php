<?php
class Subtipologias {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Obtener todas las subtipologías con su tipología principal (ajustado: campo 'nombre')
    public function listar() {
        $stmt = $this->pdo->prepare("
            SELECT s.*, t.nombre AS tipologia_principal
            FROM subtipologias s
            INNER JOIN tipologias t ON s.id_tipologia = t.id_tipologia
            WHERE s.eliminado = 0
        ");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Crear una subtipología
    public function crear($data) {
        $stmt = $this->pdo->prepare("
            INSERT INTO subtipologias (nombre, descripcion, id_tipologia, estado, eliminado, fecha_creacion)
            VALUES (:nombre, :descripcion, :id_tipologia, :estado, 0, NOW())
        ");
        return $stmt->execute([
            ':nombre' => $data['nombre'],
            ':descripcion' => $data['descripcion'],
            ':id_tipologia' => $data['id_tipologia'],
            ':estado' => $data['estado']
        ]);
    }

    // Actualizar una subtipología
    public function actualizar($id_subtipologia, $data) {
        $stmt = $this->pdo->prepare("
            UPDATE subtipologias SET
                nombre = :nombre,
                descripcion = :descripcion,
                id_tipologia = :id_tipologia,
                estado = :estado,
                fecha_actualizacion = NOW()
            WHERE id_subtipologia = :id_subtipologia
        ");
        return $stmt->execute([
            ':nombre' => $data['nombre'],
            ':descripcion' => $data['descripcion'],
            ':id_tipologia' => $data['id_tipologia'],
            ':estado' => $data['estado'],
            ':id_subtipologia' => $id_subtipologia
        ]);
    }

    // Eliminar (soft delete) una subtipología
    public function eliminar($id_subtipologia) {
        $stmt = $this->pdo->prepare("
            UPDATE subtipologias SET eliminado = 1, fecha_actualizacion = NOW()
            WHERE id_subtipologia = :id_subtipologia
        ");
        return $stmt->execute([':id_subtipologia' => $id_subtipologia]);
    }
}
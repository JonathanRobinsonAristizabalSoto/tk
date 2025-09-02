<?php
class Tipologias {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Crear tipología
    public function crear($data) {
        $sql = "INSERT INTO tipologias (nombre, descripcion, id_rol, estado_tipologia) VALUES (?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['nombre'],
            $data['descripcion'],
            $data['id_rol'],
            $data['estado_tipologia'] ?? 'Activo'
        ]);
    }

    // Actualizar tipología
    public function actualizar($id_tipologia, $data) {
        $sql = "UPDATE tipologias SET nombre=?, descripcion=?, id_rol=?, estado_tipologia=? WHERE id_tipologia=?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['nombre'],
            $data['descripcion'],
            $data['id_rol'],
            $data['estado_tipologia'],
            $id_tipologia
        ]);
    }

    // Eliminar lógica (soft delete)
    public function eliminarLogico($id_tipologia) {
        $sql = "UPDATE tipologias SET eliminado=1 WHERE id_tipologia=?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$id_tipologia]);
    }

    // Cambiar estado
    public function cambiarEstado($id_tipologia, $estado) {
        $sql = "UPDATE tipologias SET estado_tipologia=? WHERE id_tipologia=?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$estado, $id_tipologia]);
    }

    // Obtener por ID
    public function obtenerPorId($id_tipologia) {
        $sql = "SELECT t.*, r.nombre AS rol_nombre FROM tipologias t LEFT JOIN roles r ON t.id_rol = r.id_rol WHERE t.id_tipologia=? AND t.eliminado=0";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id_tipologia]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Obtener todos
    public function obtenerTodos() {
        $sql = "SELECT t.*, r.nombre AS rol_nombre FROM tipologias t LEFT JOIN roles r ON t.id_rol = r.id_rol WHERE t.eliminado=0";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
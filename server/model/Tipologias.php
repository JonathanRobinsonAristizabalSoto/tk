<?php
class Tipologias {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function crear($data) {
        $sql = "INSERT INTO tipologias (tipologia, subtipologia, id_rol, estado_tipologia) VALUES (?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['tipologia'],
            $data['subtipologia'],
            $data['id_rol'],
            $data['estado_tipologia'] ?? 'Activo'
        ]);
    }

    public function actualizar($id_tipologia, $data) {
        $sql = "UPDATE tipologias SET tipologia=?, subtipologia=?, id_rol=?, estado_tipologia=? WHERE id_tipologia=?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            $data['tipologia'],
            $data['subtipologia'],
            $data['id_rol'],
            $data['estado_tipologia'],
            $id_tipologia
        ]);
    }

    public function eliminarLogico($id_tipologia) {
        $sql = "UPDATE tipologias SET eliminado=1 WHERE id_tipologia=?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$id_tipologia]);
    }

    public function cambiarEstado($id_tipologia, $estado) {
        $sql = "UPDATE tipologias SET estado_tipologia=? WHERE id_tipologia=?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$estado, $id_tipologia]);
    }

    public function obtenerPorId($id_tipologia) {
        $sql = "SELECT * FROM tipologias WHERE id_tipologia=? AND eliminado=0";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$id_tipologia]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function obtenerTodos() {
        $sql = "SELECT t.*, r.nombre AS rol_nombre FROM tipologias t LEFT JOIN roles r ON t.id_rol = r.id_rol WHERE t.eliminado=0";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
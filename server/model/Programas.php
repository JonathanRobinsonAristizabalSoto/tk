<?php

class Programas
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    // Obtener todos los programas (no eliminados)
    public function getAll()
    {
        $stmt = $this->pdo->prepare("SELECT * FROM programas WHERE eliminado = 0");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener un programa por ID
    public function getById($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM programas WHERE id_programa = ? AND eliminado = 0");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Crear un nuevo programa
    public function create($data)
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO programas (
                codigo, version, nombre, descripcion, duracion,
                linea_tecnologica, red_tecnologica, red_de_conocimiento, modalidad,
                id_tipologia, id_subtipologia, estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['codigo'],
            $data['version'],
            $data['nombre'],
            $data['descripcion'],
            $data['duracion'],
            $data['linea_tecnologica'],
            $data['red_tecnologica'],
            $data['red_de_conocimiento'],
            $data['modalidad'],
            $data['id_tipologia'],
            $data['id_subtipologia'] ?? null,
            $data['estado']
        ]);
        return $this->getById($this->pdo->lastInsertId());
    }

    // Actualizar un programa
    public function update($id, $data)
    {
        $stmt = $this->pdo->prepare("
            UPDATE programas SET
                codigo = ?,
                version = ?,
                nombre = ?,
                descripcion = ?,
                duracion = ?,
                linea_tecnologica = ?,
                red_tecnologica = ?,
                red_de_conocimiento = ?,
                modalidad = ?,
                id_tipologia = ?,
                id_subtipologia = ?,
                estado = ?
            WHERE id_programa = ? AND eliminado = 0
        ");
        $stmt->execute([
            $data['codigo'],
            $data['version'],
            $data['nombre'],
            $data['descripcion'],
            $data['duracion'],
            $data['linea_tecnologica'],
            $data['red_tecnologica'],
            $data['red_de_conocimiento'],
            $data['modalidad'],
            $data['id_tipologia'],
            $data['id_subtipologia'] ?? null,
            $data['estado'],
            $id
        ]);
        return $this->getById($id);
    }

    // Eliminar (soft delete) un programa
    public function delete($id)
    {
        $stmt = $this->pdo->prepare("UPDATE programas SET eliminado = 1 WHERE id_programa = ?");
        return $stmt->execute([$id]);
    }
}
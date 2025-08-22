<?php

class Permisos
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    // Obtener todos los permisos (no eliminados)
    public function getAll()
    {
        $stmt = $this->pdo->prepare("SELECT * FROM permisos WHERE eliminado = 0 ORDER BY id_permiso ASC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener un permiso por ID
    public function getById($id_permiso)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM permisos WHERE id_permiso = ? AND eliminado = 0 LIMIT 1");
        $stmt->execute([$id_permiso]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Crear un nuevo permiso
    public function create($nombre, $descripcion)
    {
        $stmt = $this->pdo->prepare("INSERT INTO permisos (nombre, descripcion) VALUES (?, ?)");
        return $stmt->execute([$nombre, $descripcion]);
    }

    // Actualizar la descripción de un permiso
    public function updateDescripcion($id_permiso, $descripcion)
    {
        $stmt = $this->pdo->prepare("UPDATE permisos SET descripcion = ?, fecha_actualizacion = NOW() WHERE id_permiso = ? AND eliminado = 0");
        return $stmt->execute([$descripcion, $id_permiso]);
    }

    // Eliminar (soft delete) un permiso
    public function delete($id_permiso)
    {
        $stmt = $this->pdo->prepare("UPDATE permisos SET eliminado = 1 WHERE id_permiso = ?");
        return $stmt->execute([$id_permiso]);
    }

    // Actualizar el estado de un permiso (si tienes el campo estado)
    public function updateEstado($id_permiso, $estado)
    {
        $stmt = $this->pdo->prepare("UPDATE permisos SET estado = ?, fecha_actualizacion = NOW() WHERE id_permiso = ? AND eliminado = 0");
        return $stmt->execute([$estado, $id_permiso]);
    }

    // --- MATRIZ DE ROLES Y PERMISOS ---
    public function getRolesPermisosMatrix()
    {
        $sql = "SELECT r.id_rol, r.nombre AS rol, p.id_permiso, p.nombre AS permiso,
                       IF(rp.eliminado=0, 1, 0) AS activo
                FROM roles r
                CROSS JOIN permisos p
                LEFT JOIN rolpermisos rp ON rp.id_rol = r.id_rol AND rp.id_permiso = p.id_permiso
                WHERE r.eliminado = 0 AND p.eliminado = 0
                ORDER BY p.id_permiso, r.id_rol";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
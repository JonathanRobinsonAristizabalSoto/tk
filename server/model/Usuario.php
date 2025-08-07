<?php

class Usuario
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function crear($data)
    {
        $stmt = $this->pdo->prepare("INSERT INTO usuarios (tipo_documento, documento, nombre, apellido, email, telefono, departamento, municipio, foto, password, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        return $stmt->execute([
            $data['tipo_documento'],
            $data['documento'],
            $data['nombre'],
            $data['apellido'],
            $data['email'],
            $data['telefono'],
            $data['departamento'],
            $data['municipio'],
            $data['foto'],
            $data['password'],
            $data['id_rol']
        ]);
    }

    public function actualizar($id_usuario, $data)
    {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, telefono = ?, departamento = ?, municipio = ?, foto = ?, id_rol = ? WHERE id_usuario = ?");
        return $stmt->execute([
            $data['nombre'],
            $data['apellido'],
            $data['email'],
            $data['telefono'],
            $data['departamento'],
            $data['municipio'],
            $data['foto'],
            $data['id_rol'],
            $id_usuario
        ]);
    }

    public function actualizarPerfil($documento, $data)
    {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, telefono = ?, departamento = ?, municipio = ?, foto = ? WHERE documento = ?");
        return $stmt->execute([
            $data['nombre'],
            $data['apellido'],
            $data['email'],
            $data['telefono'],
            $data['departamento'],
            $data['municipio'],
            $data['foto'],
            $documento
        ]);
    }

    public function cambiarEstado($id_usuario, $estado)
    {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET estado = ? WHERE id_usuario = ?");
        return $stmt->execute([$estado, $id_usuario]);
    }

    public function existeEmailODocumento($email, $documento)
    {
        $stmt = $this->pdo->prepare("SELECT id_usuario FROM usuarios WHERE email = ? OR documento = ?");
        $stmt->execute([$email, $documento]);
        return $stmt->fetch();
    }

    public function obtenerPorId($id_usuario)
    {
        $stmt = $this->pdo->prepare("SELECT u.*, r.nombre AS rol_nombre FROM usuarios u LEFT JOIN roles r ON u.id_rol = r.id_rol WHERE u.id_usuario = ?");
        $stmt->execute([$id_usuario]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function obtenerTodos()
    {
        $stmt = $this->pdo->query("SELECT u.*, r.nombre AS rol_nombre FROM usuarios u LEFT JOIN roles r ON u.id_rol = r.id_rol");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
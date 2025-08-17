<?php

class Usuario
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    // Crear usuario con todos los campos relevantes
    public function crear($data)
    {
        $stmt = $this->pdo->prepare(
            "INSERT INTO usuarios (
                tipo_documento, documento, nombre, apellido, email, telefono, departamento, municipio, foto, password, id_rol, estado, email_verificado, token_verificacion, eliminado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
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
            $data['id_rol'],
            isset($data['estado']) ? $data['estado'] : 'Activo',
            isset($data['email_verificado']) ? $data['email_verificado'] : 0,
            isset($data['token_verificacion']) ? $data['token_verificacion'] : null,
            0 // eliminado
        ]);
    }

    // Actualizar usuario (incluye email_verificado y token_verificacion)
    public function actualizar($id_usuario, $data)
    {
        $stmt = $this->pdo->prepare(
            "UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, telefono = ?, departamento = ?, municipio = ?, foto = ?, id_rol = ?, estado = ?, email_verificado = ?, token_verificacion = ? WHERE id_usuario = ?"
        );
        return $stmt->execute([
            $data['nombre'],
            $data['apellido'],
            $data['email'],
            $data['telefono'],
            $data['departamento'],
            $data['municipio'],
            $data['foto'],
            $data['id_rol'],
            isset($data['estado']) ? $data['estado'] : 'Activo',
            isset($data['email_verificado']) ? $data['email_verificado'] : 0,
            isset($data['token_verificacion']) ? $data['token_verificacion'] : null,
            $id_usuario
        ]);
    }

    // Actualizar perfil básico
    public function actualizarPerfil($documento, $data)
    {
        $stmt = $this->pdo->prepare(
            "UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, telefono = ?, departamento = ?, municipio = ?, foto = ? WHERE documento = ?"
        );
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

    // Cambiar estado (Activo/Inactivo)
    public function cambiarEstado($id_usuario, $estado)
    {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET estado = ? WHERE id_usuario = ?");
        return $stmt->execute([$estado, $id_usuario]);
    }

    // Marcar usuario como eliminado (eliminación lógica)
    public function eliminarLogico($id_usuario)
    {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET eliminado = 1 WHERE id_usuario = ?");
        return $stmt->execute([$id_usuario]);
    }

    // Verificar correo electrónico
    public function verificarCorreo($id_usuario)
    {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET email_verificado = 1, token_verificacion = NULL WHERE id_usuario = ?");
        return $stmt->execute([$id_usuario]);
    }

    // Actualizar token de verificación
    public function actualizarTokenVerificacion($id_usuario, $token)
    {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET token_verificacion = ? WHERE id_usuario = ?");
        return $stmt->execute([$token, $id_usuario]);
    }

    // Verificar si existe email o documento (solo no eliminados)
    public function existeEmailODocumento($email, $documento)
    {
        $stmt = $this->pdo->prepare("SELECT id_usuario FROM usuarios WHERE (email = ? OR documento = ?) AND eliminado = 0");
        $stmt->execute([$email, $documento]);
        return $stmt->fetch();
    }

    // Obtener usuario por ID (solo si no está eliminado)
    public function obtenerPorId($id_usuario)
    {
        $stmt = $this->pdo->prepare("SELECT u.*, r.nombre AS rol_nombre FROM usuarios u LEFT JOIN roles r ON u.id_rol = r.id_rol WHERE u.id_usuario = ? AND u.eliminado = 0");
        $stmt->execute([$id_usuario]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Obtener todos los usuarios no eliminados
    public function obtenerTodos()
    {
        $stmt = $this->pdo->query("SELECT u.*, r.nombre AS rol_nombre FROM usuarios u LEFT JOIN roles r ON u.id_rol = r.id_rol WHERE u.eliminado = 0");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
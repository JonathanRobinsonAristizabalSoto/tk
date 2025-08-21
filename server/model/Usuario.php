<?php
/**
 * Modelo Usuario: gestiona la interacción con la tabla de usuarios en la base de datos.
 */
class Usuario {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Crea un usuario con todos los campos relevantes.
     * @param array $data Datos del usuario
     * @return bool
     */
    public function crear($data) {
        $stmt = $this->pdo->prepare(
            "INSERT INTO usuarios (
                tipo_documento, documento, nombre, apellido, email, telefono, departamento, municipio, foto, password, id_rol, estado, email_verificado, token_verificacion, eliminado, codigo_recuperacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)"
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

    /**
     * Actualiza los datos de un usuario.
     * @param int $id_usuario
     * @param array $data
     * @return bool
     */
    public function actualizar($id_usuario, $data) {
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

    /**
     * Actualiza el perfil básico de un usuario por documento.
     * @param string $documento
     * @param array $data
     * @return bool
     */
    public function actualizarPerfil($documento, $data) {
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

    /**
     * Cambia el estado (Activo/Inactivo) de un usuario.
     * @param int $id_usuario
     * @param string $estado
     * @return bool
     */
    public function cambiarEstado($id_usuario, $estado) {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET estado = ? WHERE id_usuario = ?");
        return $stmt->execute([$estado, $id_usuario]);
    }

    /**
     * Marca un usuario como eliminado (borrado lógico).
     * @param int $id_usuario
     * @return bool
     */
    public function eliminarLogico($id_usuario) {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET eliminado = 1 WHERE id_usuario = ?");
        return $stmt->execute([$id_usuario]);
    }

    /**
     * Marca el correo como verificado y elimina el token.
     * @param int $id_usuario
     * @return bool
     */
    public function verificarCorreo($id_usuario) {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET email_verificado = 1, token_verificacion = NULL WHERE id_usuario = ?");
        return $stmt->execute([$id_usuario]);
    }

    /**
     * Actualiza el token de verificación de correo.
     * @param int $id_usuario
     * @param string|null $token
     * @return bool
     */
    public function actualizarTokenVerificacion($id_usuario, $token) {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET token_verificacion = ? WHERE id_usuario = ?");
        return $stmt->execute([$token, $id_usuario]);
    }

    /**
     * Verifica si existe un email o documento (solo no eliminados).
     * @param string $email
     * @param string $documento
     * @return mixed
     */
    public function existeEmailODocumento($email, $documento) {
        $stmt = $this->pdo->prepare("SELECT id_usuario FROM usuarios WHERE (email = ? OR documento = ?) AND eliminado = 0");
        $stmt->execute([$email, $documento]);
        return $stmt->fetch();
    }

    /**
     * Obtiene un usuario por ID (solo si no está eliminado).
     * @param int $id_usuario
     * @return array|null
     */
    public function obtenerPorId($id_usuario) {
        $stmt = $this->pdo->prepare("SELECT u.*, r.nombre AS rol_nombre FROM usuarios u LEFT JOIN roles r ON u.id_rol = r.id_rol WHERE u.id_usuario = ? AND u.eliminado = 0");
        $stmt->execute([$id_usuario]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Obtiene todos los usuarios no eliminados.
     * @return array
     */
    public function obtenerTodos() {
        $stmt = $this->pdo->query("SELECT u.*, r.nombre AS rol_nombre FROM usuarios u LEFT JOIN roles r ON u.id_rol = r.id_rol WHERE u.eliminado = 0");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Obtiene un usuario por correo electrónico (solo si no está eliminado).
     * @param string $email
     * @return array|null
     */
    public function obtenerPorEmail($email) {
        $stmt = $this->pdo->prepare("SELECT * FROM usuarios WHERE email = ? AND eliminado = 0");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Guarda el código de recuperación de contraseña para el usuario.
     * @param int $id_usuario
     * @param string $codigo
     * @return bool
     */
    public function actualizarCodigoRecuperacion($id_usuario, $codigo) {
        $stmt = $this->pdo->prepare("UPDATE usuarios SET codigo_recuperacion = ? WHERE id_usuario = ?");
        return $stmt->execute([$codigo, $id_usuario]);
    }

    /**
     * Verifica el código de recuperación para el usuario.
     * @param int $id_usuario
     * @param string $codigo
     * @return bool
     */
    public function verificarCodigoRecuperacion($id_usuario, $codigo) {
        $stmt = $this->pdo->prepare("SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND codigo_recuperacion = ? AND eliminado = 0");
        $stmt->execute([$id_usuario, $codigo]);
        return $stmt->fetch() ? true : false;
    }

    /**
     * Actualiza la contraseña y limpia el código de recuperación.
     * @param int $id_usuario
     * @param string $password
     * @return bool
     */
    public function actualizarPasswordYLimpiarCodigo($id_usuario, $password) {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->pdo->prepare("UPDATE usuarios SET password = ?, codigo_recuperacion = NULL WHERE id_usuario = ?");
        return $stmt->execute([$hash, $id_usuario]);
    }
}
<?php
/**
 * Modelo Rol: gestiona la interacción con la tabla de roles en la base de datos.
 * Solo permite consultar roles, ya que los roles son predeterminados y no se crean ni eliminan desde la aplicación.
 */
class Rol {
    private $pdo;

    /**
     * Constructor: recibe la conexión PDO.
     * @param PDO $pdo Conexión a la base de datos
     */
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Obtiene todos los roles activos y no eliminados.
     * @return array Lista de roles (id_rol, nombre, estado, descripcion, fecha_actualizacion)
     */
    public function obtenerActivos() {
        $stmt = $this->pdo->prepare("SELECT id_rol, nombre, estado, descripcion, fecha_actualizacion FROM roles WHERE estado = 'Activo' AND eliminado = 0");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Obtiene todos los roles no eliminados (activos e inactivos).
     * @return array Lista completa de roles
     */
    public function obtenerTodos() {
        $stmt = $this->pdo->prepare("SELECT id_rol, nombre, estado, descripcion, fecha_actualizacion FROM roles WHERE eliminado = 0");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Obtiene un rol por su ID.
     * @param int $id_rol ID del rol
     * @return array|null Rol encontrado o null si no existe
     */
    public function obtenerPorId($id_rol) {
        $stmt = $this->pdo->prepare("SELECT id_rol, nombre, estado, descripcion, fecha_actualizacion FROM roles WHERE id_rol = ? AND eliminado = 0");
        $stmt->execute([$id_rol]);
        $rol = $stmt->fetch(PDO::FETCH_ASSOC);
        return $rol ? $rol : null;
    }

    /**
     * Actualiza la descripción y la fecha de actualización de un rol.
     * @param int $id_rol ID del rol
     * @param string $descripcion Nueva descripción
     * @return bool True si se actualizó correctamente
     */
    public function actualizarDescripcion($id_rol, $descripcion) {
        $stmt = $this->pdo->prepare("UPDATE roles SET descripcion = ?, fecha_actualizacion = NOW() WHERE id_rol = ? AND eliminado = 0");
        return $stmt->execute([$descripcion, $id_rol]);
    }
}
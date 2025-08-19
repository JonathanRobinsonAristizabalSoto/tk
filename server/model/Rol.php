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
     * @return array Lista de roles (id_rol, nombre)
     */
    public function obtenerActivos() {
        $stmt = $this->pdo->prepare("SELECT id_rol, nombre FROM roles WHERE estado = 'Activo' AND eliminado = 0");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Obtiene todos los roles no eliminados (activos e inactivos).
     * @return array Lista completa de roles
     */
    public function obtenerTodos() {
        $stmt = $this->pdo->prepare("SELECT id_rol, nombre, estado FROM roles WHERE eliminado = 0");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Obtiene un rol por su ID.
     * @param int $id_rol ID del rol
     * @return array|null Rol encontrado o null si no existe
     */
    public function obtenerPorId($id_rol) {
        $stmt = $this->pdo->prepare("SELECT id_rol, nombre, estado FROM roles WHERE id_rol = ? AND eliminado = 0");
        $stmt->execute([$id_rol]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
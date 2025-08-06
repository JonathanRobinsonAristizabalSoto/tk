<?php
// Configuración de cabeceras para CORS
header('Content-Type: application/json');
require_once("../config/config.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Recibe los datos del formulario
    $tipo_documento = $_POST["typeDocument"] ?? '';
    $documento = $_POST["documento"] ?? '';
    $nombre = $_POST["nombre"] ?? '';
    $apellido = $_POST["apellido"] ?? '';
    $email = $_POST["email"] ?? '';
    $telefono = $_POST["telefono"] ?? '';
    $departamento = $_POST["departamento"] ?? '';
    $municipio = $_POST["municipio"] ?? '';
    $password = $_POST["password"] ?? '';
    $rol = $_POST["tipoUsuario"] ?? 5; // Por defecto usuario

    // Imagen de perfil por defecto
    $foto = 'assets/images/perfiles/default.png';

    // Validación básica
    if (
        !$tipo_documento || !$documento || !$nombre || !$apellido ||
        !$email || !$telefono || !$departamento || !$municipio || !$password
    ) {
        echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
        exit;
    }

    // Verifica si el email o documento ya existen
    $stmt = $pdo->prepare("SELECT id_usuario FROM usuarios WHERE email = ? OR documento = ?");
    $stmt->execute([$email, $documento]);
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "El correo o documento ya está registrado."]);
        exit;
    }

    // Hash de la contraseña
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Inserta el usuario con la imagen por defecto
    $stmt = $pdo->prepare("INSERT INTO usuarios (tipo_documento, documento, nombre, apellido, email, telefono, departamento, municipio, foto, password, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $ok = $stmt->execute([
        $tipo_documento, $documento, $nombre, $apellido, $email,
        $telefono, $departamento, $municipio, $foto, $passwordHash, $rol
    ]);

    if ($ok) {
        echo json_encode(["success" => true, "message" => "Registro exitoso"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al registrar"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
}
?>
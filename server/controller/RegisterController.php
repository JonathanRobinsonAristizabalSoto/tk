<?php
header('Content-Type: application/json');
require_once("../config/config.php");

// Función para sanitizar datos
function limpiar($valor) {
    return htmlspecialchars(trim($valor), ENT_QUOTES, 'UTF-8');
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Recibe y sanitiza los datos del formulario
    $tipo_documento = limpiar($_POST["typeDocument"] ?? '');
    $documento      = limpiar($_POST["documento"] ?? '');
    $nombre         = limpiar($_POST["nombre"] ?? '');
    $apellido       = limpiar($_POST["apellido"] ?? '');
    $email          = limpiar($_POST["email"] ?? '');
    $telefono       = limpiar($_POST["telefono"] ?? '');
    $departamento   = limpiar($_POST["departamento"] ?? '');
    $municipio      = limpiar($_POST["municipio"] ?? '');
    $password       = $_POST["password"] ?? ''; // No sanitizar la contraseña
    $rol            = intval($_POST["tipoUsuario"] ?? 5); // Por defecto usuario

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

    // Validación de email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "El correo electrónico no es válido."]);
        exit;
    }

    // Validación de longitud de contraseña
    if (strlen($password) < 6) {
        echo json_encode(["success" => false, "message" => "La contraseña debe tener al menos 6 caracteres."]);
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
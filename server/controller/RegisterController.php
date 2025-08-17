<?php
header('Content-Type: application/json');
require_once("../config/config.php");
require_once("../model/Usuario.php");

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

    // Solo hay 3 roles: Administrador (1), Soporte (2), Usuario (3)
    $rol            = intval($_POST["tipoUsuario"] ?? 3); // Por defecto Usuario

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

    // Modelo usuario
    $usuarioModel = new Usuario($pdo);

    // Verifica si el email o documento ya existen
    if ($usuarioModel->existeEmailODocumento($email, $documento)) {
        echo json_encode(["success" => false, "message" => "El correo o documento ya está registrado."]);
        exit;
    }

    // Hash de la contraseña
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Datos para el modelo
    $data = [
        'tipo_documento' => $tipo_documento,
        'documento' => $documento,
        'nombre' => $nombre,
        'apellido' => $apellido,
        'email' => $email,
        'telefono' => $telefono,
        'departamento' => $departamento,
        'municipio' => $municipio,
        'foto' => $foto,
        'password' => $passwordHash,
        'id_rol' => $rol,
        'estado' => 'Activo',
        'email_verificado' => 0,
        'token_verificacion' => null
    ];

    // Inserta el usuario usando el modelo
    $ok = $usuarioModel->crear($data);

    if ($ok) {
        echo json_encode(["success" => true, "message" => "Registro exitoso"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al registrar"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
}
?>
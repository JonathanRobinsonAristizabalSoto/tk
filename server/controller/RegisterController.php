<?php
header('Content-Type: application/json');
require_once("../config/config.php");
require_once("../model/Usuario.php");
require_once("../utils/functions.php"); // <-- Incluye la función limpiar solo aquí

// Elimina la función limpiar de este archivo, ya está en utils/functions.php

class RegisterController {
    private $usuarioModel;

    public function __construct($pdo) {
        $this->usuarioModel = new Usuario($pdo);
    }

    public function handle($action) {
        if ($action === "register" && $_SERVER["REQUEST_METHOD"] === "POST") {
            $this->register();
        } else {
            echo json_encode(["success" => false, "message" => "Acción o método no permitido"]);
        }
    }

    public function register() {
        $tipo_documento = limpiar($_POST["typeDocument"] ?? '');
        $documento      = limpiar($_POST["documento"] ?? '');
        $nombre         = limpiar($_POST["nombre"] ?? '');
        $apellido       = limpiar($_POST["apellido"] ?? '');
        $email          = limpiar($_POST["email"] ?? '');
        $telefono       = limpiar($_POST["telefono"] ?? '');
        $departamento   = limpiar($_POST["departamento"] ?? '');
        $municipio      = limpiar($_POST["municipio"] ?? '');
        $password       = $_POST["password"] ?? '';
        $rol            = intval($_POST["tipoUsuario"] ?? 3);
        $foto           = 'assets/images/perfiles/default.png';

        if (
            !$tipo_documento || !$documento || !$nombre || !$apellido ||
            !$email || !$telefono || !$departamento || !$municipio || !$password
        ) {
            echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(["success" => false, "message" => "El correo electrónico no es válido."]);
            return;
        }

        if (strlen($password) < 6) {
            echo json_encode(["success" => false, "message" => "La contraseña debe tener al menos 6 caracteres."]);
            return;
        }

        $existe = $this->usuarioModel->existeEmailODocumento($email, $documento);
        if ($existe !== false && $existe !== null) {
            echo json_encode(["success" => false, "message" => "El correo o documento ya está registrado."]);
            return;
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

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

        $ok = $this->usuarioModel->crear($data);

        if ($ok) {
            echo json_encode(["success" => true, "message" => "Registro exitoso"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al registrar"]);
        }
    }
}

// Compatibilidad con POST directo (sin api.php)
if (!class_exists('RegisterController')) {
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $usuarioModel = new Usuario($pdo);

        $tipo_documento = limpiar($_POST["typeDocument"] ?? '');
        $documento      = limpiar($_POST["documento"] ?? '');
        $nombre         = limpiar($_POST["nombre"] ?? '');
        $apellido       = limpiar($_POST["apellido"] ?? '');
        $email          = limpiar($_POST["email"] ?? '');
        $telefono       = limpiar($_POST["telefono"] ?? '');
        $departamento   = limpiar($_POST["departamento"] ?? '');
        $municipio      = limpiar($_POST["municipio"] ?? '');
        $password       = $_POST["password"] ?? '';
        $rol            = intval($_POST["tipoUsuario"] ?? 3);
        $foto           = 'assets/images/perfiles/default.png';

        if (
            !$tipo_documento || !$documento || !$nombre || !$apellido ||
            !$email || !$telefono || !$departamento || !$municipio || !$password
        ) {
            echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
            exit;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(["success" => false, "message" => "El correo electrónico no es válido."]);
            exit;
        }
        if (strlen($password) < 6) {
            echo json_encode(["success" => false, "message" => "La contraseña debe tener al menos 6 caracteres."]);
            exit;
        }
        $existe = $usuarioModel->existeEmailODocumento($email, $documento);
        if ($existe !== false && $existe !== null) {
            echo json_encode(["success" => false, "message" => "El correo o documento ya está registrado."]);
            exit;
        }
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
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
        $ok = $usuarioModel->crear($data);
        if ($ok) {
            echo json_encode(["success" => true, "message" => "Registro exitoso"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al registrar"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Método no permitido"]);
    }
}
?>
<?php
header('Content-Type: application/json');
require_once("../config/config.php");
require_once("../model/Usuario.php");
require_once("../utils/functions.php");
require_once("../utils/EmailHelper.php");

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

        // Generar código de verificación de 6 dígitos
        $codigoVerificacion = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

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
            'token_verificacion' => $codigoVerificacion
        ];

        $ok = $this->usuarioModel->crear($data);

        if ($ok) {
            // Enviar el código al correo
            $subject = 'Verifica tu correo en TicketPro+';
            $body = "<p>Hola <b>$nombre $apellido</b>,</p>
                     <p>Gracias por registrarte en TicketPro+. Tu código de verificación es:</p>
                     <h2 style='text-align:center;'>$codigoVerificacion</h2>
                     <p>Ingresa este código en la página de verificación para activar tu cuenta.</p>
                     <p>Si no solicitaste este registro, ignora este correo.</p>";

            $enviado = \Src\Utils\EmailHelper::sendCode($email, $codigoVerificacion, $subject, $body);

            if ($enviado) {
                echo json_encode([
                    "success" => true,
                    "message" => "Registro exitoso. Se ha enviado un código de verificación a tu correo.",
                    "pendingUser" => $email // Para que el frontend lo guarde y redirija a verify-code.html
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Registro exitoso, pero no se pudo enviar el correo de verificación."
                ]);
            }
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

        $codigoVerificacion = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

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
            'token_verificacion' => $codigoVerificacion
        ];
        $ok = $usuarioModel->crear($data);
        if ($ok) {
            $subject = 'Verifica tu correo en TicketPro+';
            $body = "<p>Hola <b>$nombre $apellido</b>,</p>
                     <p>Gracias por registrarte en TicketPro+. Tu código de verificación es:</p>
                     <h2 style='text-align:center;'>$codigoVerificacion</h2>
                     <p>Ingresa este código en la página de verificación para activar tu cuenta.</p>
                     <p>Si no solicitaste este registro, ignora este correo.</p>";

            $enviado = \Src\Utils\EmailHelper::sendCode($email, $codigoVerificacion, $subject, $body);

            if ($enviado) {
                echo json_encode([
                    "success" => true,
                    "message" => "Registro exitoso. Se ha enviado un código de verificación a tu correo.",
                    "pendingUser" => $email
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Registro exitoso, pero no se pudo enviar el correo de verificación."
                ]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Error al registrar"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Método no permitido"]);
    }
}
?>
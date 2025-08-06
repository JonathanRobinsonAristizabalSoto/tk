<?php
// Configuración de cabecera
header('Content-Type: application/json');
require_once("../config/config.php");

try {
    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'add':
            $tipo_documento = $_POST['tipo_documento'] ?? '';
            $documento = $_POST['documento'] ?? '';
            $nombre = $_POST['nombre'] ?? '';
            $apellido = $_POST['apellido'] ?? '';
            $email = $_POST['email'] ?? '';
            $telefono = $_POST['telefono'] ?? '';
            $departamento = $_POST['departamento'] ?? '';
            $municipio = $_POST['municipio'] ?? '';
            $password = $_POST['password'] ?? '';
            $id_rol = $_POST['id_rol'] ?? 5;
            $foto = $_POST['foto'] ?? 'assets/images/perfiles/default.png';

            // Validación básica
            if (!$tipo_documento || !$documento || !$nombre || !$apellido || !$email || !$telefono || !$departamento || !$municipio || !$password) {
                echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
                exit;
            }

            // Verifica si el email o documento ya existen
            $stmt = $pdo->prepare("SELECT id_usuario FROM usuarios WHERE email = ? OR documento = ?");
            $stmt->execute([$email, $documento]);
            if ($stmt->fetch()) {
                echo json_encode(['success' => false, 'message' => 'El correo o documento ya está registrado.']);
                exit;
            }

            $passwordHash = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $pdo->prepare("INSERT INTO usuarios (tipo_documento, documento, nombre, apellido, email, telefono, departamento, municipio, foto, password, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$tipo_documento, $documento, $nombre, $apellido, $email, $telefono, $departamento, $municipio, $foto, $passwordHash, $id_rol]);
            echo json_encode(['success' => true, 'message' => 'Usuario creado con éxito.']);
            break;

        case 'update':
            $id_usuario = $_POST['id_usuario'];
            $nombre = $_POST['nombre'] ?? '';
            $apellido = $_POST['apellido'] ?? '';
            $email = $_POST['email'] ?? '';
            $telefono = $_POST['telefono'] ?? '';
            $departamento = $_POST['departamento'] ?? '';
            $municipio = $_POST['municipio'] ?? '';
            $id_rol = $_POST['id_rol'] ?? 5;

            // Manejo de imagen
            $foto = $_POST['foto_actual'] ?? 'assets/images/perfiles/default.png';
            if (isset($_FILES['foto']) && $_FILES['foto']['error'] == UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
                $nombreArchivo = 'assets/images/perfiles/' . uniqid('perfil_') . '.' . $ext;
                $rutaDestino = '../../client/src/' . $nombreArchivo;
                if (move_uploaded_file($_FILES['foto']['tmp_name'], $rutaDestino)) {
                    $foto = $nombreArchivo;
                }
            }

            $stmt = $pdo->prepare("UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, telefono = ?, departamento = ?, municipio = ?, foto = ?, id_rol = ? WHERE id_usuario = ?");
            $stmt->execute([$nombre, $apellido, $email, $telefono, $departamento, $municipio, $foto, $id_rol, $id_usuario]);
            echo json_encode(['success' => true, 'message' => 'Usuario actualizado con éxito.']);
            break;

        case 'toggle_estado':
            $id_usuario = $_POST['id_usuario'];
            $estado = $_POST['estado'];
            if ($estado !== 'Activo' && $estado !== 'Inactivo') {
                echo json_encode(['success' => false, 'message' => 'Estado no válido.']);
                exit;
            }
            $stmt = $pdo->prepare("UPDATE usuarios SET estado = ? WHERE id_usuario = ?");
            $stmt->execute([$estado, $id_usuario]);
            echo json_encode(['success' => true, 'message' => "Usuario " . ($estado === 'Activo' ? "habilitado" : "inhabilitado") . " con éxito."]);
            break;

        case 'fetch':
            if (isset($_POST['id_usuario'])) {
                $id_usuario = $_POST['id_usuario'];
                $stmt = $pdo->prepare("SELECT u.*, r.nombre AS rol_nombre FROM usuarios u LEFT JOIN roles r ON u.id_rol = r.id_rol WHERE u.id_usuario = ?");
                $stmt->execute([$id_usuario]);
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($usuario) {
                    echo json_encode($usuario);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
                }
            } else {
                $stmt = $pdo->query("SELECT u.*, r.nombre AS rol_nombre FROM usuarios u LEFT JOIN roles r ON u.id_rol = r.id_rol");
                $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($usuarios);
            }
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
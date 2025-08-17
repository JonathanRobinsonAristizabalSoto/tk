<?php
header('Content-Type: application/json');
require_once("../config/config.php");
require_once("../model/Usuario.php");

try {
    $usuarioModel = new Usuario($pdo);
    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'add':
            // Solo hay 3 roles: Administrador (1), Soporte (2), Usuario (3)
            $id_rol = intval($_POST['id_rol'] ?? 3);
            if (!in_array($id_rol, [1, 2, 3])) {
                $id_rol = 3; // Por defecto Usuario
            }
            $data = [
                'tipo_documento' => $_POST['tipo_documento'] ?? '',
                'documento' => $_POST['documento'] ?? '',
                'nombre' => $_POST['nombre'] ?? '',
                'apellido' => $_POST['apellido'] ?? '',
                'email' => $_POST['email'] ?? '',
                'telefono' => $_POST['telefono'] ?? '',
                'departamento' => $_POST['departamento'] ?? '',
                'municipio' => $_POST['municipio'] ?? '',
                'password' => password_hash($_POST['password'] ?? '', PASSWORD_DEFAULT),
                'id_rol' => $id_rol,
                'foto' => $_POST['foto'] ?? 'assets/images/perfiles/default.png',
                'estado' => 'Activo',
                'email_verificado' => 0,
                'token_verificacion' => null
            ];

            // Validación básica
            foreach (['tipo_documento','documento','nombre','apellido','email','telefono','departamento','municipio','password'] as $campo) {
                if (empty($data[$campo])) {
                    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
                    exit;
                }
            }

            if ($usuarioModel->existeEmailODocumento($data['email'], $data['documento'])) {
                echo json_encode(['success' => false, 'message' => 'El correo o documento ya está registrado.']);
                exit;
            }

            if ($usuarioModel->crear($data)) {
                echo json_encode(['success' => true, 'message' => 'Usuario creado con éxito.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al crear usuario.']);
            }
            break;

        case 'update':
            $id_usuario = $_POST['id_usuario'];
            $id_rol = intval($_POST['id_rol'] ?? 3);
            if (!in_array($id_rol, [1, 2, 3])) {
                $id_rol = 3;
            }
            $data = [
                'nombre' => $_POST['nombre'] ?? '',
                'apellido' => $_POST['apellido'] ?? '',
                'email' => $_POST['email'] ?? '',
                'telefono' => $_POST['telefono'] ?? '',
                'departamento' => $_POST['departamento'] ?? '',
                'municipio' => $_POST['municipio'] ?? '',
                'id_rol' => $id_rol,
                'foto' => $_POST['foto_actual'] ?? 'assets/images/perfiles/default.png',
                'estado' => $_POST['estado'] ?? 'Activo',
                'email_verificado' => $_POST['email_verificado'] ?? 0,
                'token_verificacion' => $_POST['token_verificacion'] ?? null
            ];

            // Manejo de imagen
            if (isset($_FILES['foto']) && $_FILES['foto']['error'] == UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
                $nombreArchivo = 'assets/images/perfiles/' . uniqid('perfil_') . '.' . $ext;
                $rutaDestino = '../../client/src/' . $nombreArchivo;
                if (move_uploaded_file($_FILES['foto']['tmp_name'], $rutaDestino)) {
                    $data['foto'] = $nombreArchivo;
                }
            }

            if ($usuarioModel->actualizar($id_usuario, $data)) {
                echo json_encode(['success' => true, 'message' => 'Usuario actualizado con éxito.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al actualizar usuario.']);
            }
            break;

        case 'update_perfil':
            $documento = $_POST['documento'] ?? '';
            $data = [
                'nombre' => $_POST['nombre'] ?? '',
                'apellido' => $_POST['apellido'] ?? '',
                'email' => $_POST['email'] ?? '',
                'telefono' => $_POST['telefono'] ?? '',
                'departamento' => $_POST['departamento'] ?? '',
                'municipio' => $_POST['municipio'] ?? '',
                'foto' => $_POST['foto_actual'] ?? 'assets/images/perfiles/default.png'
            ];

            // Manejo de imagen
            if (isset($_FILES['foto']) && $_FILES['foto']['error'] == UPLOAD_ERR_OK) {
                $ext = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
                $nombreArchivo = 'assets/images/perfiles/' . uniqid('perfil_') . '.' . $ext;
                $rutaDestino = '../../client/src/' . $nombreArchivo;
                if (move_uploaded_file($_FILES['foto']['tmp_name'], $rutaDestino)) {
                    $data['foto'] = $nombreArchivo;
                }
            }

            if ($usuarioModel->actualizarPerfil($documento, $data)) {
                echo json_encode(['success' => true, 'message' => 'Perfil actualizado con éxito.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al actualizar perfil.']);
            }
            break;

        case 'toggle_estado':
            $id_usuario = $_POST['id_usuario'];
            $estado = $_POST['estado'];
            if ($estado !== 'Activo' && $estado !== 'Inactivo') {
                echo json_encode(['success' => false, 'message' => 'Estado no válido.']);
                exit;
            }
            if ($usuarioModel->cambiarEstado($id_usuario, $estado)) {
                echo json_encode(['success' => true, 'message' => "Usuario " . ($estado === 'Activo' ? "habilitado" : "inhabilitado") . " con éxito."]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al cambiar estado.']);
            }
            break;

        case 'eliminar_logico':
            $id_usuario = $_POST['id_usuario'];
            if ($usuarioModel->eliminarLogico($id_usuario)) {
                echo json_encode(['success' => true, 'message' => 'Usuario marcado como eliminado.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al eliminar usuario.']);
            }
            break;

        case 'verificar_correo':
            $id_usuario = $_POST['id_usuario'];
            if ($usuarioModel->verificarCorreo($id_usuario)) {
                echo json_encode(['success' => true, 'message' => 'Correo verificado con éxito.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al verificar correo.']);
            }
            break;

        case 'actualizar_token_verificacion':
            $id_usuario = $_POST['id_usuario'];
            $token = $_POST['token_verificacion'] ?? null;
            if ($usuarioModel->actualizarTokenVerificacion($id_usuario, $token)) {
                echo json_encode(['success' => true, 'message' => 'Token actualizado con éxito.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al actualizar token.']);
            }
            break;

        case 'get_catalogos':
            // Obtener roles activos
            $roles = $pdo->query("SELECT id_rol, nombre FROM roles WHERE estado = 'Activo' AND eliminado = 0")->fetchAll(PDO::FETCH_ASSOC);
            // Obtener tipos de documento desde el ENUM
            $tipos = [];
            $stmt = $pdo->query("SHOW COLUMNS FROM usuarios LIKE 'tipo_documento'");
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                preg_match("/^enum\((.*)\)$/", $row['Type'], $matches);
                if (isset($matches[1])) {
                    $tipos = array_map(function($v) {
                        return trim($v, "'");
                    }, explode(',', $matches[1]));
                }
            }
            echo json_encode(['roles' => $roles, 'tipos_documento' => $tipos]);
            exit;

        case 'fetch':
            if (isset($_POST['id_usuario'])) {
                $usuario = $usuarioModel->obtenerPorId($_POST['id_usuario']);
                if ($usuario) {
                    echo json_encode($usuario);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
                }
            } else {
                $usuarios = $usuarioModel->obtenerTodos();
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
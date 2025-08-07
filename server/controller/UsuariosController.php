<?php
header('Content-Type: application/json');
require_once("../config/config.php");
require_once("../model/Usuario.php");

try {
    $usuarioModel = new Usuario($pdo);
    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'add':
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
                'id_rol' => $_POST['id_rol'] ?? 5,
                'foto' => $_POST['foto'] ?? 'assets/images/perfiles/default.png'
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
            $data = [
                'nombre' => $_POST['nombre'] ?? '',
                'apellido' => $_POST['apellido'] ?? '',
                'email' => $_POST['email'] ?? '',
                'telefono' => $_POST['telefono'] ?? '',
                'departamento' => $_POST['departamento'] ?? '',
                'municipio' => $_POST['municipio'] ?? '',
                'id_rol' => $_POST['id_rol'] ?? 5,
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
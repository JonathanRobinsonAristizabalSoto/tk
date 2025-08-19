<?php
require_once("../model/Usuario.php");

/**
 * Controlador para gestión de usuarios.
 * Permite crear, actualizar, cambiar estado, eliminar lógicamente y consultar usuarios.
 */
class UsuariosController {
    private $usuarioModel;
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->usuarioModel = new Usuario($pdo);
    }

    /**
     * Maneja las acciones solicitadas para el módulo usuarios.
     * @param string $action Acción a ejecutar
     */
    public function handle($action) {
        try {
            switch ($action) {
                case 'add':
                    $id_rol = intval($_POST['id_rol'] ?? 3);
                    if (!in_array($id_rol, [1, 2, 3])) $id_rol = 3;

                    // Procesar foto si se subió una nueva desde el formulario de admin
                    $foto = 'assets/images/perfiles/default.png';
                    if (isset($_FILES['fotoCrear']) && $_FILES['fotoCrear']['error'] == UPLOAD_ERR_OK) {
                        $ext = strtolower(pathinfo($_FILES['fotoCrear']['name'], PATHINFO_EXTENSION));
                        $nombreArchivo = 'assets/images/perfiles/' . uniqid('perfil_') . '.' . $ext;
                        $rutaDestino = '../../src/' . $nombreArchivo;
                        $tmp_name = $_FILES['fotoCrear']['tmp_name'];

                        list($width, $height) = getimagesize($tmp_name);
                        $maxWidth = 400; $maxHeight = 400;
                        $newWidth = $width; $newHeight = $height;
                        if ($width > $maxWidth) {
                            $newHeight = $height * ($maxWidth / $width);
                            $newWidth = $maxWidth;
                        }
                        if ($newHeight > $maxHeight) {
                            $newWidth = $newWidth * ($maxHeight / $newHeight);
                            $newHeight = $maxHeight;
                        }

                        // Crear imagen según el tipo
                        if ($ext === 'jpg' || $ext === 'jpeg') {
                            $srcImg = imagecreatefromjpeg($tmp_name);
                        } elseif ($ext === 'png') {
                            $srcImg = imagecreatefrompng($tmp_name);
                        } else {
                            move_uploaded_file($tmp_name, $rutaDestino); // Si no es jpg/png, solo mueve el archivo
                            $foto = $nombreArchivo;
                            break;
                        }
                        $dstImg = imagecreatetruecolor($newWidth, $newHeight);
                        imagecopyresampled($dstImg, $srcImg, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                        imagejpeg($dstImg, $rutaDestino, 80); // calidad 80%
                        imagedestroy($srcImg);
                        imagedestroy($dstImg);
                        $foto = $nombreArchivo;
                    }

                    $data = [
                        'tipo_documento' => $_POST['tipo_documento'] ?? '',
                        'documento'      => $_POST['documento'] ?? '',
                        'nombre'         => $_POST['nombre'] ?? '',
                        'apellido'       => $_POST['apellido'] ?? '',
                        'email'          => $_POST['email'] ?? '',
                        'telefono'       => $_POST['telefono'] ?? '',
                        'departamento'   => $_POST['departamento'] ?? '',
                        'municipio'      => $_POST['municipio'] ?? '',
                        'password'       => password_hash($_POST['password'] ?? '', PASSWORD_DEFAULT),
                        'id_rol'         => $id_rol,
                        'foto'           => $foto,
                        'estado'         => 'Activo',
                        'email_verificado' => 0,
                        'token_verificacion' => null
                    ];
                    // Validación de campos obligatorios
                    foreach (['tipo_documento','documento','nombre','apellido','email','telefono','departamento','municipio','password'] as $campo) {
                        if (empty($data[$campo])) {
                            echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
                            return;
                        }
                    }
                    // Validación de email/documento único
                    if ($this->usuarioModel->existeEmailODocumento($data['email'], $data['documento'])) {
                        echo json_encode(['success' => false, 'message' => 'El correo o documento ya está registrado.']);
                        return;
                    }
                    // Crear usuario
                    if ($this->usuarioModel->crear($data)) {
                        echo json_encode(['success' => true, 'message' => 'Usuario creado con éxito.']);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Error al crear usuario.']);
                    }
                    break;

                case 'update':
                    $id_usuario = $_POST['id_usuario'];
                    $id_rol = intval($_POST['id_rol'] ?? 3);
                    if (!in_array($id_rol, [1, 2, 3])) $id_rol = 3;
                    $data = [
                        'nombre'           => $_POST['nombre'] ?? '',
                        'apellido'         => $_POST['apellido'] ?? '',
                        'email'            => $_POST['email'] ?? '',
                        'telefono'         => $_POST['telefono'] ?? '',
                        'departamento'     => $_POST['departamento'] ?? '',
                        'municipio'        => $_POST['municipio'] ?? '',
                        'id_rol'           => $id_rol,
                        'foto'             => $_POST['foto_actual'] ?? 'assets/images/perfiles/default.png',
                        'estado'           => $_POST['estado'] ?? 'Activo',
                        'email_verificado' => $_POST['email_verificado'] ?? 0,
                        'token_verificacion' => $_POST['token_verificacion'] ?? null
                    ];
                    // Procesar foto si se subió una nueva
                    if (isset($_FILES['foto']) && $_FILES['foto']['error'] == UPLOAD_ERR_OK) {
                        $ext = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
                        $nombreArchivo = 'assets/images/perfiles/' . uniqid('perfil_') . '.' . $ext;
                        $rutaDestino = '../../src/' . $nombreArchivo;
                        $tmp_name = $_FILES['foto']['tmp_name'];

                        list($width, $height) = getimagesize($tmp_name);
                        $maxWidth = 400; $maxHeight = 400;
                        $newWidth = $width; $newHeight = $height;
                        if ($width > $maxWidth) {
                            $newHeight = $height * ($maxWidth / $width);
                            $newWidth = $maxWidth;
                        }
                        if ($newHeight > $maxHeight) {
                            $newWidth = $newWidth * ($maxHeight / $newHeight);
                            $newHeight = $maxHeight;
                        }

                        if ($ext === 'jpg' || $ext === 'jpeg') {
                            $srcImg = imagecreatefromjpeg($tmp_name);
                        } elseif ($ext === 'png') {
                            $srcImg = imagecreatefrompng($tmp_name);
                        } else {
                            move_uploaded_file($tmp_name, $rutaDestino);
                            $data['foto'] = $nombreArchivo;
                        }
                        if (isset($srcImg)) {
                            $dstImg = imagecreatetruecolor($newWidth, $newHeight);
                            imagecopyresampled($dstImg, $srcImg, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                            imagejpeg($dstImg, $rutaDestino, 80);
                            imagedestroy($srcImg);
                            imagedestroy($dstImg);
                            $data['foto'] = $nombreArchivo;
                        }
                    }
                    // Actualizar usuario
                    if ($this->usuarioModel->actualizar($id_usuario, $data)) {
                        echo json_encode(['success' => true, 'message' => 'Usuario actualizado con éxito.']);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Error al actualizar usuario.']);
                    }
                    break;

                case 'update_perfil':
                    $documento = $_POST['documento'] ?? '';
                    $data = [
                        'nombre'       => $_POST['nombre'] ?? '',
                        'apellido'     => $_POST['apellido'] ?? '',
                        'email'        => $_POST['email'] ?? '',
                        'telefono'     => $_POST['telefono'] ?? '',
                        'departamento' => $_POST['departamento'] ?? '',
                        'municipio'    => $_POST['municipio'] ?? '',
                        'foto'         => $_POST['foto_actual'] ?? 'assets/images/perfiles/default.png'
                    ];
                    // Procesar foto si se subió una nueva
                    if (isset($_FILES['foto']) && $_FILES['foto']['error'] == UPLOAD_ERR_OK) {
                        $ext = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
                        $nombreArchivo = 'assets/images/perfiles/' . uniqid('perfil_') . '.' . $ext;
                        $rutaDestino = '../../src/' . $nombreArchivo;
                        $tmp_name = $_FILES['foto']['tmp_name'];

                        list($width, $height) = getimagesize($tmp_name);
                        $maxWidth = 400; $maxHeight = 400;
                        $newWidth = $width; $newHeight = $height;
                        if ($width > $maxWidth) {
                            $newHeight = $height * ($maxWidth / $width);
                            $newWidth = $maxWidth;
                        }
                        if ($newHeight > $maxHeight) {
                            $newWidth = $newWidth * ($maxHeight / $newHeight);
                            $newHeight = $maxHeight;
                        }

                        if ($ext === 'jpg' || $ext === 'jpeg') {
                            $srcImg = imagecreatefromjpeg($tmp_name);
                        } elseif ($ext === 'png') {
                            $srcImg = imagecreatefrompng($tmp_name);
                        } else {
                            move_uploaded_file($tmp_name, $rutaDestino);
                            $data['foto'] = $nombreArchivo;
                        }
                        if (isset($srcImg)) {
                            $dstImg = imagecreatetruecolor($newWidth, $newHeight);
                            imagecopyresampled($dstImg, $srcImg, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                            imagejpeg($dstImg, $rutaDestino, 80);
                            imagedestroy($srcImg);
                            imagedestroy($dstImg);
                            $data['foto'] = $nombreArchivo;
                        }
                    }
                    // Actualizar perfil
                    if ($this->usuarioModel->actualizarPerfil($documento, $data)) {
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
                        return;
                    }
                    if ($this->usuarioModel->cambiarEstado($id_usuario, $estado)) {
                        echo json_encode(['success' => true, 'message' => "Usuario " . ($estado === 'Activo' ? "habilitado" : "inhabilitado") . " con éxito."]);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Error al cambiar estado.']);
                    }
                    break;

                case 'eliminar_logico':
                    $id_usuario = $_POST['id_usuario'];
                    if ($this->usuarioModel->eliminarLogico($id_usuario)) {
                        echo json_encode(['success' => true, 'message' => 'Usuario marcado como eliminado.']);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Error al eliminar usuario.']);
                    }
                    break;

                case 'verificar_correo':
                    $id_usuario = $_POST['id_usuario'];
                    if ($this->usuarioModel->verificarCorreo($id_usuario)) {
                        echo json_encode(['success' => true, 'message' => 'Correo verificado con éxito.']);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Error al verificar correo.']);
                    }
                    break;

                case 'actualizar_token_verificacion':
                    $id_usuario = $_POST['id_usuario'];
                    $token = $_POST['token_verificacion'] ?? null;
                    if ($this->usuarioModel->actualizarTokenVerificacion($id_usuario, $token)) {
                        echo json_encode(['success' => true, 'message' => 'Token actualizado con éxito.']);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Error al actualizar token.']);
                    }
                    break;

                case 'get_catalogos':
                    // Obtiene roles activos y tipos de documento (enum)
                    $roles = $this->pdo->query("SELECT id_rol, nombre FROM roles WHERE estado = 'Activo' AND eliminado = 0")->fetchAll(\PDO::FETCH_ASSOC);
                    $tipos = [];
                    $stmt = $this->pdo->query("SHOW COLUMNS FROM usuarios LIKE 'tipo_documento'");
                    $row = $stmt->fetch(\PDO::FETCH_ASSOC);
                    if ($row) {
                        preg_match("/^enum\((.*)\)$/", $row['Type'], $matches);
                        if (isset($matches[1])) {
                            $tipos = array_map(function($v) {
                                return trim($v, "'");
                            }, explode(',', $matches[1]));
                        }
                    }
                    echo json_encode(['success' => true, 'roles' => $roles, 'tipos_documento' => $tipos]);
                    break;

                case 'fetch':
                    if (isset($_POST['id_usuario'])) {
                        $usuario = $this->usuarioModel->obtenerPorId($_POST['id_usuario']);
                        if ($usuario) {
                            echo json_encode($usuario);
                        } else {
                            echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
                        }
                    } else {
                        $usuarios = $this->usuarioModel->obtenerTodos();
                        echo json_encode($usuarios);
                    }
                    break;

                default:
                    echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
                    break;
            }
        } catch (Throwable $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Error en el controlador de usuarios.',
                'error' => $e->getMessage()
            ]);
        }
    }
}
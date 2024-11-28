<?php

// Configuración de cabeceras para CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

try {
    // Configuración de la base de datos
    $dsn = 'mysql:host=localhost;dbname=ticketpro;charset=utf8';
    $username = 'root';
    $password = '';

    // Creación de la conexión PDO
    $pdo = new PDO($dsn, $username, $password);

    // Configurar el modo de error a excepción
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Procesar la solicitud de inicio de sesión
    $documento = $_POST['documento'] ?? '';
    $password = $_POST['password'] ?? '';

    if ($documento && $password) {
        $stmt = $pdo->prepare("SELECT * FROM Usuarios WHERE documento = ?");
        $stmt->execute([$documento]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario && $password === $usuario['password']) {
            session_start();
            $_SESSION['documento'] = $usuario['documento'];
            $_SESSION['nombre'] = $usuario['nombre'];
            $_SESSION['id_rol'] = $usuario['id_rol'];
            echo json_encode(['success' => true, 'message' => 'Inicio de sesión exitoso.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
    }
} catch (PDOException $e) {
    // Manejar errores de conexión
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
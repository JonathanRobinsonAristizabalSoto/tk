<?php
session_start();
header('Content-Type: application/json');
require_once("../config/config.php");

// Verifica si el usuario está autenticado
if (!isset($_SESSION['documento']) || empty($_SESSION['documento'])) {
    // Si no está autenticado, devolver respuesta y sugerir redirección
    echo json_encode([
        'success' => false,
        'message' => 'No autenticado',
        'redirect' => '/TicketProApp/client/index.html'
    ]);
    exit;
}

try {
    $documento = $_SESSION['documento'];
    $stmt = $pdo->prepare("SELECT nombre, foto FROM usuarios WHERE documento = ?");
    $stmt->execute([$documento]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        echo json_encode([
            'success' => true,
            'nombre' => $usuario['nombre'],
            'foto' => $usuario['foto']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Usuario no encontrado',
            'redirect' => '/TicketProApp/client/index.html'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión: ' . $e->getMessage(),
        'redirect' => '/TicketProApp/client/index.html'
    ]);
}
?>
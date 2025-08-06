<?php
session_start();
header('Content-Type: application/json');
require_once("../config/config.php");

// Verifica si el usuario está autenticado
if (!isset($_SESSION['documento'])) {
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
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
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]);
}
?>
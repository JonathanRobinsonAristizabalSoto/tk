<?php
// index.php

$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

switch ($requestMethod) {
    case 'GET':
        if ($requestUri == '/') {
            // Manejar la solicitud GET para la ruta raíz
            include 'client/index.html';
        } elseif ($requestUri == '/dashboard') {
            // Manejar la solicitud GET para la ruta /dashboard
            include 'client/pages/dashboard.html';
        } elseif ($requestUri == '/programas') {
            // Manejar la solicitud GET para la ruta /programas
            include 'client/pages/programas.html';
        } elseif ($requestUri == '/tickets') {
            // Manejar la solicitud GET para la ruta /tickets
            include 'client/pages/tickets.html';
        } elseif ($requestUri == '/tipologias') {
            // Manejar la solicitud GET para la ruta /tipologias
            include 'client/pages/tipologias.html';
        } elseif ($requestUri == '/usuarios') {
            // Manejar la solicitud GET para la ruta /usuarios
            include 'client/pages/usuarios.html';
        } else {
            // Manejar otras rutas GET
            header('HTTP/1.1 404 Not Found');
            echo 'Page Not Found';
        }
        break;

    case 'POST':
        if ($requestUri == '/actualizar') {
            // Manejar la solicitud POST para la ruta /actualizar
            include 'server/php/actualizar.php';
        } else {
            // Manejar otras rutas POST
            header('HTTP/1.1 404 Not Found');
            echo 'Page Not Found';
        }
        break;

    // Agrega más métodos HTTP según sea necesario

    default:
        // Manejar métodos HTTP no permitidos
        header('HTTP/1.1 405 Method Not Allowed');
        echo 'Method Not Allowed';
        break;
}
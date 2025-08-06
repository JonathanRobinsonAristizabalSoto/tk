<?php
session_start();
if (!isset($_SESSION['documento']) || empty($_SESSION['documento'])) {
    header("Location: /TicketProApp/client/index.html");
    exit;
}
readfile("../../client/src/pages/dashboard.html");
?>
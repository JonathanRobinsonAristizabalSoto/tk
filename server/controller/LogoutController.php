<?php
session_start();
session_unset();
session_destroy();

// Redirigir al inicio
header("Location: /TicketProApp/client/index.html");
exit;
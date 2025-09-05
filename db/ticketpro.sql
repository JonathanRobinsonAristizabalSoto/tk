-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-09-2025 a las 20:22:48
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ticketpro`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acceso_log`
--

CREATE TABLE `acceso_log` (
  `id_log` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `ip` varchar(45) DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adjuntos`
--

CREATE TABLE `adjuntos` (
  `id_adjunto` int(11) NOT NULL,
  `id_ticket` int(11) DEFAULT NULL,
  `id_comentario` int(11) DEFAULT NULL,
  `nombre_archivo` varchar(255) NOT NULL,
  `ruta_archivo` varchar(255) NOT NULL,
  `tipo_archivo` varchar(50) DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_subida` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id_auditoria` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `accion` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `id_comentario` int(11) NOT NULL,
  `id_ticket` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `comentario` text NOT NULL,
  `prioridad` enum('Alta','Media','Baja') DEFAULT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evento`
--

CREATE TABLE `evento` (
  `id_evento` int(11) NOT NULL,
  `id_ticket` int(11) DEFAULT NULL,
  `accion` varchar(255) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_evento` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `leido` tinyint(1) NOT NULL DEFAULT 0,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset`
--

CREATE TABLE `password_reset` (
  `id_reset` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiracion` datetime NOT NULL,
  `usado` tinyint(1) NOT NULL DEFAULT 0,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id_permiso` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id_permiso`, `nombre`, `descripcion`, `eliminado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Crear', 'Permiso para crear usuarios tipolgias programas tickets y comentarios en el sistema.', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(2, 'Ver', 'Permiso para visualizar usuarios tipolgias programas tickets y comentarios', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(3, 'Editar', 'Permiso para editar los detalles de un usuario tipolgia programa ticket y comentario', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(4, 'Eliminar', 'Permiso para eliminar una tipolgia programa ticket y comentario.', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(5, 'Activar', 'Permiso para activar un usuario tipolgia o programa.', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(6, 'Desactivar', 'Permiso para desactivar un usuario tipolgia o programa.', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programas`
--

CREATE TABLE `programas` (
  `id_programa` int(11) NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `version` varchar(50) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `duracion` int(11) NOT NULL,
  `linea_tecnologica` varchar(255) NOT NULL,
  `red_tecnologica` varchar(255) NOT NULL,
  `red_de_conocimiento` varchar(255) NOT NULL,
  `modalidad` varchar(255) NOT NULL,
  `id_tipologia` int(11) NOT NULL,
  `id_subtipologia` int(11) DEFAULT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `programas`
--

INSERT INTO `programas` (`id_programa`, `codigo`, `version`, `nombre`, `descripcion`, `duracion`, `linea_tecnologica`, `red_tecnologica`, `red_de_conocimiento`, `modalidad`, `id_tipologia`, `id_subtipologia`, `estado`, `eliminado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, '22620442', '3', 'BASICO OPERATIVO TRABAJO SEGURO EN ALTURAS', 'Capacitación para trabajos en altura.', 48, 'MATERIALES HERRAMIENTAS', 'MATERIALES PARA LA CONSTRUCCIÓN', 'Construcción', 'Presencial', 1, 1, 'Activo', 0, '2025-09-01 23:26:02', '2025-09-02 00:21:30'),
(2, '22620443', '2', 'ADMINISTRATIVO PARA JEFES DE AREA TRABAJO SEGURO EN ALTURAS', 'Capacitación para trabajos en altura.', 10, 'MATERIALES HERRAMIENTAS', 'MATERIALES PARA LA CONSTRUCCIÓN', 'Construcción', 'Presencial', 1, 1, 'Activo', 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(3, '22620444', '1', 'GESTION DEL RIESGO EN ALTURAS', 'Capacitación en gestión del riesgo.', 6, 'MATERIALES HERRAMIENTAS', 'MATERIALES PARA LA CONSTRUCCIÓN', 'Construcción', 'Presencial', 1, 1, 'Activo', 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` enum('Administrador','Soporte','Usuario') NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`, `descripcion`, `estado`, `eliminado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Administrador', 'Acceso completo al sistema.', 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(2, 'Soporte', 'Resuelve tickets y asistencia técnica.', 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(3, 'Usuario', 'Crea tickets y realiza solicitudes.', 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rolpermisos`
--

CREATE TABLE `rolpermisos` (
  `id_rol` int(11) NOT NULL,
  `id_permiso` int(11) NOT NULL,
  `fecha_asignacion` datetime NOT NULL DEFAULT current_timestamp(),
  `eliminado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rolpermisos`
--

INSERT INTO `rolpermisos` (`id_rol`, `id_permiso`, `fecha_asignacion`, `eliminado`) VALUES
(1, 1, '2023-10-01 10:00:00', 0),
(1, 2, '2023-10-01 10:00:00', 0),
(1, 3, '2023-10-01 10:00:00', 0),
(1, 4, '2023-10-01 10:00:00', 0),
(1, 5, '2023-10-01 10:00:00', 0),
(1, 6, '2023-10-01 10:00:00', 0),
(2, 2, '2023-10-01 10:00:00', 0),
(2, 3, '2023-10-01 10:00:00', 0),
(3, 1, '2023-10-01 10:00:00', 0),
(3, 2, '2023-10-01 10:00:00', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subtipologias`
--

CREATE TABLE `subtipologias` (
  `id_subtipologia` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `id_tipologia` int(11) NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `subtipologias`
--

INSERT INTO `subtipologias` (`id_subtipologia`, `nombre`, `descripcion`, `id_tipologia`, `estado`, `eliminado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Solicitud de cupos', 'Solicitudes de cupos para formación.', 1, 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(2, 'Apertura de programa', 'Consultas sobre apertura de programas.', 2, 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(3, 'Competencias laborales', 'Certificación de competencias laborales.', 3, 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(4, 'Peticiones', 'Peticiones en PQRSF.', 4, 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(5, 'Quejas', 'Quejas en PQRSF.', 4, 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(6, 'Reclamos', 'Reclamos en PQRSF.', 4, 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(7, 'Sugerencias', 'Sugerencias en PQRSF.', 4, 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(8, 'Felicitaciones', 'Felicitaciones en PQRSF.', 4, 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(9, 'Otras solicitudes', 'Otras solicitudes.', 5, 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ticket`
--

CREATE TABLE `ticket` (
  `id_ticket` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `numero_ticket` varchar(50) NOT NULL,
  `descripcion` text NOT NULL,
  `prioridad` enum('Alta','Media','Baja') NOT NULL,
  `estado` enum('Abierto','Progreso','Pendiente','Resuelto','Cerrado') NOT NULL,
  `id_rol` int(11) DEFAULT NULL,
  `id_programa` int(11) DEFAULT NULL,
  `id_tipologia` int(11) DEFAULT NULL,
  `id_subtipologia` int(11) DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ticket`
--

INSERT INTO `ticket` (`id_ticket`, `id_usuario`, `numero_ticket`, `descripcion`, `prioridad`, `estado`, `id_rol`, `id_programa`, `id_tipologia`, `id_subtipologia`, `eliminado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 1, 'TK-0001', 'Primer ticket de prueba', 'Alta', 'Abierto', 1, 1, 1, 1, 0, '2025-09-02 17:05:03', '2025-09-02 17:05:03'),
(2, 2, 'TK-0002', 'Segundo ticket de prueba', 'Media', 'Progreso', 2, 2, 2, 2, 0, '2025-09-02 17:05:03', '2025-09-02 17:05:03'),
(3, 3, 'TK-0003', 'Tercer ticket de prueba', 'Baja', 'Pendiente', 3, 3, 3, 3, 0, '2025-09-02 17:05:03', '2025-09-02 17:05:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ticket_asignacion`
--

CREATE TABLE `ticket_asignacion` (
  `id_asignacion` int(11) NOT NULL,
  `id_ticket` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_asignacion` datetime NOT NULL DEFAULT current_timestamp(),
  `eliminado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ticket_estado_historial`
--

CREATE TABLE `ticket_estado_historial` (
  `id_historial` int(11) NOT NULL,
  `id_ticket` int(11) NOT NULL,
  `estado_anterior` enum('Abierto','Progreso','Pendiente','Resuelto','Cerrado') DEFAULT NULL,
  `estado_nuevo` enum('Abierto','Progreso','Pendiente','Resuelto','Cerrado') DEFAULT NULL,
  `fecha_cambio` datetime NOT NULL DEFAULT current_timestamp(),
  `id_usuario` int(11) DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipologias`
--

CREATE TABLE `tipologias` (
  `id_tipologia` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `id_rol` int(11) DEFAULT NULL,
  `estado_tipologia` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipologias`
--

INSERT INTO `tipologias` (`id_tipologia`, `nombre`, `descripcion`, `id_rol`, `estado_tipologia`, `eliminado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Formacion', 'Procesos de formación y capacitación.', 1, 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(2, 'Consultas', 'Consultas generales y solicitudes de información.', 1, 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(3, 'Certificacion', 'Procesos de certificación y validación de competencias.', 1, 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(4, 'PQRSF', 'Peticiones, quejas, reclamos, sugerencias y felicitaciones.', 1, 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02'),
(5, 'Otro', 'Otras tipologías no clasificadas.', 1, 'Activo', 0, '2023-10-01 10:00:00', '2025-09-01 23:26:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `tipo_documento` enum('CC','TI','CE','PS','DNI','NIT') NOT NULL,
  `documento` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `departamento` varchar(255) DEFAULT NULL,
  `municipio` varchar(255) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `email_verificado` tinyint(1) NOT NULL DEFAULT 0,
  `token_verificacion` varchar(255) DEFAULT NULL,
  `codigo_recuperacion` varchar(10) DEFAULT NULL,
  `eliminado` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `tipo_documento`, `documento`, `nombre`, `apellido`, `email`, `telefono`, `departamento`, `municipio`, `foto`, `password`, `id_rol`, `estado`, `email_verificado`, `token_verificacion`, `codigo_recuperacion`, `eliminado`, `fecha_registro`, `fecha_actualizacion`) VALUES
(1, 'CC', '1053810807', 'Jonathan', 'Aristizabal', 'martinrobinsofficial@gmail.com', '3187542709', 'Caldas', 'Manizales', 'assets/images/perfiles/perfil_68b75cfa5cf5e.jpg', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 1, 'Activo', 0, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-02 16:09:15'),
(2, 'CC', '1000000002', 'Jaime', 'Rodriguez', 'jaime@email.com', '3100000002', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 2, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(3, 'CC', '1000000003', 'Gloria', 'Corrales', 'gloria@email.com', '3100000003', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 2, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(4, 'CC', '1000000004', 'Sofía', 'Ramírez', 'sofia@email.com', '3100000004', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(5, 'CC', '1000000005', 'Carlos', 'López', 'carlos@email.com', '3100000005', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(6, 'CC', '1000000006', 'María', 'Torres', 'maria@email.com', '3100000006', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(7, 'CC', '1000000007', 'Pedro', 'García', 'pedro@email.com', '3100000007', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(8, 'CC', '1000000008', 'Laura', 'Jiménez', 'laura@email.com', '3100000008', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(9, 'CC', '1000000009', 'Diego', 'Castro', 'diego@email.com', '3100000009', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(10, 'CC', '1000000010', 'Valentina', 'Mendoza', 'valentina@email.com', '3100000010', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(11, 'CC', '1000000011', 'Miguel', 'Suárez', 'miguel@email.com', '3100000011', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(12, 'CC', '1000000012', 'Camila', 'Moreno', 'camila@email.com', '3100000012', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(13, 'CC', '1000000013', 'Andrés', 'Ríos', 'andres@email.com', '3100000013', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(14, 'CC', '1000000014', 'Paula', 'Vargas', 'paula@email.com', '3100000014', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(15, 'CC', '1000000015', 'Jorge', 'Castaño', 'jorge@email.com', '3100000015', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(16, 'CC', '1000000016', 'Sara', 'Ortiz', 'sara@email.com', '3100000016', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(17, 'CC', '1000000017', 'Felipe', 'Navarro', 'felipe@email.com', '3100000017', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(18, 'CC', '1000000018', 'Isabella', 'Cruz', 'isabella@email.com', '3100000018', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(19, 'CC', '1000000019', 'David', 'Santos', 'david@email.com', '3100000019', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02'),
(20, 'CC', '1000000020', 'Lucía', 'Mejía', 'lucia@email.com', '3100000020', 'Caldas', 'Manizales', 'assets/images/perfiles/default.png', '$2y$10$JA/SnuV36zc/jbkkH4Wwje7F1HGm5Le7ZQd0AMzrTGk3lBPaUIzLi', 3, 'Activo', 1, NULL, NULL, 0, '2025-09-01 23:26:02', '2025-09-01 23:26:02');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `acceso_log`
--
ALTER TABLE `acceso_log`
  ADD PRIMARY KEY (`id_log`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `adjuntos`
--
ALTER TABLE `adjuntos`
  ADD PRIMARY KEY (`id_adjunto`),
  ADD KEY `id_ticket` (`id_ticket`),
  ADD KEY `id_comentario` (`id_comentario`);

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id_auditoria`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`id_comentario`),
  ADD KEY `id_ticket` (`id_ticket`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `evento`
--
ALTER TABLE `evento`
  ADD PRIMARY KEY (`id_evento`),
  ADD KEY `id_ticket` (`id_ticket`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `password_reset`
--
ALTER TABLE `password_reset`
  ADD PRIMARY KEY (`id_reset`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id_permiso`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `programas`
--
ALTER TABLE `programas`
  ADD PRIMARY KEY (`id_programa`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `id_tipologia` (`id_tipologia`),
  ADD KEY `id_subtipologia` (`id_subtipologia`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `rolpermisos`
--
ALTER TABLE `rolpermisos`
  ADD PRIMARY KEY (`id_rol`,`id_permiso`),
  ADD KEY `id_permiso` (`id_permiso`);

--
-- Indices de la tabla `subtipologias`
--
ALTER TABLE `subtipologias`
  ADD PRIMARY KEY (`id_subtipologia`),
  ADD KEY `id_tipologia` (`id_tipologia`);

--
-- Indices de la tabla `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id_ticket`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `id_programa` (`id_programa`),
  ADD KEY `id_tipologia` (`id_tipologia`),
  ADD KEY `id_subtipologia` (`id_subtipologia`);

--
-- Indices de la tabla `ticket_asignacion`
--
ALTER TABLE `ticket_asignacion`
  ADD PRIMARY KEY (`id_asignacion`),
  ADD KEY `id_ticket` (`id_ticket`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `ticket_estado_historial`
--
ALTER TABLE `ticket_estado_historial`
  ADD PRIMARY KEY (`id_historial`),
  ADD KEY `id_ticket` (`id_ticket`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `tipologias`
--
ALTER TABLE `tipologias`
  ADD PRIMARY KEY (`id_tipologia`),
  ADD KEY `id_rol` (`id_rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `email_2` (`email`),
  ADD KEY `documento_2` (`documento`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `acceso_log`
--
ALTER TABLE `acceso_log`
  MODIFY `id_log` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `adjuntos`
--
ALTER TABLE `adjuntos`
  MODIFY `id_adjunto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id_auditoria` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `id_comentario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evento`
--
ALTER TABLE `evento`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `password_reset`
--
ALTER TABLE `password_reset`
  MODIFY `id_reset` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `id_permiso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `programas`
--
ALTER TABLE `programas`
  MODIFY `id_programa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `subtipologias`
--
ALTER TABLE `subtipologias`
  MODIFY `id_subtipologia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `ticket`
--
ALTER TABLE `ticket`
  MODIFY `id_ticket` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ticket_asignacion`
--
ALTER TABLE `ticket_asignacion`
  MODIFY `id_asignacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ticket_estado_historial`
--
ALTER TABLE `ticket_estado_historial`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipologias`
--
ALTER TABLE `tipologias`
  MODIFY `id_tipologia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `acceso_log`
--
ALTER TABLE `acceso_log`
  ADD CONSTRAINT `acceso_log_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `adjuntos`
--
ALTER TABLE `adjuntos`
  ADD CONSTRAINT `adjuntos_ibfk_1` FOREIGN KEY (`id_ticket`) REFERENCES `ticket` (`id_ticket`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `adjuntos_ibfk_2` FOREIGN KEY (`id_comentario`) REFERENCES `comentario` (`id_comentario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`id_ticket`) REFERENCES `ticket` (`id_ticket`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comentario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `evento`
--
ALTER TABLE `evento`
  ADD CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`id_ticket`) REFERENCES `ticket` (`id_ticket`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `evento_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `password_reset`
--
ALTER TABLE `password_reset`
  ADD CONSTRAINT `password_reset_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `programas`
--
ALTER TABLE `programas`
  ADD CONSTRAINT `programas_ibfk_1` FOREIGN KEY (`id_tipologia`) REFERENCES `tipologias` (`id_tipologia`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `programas_ibfk_2` FOREIGN KEY (`id_subtipologia`) REFERENCES `subtipologias` (`id_subtipologia`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `rolpermisos`
--
ALTER TABLE `rolpermisos`
  ADD CONSTRAINT `rolpermisos_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rolpermisos_ibfk_2` FOREIGN KEY (`id_permiso`) REFERENCES `permisos` (`id_permiso`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `subtipologias`
--
ALTER TABLE `subtipologias`
  ADD CONSTRAINT `subtipologias_ibfk_1` FOREIGN KEY (`id_tipologia`) REFERENCES `tipologias` (`id_tipologia`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_ibfk_3` FOREIGN KEY (`id_programa`) REFERENCES `programas` (`id_programa`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_ibfk_4` FOREIGN KEY (`id_tipologia`) REFERENCES `tipologias` (`id_tipologia`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_ibfk_5` FOREIGN KEY (`id_subtipologia`) REFERENCES `subtipologias` (`id_subtipologia`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `ticket_asignacion`
--
ALTER TABLE `ticket_asignacion`
  ADD CONSTRAINT `ticket_asignacion_ibfk_1` FOREIGN KEY (`id_ticket`) REFERENCES `ticket` (`id_ticket`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_asignacion_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ticket_estado_historial`
--
ALTER TABLE `ticket_estado_historial`
  ADD CONSTRAINT `ticket_estado_historial_ibfk_1` FOREIGN KEY (`id_ticket`) REFERENCES `ticket` (`id_ticket`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_estado_historial_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `tipologias`
--
ALTER TABLE `tipologias`
  ADD CONSTRAINT `tipologias_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

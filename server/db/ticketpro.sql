-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-09-2024 a las 09:03:47
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
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `id_comentario` int(11) NOT NULL,
  `id_ticket` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `comentario` text NOT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comentario`
--

INSERT INTO `comentario` (`id_comentario`, `id_ticket`, `id_usuario`, `comentario`, `fecha_creacion`) VALUES
(1, 1, 1, 'Confirmo que el cupo está disponible. Por favor, procedan con la inscripción.', '2023-10-01 00:00:00'),
(2, 2, 2, 'El curso avanzado está disponible. Te enviaré los detalles por correo.', '2023-10-02 00:00:00'),
(3, 3, 3, 'La certificación será enviada una vez que finalices el curso.', '2023-10-03 00:00:00'),
(4, 4, 4, 'Información adicional se enviará a tu dirección de correo.', '2023-10-04 00:00:00'),
(5, 5, 5, 'El curso de seguridad en alturas está programado para el próximo mes.', '2023-10-05 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evento`
--

CREATE TABLE `evento` (
  `id_evento` int(11) NOT NULL,
  `id_ticket` int(11) DEFAULT NULL,
  `accion` varchar(255) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha_evento` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `evento`
--

INSERT INTO `evento` (`id_evento`, `id_ticket`, `accion`, `id_usuario`, `fecha_evento`) VALUES
(1, 1, 'Ticket Creado', 1, '2023-10-01 10:00:00'),
(2, 1, 'Ticket En progreso', 1, '2023-10-02 11:00:00'),
(3, 1, 'Ticket Pendiente', 1, '2023-10-03 12:00:00'),
(4, 1, 'Ticket Resuelto', 1, '2023-10-04 09:00:00'),
(5, 1, 'Ticket Cerrado', 1, '2023-10-05 14:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id_permiso` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id_permiso`, `nombre`, `descripcion`, `fecha_creacion`) VALUES
(1, 'Crear', 'Permiso para crear usuarios tipolgias programas tickets y comentarios en el sistema.', '2023-10-01 10:00:00'),
(2, 'Ver', 'Permiso para visualizar usuarios tipolgias programas tickets y comentarios', '2023-10-01 10:00:00'),
(3, 'Editar', 'Permiso para editar los detalles de un usuario tipolgia programa ticket y comentario', '2023-10-01 10:00:00'),
(4, 'Eliminar', 'Permiso para eliminar una tipolgia programa ticket y comentario.', '2023-10-01 10:00:00'),
(5, 'Activar', 'Permiso para activar un usuario tipolgia o programa.', '2023-10-01 10:00:00'),
(6, 'Desactivar', 'Permiso para desactivar un usuario tipolgia o programa.', '2023-10-01 10:00:00');

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
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `programas`
--

INSERT INTO `programas` (`id_programa`, `codigo`, `version`, `nombre`, `descripcion`, `duracion`, `linea_tecnologica`, `red_tecnologica`, `red_de_conocimiento`, `modalidad`, `id_tipologia`, `estado`, `fecha_creacion`) VALUES
(1, '22620442', '3', 'BASICO OPERATIVO TRABAJO SEGURO EN ALTURAS', 'Capacitación para trabajos en altura.', 48, 'MATERIALES HERRAMIENTAS', 'MATERIALES PARA LA CONSTRUCCIÓN', 'Construcción', 'Presencial', 1, 'Activo', '2024-09-12 02:03:38'),
(2, '22620443', '2', 'ADMINISTRATIVO PARA JEFES DE AREA TRABAJO SEGURO EN ALTURAS', 'Capacitación para trabajos en altura.', 10, 'MATERIALES HERRAMIENTAS', 'MATERIALES PARA LA CONSTRUCCIÓN', 'Construcción', 'Presencial', 1, 'Activo', '2024-09-12 02:03:38'),
(3, '22620444', '1', 'GESTION DEL RIESGO EN ALTURAS', 'Capacitación en gestión del riesgo.', 6, 'MATERIALES HERRAMIENTAS', 'MATERIALES PARA LA CONSTRUCCIÓN', 'Construcción', 'Presencial', 1, 'Activo', '2024-09-12 02:03:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` enum('Administrador','Supervisor','Soporte','Operador','Usuario') NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`, `descripcion`, `estado`, `fecha_creacion`) VALUES
(1, 'Administrador', 'Acceso completo al sistema.', 'Activo', '2023-10-01 10:00:00'),
(2, 'Supervisor', 'Supervisa el trabajo del soporte.', 'Activo', '2023-10-01 10:00:00'),
(3, 'Soporte', 'Resuelve tickets y asistencia técnica.', 'Activo', '2023-10-01 10:00:00'),
(4, 'Operador', 'Crea y gestiona tickets básicos.', 'Activo', '2023-10-01 10:00:00'),
(5, 'Usuario', 'Crea tickets y realiza solicitudes.', 'Activo', '2023-10-01 10:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rolpermisos`
--

CREATE TABLE `rolpermisos` (
  `id_rol` int(11) NOT NULL,
  `id_permiso` int(11) NOT NULL,
  `fecha_asignacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rolpermisos`
--

INSERT INTO `rolpermisos` (`id_rol`, `id_permiso`, `fecha_asignacion`) VALUES
(1, 1, '2023-10-01 10:00:00'),
(1, 2, '2023-10-01 10:00:00'),
(1, 3, '2023-10-01 10:00:00'),
(1, 4, '2023-10-01 10:00:00'),
(1, 5, '2023-10-01 10:00:00'),
(1, 6, '2023-10-01 10:00:00'),
(2, 2, '2023-10-01 10:00:00'),
(2, 3, '2023-10-01 10:00:00'),
(2, 5, '2023-10-01 10:00:00'),
(2, 6, '2023-10-01 10:00:00'),
(3, 2, '2023-10-01 10:00:00'),
(3, 3, '2023-10-01 10:00:00'),
(4, 1, '2023-10-01 10:00:00'),
(4, 2, '2023-10-01 10:00:00'),
(5, 1, '2023-10-01 10:00:00'),
(5, 2, '2023-10-01 10:00:00');

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
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ticket`
--

INSERT INTO `ticket` (`id_ticket`, `id_usuario`, `numero_ticket`, `descripcion`, `prioridad`, `estado`, `id_rol`, `id_programa`, `id_tipologia`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 4, 'A1B2C3', 'Necesito 5 cupos para el curso básico de formación.', 'Alta', 'Abierto', NULL, 1, 1, '2023-10-01 10:00:00', '2023-10-01 10:00:00'),
(2, 4, 'D4E5F6', 'Consulta sobre la disponibilidad del curso avanzado.', 'Media', 'Progreso', NULL, 2, 2, '2023-10-02 11:00:00', '2023-10-02 11:00:00'),
(3, 4, 'J1K2L3', 'Solicito información adicional sobre la capacitación en construcción.', 'Baja', 'Resuelto', NULL, 1, 1, '2023-10-04 09:00:00', '2023-10-04 09:00:00'),
(4, 4, 'M4N5O6', 'Requerimiento para curso de seguridad en alturas.', 'Alta', 'Cerrado', NULL, 2, 2, '2023-10-05 14:00:00', '2023-10-05 14:00:00'),
(5, 1, 'G7H8I9', 'Certificación para el curso de trabajo en alturas.', 'Alta', 'Pendiente', NULL, 3, 3, '2023-10-03 12:00:00', '2023-10-03 12:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipologias`
--

CREATE TABLE `tipologias` (
  `id_tipologia` int(11) NOT NULL,
  `tipologia` enum('Formacion','Consultas','Certificacion','PQRSF','Otro') NOT NULL,
  `subtipologia` varchar(255) NOT NULL,
  `id_rol` int(11) DEFAULT NULL,
  `estado_tipologia` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipologias`
--

INSERT INTO `tipologias` (`id_tipologia`, `tipologia`, `subtipologia`, `id_rol`, `estado_tipologia`, `fecha_creacion`) VALUES
(1, 'Formacion', 'Solicitud de cupos', 1, 'Activo', '2023-10-01 10:00:00'),
(2, 'Consultas', 'Apertura de programa', 1, 'Activo', '2023-10-01 10:00:00'),
(3, 'Certificacion', 'Competencias laborales', 1, 'Activo', '2023-10-01 10:00:00'),
(4, 'PQRSF', 'Peticiones', 1, 'Activo', '2023-10-01 10:00:00'),
(5, 'PQRSF', 'Quejas', 1, 'Activo', '2023-10-01 10:00:00'),
(6, 'PQRSF', 'Reclamos', 1, 'Activo', '2023-10-01 10:00:00'),
(7, 'PQRSF', 'Sugerencias', 1, 'Activo', '2023-10-01 10:00:00'),
(8, 'PQRSF', 'Felicitaciones', 1, 'Activo', '2023-10-01 10:00:00'),
(9, 'Otro', 'Otras solicitudes', 1, 'Activo', '2023-10-01 10:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `tipo_documento` varchar(255) NOT NULL,
  `documento` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `departamento` varchar(255) DEFAULT NULL,
  `municipio` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `tipo_documento`, `documento`, `nombre`, `apellido`, `email`, `telefono`, `departamento`, `municipio`, `password`, `id_rol`, `estado`, `fecha_registro`) VALUES
(1, 'CC', '1053810807', 'Jonathan Robinson', 'Aristizabal Soto', 'administrador@example.com', '3187542709', 'Caldas', 'Manizales', 'Administrador1234', 1, 'Activo', '2024-09-07 12:00:00'),
(2, 'CC', '87654321', 'María', 'Gómez', 'soporte@example.com', '3201234567', 'Antioquia', 'Medellín', 'Soporte1234', 2, 'Activo', '2023-10-01 10:00:00'),
(3, 'CC', '11223344', 'Carlos', 'López', 'supervisor@example.com', '3109876543', 'Bogotá', 'Bogotá', 'Supervisor1234', 3, 'Activo', '2023-10-02 11:00:00'),
(4, 'CC', '55667788', 'Luis', 'Rodríguez', 'operador@example.com', '3112233445', 'Santander', 'Bucaramanga', 'Operador1234', 4, 'Activo', '2023-10-04 09:00:00'),
(5, 'CC', '99887766', 'Ana', 'Martínez', 'usuario@example.com', '3156789012', 'Valle', 'Cali', 'Usuario1234', 5, 'Activo', '2024-09-11 08:00:00');

--
-- Índices para tablas volcadas
--

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
  ADD KEY `id_tipologia` (`id_tipologia`);

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
-- Indices de la tabla `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id_ticket`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `id_programa` (`id_programa`),
  ADD KEY `id_tipologia` (`id_tipologia`);

--
-- Indices de la tabla `tipologias`
--
ALTER TABLE `tipologias`
  ADD PRIMARY KEY (`id_tipologia`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `subtipologia` (`subtipologia`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `email_2` (`email`),
  ADD KEY `documento_2` (`documento`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `id_comentario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `evento`
--
ALTER TABLE `evento`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ticket`
--
ALTER TABLE `ticket`
  MODIFY `id_ticket` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tipologias`
--
ALTER TABLE `tipologias`
  MODIFY `id_tipologia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`id_ticket`) REFERENCES `ticket` (`id_ticket`),
  ADD CONSTRAINT `comentario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `evento`
--
ALTER TABLE `evento`
  ADD CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`id_ticket`) REFERENCES `ticket` (`id_ticket`),
  ADD CONSTRAINT `evento_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `programas`
--
ALTER TABLE `programas`
  ADD CONSTRAINT `programas_ibfk_1` FOREIGN KEY (`id_tipologia`) REFERENCES `tipologias` (`id_tipologia`);

--
-- Filtros para la tabla `rolpermisos`
--
ALTER TABLE `rolpermisos`
  ADD CONSTRAINT `rolpermisos_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  ADD CONSTRAINT `rolpermisos_ibfk_2` FOREIGN KEY (`id_permiso`) REFERENCES `permisos` (`id_permiso`);

--
-- Filtros para la tabla `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  ADD CONSTRAINT `ticket_ibfk_3` FOREIGN KEY (`id_programa`) REFERENCES `programas` (`id_programa`),
  ADD CONSTRAINT `ticket_ibfk_4` FOREIGN KEY (`id_tipologia`) REFERENCES `tipologias` (`id_tipologia`);

--
-- Filtros para la tabla `tipologias`
--
ALTER TABLE `tipologias`
  ADD CONSTRAINT `tipologias_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

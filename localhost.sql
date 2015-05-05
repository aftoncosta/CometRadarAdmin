-- phpMyAdmin SQL Dump
-- version 3.5.8.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 05, 2015 at 02:33 PM
-- Server version: 5.5.42-37.1-log
-- PHP Version: 5.4.23

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `bsxpccom_cometradar`
--
CREATE DATABASE `bsxpccom_cometradar` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `bsxpccom_cometradar`;

-- --------------------------------------------------------

--
-- Table structure for table `current_route`
--

DROP TABLE IF EXISTS `current_route`;
CREATE TABLE IF NOT EXISTS `current_route` (
  `route_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `shuttle` varchar(50) NOT NULL,
  `students_on_shuttle` int(11) NOT NULL COMMENT 'Current students on a shuttle',
  `currentLat` varchar(35) NOT NULL,
  `currentLong` varchar(35) NOT NULL,
  PRIMARY KEY (`route_name`,`email`),
  KEY `shuttle` (`shuttle`),
  KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `current_route`
--

INSERT INTO `current_route` (`route_name`, `email`, `shuttle`, `students_on_shuttle`, `currentLat`, `currentLong`) VALUES
('McDermott Library', 'amc101020@utdallas.edu', '1', 0, '32.986363', '-96.7508585'),
('McDermott Library', 'gk@utd.com', '1', 8, '32.986363', '-96.7508585'),
('Rutford Avenue North-South', 'amc101020@utdallas.edu', '1', 0, '32.9893535', '-96.7526792'),
('Rutford Avenue North-South', 'jas920394@utdallas.edu', '1', 5, '32.9893535', '-96.7526792'),
('University Commons', 'amc101020@utdallas.edu', '2', 8, '32.9894253', '-96.7526435'),
('University Village Phase 1 and 2', 'hdk728291@utdallas.edu', '3', 2, '32.9872171', '-96.7506423'),
('University Village Phase 5 and 6', 'jqa827382@utdallas.edu', '4', 6, '32.9893506', '-96.7526721');

-- --------------------------------------------------------

--
-- Table structure for table `pickup_request`
--

DROP TABLE IF EXISTS `pickup_request`;
CREATE TABLE IF NOT EXISTS `pickup_request` (
  `log` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Needed to keep log of every entry',
  `route_name` varchar(50) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lat` varchar(25) NOT NULL COMMENT 'Has to be varchar bc decimal isn''t accurate enough',
  `long` varchar(25) NOT NULL COMMENT 'Has to be varchar bc decimal isn''t accurate enough',
  PRIMARY KEY (`log`,`route_name`),
  KEY `route_name` (`route_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=195 ;

--
-- Dumping data for table `pickup_request`
--

INSERT INTO `pickup_request` (`log`, `route_name`, `date`, `lat`, `long`) VALUES
(62, 'McDermott Library', '2015-04-19 20:26:35', '32.9901275721282', '-96.74410343170166'),
(63, 'McDermott Library', '2015-04-19 20:27:38', '32.9901275721282', '-96.74410343170166'),
(64, 'University Commons', '2015-04-19 20:32:34', '32.98569996993572', '-96.75101280212402'),
(65, 'University Commons', '2015-04-19 20:36:47', '32.98569996993572', '-96.75101280212402'),
(101, 'University Commons', '2015-04-20 02:25:36', '32.98569996993572', '-96.75101280212402'),
(102, 'University Commons', '2015-04-20 02:27:48', '32.98569996993572', '-96.75101280212402'),
(103, 'University Commons', '2015-04-20 02:28:07', '32.98569996993572', '-96.75101280212402'),
(106, 'University Commons', '2015-04-20 16:12:43', '32.98569996993572', '-96.75101280212402'),
(107, 'University Commons', '2015-04-20 16:15:39', '32.98569996993572', '-96.75101280212402'),
(108, 'University Commons', '2015-04-20 16:15:47', '32.98569996993572', '-96.75101280212402'),
(109, 'University Commons', '2015-04-20 16:17:36', '32.98569996993572', '-96.75101280212402'),
(110, 'University Commons', '2015-04-20 16:24:11', '32.98569996993572', '-96.75101280212402'),
(111, 'University Commons', '2015-04-20 16:31:38', '32.98569996993572', '-96.75101280212402'),
(112, 'University Commons', '2015-04-20 16:31:45', '32.98569996993572', '-96.75101280212402'),
(113, 'University Commons', '2015-04-20 16:32:19', '32.98569996993572', '-96.75101280212402'),
(114, 'University Commons', '2015-04-20 16:34:01', '32.98569996993572', '-96.75101280212402'),
(115, 'University Commons', '2015-04-20 16:35:40', '32.98569996993572', '-96.75101280212402'),
(116, 'University Commons', '2015-04-20 16:38:26', '32.98569996993572', '-96.75101280212402'),
(118, 'University Village Phase 5 and 6', '2015-04-20 16:39:26', '32.9856639722598', '-96.75251483917236'),
(119, 'McDermott Library', '2015-04-20 16:40:14', '32.98735584716008', '-96.74697875976563'),
(120, 'University Commons', '2015-04-20 16:46:19', '32.98620393585743', '-96.75101280212402'),
(122, 'University Village Phase 5 and 6', '2015-04-20 16:47:55', '32.9856639722598', '-96.75281524658203'),
(123, 'University Commons', '2015-04-20 16:54:52', '32.98620393585743', '-96.75101280212402'),
(124, 'University Commons', '2015-04-20 16:57:44', '32.98620393585743', '-96.75101280212402'),
(125, 'University Commons', '2015-04-20 17:08:48', '32.98620393585743', '-96.75101280212402'),
(126, 'McDermott Library', '2015-04-20 17:09:16', '32.98746383807402', '-96.74702167510986'),
(127, 'University Village Phase 5 and 6', '2015-04-20 17:15:54', '32.9856639722598', '-96.75281524658203'),
(128, 'Rutford Avenue North-South', '2015-04-20 17:16:26', '32.98620393585743', '-96.75101280212402'),
(129, 'University Commons', '2015-04-20 17:28:13', '32.98620393585743', '-96.75101280212402'),
(130, 'University Commons', '2015-04-20 17:31:49', '32.98620393585743', '-96.75101280212402'),
(131, 'University Commons', '2015-04-20 17:36:13', '32.98620393585743', '-96.75101280212402'),
(132, 'University Commons', '2015-04-20 17:39:10', '32.98620393585743', '-96.75101280212402'),
(133, 'University Commons', '2015-04-20 17:43:30', '32.98620393585743', '-96.75101280212402'),
(134, 'University Commons', '2015-04-20 17:46:37', '32.98620393585743', '-96.75101280212402'),
(135, 'University Commons', '2015-04-20 17:52:23', '32.98620393585743', '-96.75101280212402'),
(136, 'University Village Phase 5 and 6', '2015-04-20 17:52:37', '32.9856639722598', '-96.75281524658203'),
(137, 'McDermott Library', '2015-04-20 17:52:53', '32.98746383807402', '-96.74702167510986'),
(138, 'University Commons', '2015-04-20 18:15:54', '32.98620393585743', '-96.75101280212402'),
(139, 'University Commons', '2015-04-20 18:21:45', '32.98620393585743', '-96.75101280212402'),
(140, 'University Commons', '2015-04-20 18:36:27', '32.98620393585743', '-96.75101280212402'),
(141, 'University Commons', '2015-04-20 18:45:48', '32.98620393585743', '-96.75101280212402'),
(142, 'University Commons', '2015-04-20 18:47:22', '32.98620393585743', '-96.75101280212402'),
(143, 'University Commons', '2015-04-20 18:57:59', '32.98620393585743', '-96.75101280212402'),
(144, 'University Commons', '2015-04-20 19:00:27', '32.98620393585743', '-96.75101280212402'),
(145, 'University Commons', '2015-04-20 19:00:43', '32.98620393585743', '-96.75101280212402'),
(146, 'University Commons', '2015-04-20 19:05:17', '32.98620393585743', '-96.75101280212402'),
(147, 'University Commons', '2015-04-20 19:10:10', '32.98620393585743', '-96.75101280212402'),
(148, 'University Commons', '2015-04-20 19:10:21', '32.98620393585743', '-96.75101280212402'),
(149, 'University Commons', '2015-04-20 19:10:39', '32.98620393585743', '-96.75101280212402'),
(150, 'University Commons', '2015-04-20 19:13:57', '32.98620393585743', '-96.75101280212402'),
(151, 'University Commons', '2015-04-20 19:20:00', '32.98620393585743', '-96.75101280212402'),
(152, 'University Commons', '2015-04-20 19:30:42', '32.98620393585743', '-96.75101280212402'),
(153, 'University Commons', '2015-04-20 19:30:53', '32.98620393585743', '-96.75101280212402'),
(155, 'University Commons', '2015-04-20 19:38:21', '32.98620393585743', '-96.75101280212402'),
(156, 'University Commons', '2015-04-20 19:49:15', '32.98620393585743', '-96.75101280212402'),
(157, 'University Commons', '2015-04-20 19:51:14', '32.98620393585743', '-96.75101280212402'),
(158, 'University Commons', '2015-04-20 19:54:52', '32.98620393585743', '-96.75101280212402'),
(159, 'University Commons', '2015-04-20 20:00:14', '32.98620393585743', '-96.75101280212402'),
(160, 'University Commons', '2015-04-20 20:10:06', '32.98620393585743', '-96.75101280212402'),
(161, 'University Commons', '2015-04-20 20:12:18', '32.98620393585743', '-96.75101280212402'),
(162, 'University Commons', '2015-04-20 20:22:39', '32.98620393585743', '-96.75101280212402'),
(163, 'University Commons', '2015-04-20 20:24:01', '32.98620393585743', '-96.75101280212402'),
(164, 'University Commons', '2015-04-20 20:24:57', '32.98620393585743', '-96.75101280212402'),
(165, 'University Commons', '2015-04-20 20:25:55', '32.98620393585743', '-96.75101280212402'),
(166, 'University Commons', '2015-04-20 20:26:20', '32.98620393585743', '-96.75101280212402'),
(167, 'University Commons', '2015-04-20 20:29:35', '32.98620393585743', '-96.75101280212402'),
(168, 'University Commons', '2015-04-20 20:31:39', '32.98620393585743', '-96.75101280212402'),
(169, 'University Commons', '2015-04-20 20:31:54', '32.98620393585743', '-96.75101280212402'),
(170, 'University Commons', '2015-04-20 20:33:06', '32.98620393585743', '-96.75101280212402'),
(171, 'University Commons', '2015-04-20 20:33:14', '32.98620393585743', '-96.75101280212402'),
(172, 'University Commons', '2015-04-20 20:34:30', '32.98620393585743', '-96.75101280212402'),
(174, 'University Village Phase 5 and 6', '2015-04-20 20:35:21', '32.9856639722598', '-96.75281524658203'),
(175, 'McDermott Library', '2015-04-23 01:04:04', '32.98746383807402', '-96.74702167510986'),
(176, 'McDermott Library', '2015-04-23 16:43:09', '32.98746383807402', '-96.74702167510986'),
(177, 'McDermott Library', '2015-04-23 16:46:35', '32.98746383807402', '-96.74702167510986'),
(178, 'McDermott Library', '2015-04-23 17:11:10', '32.98746383807402', '-96.74702167510986'),
(179, 'McDermott Library', '2015-04-23 17:13:24', '32.98746383807402', '-96.74702167510986'),
(180, 'McDermott Library', '2015-04-24 15:51:55', '32.98746383807402', '-96.74702167510986'),
(182, 'McDermott Library', '2015-04-24 15:59:30', '32.98746383807402', '-96.74702167510986'),
(183, 'University Village Phase 5 and 6', '2015-04-24 16:09:31', '32.9856639722598', '-96.75084114074707'),
(184, 'McDermott Library', '2015-04-24 16:11:32', '32.98746383807402', '-96.74702167510986'),
(185, 'Rutford Avenue North-South', '2015-04-24 16:12:09', '32.98718149928623', '-96.75099571695864'),
(188, 'McDermott Library', '2015-04-24 16:27:32', '32.98746383807402', '-96.74702167510986'),
(191, 'University Village Phase 1 and 2', '2015-04-24 17:06:46', '32.9856639722598', '-96.75084114074707'),
(192, 'McDermott Library', '2015-04-25 03:25:05', '32.98746383807402', '-96.74702167510986'),
(193, 'University Village Phase 1 and 2', '2015-04-28 15:53:39', '32.9856639722598', '-96.75281524658203'),
(194, 'McDermott Library', '2015-04-29 16:44:44', '32.98735584716008', '-96.74697875976563');

-- --------------------------------------------------------

--
-- Table structure for table `route_waypoints`
--

DROP TABLE IF EXISTS `route_waypoints`;
CREATE TABLE IF NOT EXISTS `route_waypoints` (
  `route_name` varchar(50) NOT NULL,
  `order` int(11) NOT NULL,
  `wp_lat` varchar(15) NOT NULL COMMENT 'Has to be varchar bc decimal isn''t accurate enough',
  `wp_long` varchar(15) NOT NULL COMMENT 'Has to be varchar bc decimal isn''t accurate enough',
  PRIMARY KEY (`route_name`,`order`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `route_waypoints`
--

INSERT INTO `route_waypoints` (`route_name`, `order`, `wp_lat`, `wp_long`) VALUES
('McDermott Library', 1, '32.990127', '-96.7440778'),
('McDermott Library', 2, '32.988934', '-96.7453505'),
('McDermott Library', 3, '32.9846407', '-96.7457023'),
('McDermott Library', 4, '32.9851293', '-96.7452428'),
('Rutford Avenue North-South', 1, '32.9923302', '-96.7520444'),
('Rutford Avenue North-South', 2, '32.9926281', '-96.7518497'),
('Rutford Avenue North-South', 3, '32.9863467', '-96.7510063'),
('Rutford Avenue North-South', 4, '32.9805039', '-96.7510705'),
('Rutford Avenue North-South', 5, '32.980785', '-96.7501822'),
('University Commons', 1, '32.991725', '-96.752577'),
('University Commons', 2, '32.985651', '-96.749755'),
('University Village Phase 1 and 2', 1, '32.9837381', '-96.7544246'),
('University Village Phase 1 and 2', 2, '32.9837774', '-96.75588640000'),
('University Village Phase 1 and 2', 3, '32.9855606', '-96.75002030000'),
('University Village Phase 1 and 2', 4, '32.9856448', '-96.74969579999'),
('University Village Phase 5 and 6', 1, '32.985675', '-96.753559'),
('University Village Phase 5 and 6', 2, '32.988375', '-96.754777'),
('University Village Phase 5 and 6', 3, '32.987853', '-96.753935'),
('University Village Phase 5 and 6', 4, '32.986926', '-96.753897'),
('University Village Phase 5 and 6', 5, '32.9862203', '-96.7539341'),
('University Village Phase 5 and 6', 6, '32.9856431', '-96.7495537');

-- --------------------------------------------------------

--
-- Table structure for table `routedata`
--

DROP TABLE IF EXISTS `routedata`;
CREATE TABLE IF NOT EXISTS `routedata` (
  `route_name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `shuttle` varchar(50) NOT NULL,
  `onduty` tinyint(1) NOT NULL DEFAULT '0',
  `shiftstart_date` datetime NOT NULL,
  `shiftend_date` datetime NOT NULL,
  PRIMARY KEY (`route_name`,`email`,`shuttle`,`shiftstart_date`),
  KEY `email` (`email`),
  KEY `shuttle` (`shuttle`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `routedata`
--

INSERT INTO `routedata` (`route_name`, `email`, `shuttle`, `onduty`, `shiftstart_date`, `shiftend_date`) VALUES
('McDermott Library', 'gk@utd.com', '1', 1, '2015-04-29 10:47:08', '2015-04-29 12:47:08'),
('Rutford Avenue North-South', 'jas920394@utdallas.edu', '1', 1, '2015-02-26 09:00:00', '2015-02-26 12:00:00'),
('University Commons', 'amc101020@utdallas.edu', '2', 0, '2015-02-26 09:00:00', '2015-02-26 12:00:00'),
('University Village Phase 1 and 2', 'hdk728291@utdallas.edu', '3', 1, '2015-02-26 09:00:00', '2015-02-26 12:00:00'),
('University Village Phase 5 and 6', 'jqa827382@utdallas.edu', '4', 1, '2015-02-26 09:00:00', '2015-02-26 12:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
CREATE TABLE IF NOT EXISTS `routes` (
  `route_name` varchar(50) NOT NULL,
  `originLat` varchar(15) NOT NULL,
  `originLong` varchar(15) NOT NULL,
  `destLat` varchar(15) NOT NULL,
  `destLong` varchar(15) NOT NULL,
  PRIMARY KEY (`route_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `routes`
--

INSERT INTO `routes` (`route_name`, `originLat`, `originLong`, `destLat`, `destLong`) VALUES
('McDermott Library', '32.9873818', '-96.7469962', '32.9873509', '-96.7469764'),
('Rutford Avenue North-South', '32.9878542', '-96.7510077', '32.9876923', '-96.7509939'),
('University Commons', '32.985534', '-96.749980', '32.985552', '-96.749841'),
('University Village Phase 1 and 2', '32.9856748', '-96.75524339999', '32.9855582', '-96.7499986'),
('University Village Phase 5 and 6', '32.98554', '-96.74998', '32.9855593', '-96.7499166');

-- --------------------------------------------------------

--
-- Table structure for table `routestops`
--

DROP TABLE IF EXISTS `routestops`;
CREATE TABLE IF NOT EXISTS `routestops` (
  `log` int(11) NOT NULL DEFAULT '0' COMMENT 'Needed to keep log of every entry',
  `route_name` varchar(50) NOT NULL,
  `date` datetime NOT NULL,
  `lat` varchar(15) NOT NULL COMMENT 'Has to be varchar bc decimal isn''t accurate enough',
  `long` varchar(15) NOT NULL COMMENT 'Has to be varchar bc decimal isn''t accurate enough',
  `isPickup` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 = false',
  PRIMARY KEY (`log`,`route_name`),
  KEY `route_name` (`route_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `routestops`
--

INSERT INTO `routestops` (`log`, `route_name`, `date`, `lat`, `long`, `isPickup`) VALUES
(1, 'University Commons', '2015-04-24 08:00:00', '32.985708', '-96.750900', 0),
(2, 'University Commons', '2015-04-24 09:00:00', '32.986008', '-96.751000', 0),
(3, 'University Commons', '2015-04-24 09:00:00', '32.986408', '-96.751000', 0),
(4, 'University Commons', '2015-04-24 11:00:00', '32.987808', '-96.751000', 0),
(5, 'University Commons', '2015-04-24 13:00:00', '32.988308', '-96.751000', 0),
(6, 'University Commons', '2015-04-24 13:00:00', '32.990698', '-96.751989', 0),
(7, 'University Commons', '2015-04-24 14:00:00', '32.990698', '-96.753689', 0),
(8, 'McDermott Library', '2015-04-24 08:00:00', '32.990127', '-96.7440778', 0),
(9, 'McDermott Library', '2015-04-24 08:00:00', '32.988934', '-96.7453505', 0),
(10, 'McDermott Library', '2015-04-24 10:00:00', '32.9846407', '-96.7457023', 0),
(11, 'McDermott Library', '2015-04-24 11:00:00', '32.9851293', '-96.7452428', 0),
(12, 'Rutford Avenue North-South', '2015-04-24 10:00:00', '32.9923302', '-96.7520444', 0),
(13, 'Rutford Avenue North-South', '2015-04-24 10:00:00', '32.9926281', '-96.7518497', 0),
(14, 'Rutford Avenue North-South', '2015-04-24 14:00:00', '32.9863467', '-96.7510063', 0),
(15, 'Rutford Avenue North-South', '2015-04-24 15:00:00', '32.9805039', '-96.7510705', 0);

-- --------------------------------------------------------

--
-- Table structure for table `shuttle`
--

DROP TABLE IF EXISTS `shuttle`;
CREATE TABLE IF NOT EXISTS `shuttle` (
  `shuttle` varchar(50) NOT NULL,
  `max` int(11) NOT NULL,
  PRIMARY KEY (`shuttle`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `shuttle`
--

INSERT INTO `shuttle` (`shuttle`, `max`) VALUES
('1', 8),
('2', 8),
('3', 8),
('4', 6),
('5', 6);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `fname` varchar(15) NOT NULL,
  `lname` varchar(15) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 = false, 1 = true',
  `picture` varchar(1000) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`email`, `password`, `fname`, `lname`, `isAdmin`, `picture`) VALUES
('amc101020@utdallas.edu', 'blablabla', 'Afton', 'Costa', 0, 'Example_Photo.jpg'),
('gk@utd.com', '123', 'Grace', 'Kaldawi', 1, 'collegeSenior.jpg'),
('hdk728291@utdallas.edu', 'hucihiucew', 'Howard', 'Klein', 0, 'collegeFreshman.jpg'),
('jas920394@utdallas.edu', 'huihuihiufwfw', 'Jane', 'Smith', 0, 'Screen Shot 2015-04-20 at 12.20.53 PM1429550522255.png'),
('jqa827382@utdallas.edu', 'niuniucw', 'John', 'Adams', 0, 'batman.jpg');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `current_route`
--
ALTER TABLE `current_route`
  ADD CONSTRAINT `current_route_ibfk_1` FOREIGN KEY (`route_name`) REFERENCES `routes` (`route_name`),
  ADD CONSTRAINT `current_route_ibfk_2` FOREIGN KEY (`email`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `current_route_ibfk_3` FOREIGN KEY (`shuttle`) REFERENCES `shuttle` (`shuttle`);

--
-- Constraints for table `pickup_request`
--
ALTER TABLE `pickup_request`
  ADD CONSTRAINT `pickup_request_ibfk_1` FOREIGN KEY (`route_name`) REFERENCES `routes` (`route_name`);

--
-- Constraints for table `route_waypoints`
--
ALTER TABLE `route_waypoints`
  ADD CONSTRAINT `route_waypoints_ibfk_1` FOREIGN KEY (`route_name`) REFERENCES `routes` (`route_name`);

--
-- Constraints for table `routedata`
--
ALTER TABLE `routedata`
  ADD CONSTRAINT `routedata_ibfk_1` FOREIGN KEY (`route_name`) REFERENCES `routes` (`route_name`),
  ADD CONSTRAINT `routedata_ibfk_2` FOREIGN KEY (`email`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `routedata_ibfk_3` FOREIGN KEY (`shuttle`) REFERENCES `shuttle` (`shuttle`);

--
-- Constraints for table `routestops`
--
ALTER TABLE `routestops`
  ADD CONSTRAINT `routestops_ibfk_1` FOREIGN KEY (`route_name`) REFERENCES `routes` (`route_name`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

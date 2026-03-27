-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Mar 21, 2026 at 04:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sports_rental_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` varchar(20) NOT NULL,
  `customer_id` varchar(20) DEFAULT NULL,
  `staff_id` varchar(20) DEFAULT NULL,
  `branch_id` varchar(20) DEFAULT NULL,
  `booking_type_id` int(10) UNSIGNED DEFAULT NULL,
  `booking_status_id` int(11) DEFAULT NULL,
  `payment_status_id` int(11) DEFAULT NULL,
  `pickup_time` datetime DEFAULT NULL,
  `due_return_time` datetime NOT NULL,
  `actual_pickup_time` datetime DEFAULT NULL,
  `actual_return_time` datetime DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `penalty_fee` decimal(10,2) DEFAULT 0.00,
  `extra_hour_fee` decimal(10,2) DEFAULT 0.00,
  `net_amount` decimal(10,2) NOT NULL,
  `coupon_code` varchar(20) DEFAULT NULL,
  `points_used` int(11) DEFAULT 0,
  `points_used_value` decimal(10,2) DEFAULT 0.00,
  `points_earned` int(11) DEFAULT 0,
  `cancellation_reason` varchar(255) DEFAULT NULL,
  `cancelled_at` datetime DEFAULT NULL,
  `cancelled_by_staff_id` varchar(20) DEFAULT NULL,
  `cancelled_by_customer_id` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `customer_id`, `staff_id`, `branch_id`, `booking_type_id`, `booking_status_id`, `payment_status_id`, `pickup_time`, `due_return_time`, `actual_pickup_time`, `actual_return_time`, `total_amount`, `discount_amount`, `penalty_fee`, `extra_hour_fee`, `net_amount`, `coupon_code`, `points_used`, `points_used_value`, `points_earned`, `cancellation_reason`, `cancelled_at`, `cancelled_by_staff_id`, `cancelled_by_customer_id`) VALUES
('BK001338', 'C88103', 'S007', 'B002', 2, 5, 3, '2026-02-18 17:00:00', '2026-02-18 19:00:00', '2026-02-17 18:42:11', '2026-02-17 18:43:07', 1000.00, 200.00, 8.00, 0.00, 800.00, 'STUDENT20', 0, 0.00, 8, NULL, NULL, NULL, NULL),
('BK003355', 'C48699', 'S023', 'B010', 1, 5, 3, '2026-02-18 16:00:00', '2026-02-18 17:00:00', '2026-02-18 13:33:36', '2026-02-18 13:33:49', 325.00, 0.00, 0.00, 0.00, 325.00, NULL, 0, 0.00, 3, NULL, NULL, NULL, NULL),
('BK031829', 'C88103', 'S012', 'B003', 1, 5, 3, '2026-02-16 15:00:00', '2026-02-16 18:00:00', '2026-02-15 13:15:43', '2026-02-15 13:16:25', 1125.00, 225.00, 5.00, 0.00, 900.00, 'SPORT20', 0, 0.00, 9, NULL, NULL, NULL, NULL),
('BK050453', 'C33085', 'S002', 'B001', 2, 5, 3, '2026-02-17 09:00:00', '2026-02-17 10:00:00', '2026-02-17 14:14:57', '2026-02-17 15:44:11', 70.00, 0.00, 0.00, 0.00, 70.00, NULL, 0, 0.00, 0, NULL, NULL, NULL, NULL),
('BK076066', 'C33085', 'S017', 'B005', 1, 5, 3, '2026-02-18 08:00:00', '2026-02-18 09:00:00', '2026-02-18 13:11:13', '2026-03-20 18:57:00', 150.00, 0.00, 1550.00, 0.00, 150.00, NULL, 0, 0.00, 1, NULL, NULL, NULL, NULL),
('BK109874', 'C33085', NULL, 'B001', 1, 6, 5, '2026-03-18 08:00:00', '2026-03-18 09:00:00', NULL, NULL, 35.00, 0.00, 0.00, 0.00, 35.00, NULL, 0, 0.00, 0, 'ขี้เกียจจะเล่น', '2026-03-18 13:00:03', NULL, 'C33085'),
('BK130179', 'C33085', NULL, 'B001', 1, 6, 5, '2026-02-18 11:00:00', '2026-02-18 12:00:00', NULL, NULL, 35.00, 0.00, 0.00, 0.00, 35.00, NULL, 0, 0.00, 0, 'หนาวมาก ', '2026-02-18 18:33:44', NULL, 'C33085'),
('BK144868', 'C33085', 'S002', 'B001', 1, 5, 3, '2026-02-16 08:00:00', '2026-02-16 09:00:00', '2026-02-17 14:09:17', '2026-02-17 15:32:34', 50.00, 0.00, 50.00, 0.00, 50.00, NULL, 0, 0.00, 0, NULL, NULL, NULL, NULL),
('BK174897', 'C33085', NULL, 'B001', 1, 6, 5, '2026-02-18 10:00:00', '2026-02-18 11:00:00', NULL, NULL, 165.00, 0.00, 0.00, 0.00, 165.00, NULL, 0, 0.00, 1, 'gh', '2026-02-17 18:20:37', NULL, 'C33085'),
('BK196966', 'C33085', 'S002', 'B001', 1, 5, 3, '2026-02-18 12:00:00', '2026-02-18 14:00:00', '2026-02-17 18:22:59', '2026-02-17 18:23:34', 1070.00, 0.00, 19.00, 0.00, 1070.00, NULL, 0, 0.00, 10, NULL, NULL, NULL, NULL),
('BK233510', 'C88103', 'S017', 'B005', 1, 5, 3, '2026-02-16 10:00:00', '2026-02-16 12:00:00', '2026-02-15 19:32:26', '2026-02-15 19:32:46', 120.00, 0.00, 0.00, 0.00, 120.00, NULL, 0, 0.00, 1, NULL, NULL, NULL, NULL),
('BK255982', 'C33085', 'S002', 'B001', 1, 5, 3, '2026-02-18 10:00:00', '2026-02-18 14:00:00', '2026-02-17 18:18:21', '2026-03-20 18:57:06', 520.00, 62.00, 1500.00, 100.00, 558.00, 'NEW10', 0, 0.00, 5, NULL, NULL, NULL, NULL),
('BK258702', 'C33085', 'S002', 'B001', 1, 5, 3, '2026-02-19 12:00:00', '2026-02-19 13:00:00', '2026-02-18 20:34:57', '2026-02-18 20:35:52', 240.00, 0.00, 0.00, 0.00, 235.00, NULL, 5, 5.00, 2, NULL, NULL, NULL, NULL),
('BK274344', 'C33085', NULL, 'B001', 1, 6, 6, '2026-02-16 08:00:00', '2026-02-16 09:00:00', NULL, NULL, 85.00, 0.00, 0.00, 0.00, 85.00, NULL, 0, 0.00, 0, 'ขี้เกียจ', '2026-02-17 14:04:55', NULL, 'C33085'),
('BK342739', 'C25261', 'S001', 'B001', 1, 5, 3, '2026-03-20 08:00:00', '2026-03-20 09:00:00', '2026-03-20 20:47:10', '2026-03-20 20:47:26', 25.00, 0.00, 50.00, 0.00, 25.00, NULL, 0, 0.00, 0, NULL, NULL, NULL, NULL),
('BK454414', 'C88103', 'S012', 'B003', 1, 5, 3, '2026-02-15 16:00:00', '2026-02-15 18:00:00', '2026-02-15 13:07:12', '2026-02-15 13:07:36', 300.00, 30.00, 0.00, 0.00, 270.00, 'STUDENT20', 0, 0.00, 2, NULL, NULL, NULL, NULL),
('BK455152', 'C48699', 'S023', 'B010', 2, 5, 3, '2026-02-18 14:00:00', '2026-02-18 15:00:00', '2026-02-18 13:37:10', '2026-02-18 13:38:08', 215.00, 0.00, 0.00, 0.00, 215.00, NULL, 0, 0.00, 2, NULL, NULL, NULL, NULL),
('BK455797', 'C33085', 'S002', 'B001', 1, 5, 3, '2026-02-16 08:00:00', '2026-02-16 09:00:00', '2026-03-20 21:13:16', '2026-03-20 21:13:26', 50.00, 2.00, 1700.00, 0.00, 48.00, 'BALL5', 0, 0.00, 0, NULL, NULL, NULL, NULL),
('BK574824', 'C88103', NULL, 'B002', 1, 6, 5, '2026-02-17 19:00:00', '2026-02-17 22:00:00', NULL, NULL, 1275.00, 0.00, 0.00, 0.00, 1275.00, NULL, 0, 0.00, 12, 'ไม่สามารถไปรับอุปกรณ์ได้ตามเวลาที่กำหนด', '2026-02-17 18:45:04', NULL, 'C88103'),
('BK606939', 'C33085', NULL, 'B001', 1, 6, 5, '2026-02-17 09:00:00', '2026-02-17 10:00:00', NULL, NULL, 100.00, 0.00, 0.00, 0.00, 100.00, NULL, 0, 0.00, 1, 'แอมอยากกินข้าว', '2026-02-17 15:16:42', NULL, 'C33085'),
('BK613961', 'C33085', NULL, 'B001', 1, 6, 5, '2026-02-18 11:00:00', '2026-02-18 12:00:00', NULL, NULL, 35.00, 0.00, 0.00, 0.00, 25.00, NULL, 10, 10.00, 0, 'เหงา', '2026-02-18 18:52:29', NULL, 'C33085'),
('BK615294', 'C25261', 'S002', 'B001', 1, 5, 3, '2026-03-20 09:00:00', '2026-03-20 13:00:00', '2026-03-20 18:56:25', '2026-03-20 18:56:35', 260.00, 0.00, 0.00, 100.00, 360.00, NULL, 0, 0.00, 3, NULL, NULL, NULL, NULL),
('BK683282', 'C88103', 'S012', 'B003', 1, 5, 3, '2026-02-15 17:00:00', '2026-02-15 19:00:00', '2026-02-15 13:19:33', '2026-02-15 13:19:59', 540.00, 108.00, 0.00, 0.00, 432.00, 'SPORT20', 0, 0.00, 4, NULL, NULL, NULL, NULL),
('BK703684', 'C77642', 'S002', 'B001', 1, 5, 3, '2026-02-17 09:00:00', '2026-02-17 10:00:00', '2026-02-17 15:44:03', '2026-02-17 15:44:16', 25.00, 0.00, 0.00, 0.00, 25.00, NULL, 0, 0.00, 0, NULL, NULL, NULL, NULL),
('BK744345', 'C33085', 'S002', 'B001', 1, 5, 3, '2026-02-17 17:00:00', '2026-02-17 22:00:00', '2026-02-16 20:48:13', '2026-02-16 20:48:59', 2725.00, 0.00, 0.00, 200.00, 2925.00, NULL, 0, 0.00, 29, NULL, NULL, NULL, NULL),
('BK748009', 'C48699', 'S023', 'B010', 2, 5, 3, '2026-02-18 12:00:00', '2026-02-18 13:00:00', '2026-02-18 13:35:31', '2026-02-18 13:35:46', 200.00, 0.00, 9.00, 0.00, 200.00, NULL, 0, 0.00, 2, NULL, NULL, NULL, NULL),
('BK779523', 'C88103', NULL, 'B003', 1, 6, 6, '2026-02-15 16:00:00', '2026-02-15 17:00:00', NULL, NULL, 140.00, 0.00, 0.00, 0.00, 140.00, NULL, 0, 0.00, 1, 'เนื่องจากติดภารกิจไม่สามารถเข้าไปรับอุปกรณ์ในเวลาได้', '2026-02-15 13:23:02', NULL, 'C88103'),
('BK814234', 'C48699', NULL, 'B010', 1, 6, 5, '2026-02-18 14:00:00', '2026-02-18 15:00:00', NULL, NULL, 40.00, 0.00, 0.00, 0.00, 40.00, NULL, 0, 0.00, 0, 'ขี้เกียจ', '2026-02-18 13:38:40', NULL, 'C48699'),
('BK815266', 'C88103', 'S012', 'B003', 1, 5, 3, '2026-02-16 09:00:00', '2026-02-16 11:00:00', '2026-02-15 13:12:17', '2026-02-15 13:16:05', 480.00, 96.00, 0.00, 0.00, 380.00, 'SPORT20', 4, 4.00, 3, NULL, NULL, NULL, NULL),
('BK833839', 'C88103', 'S007', 'B002', 1, 5, 3, '2026-02-18 10:00:00', '2026-02-18 12:00:00', '2026-02-17 18:34:38', '2026-02-17 18:35:08', 780.00, 100.00, 0.00, 0.00, 680.00, 'RENT100', 0, 0.00, 6, NULL, NULL, NULL, NULL),
('BK938347', 'C33085', 'S002', 'B001', 1, 5, 3, '2026-02-17 09:00:00', '2026-02-17 14:00:00', '2026-02-16 20:44:04', '2026-03-20 18:56:54', 1900.00, 0.00, 1550.00, 200.00, 2099.00, NULL, 1, 1.00, 20, NULL, NULL, NULL, NULL),
('BK942167', 'C33085', 'S002', 'B001', 1, 5, 3, '2026-02-17 09:00:00', '2026-02-17 10:00:00', '2026-02-17 15:42:46', '2026-03-18 12:54:36', 100.00, 0.00, 1450.00, 0.00, 100.00, NULL, 0, 0.00, 1, NULL, NULL, NULL, NULL),
('BK949371', 'C33085', NULL, 'B001', 1, 6, 5, '2026-02-17 09:00:00', '2026-02-17 10:00:00', NULL, NULL, 35.00, 0.00, 0.00, 0.00, 35.00, NULL, 0, 0.00, 0, 'ฮีๆๆๆๆ', '2026-02-17 16:47:19', NULL, 'C33085'),
('BK950826', 'C33085', 'S002', 'B001', 1, 5, 3, '2026-02-17 09:00:00', '2026-02-17 10:00:00', '2026-02-17 14:10:35', '2026-03-20 18:56:40', 60.00, 0.00, 1600.00, 0.00, 60.00, NULL, 0, 0.00, 0, NULL, NULL, NULL, NULL),
('BK972372', 'C33085', NULL, 'B001', 1, 6, 5, '2026-02-17 09:00:00', '2026-02-17 10:00:00', NULL, NULL, 35.00, 0.00, 0.00, 0.00, 35.00, NULL, 0, 0.00, 0, 'เหงามากกกกก', '2026-02-17 14:57:41', NULL, 'C33085'),
('BK973954', 'C88103', 'S017', 'B005', 1, 5, 3, '2026-02-16 08:00:00', '2026-02-16 10:00:00', '2026-02-15 19:30:23', '2026-02-15 19:30:38', 130.00, 0.00, 0.00, 0.00, 130.00, NULL, 0, 0.00, 1, NULL, NULL, NULL, NULL),
('BK998748', 'C33085', 'S002', 'B001', 1, 4, 3, '2026-02-16 08:00:00', '2026-02-16 09:00:00', '2026-02-16 17:45:19', '2026-02-17 15:49:05', 35.00, 0.00, 50.00, 0.00, 35.00, NULL, 0, 0.00, 0, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `booking_details`
--

CREATE TABLE `booking_details` (
  `detail_id` bigint(20) NOT NULL,
  `booking_id` varchar(20) DEFAULT NULL,
  `item_type` varchar(20) NOT NULL,
  `equipment_id` varchar(20) DEFAULT NULL,
  `equipment_instance_id` varchar(50) DEFAULT NULL,
  `venue_id` varchar(20) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `price_at_booking` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_details`
--

INSERT INTO `booking_details` (`detail_id`, `booking_id`, `item_type`, `equipment_id`, `equipment_instance_id`, `venue_id`, `quantity`, `price_at_booking`) VALUES
(358, 'BK454414', 'Equipment', 'BD02', 'BD02-0013', NULL, 1, 25.00),
(359, 'BK454414', 'Equipment', 'BD02', 'BD02-0015', NULL, 1, 25.00),
(360, 'BK454414', 'Equipment', 'BD01', 'BD01-0037', NULL, 1, 50.00),
(361, 'BK454414', 'Equipment', 'BD01', 'BD01-0039', NULL, 1, 50.00),
(362, 'BK815266', 'Equipment', 'TK01', 'TK01-0017', NULL, 1, 45.00),
(363, 'BK815266', 'Equipment', 'TK01', 'TK01-0018', NULL, 1, 45.00),
(364, 'BK815266', 'Venue', NULL, NULL, 'V050', 1, 150.00),
(365, 'BK031829', 'Equipment', 'GF03', 'GF03-0013', NULL, 1, 200.00),
(366, 'BK031829', 'Equipment', 'GF02', 'GF02-0015', NULL, 1, 25.00),
(367, 'BK031829', 'Equipment', 'GF01', 'GF01-0014', NULL, 1, 150.00),
(368, 'BK683282', 'Equipment', 'TN01', 'TN01-0013', NULL, 1, 120.00),
(369, 'BK683282', 'Equipment', 'TN01', 'TN01-0014', NULL, 1, 120.00),
(370, 'BK683282', 'Equipment', 'TN02', 'TN02-0014', NULL, 1, 30.00),
(371, 'BK779523', 'Equipment', 'PT01', NULL, NULL, 1, 35.00),
(372, 'BK779523', 'Equipment', 'PT01', NULL, NULL, 1, 35.00),
(373, 'BK779523', 'Equipment', 'PT01', NULL, NULL, 1, 35.00),
(374, 'BK779523', 'Equipment', 'PT03', NULL, NULL, 1, 10.00),
(375, 'BK779523', 'Equipment', 'PT02', NULL, NULL, 1, 25.00),
(376, 'BK973954', 'Equipment', 'SW02', 'SW02-0019', NULL, 1, 15.00),
(377, 'BK973954', 'Equipment', 'SW01', 'SW01-0033', NULL, 1, 30.00),
(378, 'BK973954', 'Equipment', 'SW03', 'SW03-0035', NULL, 1, 20.00),
(379, 'BK233510', 'Equipment', 'BG01', 'BG01-0019', NULL, 1, 60.00),
(380, 'BK998748', 'Equipment', 'AT02', 'AT02-0004', NULL, 1, 35.00),
(381, 'BK938347', 'Equipment', 'BB01', 'BB01-0002', NULL, 1, 60.00),
(382, 'BK938347', 'Equipment', 'BB02', 'BB02-0003', NULL, 1, 35.00),
(383, 'BK938347', 'Equipment', 'BB02', 'BB02-0002', NULL, 1, 35.00),
(384, 'BK938347', 'Venue', NULL, NULL, 'V007', 1, 250.00),
(385, 'BK744345', 'Equipment', 'BB01', 'BB01-0009', NULL, 1, 60.00),
(386, 'BK744345', 'Equipment', 'BB02', 'BB02-0007', NULL, 1, 35.00),
(387, 'BK744345', 'Equipment', 'BB02', 'BB02-0008', NULL, 1, 35.00),
(388, 'BK744345', 'Venue', NULL, NULL, 'V007', 1, 250.00),
(389, 'BK744345', 'Equipment', 'SW03', 'SW03-0008', NULL, 1, 20.00),
(390, 'BK744345', 'Equipment', 'SW01', 'SW01-0009', NULL, 1, 30.00),
(391, 'BK744345', 'Equipment', 'SW02', 'SW02-0005', NULL, 1, 15.00),
(392, 'BK744345', 'Venue', NULL, NULL, 'V017', 1, 100.00),
(393, 'BK455797', 'Equipment', 'FB01', 'FB01-0001', NULL, 1, 50.00),
(394, 'BK274344', 'Equipment', 'FB01', NULL, NULL, 1, 50.00),
(395, 'BK274344', 'Equipment', 'AT02', NULL, NULL, 1, 35.00),
(396, 'BK144868', 'Equipment', 'FB01', 'FB01-0001', NULL, 1, 50.00),
(397, 'BK950826', 'Equipment', 'BG01', 'BG01-0002', NULL, 1, 60.00),
(398, 'BK050453', 'Equipment', 'BG02', 'BG02-0001', NULL, 1, 70.00),
(399, 'BK972372', 'Equipment', 'AT02', NULL, NULL, 1, 35.00),
(400, 'BK606939', 'Equipment', 'TN03', NULL, NULL, 1, 100.00),
(401, 'BK942167', 'Equipment', 'TN03', 'TN03-0002', NULL, 1, 100.00),
(402, 'BK703684', 'Equipment', 'BB03', 'BB03-0001', NULL, 1, 25.00),
(403, 'BK949371', 'Equipment', 'AT02', NULL, NULL, 1, 35.00),
(404, 'BK255982', 'Equipment', 'BG01', 'BG01-0001', NULL, 1, 60.00),
(405, 'BK255982', 'Equipment', 'BG02', 'BG02-0001', NULL, 1, 70.00),
(406, 'BK174897', 'Equipment', 'PT01', NULL, NULL, 1, 35.00),
(407, 'BK174897', 'Venue', NULL, NULL, 'V015', 1, 130.00),
(408, 'BK196966', 'Equipment', 'PT01', 'PT01-0002', NULL, 1, 35.00),
(409, 'BK196966', 'Venue', NULL, NULL, 'V015', 1, 130.00),
(410, 'BK196966', 'Equipment', 'BB01', 'BB01-0004', NULL, 1, 60.00),
(411, 'BK196966', 'Equipment', 'BB01', 'BB01-0003', NULL, 1, 60.00),
(412, 'BK196966', 'Venue', NULL, NULL, 'V007', 1, 250.00),
(413, 'BK833839', 'Equipment', 'AT02', 'AT02-0010', NULL, 1, 35.00),
(414, 'BK833839', 'Equipment', 'AT02', 'AT02-0011', NULL, 1, 35.00),
(415, 'BK833839', 'Equipment', 'AT01', 'AT01-0006', NULL, 1, 40.00),
(416, 'BK833839', 'Equipment', 'AT03', 'AT03-0006', NULL, 1, 120.00),
(417, 'BK833839', 'Venue', NULL, NULL, 'V035', 1, 160.00),
(418, 'BK001338', 'Equipment', 'AR04', 'AR04-0005', NULL, 1, 30.00),
(419, 'BK001338', 'Equipment', 'AR01', 'AR01-0006', NULL, 1, 120.00),
(420, 'BK001338', 'Equipment', 'AR05', 'AR05-0004', NULL, 1, 40.00),
(421, 'BK001338', 'Equipment', 'AR02', 'AR02-0009', NULL, 1, 35.00),
(422, 'BK001338', 'Equipment', 'AR03', 'AR03-0006', NULL, 1, 75.00),
(423, 'BK001338', 'Venue', NULL, NULL, 'V032', 1, 200.00),
(424, 'BK574824', 'Equipment', 'BD03', NULL, NULL, 1, 100.00),
(425, 'BK574824', 'Equipment', 'BD02', NULL, NULL, 1, 25.00),
(426, 'BK574824', 'Equipment', 'BD01', NULL, NULL, 1, 50.00),
(427, 'BK574824', 'Equipment', 'BD01', NULL, NULL, 1, 50.00),
(428, 'BK574824', 'Venue', NULL, NULL, 'V025', 1, 200.00),
(429, 'BK076066', 'Equipment', 'AR04', 'AR04-0013', NULL, 1, 30.00),
(430, 'BK076066', 'Equipment', 'AR01', 'AR01-0017', NULL, 1, 120.00),
(431, 'BK003355', 'Venue', NULL, NULL, 'V065', 1, 200.00),
(432, 'BK003355', 'Equipment', 'BD01', 'BD01-0073', NULL, 1, 50.00),
(433, 'BK003355', 'Equipment', 'BD01', 'BD01-0074', NULL, 1, 50.00),
(434, 'BK003355', 'Equipment', 'BD02', 'BD02-0025', NULL, 1, 25.00),
(435, 'BK748009', 'Equipment', 'TK01', 'TK01-0033', NULL, 1, 45.00),
(436, 'BK748009', 'Venue', NULL, NULL, 'V070', 1, 155.00),
(437, 'BK455152', 'Venue', NULL, NULL, 'V077', 1, 215.00),
(438, 'BK814234', 'Equipment', 'FT03', NULL, NULL, 1, 40.00),
(439, 'BK130179', 'Equipment', 'AT02', NULL, NULL, 1, 35.00),
(440, 'BK613961', 'Equipment', 'AT02', NULL, NULL, 1, 35.00),
(441, 'BK258702', 'Equipment', 'AT01', 'AT01-0002', NULL, 1, 40.00),
(442, 'BK258702', 'Venue', NULL, NULL, 'V020', 1, 200.00),
(443, 'BK109874', 'Equipment', 'AT02', NULL, NULL, 1, 35.00),
(444, 'BK615294', 'Equipment', 'SW03', 'SW03-0001', NULL, 1, 20.00),
(445, 'BK615294', 'Equipment', 'SW02', 'SW02-0001', NULL, 1, 15.00),
(446, 'BK615294', 'Equipment', 'SW01', 'SW01-0001', NULL, 1, 30.00),
(447, 'BK342739', 'Equipment', 'BB03', 'BB03-0001', NULL, 1, 25.00);

-- --------------------------------------------------------

--
-- Table structure for table `booking_item_assignments`
--

CREATE TABLE `booking_item_assignments` (
  `assignment_id` bigint(20) NOT NULL,
  `detail_id` bigint(20) DEFAULT NULL,
  `instance_code` varchar(50) DEFAULT NULL,
  `return_condition_id` int(11) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_item_assignments`
--

INSERT INTO `booking_item_assignments` (`assignment_id`, `detail_id`, `instance_code`, `return_condition_id`, `note`) VALUES
(138, 358, 'BD02-0013', 1, NULL),
(139, 359, 'BD02-0015', 1, NULL),
(140, 360, 'BD01-0037', 1, NULL),
(141, 361, 'BD01-0039', 1, NULL),
(142, 362, 'TK01-0017', 1, NULL),
(143, 363, 'TK01-0018', 1, NULL),
(144, 364, NULL, 1, NULL),
(145, 365, 'GF03-0013', 1, NULL),
(146, 366, 'GF02-0015', 2, NULL),
(147, 367, 'GF01-0014', 1, NULL),
(148, 368, 'TN01-0013', 1, NULL),
(149, 369, 'TN01-0014', 1, NULL),
(150, 370, 'TN02-0014', 1, NULL),
(151, 376, 'SW02-0019', 1, NULL),
(152, 377, 'SW01-0033', 1, NULL),
(153, 378, 'SW03-0035', 1, NULL),
(154, 379, 'BG01-0019', 1, NULL),
(155, 385, 'BB01-0009', 1, NULL),
(156, 386, 'BB02-0007', 1, NULL),
(157, 387, 'BB02-0008', 1, NULL),
(158, 388, NULL, 1, NULL),
(159, 389, 'SW03-0008', 1, NULL),
(160, 390, 'SW01-0009', 1, NULL),
(161, 391, 'SW02-0005', 1, NULL),
(162, 392, NULL, 1, NULL),
(163, 396, 'FB01-0001', 1, NULL),
(164, 398, 'BG02-0001', 1, NULL),
(165, 402, 'BB03-0001', 1, NULL),
(166, 380, 'AT02-0004', 4, NULL),
(167, 380, 'AT02-0004', 1, NULL),
(168, 408, 'PT01-0002', 2, NULL),
(169, 409, NULL, 1, NULL),
(170, 410, 'BB01-0004', 2, NULL),
(171, 411, 'BB01-0003', 1, NULL),
(172, 412, NULL, 1, NULL),
(173, 413, 'AT02-0010', 1, NULL),
(174, 414, 'AT02-0011', 1, NULL),
(175, 415, 'AT01-0006', 1, NULL),
(176, 416, 'AT03-0006', 1, NULL),
(177, 417, NULL, 1, NULL),
(178, 418, 'AR04-0005', 1, NULL),
(179, 419, 'AR01-0006', 1, NULL),
(180, 420, 'AR05-0004', 2, NULL),
(181, 421, 'AR02-0009', 1, NULL),
(182, 422, 'AR03-0006', 1, NULL),
(183, 423, NULL, 1, NULL),
(184, 431, NULL, 1, NULL),
(185, 432, 'BD01-0073', 1, NULL),
(186, 433, 'BD01-0074', 1, NULL),
(187, 434, 'BD02-0025', 1, NULL),
(188, 435, 'TK01-0033', 2, NULL),
(189, 436, NULL, 1, NULL),
(190, 437, NULL, 1, NULL),
(191, 441, 'AT01-0002', 1, NULL),
(192, 442, NULL, 1, NULL),
(193, 401, 'TN03-0002', 1, NULL),
(194, 444, 'SW03-0001', 1, NULL),
(195, 445, 'SW02-0001', 1, NULL),
(196, 446, 'SW01-0001', 1, NULL),
(197, 397, 'BG01-0002', 1, NULL),
(198, 381, 'BB01-0002', 1, NULL),
(199, 382, 'BB02-0003', 1, NULL),
(200, 383, 'BB02-0002', 1, NULL),
(201, 384, NULL, 1, NULL),
(202, 429, 'AR04-0013', 1, NULL),
(203, 430, 'AR01-0017', 1, NULL),
(204, 404, 'BG01-0001', 1, NULL),
(205, 405, 'BG02-0001', 1, NULL),
(206, 447, 'BB03-0001', 1, NULL),
(207, 393, 'FB01-0001', 4, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `booking_status`
--

CREATE TABLE `booking_status` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name_th` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_status`
--

INSERT INTO `booking_status` (`id`, `code`, `name_th`, `description`, `created_at`) VALUES
(1, 'WAITING_STAFF', 'รอเจ้าหน้าที่ตรวจสอบ', 'รอเจ้าหน้าที่ตรวจสอบสลีปและรายการจอง', '2026-02-06 11:34:13'),
(2, 'CONFIRMED_WAITING_PICKUP', 'ยืนยันแล้ว / รอรับอุปกรณ์', 'ชำระเงินผ่านแล้วและรอรับของ', '2026-02-06 11:34:13'),
(3, 'IN_USE', 'กำลังใช้งาน', 'ลูกค้ากำลังใช้อุปกรณ์', '2026-02-06 11:34:13'),
(4, 'RETURNING', 'คืนอุปกรณ์', 'อยู่ระหว่างคืน', '2026-02-06 11:34:13'),
(5, 'COMPLETED', 'เสร็จสิ้น', 'กระบวนการจบแล้ว', '2026-02-06 11:34:13'),
(6, 'CANCELLED', 'ยกเลิก', 'ยกเลิกการจอง', '2026-02-06 11:34:13'),
(7, 'EXPIRED', 'หมดอายุ', 'ไม่ชำระเงินภายในเวลาที่กำหนด', '2026-02-06 11:34:13');

-- --------------------------------------------------------

--
-- Table structure for table `booking_types`
--

CREATE TABLE `booking_types` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(50) NOT NULL,
  `name_th` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_types`
--

INSERT INTO `booking_types` (`id`, `code`, `name_th`, `description`, `created_at`) VALUES
(1, 'ONLINE', 'ออนไลน์', 'ลูกค้าจองผ่านระบบ', '2026-02-06 11:45:04'),
(2, 'WALK_IN', 'หน้าร้าน', 'ลูกค้าเข้ามารับบริการหน้าร้าน', '2026-02-06 11:45:04');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `branch_id` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `province_id` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `open_time` time NOT NULL,
  `close_time` time NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`branch_id`, `name`, `province_id`, `phone`, `open_time`, `close_time`, `is_active`, `latitude`, `longitude`) VALUES
('B001', 'มหาวิทยาลัยนเรศวร', '38', '055-1234567', '08:00:00', '20:00:00', 1, 16.7479000, 100.1929000),
('B002', 'มหาวิทยาลัยเชียงใหม่', '14', '053-7654321', '10:00:00', '22:00:00', 1, 18.8046000, 98.9510000),
('B003', 'มหาวิทยาลัยขอนแก่น', '6', '043-9876543', '08:00:00', '20:00:00', 1, 16.4419000, 102.8350000),
('B004', 'มหาวิทยาลัยสงขลานครินทร์', '58', '074-1234567', '08:00:00', '20:00:00', 1, 7.0084000, 100.4970000),
('B005', 'มหาวิทยาลัยธรรมศาสตร์', '2', '02-1234567', '08:00:00', '20:00:00', 1, 13.7563000, 100.5018000),
('B010', 'มหาวิทยาลัยเกษตรศาสตร์', '2', '02-1239876', '09:00:00', '21:00:00', 1, 13.8479000, 100.5713000);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`) VALUES
(11, ' กรีฑา'),
(7, ' กอล์ฟ'),
(12, ' ตะกร้อ'),
(2, ' บาสเกตบอล'),
(8, ' ปิงปอง'),
(1, ' ฟุตบอล'),
(10, ' ยิงธนู'),
(3, ' วอลเลย์บอล'),
(6, ' ว่ายน้ำ'),
(5, ' เทนนิส'),
(9, ' เปตอง'),
(4, ' แบดมินตัน'),
(14, 'บอร์ดเกม'),
(13, 'ฟิตเนส');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `code` varchar(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `discount_type` varchar(20) NOT NULL,
  `min_purchase` decimal(10,2) DEFAULT 0.00,
  `category_id` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `expiry_date` datetime DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `valid_days` varchar(20) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT 100,
  `per_user_limit` int(11) DEFAULT NULL,
  `per_user_daily_limit` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `allowed_customer_type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`code`, `name`, `discount_value`, `discount_type`, `min_purchase`, `category_id`, `start_date`, `expiry_date`, `start_time`, `end_time`, `valid_days`, `usage_limit`, `per_user_limit`, `per_user_daily_limit`, `used_count`, `is_active`, `allowed_customer_type`) VALUES
('BALL5', 'ลด 5% สำหรับอุปกรณ์ลูกบอล', 5.00, 'percent', 50.00, 1, '2026-01-26 14:43:31', '2026-05-31 23:59:59', '00:00:00', '23:59:59', 'ALL', 300, NULL, 1, 27, 1, NULL),
('FIT15', 'ลด 15% สำหรับอุปกรณ์กอล์ฟ', 15.00, 'percent', 100.00, 7, '2026-01-03 14:45:15', '2026-06-30 23:59:59', '00:00:00', '23:59:59', 'ALL', 100, 1, NULL, 10, 1, NULL),
('NEW10', 'ส่วนลดสมาชิกใหม่ 10%', 10.00, 'percent', 200.00, NULL, '2026-01-13 14:45:24', '2026-06-30 23:59:00', '00:00:00', '23:59:59', 'ALL', 1000, 1, NULL, 2, 1, NULL),
('RENT100', 'เช่าครบ 500 ลด 100 บาท', 100.00, 'fixed', 500.00, NULL, '2026-01-02 14:45:29', '2026-12-31 23:59:59', '00:00:00', '23:59:59', 'ALL', 50, 1, NULL, 7, 1, NULL),
('SAVE50', 'ลดทันที 50', 50.00, 'fixed', 300.00, NULL, '2025-12-05 14:45:33', '0000-00-00 00:00:00', '00:00:00', '23:59:59', 'ALL', 500, 1, NULL, 5, 1, NULL),
('SPORT20', 'ลด 20%', 20.00, 'percent', 400.00, NULL, '2025-12-31 14:45:38', '2026-05-31 23:59:00', '00:00:00', '23:59:59', 'ALL', 300, 1, NULL, 13, 1, NULL),
('STUDENT20', 'ส่วนลดนักศึกษา 20%', 20.00, 'percent', 80.00, NULL, '2026-01-03 14:45:45', '2026-12-31 23:59:59', '00:00:00', '23:59:59', 'ALL', 300, NULL, 1, 42, 1, 'student');

-- --------------------------------------------------------

--
-- Table structure for table `coupon_usages`
--

CREATE TABLE `coupon_usages` (
  `id` int(11) NOT NULL,
  `coupon_code` varchar(20) NOT NULL,
  `customer_id` varchar(20) NOT NULL,
  `used_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupon_usages`
--

INSERT INTO `coupon_usages` (`id`, `coupon_code`, `customer_id`, `used_at`) VALUES
(12, 'NEW10', 'C33085', '2026-02-17 18:17:42'),
(13, 'RENT100', 'C88103', '2026-02-17 18:31:46');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` varchar(20) NOT NULL,
  `gender_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `customer_type` varchar(20) NOT NULL,
  `branch_id` varchar(20) DEFAULT NULL,
  `faculty_id` int(11) DEFAULT NULL,
  `study_year` int(11) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `current_points` int(11) DEFAULT 0,
  `member_level` varchar(20) DEFAULT 'Bronze',
  `refund_bank` varchar(50) DEFAULT NULL,
  `refund_account_number` varchar(30) DEFAULT NULL,
  `refund_account_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `gender_id`, `name`, `customer_type`, `branch_id`, `faculty_id`, `study_year`, `birth_date`, `phone`, `email`, `password_hash`, `current_points`, `member_level`, `refund_bank`, `refund_account_number`, `refund_account_name`) VALUES
('C02205', 2, 'แมว', 'student', 'B010', 2, 3, '2026-02-02', '0123456789', 'meaw@', '$2y$10$WRSlPCTavkPCBTzh6FtwWeCUq9WSmqa6Jnoj373tDOhQ3.yzGPTXi', 0, 'Bronze', NULL, NULL, NULL),
('C19750', 3, 'แป้ง ตลุกดู่', 'general', 'B002', NULL, NULL, '2004-04-10', '0998881010', 'suwi@cmu.ac.th', '$2y$10$IBCrp0O6kJcUfASS3eyeouVpiXHvvuba7FanjX8NzP3Tncs66vKrK', 0, 'Bronze', NULL, NULL, NULL),
('C25245', 3, 'แอม อีกครั้ง', 'general', 'B002', NULL, NULL, '0001-11-11', '0123456789', 'aam@gmail.com', '$2y$10$H34zeRSyKfFuSNyW38nAguDZzZxHGg.0AqERZ5hWrGfPvCIRcwY22', 0, 'Bronze', NULL, NULL, NULL),
('C25261', 1, 'แอม แม่ลาใหญ่', 'student', 'B001', 1, 3, '2026-03-01', '0981234567', 'a@gmail.com', '$2y$10$4hYfk.r0qZf3Pfs5tsMLZOXEXYdDNGzeAVbbBG6H7/vKzb6jcBIcK', 3, 'Bronze', NULL, NULL, NULL),
('C27303', 2, 'สุวิมล คนสวย', 'student', 'B001', 3, 3, '2004-04-10', '0998881010', 'pang1234@gmail.com', '$2y$10$6.OdiYFWki/.c8ijwHSzP.1hz10oyyjWixbded91JmiTJoB6R3LtK', 33, 'Bronze', NULL, NULL, NULL),
('C32884', 1, 'aonpimol w', 'general', NULL, NULL, NULL, '2026-02-01', '0987654321', 'test@gmail.com', '$2y$10$lWoRpyVJXyAaD2NcHHOAMOPUc49yUQvS9HheI644AcCP.8fN2i8ca', 0, 'Bronze', NULL, NULL, NULL),
('C33085', 2, 'อรพิมล วงศ์แสน', 'general', NULL, NULL, NULL, '2004-09-22', '0812345678', 'aonpimolw66@nu.ac.th', '$2y$10$u4cyIwiyIw2XXsS04h0W3uNNVFJ66WycK.LNcEfjVqMK4tIM5699G', 56, 'Bronze', 'GSB', '12345678910', 'แอม วังคัน'),
('C48699', 3, 'น้องแอม แม่ลาน้อย', 'student', NULL, 5, 5, '2004-02-14', '061789456', 'test@example.com', '$2y$10$yX9WSUoJwBS9j8bQL5uYNeSAj9x7QlSzr/qjDXlMSYHQJ/mPUn2u.', 3, 'Bronze', 'SCB', '12345678910', 'แอม แม่ลาน้อย'),
('C52747', 2, 'ไก่', 'student', 'B001', 1, 4, '2026-02-04', '0998765432', 'test@', '$2y$10$suWC1Ik5q5Fo1sqfRNonFetL5i2ocAE/d923jUu20DIz8KKOdiXa6', 0, 'Bronze', NULL, NULL, NULL),
('C64683', 2, 'แอม แม่ลาใหญ่', 'student', 'B001', 5, 3, '2004-09-22', '0998887766', 'aonpimol66@nu.ac.th', '$2y$10$Rhb6UVNzJaECOnH9gVTfLeludp3fshwquQsCFarZrkPSYaCqwS7aC', 0, 'Bronze', NULL, NULL, NULL),
('C76683', 2, 'พิมพ์ชา ชุ่มช่ำ', 'student', NULL, 3, 3, '2003-03-03', '0613211234', 'pimcha@gmail.com', '$2y$10$C..fB163bo1iMd8plPzIJeQuP29AWOXI31qbtj6LlLvzhV2rOY3ny', 0, 'Bronze', NULL, NULL, NULL),
('C77642', 1, 'ก๊อต แจ้ห่ม', 'student', NULL, 3, 3, '2004-07-09', '0612345678', 'Thirawaty66@nu.ac.th', '$2y$10$aUQ1YOROSLgDPAlyIgDvqeGRRa1fl47C1NtDlqsdAt9DsSedGS6Eq', 0, 'Bronze', 'GSB', '12345678910', 'ก๊อต น้อย'),
('C80739', 2, 'น้องแป้ง ตลุกดู่', 'student', NULL, 3, 3, '2004-04-10', '0998765432', 'suwimonk66@nu.ac.th', '$2y$10$SLswqJFvATyuoKD1eErJ.ubB1CfVncnrDZN4q5LnNoDSkKWVxwXlS', 5, 'Bronze', NULL, NULL, NULL),
('C87166', 1, 'แอม วังคัน', 'student', NULL, 10, 1, '2026-02-03', '0987654321', 'aam@test.com', '$2y$10$JhW4ZdFIlX2CRSA.GJlkhu5r..kB7LGNLjGAiutGUpqArdTsGOuFe', 1, 'Bronze', NULL, NULL, NULL),
('C88103', 2, 'พิมพ์ชนก ซีซี', 'student', NULL, 3, 3, '2003-12-03', '0611235587', 'pimchanokc66@nu.ac.th', '$2y$10$v/XaCndZUAfiHgqd6DhbmuoEnHKqn1qLQAdPP1985znOlZxjrNita', 45, 'Bronze', 'BBL', '1234456890', 'พิมพ์ชา ซีซี');

-- --------------------------------------------------------

--
-- Table structure for table `damage_levels`
--

CREATE TABLE `damage_levels` (
  `damage_id` int(11) NOT NULL,
  `name_en` varchar(50) NOT NULL,
  `name_th` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `damage_levels`
--

INSERT INTO `damage_levels` (`damage_id`, `name_en`, `name_th`, `description`) VALUES
(1, 'LOW', 'เล็กน้อย', 'มีรอยเล็กน้อย ยังใช้งานได้ปกติ'),
(2, 'MEDIUM', 'ปานกลาง', 'มีความเสียหายระดับกลาง ต้องตรวจสอบ'),
(3, 'HIGH', 'รุนแรง', 'เสียหายหนัก ไม่สามารถใช้งานได้');

-- --------------------------------------------------------

--
-- Table structure for table `equipment_instances`
--

CREATE TABLE `equipment_instances` (
  `instance_code` varchar(50) NOT NULL,
  `equipment_id` varchar(20) NOT NULL,
  `branch_id` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Ready',
  `received_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `current_location` varchar(100) DEFAULT 'Main Storage'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment_instances`
--

INSERT INTO `equipment_instances` (`instance_code`, `equipment_id`, `branch_id`, `status`, `received_date`, `expiry_date`, `current_location`) VALUES
('AR01-0001', 'AR01', 'B001', 'Rented', '2025-07-23', '2028-07-23', 'Customer'),
('AR01-0002', 'AR01', 'B001', 'Ready', '2025-09-04', '2028-09-04', 'Main Storage'),
('AR01-0003', 'AR01', 'B001', 'Ready', '2024-06-30', '2027-06-30', 'Main Storage'),
('AR01-0004', 'AR01', 'B001', 'Ready', '2025-08-03', '2028-08-03', 'Main Storage'),
('AR01-0005', 'AR01', 'B001', 'Ready', '2023-05-08', '2026-05-08', 'Main Storage'),
('AR01-0006', 'AR01', 'B002', 'Ready', '2024-04-03', '2027-04-03', 'Main Storage'),
('AR01-0007', 'AR01', 'B002', 'Ready', '2025-09-18', '2028-09-18', 'Main Storage'),
('AR01-0008', 'AR01', 'B002', 'Ready', '2025-08-28', '2028-08-28', 'Main Storage'),
('AR01-0009', 'AR01', 'B002', 'Ready', '2023-07-31', '2026-07-31', 'Main Storage'),
('AR01-0010', 'AR01', 'B002', 'Ready', '2023-04-11', '2026-04-11', 'Main Storage'),
('AR01-0011', 'AR01', 'B003', 'Ready', '2024-03-22', '2027-03-22', 'Main Storage'),
('AR01-0012', 'AR01', 'B003', 'Ready', '2025-09-09', '2028-09-09', 'Main Storage'),
('AR01-0013', 'AR01', 'B003', 'Ready', '2024-10-14', '2027-10-14', 'Main Storage'),
('AR01-0014', 'AR01', 'B003', 'Ready', '2023-05-23', '2026-05-23', 'Main Storage'),
('AR01-0015', 'AR01', 'B003', 'Ready', '2025-08-18', '2028-08-18', 'Main Storage'),
('AR01-0016', 'AR01', 'B005', 'Ready', '2023-08-19', '2026-08-19', 'Main Storage'),
('AR01-0017', 'AR01', 'B005', 'Ready', '2024-03-02', '2027-03-02', 'Main Storage'),
('AR01-0018', 'AR01', 'B005', 'Ready', '2023-09-01', '2026-09-01', 'Main Storage'),
('AR01-0019', 'AR01', 'B005', 'Ready', '2023-01-10', '2026-01-10', 'Main Storage'),
('AR01-0020', 'AR01', 'B005', 'Ready', '2024-10-31', '2027-10-31', 'Main Storage'),
('AR01-0021', 'AR01', 'B010', 'Ready', '2024-08-10', '2027-08-10', 'Main Storage'),
('AR01-0022', 'AR01', 'B010', 'Ready', '2025-11-18', '2028-11-18', 'Main Storage'),
('AR01-0023', 'AR01', 'B010', 'Ready', '2023-01-16', '2026-01-16', 'Main Storage'),
('AR01-0024', 'AR01', 'B010', 'Ready', '2024-01-20', '2027-01-20', 'Main Storage'),
('AR01-0025', 'AR01', 'B010', 'Ready', '2025-09-15', '2028-09-15', 'Main Storage'),
('AR01-0026', 'AR01', 'B004', 'Ready', '2024-11-20', '2027-11-20', 'Main Storage'),
('AR01-0027', 'AR01', 'B004', 'Ready', '2023-04-16', '2026-04-15', 'Main Storage'),
('AR01-0028', 'AR01', 'B004', 'Ready', '2023-10-05', '2026-10-04', 'Main Storage'),
('AR01-0029', 'AR01', 'B004', 'Ready', '2024-03-15', '2027-03-15', 'Main Storage'),
('AR01-0030', 'AR01', 'B004', 'Ready', '2025-10-24', '2028-10-23', 'Main Storage'),
('AR01-0031', 'AR01', 'B001', 'Ready', '2026-02-17', '2029-02-17', 'Main Storage'),
('AR02-0001', 'AR02', 'B001', 'Ready', '2024-03-07', '2027-03-07', 'Main Storage'),
('AR02-0002', 'AR02', 'B001', 'Ready', '2025-11-09', '2028-11-09', 'Main Storage'),
('AR02-0003', 'AR02', 'B001', 'Ready', '2024-03-11', '2027-03-11', 'Main Storage'),
('AR02-0004', 'AR02', 'B001', 'Ready', '2023-08-22', '2026-08-22', 'Main Storage'),
('AR02-0005', 'AR02', 'B001', 'Ready', '2024-11-01', '2027-11-01', 'Main Storage'),
('AR02-0006', 'AR02', 'B001', 'Ready', '2023-06-01', '2026-06-01', 'Main Storage'),
('AR02-0007', 'AR02', 'B001', 'Ready', '2025-10-25', '2028-10-25', 'Main Storage'),
('AR02-0008', 'AR02', 'B001', 'Ready', '2024-10-30', '2027-10-30', 'Main Storage'),
('AR02-0009', 'AR02', 'B002', 'Maintenance', '2023-06-02', '2026-06-02', 'Repair Shop'),
('AR02-0010', 'AR02', 'B002', 'Ready', '2025-08-15', '2028-08-15', 'Main Storage'),
('AR02-0011', 'AR02', 'B002', 'Ready', '2024-06-15', '2027-06-15', 'Main Storage'),
('AR02-0012', 'AR02', 'B002', 'Ready', '2023-10-27', '2026-10-27', 'Main Storage'),
('AR02-0013', 'AR02', 'B002', 'Ready', '2023-08-16', '2026-08-16', 'Main Storage'),
('AR02-0014', 'AR02', 'B002', 'Ready', '2023-08-31', '2026-08-31', 'Main Storage'),
('AR02-0015', 'AR02', 'B002', 'Ready', '2025-02-23', '2028-02-23', 'Main Storage'),
('AR02-0016', 'AR02', 'B002', 'Ready', '2025-03-08', '2028-03-08', 'Main Storage'),
('AR02-0017', 'AR02', 'B003', 'Ready', '2025-01-31', '2028-01-31', 'Main Storage'),
('AR02-0018', 'AR02', 'B003', 'Ready', '2024-09-08', '2027-09-08', 'Main Storage'),
('AR02-0019', 'AR02', 'B003', 'Ready', '2025-04-07', '2028-04-07', 'Main Storage'),
('AR02-0020', 'AR02', 'B003', 'Ready', '2024-08-13', '2027-08-13', 'Main Storage'),
('AR02-0021', 'AR02', 'B003', 'Ready', '2025-11-25', '2028-11-25', 'Main Storage'),
('AR02-0022', 'AR02', 'B003', 'Ready', '2024-02-09', '2027-02-09', 'Main Storage'),
('AR02-0023', 'AR02', 'B003', 'Ready', '2023-09-24', '2026-09-24', 'Main Storage'),
('AR02-0024', 'AR02', 'B003', 'Ready', '2025-05-12', '2028-05-12', 'Main Storage'),
('AR02-0025', 'AR02', 'B005', 'Ready', '2023-04-23', '2026-04-23', 'Main Storage'),
('AR02-0026', 'AR02', 'B005', 'Ready', '2025-10-19', '2028-10-19', 'Main Storage'),
('AR02-0027', 'AR02', 'B005', 'Ready', '2024-02-25', '2027-02-25', 'Main Storage'),
('AR02-0028', 'AR02', 'B005', 'Ready', '2024-08-18', '2027-08-18', 'Main Storage'),
('AR02-0029', 'AR02', 'B005', 'Ready', '2024-05-14', '2027-05-14', 'Main Storage'),
('AR02-0030', 'AR02', 'B005', 'Ready', '2025-08-23', '2028-08-23', 'Main Storage'),
('AR02-0031', 'AR02', 'B005', 'Ready', '2023-03-12', '2026-03-12', 'Main Storage'),
('AR02-0032', 'AR02', 'B005', 'Ready', '2024-09-25', '2027-09-25', 'Main Storage'),
('AR02-0033', 'AR02', 'B010', 'Ready', '2023-10-13', '2026-10-13', 'Main Storage'),
('AR02-0034', 'AR02', 'B010', 'Ready', '2024-11-30', '2027-11-30', 'Main Storage'),
('AR02-0035', 'AR02', 'B010', 'Ready', '2023-12-09', '2026-12-09', 'Main Storage'),
('AR02-0036', 'AR02', 'B010', 'Ready', '2024-02-15', '2027-02-15', 'Main Storage'),
('AR02-0037', 'AR02', 'B010', 'Ready', '2023-04-28', '2026-04-28', 'Main Storage'),
('AR02-0038', 'AR02', 'B010', 'Ready', '2023-07-26', '2026-07-26', 'Main Storage'),
('AR02-0039', 'AR02', 'B010', 'Ready', '2025-05-27', '2028-05-27', 'Main Storage'),
('AR02-0040', 'AR02', 'B010', 'Ready', '2023-07-03', '2026-07-03', 'Main Storage'),
('AR02-0041', 'AR02', 'B004', 'Ready', '2025-09-29', '2028-09-28', 'Main Storage'),
('AR02-0042', 'AR02', 'B004', 'Ready', '2023-12-08', '2026-12-07', 'Main Storage'),
('AR02-0043', 'AR02', 'B004', 'Ready', '2024-12-09', '2027-12-09', 'Main Storage'),
('AR02-0044', 'AR02', 'B004', 'Ready', '2023-12-22', '2026-12-21', 'Main Storage'),
('AR02-0045', 'AR02', 'B004', 'Ready', '2025-05-11', '2028-05-10', 'Main Storage'),
('AR02-0046', 'AR02', 'B004', 'Ready', '2024-09-12', '2027-09-12', 'Main Storage'),
('AR02-0047', 'AR02', 'B004', 'Ready', '2025-02-08', '2028-02-08', 'Main Storage'),
('AR02-0048', 'AR02', 'B004', 'Ready', '2025-08-28', '2028-08-27', 'Main Storage'),
('AR03-0001', 'AR03', 'B001', 'Ready', '2024-04-26', '2027-04-26', 'Main Storage'),
('AR03-0002', 'AR03', 'B001', 'Ready', '2025-12-14', '2028-12-14', 'Main Storage'),
('AR03-0003', 'AR03', 'B001', 'Ready', '2024-06-11', '2027-06-11', 'Main Storage'),
('AR03-0004', 'AR03', 'B001', 'Ready', '2023-11-18', '2026-11-18', 'Main Storage'),
('AR03-0005', 'AR03', 'B001', 'Ready', '2023-01-08', '2026-01-08', 'Main Storage'),
('AR03-0006', 'AR03', 'B002', 'Ready', '2025-04-16', '2028-04-16', 'Main Storage'),
('AR03-0007', 'AR03', 'B002', 'Ready', '2025-08-02', '2028-08-02', 'Main Storage'),
('AR03-0008', 'AR03', 'B002', 'Ready', '2024-09-13', '2027-09-13', 'Main Storage'),
('AR03-0009', 'AR03', 'B002', 'Ready', '2024-09-16', '2027-09-16', 'Main Storage'),
('AR03-0010', 'AR03', 'B002', 'Ready', '2024-09-18', '2027-09-18', 'Main Storage'),
('AR03-0011', 'AR03', 'B003', 'Ready', '2023-12-10', '2026-12-10', 'Main Storage'),
('AR03-0012', 'AR03', 'B003', 'Ready', '2023-10-13', '2026-10-13', 'Main Storage'),
('AR03-0013', 'AR03', 'B003', 'Ready', '2025-02-22', '2028-02-22', 'Main Storage'),
('AR03-0014', 'AR03', 'B003', 'Ready', '2024-07-14', '2027-07-14', 'Main Storage'),
('AR03-0015', 'AR03', 'B003', 'Ready', '2025-09-28', '2028-09-28', 'Main Storage'),
('AR03-0016', 'AR03', 'B005', 'Ready', '2023-03-22', '2026-03-22', 'Main Storage'),
('AR03-0017', 'AR03', 'B005', 'Ready', '2025-04-22', '2028-04-22', 'Main Storage'),
('AR03-0018', 'AR03', 'B005', 'Ready', '2024-06-02', '2027-06-02', 'Main Storage'),
('AR03-0019', 'AR03', 'B005', 'Ready', '2023-01-29', '2026-01-29', 'Main Storage'),
('AR03-0020', 'AR03', 'B005', 'Ready', '2023-04-13', '2026-04-13', 'Main Storage'),
('AR03-0021', 'AR03', 'B010', 'Ready', '2024-10-29', '2027-10-29', 'Main Storage'),
('AR03-0022', 'AR03', 'B010', 'Ready', '2024-03-04', '2027-03-04', 'Main Storage'),
('AR03-0023', 'AR03', 'B010', 'Ready', '2025-10-01', '2028-10-01', 'Main Storage'),
('AR03-0024', 'AR03', 'B010', 'Ready', '2025-04-11', '2028-04-11', 'Main Storage'),
('AR03-0025', 'AR03', 'B010', 'Ready', '2023-02-16', '2026-02-16', 'Main Storage'),
('AR03-0026', 'AR03', 'B004', 'Ready', '2025-04-01', '2028-03-31', 'Main Storage'),
('AR03-0027', 'AR03', 'B004', 'Ready', '2025-04-29', '2028-04-28', 'Main Storage'),
('AR03-0028', 'AR03', 'B004', 'Ready', '2024-11-03', '2027-11-03', 'Main Storage'),
('AR03-0029', 'AR03', 'B004', 'Ready', '2023-10-31', '2026-10-30', 'Main Storage'),
('AR03-0030', 'AR03', 'B004', 'Ready', '2024-02-28', '2027-02-27', 'Main Storage'),
('AR04-0001', 'AR04', 'B001', 'Ready', '2024-11-04', '2027-11-04', 'Main Storage'),
('AR04-0002', 'AR04', 'B001', 'Ready', '2024-05-08', '2027-05-08', 'Main Storage'),
('AR04-0003', 'AR04', 'B001', 'Ready', '2025-09-13', '2028-09-13', 'Main Storage'),
('AR04-0004', 'AR04', 'B001', 'Ready', '2025-05-08', '2028-05-08', 'Main Storage'),
('AR04-0005', 'AR04', 'B002', 'Ready', '2023-06-24', '2026-06-24', 'Main Storage'),
('AR04-0006', 'AR04', 'B002', 'Ready', '2025-10-12', '2028-10-12', 'Main Storage'),
('AR04-0007', 'AR04', 'B002', 'Ready', '2024-05-29', '2027-05-29', 'Main Storage'),
('AR04-0008', 'AR04', 'B002', 'Ready', '2023-06-05', '2026-06-05', 'Main Storage'),
('AR04-0009', 'AR04', 'B003', 'Ready', '2023-01-04', '2026-01-04', 'Main Storage'),
('AR04-0010', 'AR04', 'B003', 'Ready', '2023-02-03', '2026-02-03', 'Main Storage'),
('AR04-0011', 'AR04', 'B003', 'Ready', '2024-04-22', '2027-04-22', 'Main Storage'),
('AR04-0012', 'AR04', 'B003', 'Ready', '2024-10-01', '2027-10-01', 'Main Storage'),
('AR04-0013', 'AR04', 'B005', 'Ready', '2023-02-21', '2026-02-21', 'Main Storage'),
('AR04-0014', 'AR04', 'B005', 'Ready', '2025-03-03', '2028-03-03', 'Main Storage'),
('AR04-0015', 'AR04', 'B005', 'Ready', '2023-04-07', '2026-04-07', 'Main Storage'),
('AR04-0016', 'AR04', 'B005', 'Ready', '2023-07-26', '2026-07-26', 'Main Storage'),
('AR04-0017', 'AR04', 'B010', 'Ready', '2025-05-10', '2028-05-10', 'Main Storage'),
('AR04-0018', 'AR04', 'B010', 'Ready', '2025-04-07', '2028-04-07', 'Main Storage'),
('AR04-0019', 'AR04', 'B010', 'Ready', '2025-05-23', '2028-05-23', 'Main Storage'),
('AR04-0020', 'AR04', 'B010', 'Ready', '2024-03-20', '2027-03-20', 'Main Storage'),
('AR04-0021', 'AR04', 'B004', 'Ready', '2024-09-13', '2027-09-13', 'Main Storage'),
('AR04-0022', 'AR04', 'B004', 'Ready', '2024-03-15', '2027-03-15', 'Main Storage'),
('AR04-0023', 'AR04', 'B004', 'Ready', '2025-04-30', '2028-04-29', 'Main Storage'),
('AR04-0024', 'AR04', 'B004', 'Ready', '2024-12-19', '2027-12-19', 'Main Storage'),
('AR05-0001', 'AR05', 'B001', 'Ready', '2023-07-30', '2026-07-30', 'Main Storage'),
('AR05-0002', 'AR05', 'B001', 'Ready', '2024-04-21', '2027-04-21', 'Main Storage'),
('AR05-0003', 'AR05', 'B001', 'Ready', '2024-04-18', '2027-04-18', 'Main Storage'),
('AR05-0004', 'AR05', 'B002', 'Ready', '2024-10-13', '2027-10-13', 'Main Storage'),
('AR05-0005', 'AR05', 'B002', 'Ready', '2024-09-12', '2027-09-12', 'Main Storage'),
('AR05-0006', 'AR05', 'B002', 'Ready', '2023-12-13', '2026-12-13', 'Main Storage'),
('AR05-0007', 'AR05', 'B003', 'Ready', '2024-09-02', '2027-09-02', 'Main Storage'),
('AR05-0008', 'AR05', 'B003', 'Ready', '2025-12-07', '2028-12-07', 'Main Storage'),
('AR05-0009', 'AR05', 'B003', 'Ready', '2024-08-03', '2027-08-03', 'Main Storage'),
('AR05-0010', 'AR05', 'B005', 'Ready', '2023-06-06', '2026-06-06', 'Main Storage'),
('AR05-0011', 'AR05', 'B005', 'Ready', '2025-04-30', '2028-04-30', 'Main Storage'),
('AR05-0012', 'AR05', 'B005', 'Ready', '2023-01-26', '2026-01-26', 'Main Storage'),
('AR05-0013', 'AR05', 'B010', 'Ready', '2023-03-08', '2026-03-08', 'Main Storage'),
('AR05-0014', 'AR05', 'B010', 'Ready', '2025-04-07', '2028-04-07', 'Main Storage'),
('AR05-0015', 'AR05', 'B010', 'Ready', '2024-12-01', '2027-12-01', 'Main Storage'),
('AR05-0016', 'AR05', 'B004', 'Ready', '2024-02-21', '2027-02-20', 'Main Storage'),
('AR05-0017', 'AR05', 'B004', 'Ready', '2023-07-25', '2026-07-24', 'Main Storage'),
('AR05-0018', 'AR05', 'B004', 'Ready', '2024-03-23', '2027-03-23', 'Main Storage'),
('AT01-0001', 'AT01', 'B001', 'Ready', '2024-10-19', '2027-10-19', 'Main Storage'),
('AT01-0002', 'AT01', 'B001', 'Ready', '2025-05-31', '2028-05-31', 'Main Storage'),
('AT01-0003', 'AT01', 'B001', 'Ready', '2024-05-12', '2027-05-12', 'Main Storage'),
('AT01-0004', 'AT01', 'B001', 'Expired', '2023-02-08', '2026-02-08', 'Expired Storage'),
('AT01-0005', 'AT01', 'B001', 'Ready', '2023-09-25', '2026-09-25', 'Main Storage'),
('AT01-0006', 'AT01', 'B002', 'Ready', '2023-12-19', '2026-12-19', 'Main Storage'),
('AT01-0007', 'AT01', 'B002', 'Ready', '2023-10-09', '2026-10-09', 'Main Storage'),
('AT01-0008', 'AT01', 'B002', 'Ready', '2024-09-15', '2027-09-15', 'Main Storage'),
('AT01-0009', 'AT01', 'B002', 'Ready', '2024-03-06', '2027-03-06', 'Main Storage'),
('AT01-0010', 'AT01', 'B002', 'Ready', '2024-11-30', '2027-11-30', 'Main Storage'),
('AT01-0011', 'AT01', 'B003', 'Ready', '2023-07-04', '2026-07-04', 'Main Storage'),
('AT01-0012', 'AT01', 'B003', 'Ready', '2023-10-02', '2026-10-02', 'Main Storage'),
('AT01-0013', 'AT01', 'B003', 'Ready', '2024-06-12', '2027-06-12', 'Main Storage'),
('AT01-0014', 'AT01', 'B003', 'Ready', '2025-09-05', '2028-09-05', 'Main Storage'),
('AT01-0015', 'AT01', 'B003', 'Ready', '2023-01-10', '2026-01-10', 'Main Storage'),
('AT01-0016', 'AT01', 'B005', 'Ready', '2023-11-30', '2026-11-30', 'Main Storage'),
('AT01-0017', 'AT01', 'B005', 'Ready', '2025-07-15', '2028-07-15', 'Main Storage'),
('AT01-0018', 'AT01', 'B005', 'Ready', '2023-11-19', '2026-11-19', 'Main Storage'),
('AT01-0019', 'AT01', 'B005', 'Ready', '2023-01-27', '2026-01-27', 'Main Storage'),
('AT01-0020', 'AT01', 'B005', 'Ready', '2023-01-17', '2026-01-17', 'Main Storage'),
('AT01-0021', 'AT01', 'B010', 'Ready', '2024-01-23', '2027-01-23', 'Main Storage'),
('AT01-0022', 'AT01', 'B010', 'Ready', '2024-04-03', '2027-04-03', 'Main Storage'),
('AT01-0023', 'AT01', 'B010', 'Ready', '2023-03-12', '2026-03-12', 'Main Storage'),
('AT01-0024', 'AT01', 'B010', 'Ready', '2025-01-02', '2028-01-02', 'Main Storage'),
('AT01-0025', 'AT01', 'B010', 'Ready', '2024-07-13', '2027-07-13', 'Main Storage'),
('AT01-0026', 'AT01', 'B004', 'Ready', '2025-07-06', '2028-07-05', 'Main Storage'),
('AT01-0027', 'AT01', 'B004', 'Ready', '2024-09-21', '2027-09-21', 'Main Storage'),
('AT01-0028', 'AT01', 'B004', 'Ready', '2023-02-18', '2026-02-17', 'Main Storage'),
('AT01-0029', 'AT01', 'B004', 'Ready', '2025-01-30', '2028-01-30', 'Main Storage'),
('AT01-0030', 'AT01', 'B004', 'Ready', '2024-07-20', '2027-07-20', 'Main Storage'),
('AT02-0001', 'AT02', 'B001', 'Ready', '2023-09-27', '2026-09-27', 'Main Storage'),
('AT02-0002', 'AT02', 'B001', 'Ready', '2023-07-11', '2026-07-11', 'Main Storage'),
('AT02-0003', 'AT02', 'B001', 'Ready', '2025-01-14', '2028-01-14', 'Main Storage'),
('AT02-0004', 'AT02', 'B001', 'Ready', '2025-03-29', '2028-03-29', 'Main Storage'),
('AT02-0005', 'AT02', 'B001', 'Ready', '2024-03-15', '2027-03-15', 'Main Storage'),
('AT02-0006', 'AT02', 'B001', 'Ready', '2024-10-04', '2027-10-04', 'Main Storage'),
('AT02-0007', 'AT02', 'B001', 'Ready', '2023-06-26', '2026-06-26', 'Main Storage'),
('AT02-0008', 'AT02', 'B001', 'Ready', '2023-04-20', '2026-04-20', 'Main Storage'),
('AT02-0009', 'AT02', 'B001', 'Ready', '2024-07-24', '2027-07-24', 'Main Storage'),
('AT02-0010', 'AT02', 'B002', 'Ready', '2023-04-09', '2026-04-09', 'Main Storage'),
('AT02-0011', 'AT02', 'B002', 'Ready', '2024-10-13', '2027-10-13', 'Main Storage'),
('AT02-0012', 'AT02', 'B002', 'Ready', '2024-04-30', '2027-04-30', 'Main Storage'),
('AT02-0013', 'AT02', 'B002', 'Ready', '2024-12-31', '2027-12-31', 'Main Storage'),
('AT02-0014', 'AT02', 'B002', 'Ready', '2024-07-01', '2027-07-01', 'Main Storage'),
('AT02-0015', 'AT02', 'B002', 'Ready', '2023-04-30', '2026-04-30', 'Main Storage'),
('AT02-0016', 'AT02', 'B002', 'Ready', '2025-02-15', '2028-02-15', 'Main Storage'),
('AT02-0017', 'AT02', 'B002', 'Ready', '2024-12-04', '2027-12-04', 'Main Storage'),
('AT02-0018', 'AT02', 'B002', 'Ready', '2025-11-15', '2028-11-15', 'Main Storage'),
('AT02-0019', 'AT02', 'B003', 'Ready', '2023-04-13', '2026-04-13', 'Main Storage'),
('AT02-0020', 'AT02', 'B003', 'Ready', '2023-03-02', '2026-03-02', 'Main Storage'),
('AT02-0021', 'AT02', 'B003', 'Ready', '2023-09-24', '2026-09-24', 'Main Storage'),
('AT02-0022', 'AT02', 'B003', 'Ready', '2025-09-14', '2028-09-14', 'Main Storage'),
('AT02-0023', 'AT02', 'B003', 'Ready', '2024-09-29', '2027-09-29', 'Main Storage'),
('AT02-0024', 'AT02', 'B003', 'Ready', '2025-07-28', '2028-07-28', 'Main Storage'),
('AT02-0025', 'AT02', 'B003', 'Ready', '2025-06-22', '2028-06-22', 'Main Storage'),
('AT02-0026', 'AT02', 'B003', 'Ready', '2023-12-23', '2026-12-23', 'Main Storage'),
('AT02-0027', 'AT02', 'B003', 'Ready', '2025-01-16', '2028-01-16', 'Main Storage'),
('AT02-0028', 'AT02', 'B005', 'Ready', '2024-09-01', '2027-09-01', 'Main Storage'),
('AT02-0029', 'AT02', 'B005', 'Ready', '2025-11-10', '2028-11-10', 'Main Storage'),
('AT02-0030', 'AT02', 'B005', 'Ready', '2023-10-16', '2026-10-16', 'Main Storage'),
('AT02-0031', 'AT02', 'B005', 'Ready', '2023-05-11', '2026-05-11', 'Main Storage'),
('AT02-0032', 'AT02', 'B005', 'Ready', '2023-01-30', '2026-01-30', 'Main Storage'),
('AT02-0033', 'AT02', 'B005', 'Ready', '2024-05-27', '2027-05-27', 'Main Storage'),
('AT02-0034', 'AT02', 'B005', 'Ready', '2024-12-31', '2027-12-31', 'Main Storage'),
('AT02-0035', 'AT02', 'B005', 'Ready', '2024-09-02', '2027-09-02', 'Main Storage'),
('AT02-0036', 'AT02', 'B005', 'Ready', '2023-07-06', '2026-07-06', 'Main Storage'),
('AT02-0037', 'AT02', 'B010', 'Ready', '2025-06-12', '2028-06-12', 'Main Storage'),
('AT02-0038', 'AT02', 'B010', 'Ready', '2024-05-30', '2027-05-30', 'Main Storage'),
('AT02-0039', 'AT02', 'B010', 'Ready', '2025-04-04', '2028-04-04', 'Main Storage'),
('AT02-0040', 'AT02', 'B010', 'Ready', '2025-07-10', '2028-07-10', 'Main Storage'),
('AT02-0041', 'AT02', 'B010', 'Ready', '2025-03-29', '2028-03-29', 'Main Storage'),
('AT02-0042', 'AT02', 'B010', 'Ready', '2024-03-24', '2027-03-24', 'Main Storage'),
('AT02-0043', 'AT02', 'B010', 'Ready', '2025-05-05', '2028-05-05', 'Main Storage'),
('AT02-0044', 'AT02', 'B010', 'Ready', '2025-06-15', '2028-06-15', 'Main Storage'),
('AT02-0045', 'AT02', 'B010', 'Ready', '2024-08-17', '2027-08-17', 'Main Storage'),
('AT02-0046', 'AT02', 'B004', 'Ready', '2023-03-27', '2026-03-26', 'Main Storage'),
('AT02-0047', 'AT02', 'B004', 'Ready', '2023-05-14', '2026-05-13', 'Main Storage'),
('AT02-0048', 'AT02', 'B004', 'Ready', '2024-07-06', '2027-07-06', 'Main Storage'),
('AT02-0049', 'AT02', 'B004', 'Ready', '2025-04-30', '2028-04-29', 'Main Storage'),
('AT02-0050', 'AT02', 'B004', 'Ready', '2025-12-28', '2028-12-27', 'Main Storage'),
('AT02-0051', 'AT02', 'B004', 'Ready', '2025-02-10', '2028-02-10', 'Main Storage'),
('AT02-0052', 'AT02', 'B004', 'Ready', '2025-02-04', '2028-02-04', 'Main Storage'),
('AT02-0053', 'AT02', 'B004', 'Ready', '2024-11-01', '2027-11-01', 'Main Storage'),
('AT02-0054', 'AT02', 'B004', 'Ready', '2023-01-01', '2025-12-31', 'Main Storage'),
('AT03-0001', 'AT03', 'B001', 'Ready', '2024-10-21', '2027-10-21', 'Main Storage'),
('AT03-0002', 'AT03', 'B001', 'Ready', '2023-01-30', '2026-01-30', 'Main Storage'),
('AT03-0003', 'AT03', 'B001', 'Ready', '2023-04-06', '2026-04-06', 'Main Storage'),
('AT03-0004', 'AT03', 'B001', 'Ready', '2023-11-14', '2026-11-14', 'Main Storage'),
('AT03-0005', 'AT03', 'B001', 'Ready', '2023-10-17', '2026-10-17', 'Main Storage'),
('AT03-0006', 'AT03', 'B002', 'Ready', '2023-02-02', '2026-02-02', 'Main Storage'),
('AT03-0007', 'AT03', 'B002', 'Ready', '2023-02-22', '2026-02-22', 'Main Storage'),
('AT03-0008', 'AT03', 'B002', 'Ready', '2023-01-17', '2026-01-17', 'Main Storage'),
('AT03-0009', 'AT03', 'B002', 'Ready', '2024-03-09', '2027-03-09', 'Main Storage'),
('AT03-0010', 'AT03', 'B002', 'Ready', '2024-12-16', '2027-12-16', 'Main Storage'),
('AT03-0011', 'AT03', 'B003', 'Ready', '2024-08-29', '2027-08-29', 'Main Storage'),
('AT03-0012', 'AT03', 'B003', 'Ready', '2025-08-09', '2028-08-09', 'Main Storage'),
('AT03-0013', 'AT03', 'B003', 'Ready', '2023-07-25', '2026-07-25', 'Main Storage'),
('AT03-0014', 'AT03', 'B003', 'Ready', '2023-12-22', '2026-12-22', 'Main Storage'),
('AT03-0015', 'AT03', 'B003', 'Ready', '2024-09-01', '2027-09-01', 'Main Storage'),
('AT03-0016', 'AT03', 'B005', 'Ready', '2023-05-27', '2026-05-27', 'Main Storage'),
('AT03-0017', 'AT03', 'B005', 'Ready', '2024-04-12', '2027-04-12', 'Main Storage'),
('AT03-0018', 'AT03', 'B005', 'Ready', '2024-10-03', '2027-10-03', 'Main Storage'),
('AT03-0019', 'AT03', 'B005', 'Ready', '2025-11-05', '2028-11-05', 'Main Storage'),
('AT03-0020', 'AT03', 'B005', 'Ready', '2025-03-06', '2028-03-06', 'Main Storage'),
('AT03-0021', 'AT03', 'B010', 'Ready', '2025-03-04', '2028-03-04', 'Main Storage'),
('AT03-0022', 'AT03', 'B010', 'Ready', '2024-08-01', '2027-08-01', 'Main Storage'),
('AT03-0023', 'AT03', 'B010', 'Ready', '2023-07-10', '2026-07-10', 'Main Storage'),
('AT03-0024', 'AT03', 'B010', 'Ready', '2025-10-06', '2028-10-06', 'Main Storage'),
('AT03-0025', 'AT03', 'B010', 'Ready', '2025-09-06', '2028-09-06', 'Main Storage'),
('AT03-0026', 'AT03', 'B004', 'Ready', '2023-07-25', '2026-07-24', 'Main Storage'),
('AT03-0027', 'AT03', 'B004', 'Ready', '2025-03-16', '2028-03-15', 'Main Storage'),
('AT03-0028', 'AT03', 'B004', 'Ready', '2024-11-30', '2027-11-30', 'Main Storage'),
('AT03-0029', 'AT03', 'B004', 'Ready', '2024-05-16', '2027-05-16', 'Main Storage'),
('AT03-0030', 'AT03', 'B004', 'Ready', '2024-09-07', '2027-09-07', 'Main Storage'),
('BB01-0001', 'BB01', 'B001', 'Ready', '2024-11-16', '2027-11-16', 'Main Storage'),
('BB01-0002', 'BB01', 'B001', 'Ready', '2025-08-04', '2028-08-04', 'Main Storage'),
('BB01-0003', 'BB01', 'B001', 'Ready', '2023-09-17', '2026-09-17', 'Main Storage'),
('BB01-0004', 'BB01', 'B001', 'Ready', '2025-03-03', '2028-03-03', 'Main Storage'),
('BB01-0005', 'BB01', 'B001', 'Ready', '2023-06-14', '2026-06-14', 'Main Storage'),
('BB01-0006', 'BB01', 'B001', 'Ready', '2025-04-20', '2028-04-20', 'Main Storage'),
('BB01-0007', 'BB01', 'B001', 'Ready', '2023-04-23', '2026-04-23', 'Main Storage'),
('BB01-0008', 'BB01', 'B001', 'Ready', '2023-05-08', '2026-05-08', 'Main Storage'),
('BB01-0009', 'BB01', 'B001', 'Ready', '2023-08-25', '2026-08-25', 'Main Storage'),
('BB01-0010', 'BB01', 'B002', 'Ready', '2024-04-29', '2027-04-29', 'Main Storage'),
('BB01-0011', 'BB01', 'B002', 'Ready', '2023-03-29', '2026-03-29', 'Main Storage'),
('BB01-0012', 'BB01', 'B002', 'Ready', '2023-05-16', '2026-05-16', 'Main Storage'),
('BB01-0013', 'BB01', 'B002', 'Ready', '2025-10-01', '2028-10-01', 'Main Storage'),
('BB01-0014', 'BB01', 'B002', 'Ready', '2024-02-15', '2027-02-15', 'Main Storage'),
('BB01-0015', 'BB01', 'B002', 'Ready', '2023-09-04', '2026-09-04', 'Main Storage'),
('BB01-0016', 'BB01', 'B002', 'Ready', '2024-02-27', '2027-02-27', 'Main Storage'),
('BB01-0017', 'BB01', 'B002', 'Ready', '2025-05-01', '2028-05-01', 'Main Storage'),
('BB01-0018', 'BB01', 'B002', 'Ready', '2025-12-14', '2028-12-14', 'Main Storage'),
('BB01-0019', 'BB01', 'B003', 'Ready', '2024-06-16', '2027-06-16', 'Main Storage'),
('BB01-0020', 'BB01', 'B003', 'Ready', '2023-01-09', '2026-01-09', 'Main Storage'),
('BB01-0021', 'BB01', 'B003', 'Ready', '2025-05-12', '2028-05-12', 'Main Storage'),
('BB01-0022', 'BB01', 'B003', 'Ready', '2023-07-01', '2026-07-01', 'Main Storage'),
('BB01-0023', 'BB01', 'B003', 'Ready', '2023-11-18', '2026-11-18', 'Main Storage'),
('BB01-0024', 'BB01', 'B003', 'Ready', '2024-08-02', '2027-08-02', 'Main Storage'),
('BB01-0025', 'BB01', 'B003', 'Ready', '2023-07-04', '2026-07-04', 'Main Storage'),
('BB01-0026', 'BB01', 'B003', 'Ready', '2025-10-03', '2028-10-03', 'Main Storage'),
('BB01-0027', 'BB01', 'B003', 'Ready', '2023-07-24', '2026-07-24', 'Main Storage'),
('BB01-0028', 'BB01', 'B005', 'Ready', '2023-03-29', '2026-03-29', 'Main Storage'),
('BB01-0029', 'BB01', 'B005', 'Ready', '2023-07-30', '2026-07-30', 'Main Storage'),
('BB01-0030', 'BB01', 'B005', 'Ready', '2025-01-18', '2028-01-18', 'Main Storage'),
('BB01-0031', 'BB01', 'B005', 'Ready', '2024-04-06', '2027-04-06', 'Main Storage'),
('BB01-0032', 'BB01', 'B005', 'Ready', '2025-07-22', '2028-07-22', 'Main Storage'),
('BB01-0033', 'BB01', 'B005', 'Ready', '2024-08-12', '2027-08-12', 'Main Storage'),
('BB01-0034', 'BB01', 'B005', 'Ready', '2023-06-03', '2026-06-03', 'Main Storage'),
('BB01-0035', 'BB01', 'B005', 'Ready', '2025-09-07', '2028-09-07', 'Main Storage'),
('BB01-0036', 'BB01', 'B005', 'Ready', '2024-10-09', '2027-10-09', 'Main Storage'),
('BB01-0037', 'BB01', 'B010', 'Ready', '2023-10-06', '2026-10-06', 'Main Storage'),
('BB01-0038', 'BB01', 'B010', 'Ready', '2025-10-20', '2028-10-20', 'Main Storage'),
('BB01-0039', 'BB01', 'B010', 'Ready', '2025-11-07', '2028-11-07', 'Main Storage'),
('BB01-0040', 'BB01', 'B010', 'Ready', '2023-02-18', '2026-02-18', 'Main Storage'),
('BB01-0041', 'BB01', 'B010', 'Ready', '2023-05-18', '2026-05-18', 'Main Storage'),
('BB01-0042', 'BB01', 'B010', 'Ready', '2024-03-30', '2027-03-30', 'Main Storage'),
('BB01-0043', 'BB01', 'B010', 'Ready', '2024-09-20', '2027-09-20', 'Main Storage'),
('BB01-0044', 'BB01', 'B010', 'Ready', '2023-03-05', '2026-03-05', 'Main Storage'),
('BB01-0045', 'BB01', 'B010', 'Ready', '2025-05-14', '2028-05-14', 'Main Storage'),
('BB01-0046', 'BB01', 'B004', 'Ready', '2024-09-27', '2027-09-27', 'Main Storage'),
('BB01-0047', 'BB01', 'B004', 'Ready', '2023-03-21', '2026-03-20', 'Main Storage'),
('BB01-0048', 'BB01', 'B004', 'Ready', '2023-05-05', '2026-05-04', 'Main Storage'),
('BB01-0049', 'BB01', 'B004', 'Ready', '2025-01-22', '2028-01-22', 'Main Storage'),
('BB01-0050', 'BB01', 'B004', 'Ready', '2025-08-07', '2028-08-06', 'Main Storage'),
('BB01-0051', 'BB01', 'B004', 'Ready', '2025-03-01', '2028-02-29', 'Main Storage'),
('BB01-0052', 'BB01', 'B004', 'Ready', '2023-07-31', '2026-07-30', 'Main Storage'),
('BB01-0053', 'BB01', 'B004', 'Ready', '2025-10-07', '2028-10-06', 'Main Storage'),
('BB01-0054', 'BB01', 'B004', 'Ready', '2024-02-29', '2027-02-28', 'Main Storage'),
('BB02-0001', 'BB02', 'B001', 'Ready', '2023-08-25', '2026-08-25', 'Main Storage'),
('BB02-0002', 'BB02', 'B001', 'Ready', '2023-12-08', '2026-12-08', 'Main Storage'),
('BB02-0003', 'BB02', 'B001', 'Ready', '2024-03-15', '2027-03-15', 'Main Storage'),
('BB02-0004', 'BB02', 'B001', 'Ready', '2025-11-23', '2028-11-23', 'Main Storage'),
('BB02-0005', 'BB02', 'B001', 'Ready', '2023-08-14', '2026-08-14', 'Main Storage'),
('BB02-0006', 'BB02', 'B001', 'Ready', '2025-11-11', '2028-11-11', 'Main Storage'),
('BB02-0007', 'BB02', 'B001', 'Ready', '2023-12-15', '2026-12-15', 'Main Storage'),
('BB02-0008', 'BB02', 'B001', 'Ready', '2023-07-06', '2026-07-06', 'Main Storage'),
('BB02-0009', 'BB02', 'B002', 'Ready', '2025-02-25', '2028-02-25', 'Main Storage'),
('BB02-0010', 'BB02', 'B002', 'Ready', '2025-11-16', '2028-11-16', 'Main Storage'),
('BB02-0011', 'BB02', 'B002', 'Ready', '2024-08-03', '2027-08-03', 'Main Storage'),
('BB02-0012', 'BB02', 'B002', 'Ready', '2024-03-26', '2027-03-26', 'Main Storage'),
('BB02-0013', 'BB02', 'B002', 'Ready', '2023-10-11', '2026-10-11', 'Main Storage'),
('BB02-0014', 'BB02', 'B002', 'Ready', '2025-02-06', '2028-02-06', 'Main Storage'),
('BB02-0015', 'BB02', 'B002', 'Ready', '2024-01-05', '2027-01-05', 'Main Storage'),
('BB02-0016', 'BB02', 'B002', 'Ready', '2025-11-27', '2028-11-27', 'Main Storage'),
('BB02-0017', 'BB02', 'B003', 'Ready', '2025-11-12', '2028-11-12', 'Main Storage'),
('BB02-0018', 'BB02', 'B003', 'Ready', '2023-03-05', '2026-03-05', 'Main Storage'),
('BB02-0019', 'BB02', 'B003', 'Ready', '2024-09-25', '2027-09-25', 'Main Storage'),
('BB02-0020', 'BB02', 'B003', 'Ready', '2025-07-29', '2028-07-29', 'Main Storage'),
('BB02-0021', 'BB02', 'B003', 'Ready', '2023-08-02', '2026-08-02', 'Main Storage'),
('BB02-0022', 'BB02', 'B003', 'Ready', '2024-04-30', '2027-04-30', 'Main Storage'),
('BB02-0023', 'BB02', 'B003', 'Ready', '2024-03-14', '2027-03-14', 'Main Storage'),
('BB02-0024', 'BB02', 'B003', 'Ready', '2023-10-04', '2026-10-04', 'Main Storage'),
('BB02-0025', 'BB02', 'B005', 'Ready', '2023-02-26', '2026-02-26', 'Main Storage'),
('BB02-0026', 'BB02', 'B005', 'Ready', '2024-01-23', '2027-01-23', 'Main Storage'),
('BB02-0027', 'BB02', 'B005', 'Ready', '2024-07-22', '2027-07-22', 'Main Storage'),
('BB02-0028', 'BB02', 'B005', 'Ready', '2025-11-28', '2028-11-28', 'Main Storage'),
('BB02-0029', 'BB02', 'B005', 'Ready', '2023-09-12', '2026-09-12', 'Main Storage'),
('BB02-0030', 'BB02', 'B005', 'Ready', '2024-10-22', '2027-10-22', 'Main Storage'),
('BB02-0031', 'BB02', 'B005', 'Ready', '2023-06-08', '2026-06-08', 'Main Storage'),
('BB02-0032', 'BB02', 'B005', 'Ready', '2025-01-31', '2028-01-31', 'Main Storage'),
('BB02-0033', 'BB02', 'B010', 'Ready', '2025-06-19', '2028-06-19', 'Main Storage'),
('BB02-0034', 'BB02', 'B010', 'Ready', '2025-04-20', '2028-04-20', 'Main Storage'),
('BB02-0035', 'BB02', 'B010', 'Ready', '2023-11-23', '2026-11-23', 'Main Storage'),
('BB02-0036', 'BB02', 'B010', 'Ready', '2025-09-17', '2028-09-17', 'Main Storage'),
('BB02-0037', 'BB02', 'B010', 'Ready', '2024-02-03', '2027-02-03', 'Main Storage'),
('BB02-0038', 'BB02', 'B010', 'Ready', '2023-12-04', '2026-12-04', 'Main Storage'),
('BB02-0039', 'BB02', 'B010', 'Ready', '2023-06-01', '2026-06-01', 'Main Storage'),
('BB02-0040', 'BB02', 'B010', 'Ready', '2024-09-06', '2027-09-06', 'Main Storage'),
('BB02-0041', 'BB02', 'B004', 'Ready', '2025-04-10', '2028-04-09', 'Main Storage'),
('BB02-0042', 'BB02', 'B004', 'Ready', '2023-08-10', '2026-08-09', 'Main Storage'),
('BB02-0043', 'BB02', 'B004', 'Ready', '2024-09-11', '2027-09-11', 'Main Storage'),
('BB02-0044', 'BB02', 'B004', 'Ready', '2023-07-18', '2026-07-17', 'Main Storage'),
('BB02-0045', 'BB02', 'B004', 'Ready', '2025-05-26', '2028-05-25', 'Main Storage'),
('BB02-0046', 'BB02', 'B004', 'Ready', '2024-12-09', '2027-12-09', 'Main Storage'),
('BB02-0047', 'BB02', 'B004', 'Ready', '2025-03-10', '2028-03-09', 'Main Storage'),
('BB02-0048', 'BB02', 'B004', 'Ready', '2023-01-06', '2026-01-05', 'Main Storage'),
('BB03-0001', 'BB03', 'B001', 'Ready', '2024-10-19', '2027-10-19', 'Main Storage'),
('BB03-0002', 'BB03', 'B001', 'Ready', '2024-04-17', '2027-04-17', 'Main Storage'),
('BB03-0003', 'BB03', 'B001', 'Ready', '2025-07-25', '2028-07-25', 'Main Storage'),
('BB03-0004', 'BB03', 'B001', 'Ready', '2025-08-22', '2028-08-22', 'Main Storage'),
('BB03-0005', 'BB03', 'B001', 'Ready', '2025-04-19', '2028-04-19', 'Main Storage'),
('BB03-0006', 'BB03', 'B002', 'Ready', '2023-04-25', '2026-04-25', 'Main Storage'),
('BB03-0007', 'BB03', 'B002', 'Ready', '2023-05-13', '2026-05-13', 'Main Storage'),
('BB03-0008', 'BB03', 'B002', 'Ready', '2024-01-11', '2027-01-11', 'Main Storage'),
('BB03-0009', 'BB03', 'B002', 'Ready', '2024-11-27', '2027-11-27', 'Main Storage'),
('BB03-0010', 'BB03', 'B002', 'Ready', '2023-05-21', '2026-05-21', 'Main Storage'),
('BB03-0011', 'BB03', 'B003', 'Ready', '2024-06-13', '2027-06-13', 'Main Storage'),
('BB03-0012', 'BB03', 'B003', 'Ready', '2025-01-04', '2028-01-04', 'Main Storage'),
('BB03-0013', 'BB03', 'B003', 'Ready', '2024-08-02', '2027-08-02', 'Main Storage'),
('BB03-0014', 'BB03', 'B003', 'Ready', '2025-04-16', '2028-04-16', 'Main Storage'),
('BB03-0015', 'BB03', 'B003', 'Ready', '2025-02-02', '2028-02-02', 'Main Storage'),
('BB03-0016', 'BB03', 'B005', 'Ready', '2024-03-03', '2027-03-03', 'Main Storage'),
('BB03-0017', 'BB03', 'B005', 'Ready', '2025-10-16', '2028-10-16', 'Main Storage'),
('BB03-0018', 'BB03', 'B005', 'Ready', '2024-08-12', '2027-08-12', 'Main Storage'),
('BB03-0019', 'BB03', 'B005', 'Ready', '2025-12-08', '2028-12-08', 'Main Storage'),
('BB03-0020', 'BB03', 'B005', 'Ready', '2024-01-07', '2027-01-07', 'Main Storage'),
('BB03-0021', 'BB03', 'B010', 'Ready', '2024-06-22', '2027-06-22', 'Main Storage'),
('BB03-0022', 'BB03', 'B010', 'Ready', '2025-04-29', '2028-04-29', 'Main Storage'),
('BB03-0023', 'BB03', 'B010', 'Ready', '2023-02-20', '2026-02-20', 'Main Storage'),
('BB03-0024', 'BB03', 'B010', 'Ready', '2025-10-17', '2028-10-17', 'Main Storage'),
('BB03-0025', 'BB03', 'B010', 'Ready', '2025-08-03', '2028-08-03', 'Main Storage'),
('BB03-0026', 'BB03', 'B004', 'Ready', '2023-01-19', '2026-01-18', 'Main Storage'),
('BB03-0027', 'BB03', 'B004', 'Ready', '2024-08-02', '2027-08-02', 'Main Storage'),
('BB03-0028', 'BB03', 'B004', 'Ready', '2024-03-25', '2027-03-25', 'Main Storage'),
('BB03-0029', 'BB03', 'B004', 'Ready', '2025-10-20', '2028-10-19', 'Main Storage'),
('BB03-0030', 'BB03', 'B004', 'Ready', '2023-01-04', '2026-01-03', 'Main Storage'),
('BB04-0001', 'BB04', 'B001', 'Ready', '2023-12-20', '2026-12-20', 'Main Storage'),
('BB04-0002', 'BB04', 'B001', 'Ready', '2024-02-24', '2027-02-24', 'Main Storage'),
('BB04-0003', 'BB04', 'B001', 'Ready', '2023-02-05', '2026-02-05', 'Main Storage'),
('BB04-0004', 'BB04', 'B001', 'Ready', '2025-12-31', '2028-12-31', 'Main Storage'),
('BB04-0005', 'BB04', 'B001', 'Ready', '2025-09-11', '2028-09-11', 'Main Storage'),
('BB04-0006', 'BB04', 'B002', 'Ready', '2025-06-15', '2028-06-15', 'Main Storage'),
('BB04-0007', 'BB04', 'B002', 'Ready', '2025-10-19', '2028-10-19', 'Main Storage'),
('BB04-0008', 'BB04', 'B002', 'Ready', '2025-06-02', '2028-06-02', 'Main Storage'),
('BB04-0009', 'BB04', 'B002', 'Ready', '2023-02-14', '2026-02-14', 'Main Storage'),
('BB04-0010', 'BB04', 'B002', 'Ready', '2023-02-06', '2026-02-06', 'Main Storage'),
('BB04-0011', 'BB04', 'B003', 'Ready', '2023-03-03', '2026-03-03', 'Main Storage'),
('BB04-0012', 'BB04', 'B003', 'Ready', '2024-10-20', '2027-10-20', 'Main Storage'),
('BB04-0013', 'BB04', 'B003', 'Ready', '2023-05-30', '2026-05-30', 'Main Storage'),
('BB04-0014', 'BB04', 'B003', 'Ready', '2023-08-13', '2026-08-13', 'Main Storage'),
('BB04-0015', 'BB04', 'B003', 'Ready', '2023-09-07', '2026-09-07', 'Main Storage'),
('BB04-0016', 'BB04', 'B005', 'Ready', '2023-05-13', '2026-05-13', 'Main Storage'),
('BB04-0017', 'BB04', 'B005', 'Ready', '2024-09-06', '2027-09-06', 'Main Storage'),
('BB04-0018', 'BB04', 'B005', 'Ready', '2024-01-19', '2027-01-19', 'Main Storage'),
('BB04-0019', 'BB04', 'B005', 'Ready', '2023-06-27', '2026-06-27', 'Main Storage'),
('BB04-0020', 'BB04', 'B005', 'Ready', '2024-11-20', '2027-11-20', 'Main Storage'),
('BB04-0021', 'BB04', 'B010', 'Ready', '2023-07-20', '2026-07-20', 'Main Storage'),
('BB04-0022', 'BB04', 'B010', 'Ready', '2025-11-20', '2028-11-20', 'Main Storage'),
('BB04-0023', 'BB04', 'B010', 'Ready', '2024-09-25', '2027-09-25', 'Main Storage'),
('BB04-0024', 'BB04', 'B010', 'Ready', '2024-08-29', '2027-08-29', 'Main Storage'),
('BB04-0025', 'BB04', 'B010', 'Ready', '2024-11-12', '2027-11-12', 'Main Storage'),
('BB04-0026', 'BB04', 'B004', 'Ready', '2023-09-14', '2026-09-13', 'Main Storage'),
('BB04-0027', 'BB04', 'B004', 'Ready', '2023-04-15', '2026-04-14', 'Main Storage'),
('BB04-0028', 'BB04', 'B004', 'Ready', '2023-03-21', '2026-03-20', 'Main Storage'),
('BB04-0029', 'BB04', 'B004', 'Ready', '2024-12-27', '2027-12-27', 'Main Storage'),
('BB04-0030', 'BB04', 'B004', 'Ready', '2024-10-16', '2027-10-16', 'Main Storage'),
('BD01-0001', 'BD01', 'B001', 'Ready', '2024-12-23', '2027-12-23', 'Main Storage'),
('BD01-0002', 'BD01', 'B001', 'Ready', '2025-11-23', '2028-11-23', 'Main Storage'),
('BD01-0003', 'BD01', 'B001', 'Ready', '2023-10-18', '2026-10-18', 'Main Storage'),
('BD01-0004', 'BD01', 'B001', 'Ready', '2024-09-09', '2027-09-09', 'Main Storage'),
('BD01-0005', 'BD01', 'B001', 'Ready', '2023-12-14', '2026-12-14', 'Main Storage'),
('BD01-0006', 'BD01', 'B001', 'Ready', '2023-12-17', '2026-12-17', 'Main Storage'),
('BD01-0007', 'BD01', 'B001', 'Ready', '2024-06-05', '2027-06-05', 'Main Storage'),
('BD01-0008', 'BD01', 'B001', 'Ready', '2025-11-16', '2028-11-16', 'Main Storage'),
('BD01-0009', 'BD01', 'B001', 'Ready', '2025-01-11', '2028-01-11', 'Main Storage'),
('BD01-0010', 'BD01', 'B001', 'Ready', '2024-09-06', '2027-09-06', 'Main Storage'),
('BD01-0011', 'BD01', 'B001', 'Ready', '2025-01-19', '2028-01-19', 'Main Storage'),
('BD01-0012', 'BD01', 'B001', 'Ready', '2024-07-25', '2027-07-25', 'Main Storage'),
('BD01-0013', 'BD01', 'B001', 'Ready', '2024-03-10', '2027-03-10', 'Main Storage'),
('BD01-0014', 'BD01', 'B001', 'Ready', '2023-10-19', '2026-10-19', 'Main Storage'),
('BD01-0015', 'BD01', 'B001', 'Ready', '2025-10-31', '2028-10-31', 'Main Storage'),
('BD01-0016', 'BD01', 'B001', 'Ready', '2025-05-02', '2028-05-02', 'Main Storage'),
('BD01-0017', 'BD01', 'B001', 'Ready', '2024-07-01', '2027-07-01', 'Main Storage'),
('BD01-0018', 'BD01', 'B001', 'Ready', '2024-08-01', '2027-08-01', 'Main Storage'),
('BD01-0019', 'BD01', 'B002', 'Ready', '2025-11-10', '2028-11-10', 'Main Storage'),
('BD01-0020', 'BD01', 'B002', 'Ready', '2023-12-20', '2026-12-20', 'Main Storage'),
('BD01-0021', 'BD01', 'B002', 'Ready', '2025-05-24', '2028-05-24', 'Main Storage'),
('BD01-0022', 'BD01', 'B002', 'Ready', '2025-12-18', '2028-12-18', 'Main Storage'),
('BD01-0023', 'BD01', 'B002', 'Ready', '2024-06-11', '2027-06-11', 'Main Storage'),
('BD01-0024', 'BD01', 'B002', 'Ready', '2025-03-31', '2028-03-31', 'Main Storage'),
('BD01-0025', 'BD01', 'B002', 'Ready', '2023-08-02', '2026-08-02', 'Main Storage'),
('BD01-0026', 'BD01', 'B002', 'Ready', '2023-07-13', '2026-07-13', 'Main Storage'),
('BD01-0027', 'BD01', 'B002', 'Ready', '2024-11-18', '2027-11-18', 'Main Storage'),
('BD01-0028', 'BD01', 'B002', 'Ready', '2024-06-19', '2027-06-19', 'Main Storage'),
('BD01-0029', 'BD01', 'B002', 'Ready', '2023-05-17', '2026-05-17', 'Main Storage'),
('BD01-0030', 'BD01', 'B002', 'Ready', '2024-12-06', '2027-12-06', 'Main Storage'),
('BD01-0031', 'BD01', 'B002', 'Ready', '2024-09-25', '2027-09-25', 'Main Storage'),
('BD01-0032', 'BD01', 'B002', 'Ready', '2024-08-28', '2027-08-28', 'Main Storage'),
('BD01-0033', 'BD01', 'B002', 'Ready', '2025-07-21', '2028-07-21', 'Main Storage'),
('BD01-0034', 'BD01', 'B002', 'Ready', '2023-12-04', '2026-12-04', 'Main Storage'),
('BD01-0035', 'BD01', 'B002', 'Ready', '2023-01-11', '2026-01-11', 'Main Storage'),
('BD01-0036', 'BD01', 'B002', 'Ready', '2025-12-19', '2028-12-19', 'Main Storage'),
('BD01-0037', 'BD01', 'B003', 'Ready', '2023-08-08', '2026-08-08', 'Main Storage'),
('BD01-0038', 'BD01', 'B003', 'Ready', '2024-01-30', '2027-01-30', 'Main Storage'),
('BD01-0039', 'BD01', 'B003', 'Ready', '2023-09-15', '2026-09-15', 'Main Storage'),
('BD01-0040', 'BD01', 'B003', 'Ready', '2023-07-20', '2026-07-20', 'Main Storage'),
('BD01-0041', 'BD01', 'B003', 'Ready', '2023-05-15', '2026-05-15', 'Main Storage'),
('BD01-0042', 'BD01', 'B003', 'Ready', '2024-12-15', '2027-12-15', 'Main Storage'),
('BD01-0043', 'BD01', 'B003', 'Ready', '2023-04-13', '2026-04-13', 'Main Storage'),
('BD01-0044', 'BD01', 'B003', 'Ready', '2025-01-19', '2028-01-19', 'Main Storage'),
('BD01-0045', 'BD01', 'B003', 'Ready', '2025-12-21', '2028-12-21', 'Main Storage'),
('BD01-0046', 'BD01', 'B003', 'Ready', '2023-03-18', '2026-03-18', 'Main Storage'),
('BD01-0047', 'BD01', 'B003', 'Ready', '2024-07-06', '2027-07-06', 'Main Storage'),
('BD01-0048', 'BD01', 'B003', 'Ready', '2024-11-24', '2027-11-24', 'Main Storage'),
('BD01-0049', 'BD01', 'B003', 'Ready', '2024-03-31', '2027-03-31', 'Main Storage'),
('BD01-0050', 'BD01', 'B003', 'Ready', '2023-04-09', '2026-04-09', 'Main Storage'),
('BD01-0051', 'BD01', 'B003', 'Ready', '2023-04-04', '2026-04-04', 'Main Storage'),
('BD01-0052', 'BD01', 'B003', 'Ready', '2025-01-13', '2028-01-13', 'Main Storage'),
('BD01-0053', 'BD01', 'B003', 'Ready', '2025-05-17', '2028-05-17', 'Main Storage'),
('BD01-0054', 'BD01', 'B003', 'Ready', '2025-12-12', '2028-12-12', 'Main Storage'),
('BD01-0055', 'BD01', 'B005', 'Ready', '2023-10-10', '2026-10-10', 'Main Storage'),
('BD01-0056', 'BD01', 'B005', 'Ready', '2025-12-15', '2028-12-15', 'Main Storage'),
('BD01-0057', 'BD01', 'B005', 'Ready', '2023-08-29', '2026-08-29', 'Main Storage'),
('BD01-0058', 'BD01', 'B005', 'Ready', '2024-10-12', '2027-10-12', 'Main Storage'),
('BD01-0059', 'BD01', 'B005', 'Ready', '2025-12-16', '2028-12-16', 'Main Storage'),
('BD01-0060', 'BD01', 'B005', 'Ready', '2023-01-14', '2026-01-14', 'Main Storage'),
('BD01-0061', 'BD01', 'B005', 'Ready', '2025-05-27', '2028-05-27', 'Main Storage'),
('BD01-0062', 'BD01', 'B005', 'Ready', '2025-03-26', '2028-03-26', 'Main Storage'),
('BD01-0063', 'BD01', 'B005', 'Ready', '2023-11-12', '2026-11-12', 'Main Storage'),
('BD01-0064', 'BD01', 'B005', 'Ready', '2023-01-22', '2026-01-22', 'Main Storage'),
('BD01-0065', 'BD01', 'B005', 'Ready', '2025-01-21', '2028-01-21', 'Main Storage'),
('BD01-0066', 'BD01', 'B005', 'Ready', '2024-04-04', '2027-04-04', 'Main Storage'),
('BD01-0067', 'BD01', 'B005', 'Ready', '2024-07-12', '2027-07-12', 'Main Storage'),
('BD01-0068', 'BD01', 'B005', 'Ready', '2023-05-21', '2026-05-21', 'Main Storage'),
('BD01-0069', 'BD01', 'B005', 'Ready', '2024-09-07', '2027-09-07', 'Main Storage'),
('BD01-0070', 'BD01', 'B005', 'Ready', '2023-05-10', '2026-05-10', 'Main Storage'),
('BD01-0071', 'BD01', 'B005', 'Ready', '2024-04-10', '2027-04-10', 'Main Storage'),
('BD01-0072', 'BD01', 'B005', 'Ready', '2024-12-16', '2027-12-16', 'Main Storage'),
('BD01-0073', 'BD01', 'B010', 'Ready', '2024-09-18', '2027-09-18', 'Main Storage'),
('BD01-0074', 'BD01', 'B010', 'Ready', '2024-06-14', '2027-06-14', 'Main Storage'),
('BD01-0075', 'BD01', 'B010', 'Ready', '2024-02-24', '2027-02-24', 'Main Storage'),
('BD01-0076', 'BD01', 'B010', 'Ready', '2024-11-10', '2027-11-10', 'Main Storage'),
('BD01-0077', 'BD01', 'B010', 'Ready', '2025-06-13', '2028-06-13', 'Main Storage'),
('BD01-0078', 'BD01', 'B010', 'Ready', '2023-03-06', '2026-03-06', 'Main Storage'),
('BD01-0079', 'BD01', 'B010', 'Ready', '2024-01-01', '2027-01-01', 'Main Storage'),
('BD01-0080', 'BD01', 'B010', 'Ready', '2024-01-26', '2027-01-26', 'Main Storage'),
('BD01-0081', 'BD01', 'B010', 'Ready', '2023-07-24', '2026-07-24', 'Main Storage'),
('BD01-0082', 'BD01', 'B010', 'Ready', '2025-07-24', '2028-07-24', 'Main Storage'),
('BD01-0083', 'BD01', 'B010', 'Ready', '2024-06-21', '2027-06-21', 'Main Storage'),
('BD01-0084', 'BD01', 'B010', 'Ready', '2025-11-10', '2028-11-10', 'Main Storage'),
('BD01-0085', 'BD01', 'B010', 'Ready', '2024-05-12', '2027-05-12', 'Main Storage'),
('BD01-0086', 'BD01', 'B010', 'Ready', '2023-05-16', '2026-05-16', 'Main Storage'),
('BD01-0087', 'BD01', 'B010', 'Ready', '2025-02-27', '2028-02-27', 'Main Storage'),
('BD01-0088', 'BD01', 'B010', 'Ready', '2024-01-14', '2027-01-14', 'Main Storage'),
('BD01-0089', 'BD01', 'B010', 'Ready', '2025-09-05', '2028-09-05', 'Main Storage'),
('BD01-0090', 'BD01', 'B010', 'Ready', '2023-05-10', '2026-05-10', 'Main Storage'),
('BD01-0091', 'BD01', 'B004', 'Ready', '2023-06-16', '2026-06-15', 'Main Storage'),
('BD01-0092', 'BD01', 'B004', 'Ready', '2025-04-26', '2028-04-25', 'Main Storage'),
('BD01-0093', 'BD01', 'B004', 'Ready', '2025-01-13', '2028-01-13', 'Main Storage'),
('BD01-0094', 'BD01', 'B004', 'Ready', '2023-07-26', '2026-07-25', 'Main Storage'),
('BD01-0095', 'BD01', 'B004', 'Ready', '2024-08-28', '2027-08-28', 'Main Storage'),
('BD01-0096', 'BD01', 'B004', 'Ready', '2025-12-20', '2028-12-19', 'Main Storage'),
('BD01-0097', 'BD01', 'B004', 'Ready', '2023-10-31', '2026-10-30', 'Main Storage'),
('BD01-0098', 'BD01', 'B004', 'Ready', '2025-04-04', '2028-04-03', 'Main Storage'),
('BD01-0099', 'BD01', 'B004', 'Ready', '2025-01-22', '2028-01-22', 'Main Storage'),
('BD01-0100', 'BD01', 'B004', 'Ready', '2025-01-11', '2028-01-11', 'Main Storage'),
('BD01-0101', 'BD01', 'B004', 'Ready', '2024-12-23', '2027-12-23', 'Main Storage'),
('BD01-0102', 'BD01', 'B004', 'Ready', '2025-11-23', '2028-11-23', 'Main Storage'),
('BD01-0103', 'BD01', 'B004', 'Ready', '2023-10-18', '2026-10-18', 'Main Storage'),
('BD01-0104', 'BD01', 'B004', 'Ready', '2024-09-09', '2027-09-09', 'Main Storage'),
('BD01-0105', 'BD01', 'B004', 'Ready', '2023-12-14', '2026-12-14', 'Main Storage'),
('BD01-0106', 'BD01', 'B004', 'Ready', '2023-12-17', '2026-12-17', 'Main Storage'),
('BD01-0107', 'BD01', 'B004', 'Ready', '2024-06-05', '2027-06-05', 'Main Storage'),
('BD01-0108', 'BD01', 'B004', 'Ready', '2025-11-16', '2028-11-16', 'Main Storage'),
('BD02-0001', 'BD02', 'B001', 'Ready', '2023-04-15', '2026-04-15', 'Main Storage'),
('BD02-0002', 'BD02', 'B001', 'Ready', '2024-01-14', '2027-01-14', 'Main Storage'),
('BD02-0003', 'BD02', 'B001', 'Ready', '2025-06-25', '2028-06-25', 'Main Storage'),
('BD02-0004', 'BD02', 'B001', 'Ready', '2025-08-23', '2028-08-23', 'Main Storage'),
('BD02-0005', 'BD02', 'B001', 'Ready', '2024-02-07', '2027-02-07', 'Main Storage'),
('BD02-0006', 'BD02', 'B001', 'Ready', '2024-08-31', '2027-08-31', 'Main Storage'),
('BD02-0007', 'BD02', 'B002', 'Ready', '2024-03-02', '2027-03-02', 'Main Storage'),
('BD02-0008', 'BD02', 'B002', 'Ready', '2023-08-18', '2026-08-18', 'Main Storage'),
('BD02-0009', 'BD02', 'B002', 'Ready', '2023-05-24', '2026-05-24', 'Main Storage'),
('BD02-0010', 'BD02', 'B002', 'Ready', '2025-09-19', '2028-09-19', 'Main Storage'),
('BD02-0011', 'BD02', 'B002', 'Ready', '2024-07-15', '2027-07-15', 'Main Storage'),
('BD02-0012', 'BD02', 'B002', 'Ready', '2024-10-05', '2027-10-05', 'Main Storage'),
('BD02-0013', 'BD02', 'B003', 'Ready', '2024-01-21', '2027-01-21', 'Main Storage'),
('BD02-0014', 'BD02', 'B003', 'Ready', '2025-07-22', '2028-07-22', 'Main Storage'),
('BD02-0015', 'BD02', 'B003', 'Ready', '2023-02-06', '2026-02-06', 'Main Storage'),
('BD02-0016', 'BD02', 'B003', 'Ready', '2023-03-24', '2026-03-24', 'Main Storage'),
('BD02-0017', 'BD02', 'B003', 'Ready', '2025-01-25', '2028-01-25', 'Main Storage'),
('BD02-0018', 'BD02', 'B003', 'Ready', '2024-02-16', '2027-02-16', 'Main Storage'),
('BD02-0019', 'BD02', 'B005', 'Ready', '2023-02-26', '2026-02-26', 'Main Storage'),
('BD02-0020', 'BD02', 'B005', 'Ready', '2023-05-15', '2026-05-15', 'Main Storage'),
('BD02-0021', 'BD02', 'B005', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('BD02-0022', 'BD02', 'B005', 'Ready', '2025-06-11', '2028-06-11', 'Main Storage'),
('BD02-0023', 'BD02', 'B005', 'Ready', '2025-07-29', '2028-07-29', 'Main Storage'),
('BD02-0024', 'BD02', 'B005', 'Ready', '2023-08-16', '2026-08-16', 'Main Storage'),
('BD02-0025', 'BD02', 'B010', 'Ready', '2025-09-03', '2028-09-03', 'Main Storage'),
('BD02-0026', 'BD02', 'B010', 'Ready', '2025-12-05', '2028-12-05', 'Main Storage'),
('BD02-0027', 'BD02', 'B010', 'Ready', '2024-02-24', '2027-02-24', 'Main Storage'),
('BD02-0028', 'BD02', 'B010', 'Ready', '2023-02-12', '2026-02-12', 'Main Storage'),
('BD02-0029', 'BD02', 'B010', 'Ready', '2023-11-16', '2026-11-16', 'Main Storage'),
('BD02-0030', 'BD02', 'B010', 'Ready', '2024-11-17', '2027-11-17', 'Main Storage'),
('BD02-0031', 'BD02', 'B004', 'Ready', '2025-09-17', '2028-09-16', 'Main Storage'),
('BD02-0032', 'BD02', 'B004', 'Ready', '2023-01-06', '2026-01-05', 'Main Storage'),
('BD02-0033', 'BD02', 'B004', 'Ready', '2025-01-01', '2028-01-01', 'Main Storage'),
('BD02-0034', 'BD02', 'B004', 'Ready', '2024-10-23', '2027-10-23', 'Main Storage'),
('BD02-0035', 'BD02', 'B004', 'Ready', '2025-07-09', '2028-07-08', 'Main Storage'),
('BD02-0036', 'BD02', 'B004', 'Ready', '2023-10-01', '2026-09-30', 'Main Storage'),
('BD03-0001', 'BD03', 'B001', 'Ready', '2023-07-27', '2026-07-27', 'Main Storage'),
('BD03-0002', 'BD03', 'B001', 'Ready', '2025-12-28', '2028-12-28', 'Main Storage'),
('BD03-0003', 'BD03', 'B002', 'Ready', '2024-09-16', '2027-09-16', 'Main Storage'),
('BD03-0004', 'BD03', 'B002', 'Ready', '2025-07-31', '2028-07-31', 'Main Storage'),
('BD03-0005', 'BD03', 'B003', 'Ready', '2023-09-27', '2026-09-27', 'Main Storage'),
('BD03-0006', 'BD03', 'B003', 'Ready', '2025-12-19', '2028-12-19', 'Main Storage'),
('BD03-0007', 'BD03', 'B005', 'Ready', '2023-01-26', '2026-01-26', 'Main Storage'),
('BD03-0008', 'BD03', 'B005', 'Ready', '2023-05-26', '2026-05-26', 'Main Storage'),
('BD03-0009', 'BD03', 'B010', 'Ready', '2025-10-04', '2028-10-04', 'Main Storage'),
('BD03-0010', 'BD03', 'B010', 'Ready', '2023-07-17', '2026-07-17', 'Main Storage'),
('BD03-0011', 'BD03', 'B004', 'Ready', '2025-05-13', '2028-05-12', 'Main Storage'),
('BD03-0012', 'BD03', 'B004', 'Ready', '2024-08-16', '2027-08-16', 'Main Storage'),
('BG01-0001', 'BG01', 'B001', 'Ready', '2025-02-10', '2028-02-10', 'Main Storage'),
('BG01-0002', 'BG01', 'B001', 'Ready', '2025-04-15', '2028-04-15', 'Main Storage'),
('BG01-0003', 'BG01', 'B001', 'Ready', '2025-06-08', '2028-06-08', 'Main Storage'),
('BG01-0004', 'BG01', 'B001', 'Ready', '2025-06-08', '2028-06-08', 'Main Storage'),
('BG01-0005', 'BG01', 'B002', 'Ready', '2024-01-12', '2027-01-12', 'Main Storage'),
('BG01-0006', 'BG01', 'B002', 'Ready', '2024-11-18', '2027-11-18', 'Main Storage'),
('BG01-0007', 'BG01', 'B002', 'Ready', '2024-12-08', '2027-12-08', 'Main Storage'),
('BG01-0008', 'BG01', 'B002', 'Ready', '2024-10-05', '2027-10-05', 'Main Storage'),
('BG01-0009', 'BG01', 'B003', 'Ready', '2025-12-31', '2028-12-31', 'Main Storage'),
('BG01-0010', 'BG01', 'B003', 'Ready', '2025-04-18', '2028-04-18', 'Main Storage'),
('BG01-0011', 'BG01', 'B003', 'Ready', '2024-12-15', '2027-12-15', 'Main Storage'),
('BG01-0012', 'BG01', 'B003', 'Ready', '2025-11-15', '2028-11-15', 'Main Storage'),
('BG01-0013', 'BG01', 'B004', 'Ready', '2024-01-30', '2027-01-30', 'Main Storage'),
('BG01-0014', 'BG01', 'B004', 'Ready', '2025-04-18', '2028-04-18', 'Main Storage'),
('BG01-0015', 'BG01', 'B004', 'Ready', '2024-12-15', '2027-12-15', 'Main Storage'),
('BG01-0016', 'BG01', 'B004', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('BG01-0017', 'BG01', 'B005', 'Ready', '2024-12-12', '2027-12-12', 'Main Storage'),
('BG01-0018', 'BG01', 'B005', 'Ready', '2024-05-18', '2027-05-18', 'Main Storage'),
('BG01-0019', 'BG01', 'B005', 'Ready', '2024-12-31', '2027-12-31', 'Main Storage'),
('BG01-0020', 'BG01', 'B005', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('BG01-0021', 'BG01', 'B010', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('BG01-0022', 'BG01', 'B010', 'Ready', '2024-12-12', '2027-12-12', 'Main Storage'),
('BG01-0023', 'BG01', 'B010', 'Ready', '2024-05-18', '2027-05-18', 'Main Storage'),
('BG01-0024', 'BG01', 'B010', 'Ready', '2024-10-08', '2027-10-08', 'Main Storage');
INSERT INTO `equipment_instances` (`instance_code`, `equipment_id`, `branch_id`, `status`, `received_date`, `expiry_date`, `current_location`) VALUES
('BG02-0001', 'BG02', 'B001', 'Ready', '2025-02-10', '2028-02-10', 'Main Storage'),
('BG02-0002', 'BG02', 'B001', 'Ready', '2025-04-15', '2028-04-15', 'Main Storage'),
('BG02-0003', 'BG02', 'B001', 'Ready', '2025-06-08', '2028-06-08', 'Main Storage'),
('BG02-0004', 'BG02', 'B002', 'Ready', '2024-01-12', '2027-01-12', 'Main Storage'),
('BG02-0005', 'BG02', 'B002', 'Ready', '2024-11-18', '2027-11-18', 'Main Storage'),
('BG02-0006', 'BG02', 'B002', 'Ready', '2024-12-08', '2027-12-08', 'Main Storage'),
('BG02-0007', 'BG02', 'B003', 'Ready', '2025-12-31', '2028-12-31', 'Main Storage'),
('BG02-0008', 'BG02', 'B003', 'Ready', '2025-04-18', '2028-04-18', 'Main Storage'),
('BG02-0009', 'BG02', 'B003', 'Ready', '2024-12-15', '2027-12-15', 'Main Storage'),
('BG02-0010', 'BG02', 'B004', 'Ready', '2024-01-30', '2027-01-30', 'Main Storage'),
('BG02-0011', 'BG02', 'B004', 'Ready', '2025-04-18', '2028-04-18', 'Main Storage'),
('BG02-0012', 'BG02', 'B004', 'Ready', '2024-12-15', '2027-12-15', 'Main Storage'),
('BG02-0013', 'BG02', 'B005', 'Ready', '2024-12-12', '2027-12-12', 'Main Storage'),
('BG02-0014', 'BG02', 'B005', 'Ready', '2024-05-18', '2027-05-18', 'Main Storage'),
('BG02-0015', 'BG02', 'B005', 'Ready', '2024-12-31', '2027-12-31', 'Main Storage'),
('BG02-0016', 'BG02', 'B010', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('BG02-0017', 'BG02', 'B010', 'Ready', '2024-12-12', '2027-12-12', 'Main Storage'),
('BG02-0018', 'BG02', 'B010', 'Ready', '2024-05-18', '2027-05-18', 'Main Storage'),
('FB01-0001', 'FB01', 'B001', 'Ready', '2023-08-31', '2026-08-31', 'Main Storage'),
('FB01-0002', 'FB01', 'B001', 'Ready', '2025-03-15', '2028-03-15', 'Main Storage'),
('FB01-0003', 'FB01', 'B001', 'Ready', '2024-10-11', '2027-10-11', 'Main Storage'),
('FB01-0004', 'FB01', 'B001', 'Ready', '2024-01-28', '2027-01-28', 'Main Storage'),
('FB01-0005', 'FB01', 'B001', 'Ready', '2025-06-30', '2028-06-30', 'Main Storage'),
('FB01-0006', 'FB01', 'B001', 'Ready', '2024-10-07', '2027-10-07', 'Main Storage'),
('FB01-0007', 'FB01', 'B001', 'Ready', '2023-05-17', '2026-05-17', 'Main Storage'),
('FB01-0008', 'FB01', 'B001', 'Ready', '2024-05-17', '2027-05-17', 'Main Storage'),
('FB01-0009', 'FB01', 'B001', 'Ready', '2023-03-21', '2026-03-21', 'Main Storage'),
('FB01-0010', 'FB01', 'B001', 'Ready', '2025-10-06', '2028-10-06', 'Main Storage'),
('FB01-0011', 'FB01', 'B002', 'Ready', '2024-01-05', '2027-01-05', 'Main Storage'),
('FB01-0012', 'FB01', 'B002', 'Ready', '2023-01-17', '2026-01-17', 'Main Storage'),
('FB01-0013', 'FB01', 'B002', 'Ready', '2023-06-26', '2026-06-26', 'Main Storage'),
('FB01-0014', 'FB01', 'B002', 'Ready', '2025-10-29', '2028-10-29', 'Main Storage'),
('FB01-0015', 'FB01', 'B002', 'Ready', '2025-12-13', '2028-12-13', 'Main Storage'),
('FB01-0016', 'FB01', 'B002', 'Ready', '2024-04-01', '2027-04-01', 'Main Storage'),
('FB01-0017', 'FB01', 'B002', 'Ready', '2024-05-31', '2027-05-31', 'Main Storage'),
('FB01-0018', 'FB01', 'B002', 'Ready', '2025-06-05', '2028-06-05', 'Main Storage'),
('FB01-0019', 'FB01', 'B002', 'Ready', '2024-01-25', '2027-01-25', 'Main Storage'),
('FB01-0020', 'FB01', 'B002', 'Ready', '2024-09-28', '2027-09-28', 'Main Storage'),
('FB01-0021', 'FB01', 'B003', 'Ready', '2024-12-30', '2027-12-30', 'Main Storage'),
('FB01-0022', 'FB01', 'B003', 'Ready', '2025-07-16', '2028-07-16', 'Main Storage'),
('FB01-0023', 'FB01', 'B003', 'Ready', '2025-09-10', '2028-09-10', 'Main Storage'),
('FB01-0024', 'FB01', 'B003', 'Ready', '2025-03-28', '2028-03-28', 'Main Storage'),
('FB01-0025', 'FB01', 'B003', 'Ready', '2024-11-07', '2027-11-07', 'Main Storage'),
('FB01-0026', 'FB01', 'B003', 'Ready', '2024-10-18', '2027-10-18', 'Main Storage'),
('FB01-0027', 'FB01', 'B003', 'Ready', '2024-09-09', '2027-09-09', 'Main Storage'),
('FB01-0028', 'FB01', 'B003', 'Ready', '2025-01-06', '2028-01-06', 'Main Storage'),
('FB01-0029', 'FB01', 'B003', 'Ready', '2024-06-29', '2027-06-29', 'Main Storage'),
('FB01-0030', 'FB01', 'B003', 'Ready', '2024-09-24', '2027-09-24', 'Main Storage'),
('FB01-0031', 'FB01', 'B005', 'Ready', '2023-08-26', '2026-08-26', 'Main Storage'),
('FB01-0032', 'FB01', 'B005', 'Ready', '2024-04-24', '2027-04-24', 'Main Storage'),
('FB01-0033', 'FB01', 'B005', 'Ready', '2024-09-02', '2027-09-02', 'Main Storage'),
('FB01-0034', 'FB01', 'B005', 'Ready', '2024-03-10', '2027-03-10', 'Main Storage'),
('FB01-0035', 'FB01', 'B005', 'Ready', '2023-03-20', '2026-03-20', 'Main Storage'),
('FB01-0036', 'FB01', 'B005', 'Ready', '2025-10-08', '2028-10-08', 'Main Storage'),
('FB01-0037', 'FB01', 'B005', 'Ready', '2025-08-13', '2028-08-13', 'Main Storage'),
('FB01-0038', 'FB01', 'B005', 'Ready', '2025-02-12', '2028-02-12', 'Main Storage'),
('FB01-0039', 'FB01', 'B005', 'Ready', '2025-07-04', '2028-07-04', 'Main Storage'),
('FB01-0040', 'FB01', 'B005', 'Ready', '2025-04-25', '2028-04-25', 'Main Storage'),
('FB01-0041', 'FB01', 'B010', 'Ready', '2024-05-09', '2027-05-09', 'Main Storage'),
('FB01-0042', 'FB01', 'B010', 'Ready', '2023-10-12', '2026-10-12', 'Main Storage'),
('FB01-0043', 'FB01', 'B010', 'Ready', '2024-03-12', '2027-03-12', 'Main Storage'),
('FB01-0044', 'FB01', 'B010', 'Ready', '2024-02-27', '2027-02-27', 'Main Storage'),
('FB01-0045', 'FB01', 'B010', 'Ready', '2024-02-15', '2027-02-15', 'Main Storage'),
('FB01-0046', 'FB01', 'B010', 'Ready', '2025-10-22', '2028-10-22', 'Main Storage'),
('FB01-0047', 'FB01', 'B010', 'Ready', '2023-02-11', '2026-02-11', 'Main Storage'),
('FB01-0048', 'FB01', 'B010', 'Ready', '2023-03-25', '2026-03-25', 'Main Storage'),
('FB01-0049', 'FB01', 'B010', 'Ready', '2025-07-29', '2028-07-29', 'Main Storage'),
('FB01-0050', 'FB01', 'B010', 'Ready', '2023-07-10', '2026-07-10', 'Main Storage'),
('FB01-0051', 'FB01', 'B004', 'Ready', '2024-02-15', '2027-02-15', 'Main Storage'),
('FB01-0052', 'FB01', 'B004', 'Ready', '2023-09-20', '2026-09-20', 'Main Storage'),
('FB01-0053', 'FB01', 'B004', 'Ready', '2025-05-10', '2028-05-10', 'Main Storage'),
('FB01-0054', 'FB01', 'B004', 'Ready', '2024-11-25', '2027-11-25', 'Main Storage'),
('FB01-0055', 'FB01', 'B004', 'Ready', '2024-07-30', '2027-07-30', 'Main Storage'),
('FB01-0056', 'FB01', 'B004', 'Ready', '2023-08-31', '2026-08-31', 'Main Storage'),
('FB01-0057', 'FB01', 'B004', 'Ready', '2025-03-15', '2028-03-15', 'Main Storage'),
('FB01-0058', 'FB01', 'B004', 'Ready', '2024-10-11', '2027-10-11', 'Main Storage'),
('FB01-0059', 'FB01', 'B004', 'Ready', '2024-01-28', '2027-01-28', 'Main Storage'),
('FB01-0060', 'FB01', 'B004', 'Ready', '2025-06-30', '2028-06-30', 'Main Storage'),
('FB02-0001', 'FB02', 'B001', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FB02-0002', 'FB02', 'B001', 'Ready', '2023-08-18', '2026-08-18', 'Main Storage'),
('FB02-0003', 'FB02', 'B001', 'Ready', '2024-09-04', '2027-09-04', 'Main Storage'),
('FB02-0004', 'FB02', 'B001', 'Ready', '2024-06-25', '2027-06-25', 'Main Storage'),
('FB02-0005', 'FB02', 'B001', 'Ready', '2025-12-23', '2028-12-23', 'Main Storage'),
('FB02-0006', 'FB02', 'B001', 'Ready', '2025-01-24', '2028-01-24', 'Main Storage'),
('FB02-0007', 'FB02', 'B001', 'Ready', '2024-05-12', '2027-05-12', 'Main Storage'),
('FB02-0008', 'FB02', 'B001', 'Ready', '2023-08-08', '2026-08-08', 'Main Storage'),
('FB02-0009', 'FB02', 'B002', 'Ready', '2024-12-29', '2027-12-29', 'Main Storage'),
('FB02-0010', 'FB02', 'B002', 'Ready', '2025-09-06', '2028-09-06', 'Main Storage'),
('FB02-0011', 'FB02', 'B002', 'Ready', '2025-02-15', '2028-02-15', 'Main Storage'),
('FB02-0012', 'FB02', 'B002', 'Ready', '2025-01-11', '2028-01-11', 'Main Storage'),
('FB02-0013', 'FB02', 'B002', 'Ready', '2023-09-18', '2026-09-18', 'Main Storage'),
('FB02-0014', 'FB02', 'B002', 'Ready', '2023-07-26', '2026-07-26', 'Main Storage'),
('FB02-0015', 'FB02', 'B002', 'Ready', '2023-08-10', '2026-08-10', 'Main Storage'),
('FB02-0016', 'FB02', 'B002', 'Ready', '2025-02-11', '2028-02-11', 'Main Storage'),
('FB02-0017', 'FB02', 'B003', 'Ready', '2023-08-09', '2026-08-09', 'Main Storage'),
('FB02-0018', 'FB02', 'B003', 'Ready', '2024-06-18', '2027-06-18', 'Main Storage'),
('FB02-0019', 'FB02', 'B003', 'Ready', '2023-04-19', '2026-04-19', 'Main Storage'),
('FB02-0020', 'FB02', 'B003', 'Ready', '2024-06-19', '2027-06-19', 'Main Storage'),
('FB02-0021', 'FB02', 'B003', 'Ready', '2024-07-28', '2027-07-28', 'Main Storage'),
('FB02-0022', 'FB02', 'B003', 'Ready', '2024-04-25', '2027-04-25', 'Main Storage'),
('FB02-0023', 'FB02', 'B003', 'Ready', '2025-05-23', '2028-05-23', 'Main Storage'),
('FB02-0024', 'FB02', 'B003', 'Ready', '2023-09-02', '2026-09-02', 'Main Storage'),
('FB02-0025', 'FB02', 'B005', 'Ready', '2025-12-23', '2028-12-23', 'Main Storage'),
('FB02-0026', 'FB02', 'B005', 'Ready', '2024-01-10', '2027-01-10', 'Main Storage'),
('FB02-0027', 'FB02', 'B005', 'Ready', '2025-01-05', '2028-01-05', 'Main Storage'),
('FB02-0028', 'FB02', 'B005', 'Ready', '2024-09-22', '2027-09-22', 'Main Storage'),
('FB02-0029', 'FB02', 'B005', 'Ready', '2023-05-05', '2026-05-05', 'Main Storage'),
('FB02-0030', 'FB02', 'B005', 'Ready', '2024-02-23', '2027-02-23', 'Main Storage'),
('FB02-0031', 'FB02', 'B005', 'Ready', '2023-03-10', '2026-03-10', 'Main Storage'),
('FB02-0032', 'FB02', 'B005', 'Ready', '2025-09-05', '2028-09-05', 'Main Storage'),
('FB02-0033', 'FB02', 'B010', 'Ready', '2023-10-04', '2026-10-04', 'Main Storage'),
('FB02-0034', 'FB02', 'B010', 'Ready', '2024-02-28', '2027-02-28', 'Main Storage'),
('FB02-0035', 'FB02', 'B010', 'Ready', '2025-05-23', '2028-05-23', 'Main Storage'),
('FB02-0036', 'FB02', 'B010', 'Ready', '2023-08-25', '2026-08-25', 'Main Storage'),
('FB02-0037', 'FB02', 'B010', 'Ready', '2024-06-14', '2027-06-14', 'Main Storage'),
('FB02-0038', 'FB02', 'B010', 'Ready', '2023-08-02', '2026-08-02', 'Main Storage'),
('FB02-0039', 'FB02', 'B010', 'Ready', '2025-10-29', '2028-10-29', 'Main Storage'),
('FB02-0040', 'FB02', 'B010', 'Ready', '2023-03-25', '2026-03-25', 'Main Storage'),
('FB02-0041', 'FB02', 'B004', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FB02-0042', 'FB02', 'B004', 'Ready', '2023-08-18', '2026-08-18', 'Main Storage'),
('FB02-0043', 'FB02', 'B004', 'Ready', '2024-09-04', '2027-09-04', 'Main Storage'),
('FB02-0044', 'FB02', 'B004', 'Ready', '2024-06-25', '2027-06-25', 'Main Storage'),
('FB02-0045', 'FB02', 'B004', 'Ready', '2025-12-23', '2028-12-23', 'Main Storage'),
('FB02-0046', 'FB02', 'B004', 'Ready', '2025-01-24', '2028-01-24', 'Main Storage'),
('FB02-0047', 'FB02', 'B004', 'Ready', '2024-05-12', '2027-05-12', 'Main Storage'),
('FB02-0048', 'FB02', 'B004', 'Ready', '2023-08-08', '2026-08-08', 'Main Storage'),
('FB03-0001', 'FB03', 'B001', 'Ready', '2023-02-07', '2026-02-07', 'Main Storage'),
('FB03-0002', 'FB03', 'B001', 'Ready', '2024-02-06', '2027-02-06', 'Main Storage'),
('FB03-0003', 'FB03', 'B001', 'Ready', '2025-06-20', '2028-06-20', 'Main Storage'),
('FB03-0004', 'FB03', 'B001', 'Ready', '2023-01-10', '2026-01-10', 'Main Storage'),
('FB03-0005', 'FB03', 'B001', 'Ready', '2025-12-21', '2028-12-21', 'Main Storage'),
('FB03-0006', 'FB03', 'B001', 'Ready', '2024-09-23', '2027-09-23', 'Main Storage'),
('FB03-0007', 'FB03', 'B001', 'Ready', '2024-02-29', '2027-02-28', 'Main Storage'),
('FB03-0008', 'FB03', 'B001', 'Ready', '2023-04-30', '2026-04-30', 'Main Storage'),
('FB03-0009', 'FB03', 'B001', 'Ready', '2025-08-21', '2028-08-21', 'Main Storage'),
('FB03-0010', 'FB03', 'B001', 'Ready', '2023-04-22', '2026-04-22', 'Main Storage'),
('FB03-0011', 'FB03', 'B002', 'Ready', '2024-04-04', '2027-04-04', 'Main Storage'),
('FB03-0012', 'FB03', 'B002', 'Ready', '2024-04-17', '2027-04-17', 'Main Storage'),
('FB03-0013', 'FB03', 'B002', 'Ready', '2023-01-02', '2026-01-02', 'Main Storage'),
('FB03-0014', 'FB03', 'B002', 'Ready', '2024-01-29', '2027-01-29', 'Main Storage'),
('FB03-0015', 'FB03', 'B002', 'Ready', '2023-12-13', '2026-12-13', 'Main Storage'),
('FB03-0016', 'FB03', 'B002', 'Ready', '2025-01-14', '2028-01-14', 'Main Storage'),
('FB03-0017', 'FB03', 'B002', 'Ready', '2023-11-10', '2026-11-10', 'Main Storage'),
('FB03-0018', 'FB03', 'B002', 'Ready', '2025-03-11', '2028-03-11', 'Main Storage'),
('FB03-0019', 'FB03', 'B002', 'Ready', '2024-01-19', '2027-01-19', 'Main Storage'),
('FB03-0020', 'FB03', 'B002', 'Ready', '2025-05-31', '2028-05-31', 'Main Storage'),
('FB03-0021', 'FB03', 'B003', 'Ready', '2024-03-29', '2027-03-29', 'Main Storage'),
('FB03-0022', 'FB03', 'B003', 'Ready', '2023-12-12', '2026-12-12', 'Main Storage'),
('FB03-0023', 'FB03', 'B003', 'Ready', '2023-02-28', '2026-02-28', 'Main Storage'),
('FB03-0024', 'FB03', 'B003', 'Ready', '2024-07-18', '2027-07-18', 'Main Storage'),
('FB03-0025', 'FB03', 'B003', 'Ready', '2024-03-13', '2027-03-13', 'Main Storage'),
('FB03-0026', 'FB03', 'B003', 'Ready', '2025-12-06', '2028-12-06', 'Main Storage'),
('FB03-0027', 'FB03', 'B003', 'Ready', '2023-08-12', '2026-08-12', 'Main Storage'),
('FB03-0028', 'FB03', 'B003', 'Ready', '2025-09-18', '2028-09-18', 'Main Storage'),
('FB03-0029', 'FB03', 'B003', 'Ready', '2023-06-20', '2026-06-20', 'Main Storage'),
('FB03-0030', 'FB03', 'B003', 'Ready', '2024-06-10', '2027-06-10', 'Main Storage'),
('FB03-0031', 'FB03', 'B005', 'Ready', '2024-08-29', '2027-08-29', 'Main Storage'),
('FB03-0032', 'FB03', 'B005', 'Ready', '2024-12-25', '2027-12-25', 'Main Storage'),
('FB03-0033', 'FB03', 'B005', 'Ready', '2024-12-24', '2027-12-24', 'Main Storage'),
('FB03-0034', 'FB03', 'B005', 'Ready', '2023-06-24', '2026-06-24', 'Main Storage'),
('FB03-0035', 'FB03', 'B005', 'Ready', '2024-03-02', '2027-03-02', 'Main Storage'),
('FB03-0036', 'FB03', 'B005', 'Ready', '2024-01-29', '2027-01-29', 'Main Storage'),
('FB03-0037', 'FB03', 'B005', 'Ready', '2025-10-21', '2028-10-21', 'Main Storage'),
('FB03-0038', 'FB03', 'B005', 'Ready', '2025-03-24', '2028-03-24', 'Main Storage'),
('FB03-0039', 'FB03', 'B005', 'Ready', '2023-01-14', '2026-01-14', 'Main Storage'),
('FB03-0040', 'FB03', 'B005', 'Ready', '2024-10-18', '2027-10-18', 'Main Storage'),
('FB03-0041', 'FB03', 'B010', 'Ready', '2024-09-13', '2027-09-13', 'Main Storage'),
('FB03-0042', 'FB03', 'B010', 'Ready', '2023-07-25', '2026-07-25', 'Main Storage'),
('FB03-0043', 'FB03', 'B010', 'Ready', '2024-12-17', '2027-12-17', 'Main Storage'),
('FB03-0044', 'FB03', 'B010', 'Ready', '2024-05-25', '2027-05-25', 'Main Storage'),
('FB03-0045', 'FB03', 'B010', 'Ready', '2023-01-25', '2026-01-25', 'Main Storage'),
('FB03-0046', 'FB03', 'B010', 'Ready', '2024-07-01', '2027-07-01', 'Main Storage'),
('FB03-0047', 'FB03', 'B010', 'Ready', '2024-10-11', '2027-10-11', 'Main Storage'),
('FB03-0048', 'FB03', 'B010', 'Ready', '2025-10-14', '2028-10-14', 'Main Storage'),
('FB03-0049', 'FB03', 'B010', 'Ready', '2024-12-23', '2027-12-23', 'Main Storage'),
('FB03-0050', 'FB03', 'B010', 'Ready', '2023-03-16', '2026-03-16', 'Main Storage'),
('FB03-0051', 'FB03', 'B004', 'Ready', '2023-02-07', '2026-02-07', 'Main Storage'),
('FB03-0052', 'FB03', 'B004', 'Ready', '2024-02-06', '2027-02-06', 'Main Storage'),
('FB03-0053', 'FB03', 'B004', 'Ready', '2025-06-20', '2028-06-20', 'Main Storage'),
('FB03-0054', 'FB03', 'B004', 'Ready', '2023-01-10', '2026-01-10', 'Main Storage'),
('FB03-0055', 'FB03', 'B004', 'Ready', '2025-12-21', '2028-12-21', 'Main Storage'),
('FB03-0056', 'FB03', 'B004', 'Ready', '2024-09-23', '2027-09-23', 'Main Storage'),
('FB03-0057', 'FB03', 'B004', 'Ready', '2024-02-29', '2027-02-28', 'Main Storage'),
('FB03-0058', 'FB03', 'B004', 'Ready', '2023-04-30', '2026-04-30', 'Main Storage'),
('FB03-0059', 'FB03', 'B004', 'Ready', '2025-08-21', '2028-08-21', 'Main Storage'),
('FB03-0060', 'FB03', 'B004', 'Ready', '2023-04-22', '2026-04-22', 'Main Storage'),
('FB04-0001', 'FB04', 'B001', 'Ready', '2025-12-21', '2028-12-21', 'Main Storage'),
('FB04-0002', 'FB04', 'B001', 'Ready', '2023-09-02', '2026-09-02', 'Main Storage'),
('FB04-0003', 'FB04', 'B001', 'Ready', '2025-05-28', '2028-05-28', 'Main Storage'),
('FB04-0004', 'FB04', 'B001', 'Ready', '2024-10-28', '2027-10-28', 'Main Storage'),
('FB04-0005', 'FB04', 'B001', 'Ready', '2024-08-26', '2027-08-26', 'Main Storage'),
('FB04-0006', 'FB04', 'B002', 'Ready', '2023-07-01', '2026-07-01', 'Main Storage'),
('FB04-0007', 'FB04', 'B002', 'Ready', '2024-07-07', '2027-07-07', 'Main Storage'),
('FB04-0008', 'FB04', 'B002', 'Ready', '2023-05-22', '2026-05-22', 'Main Storage'),
('FB04-0009', 'FB04', 'B002', 'Ready', '2025-11-10', '2028-11-10', 'Main Storage'),
('FB04-0010', 'FB04', 'B002', 'Ready', '2025-09-03', '2028-09-03', 'Main Storage'),
('FB04-0011', 'FB04', 'B003', 'Ready', '2025-06-08', '2028-06-08', 'Main Storage'),
('FB04-0012', 'FB04', 'B003', 'Ready', '2024-04-05', '2027-04-05', 'Main Storage'),
('FB04-0013', 'FB04', 'B003', 'Ready', '2025-12-06', '2028-12-06', 'Main Storage'),
('FB04-0014', 'FB04', 'B003', 'Ready', '2025-11-29', '2028-11-29', 'Main Storage'),
('FB04-0015', 'FB04', 'B003', 'Ready', '2024-01-02', '2027-01-02', 'Main Storage'),
('FB04-0016', 'FB04', 'B005', 'Ready', '2024-11-12', '2027-11-12', 'Main Storage'),
('FB04-0017', 'FB04', 'B005', 'Ready', '2025-10-19', '2028-10-19', 'Main Storage'),
('FB04-0018', 'FB04', 'B005', 'Ready', '2023-10-13', '2026-10-13', 'Main Storage'),
('FB04-0019', 'FB04', 'B005', 'Ready', '2025-05-04', '2028-05-04', 'Main Storage'),
('FB04-0020', 'FB04', 'B005', 'Ready', '2025-09-11', '2028-09-11', 'Main Storage'),
('FB04-0021', 'FB04', 'B010', 'Ready', '2023-09-16', '2026-09-16', 'Main Storage'),
('FB04-0022', 'FB04', 'B010', 'Ready', '2023-01-22', '2026-01-22', 'Main Storage'),
('FB04-0023', 'FB04', 'B010', 'Ready', '2024-08-09', '2027-08-09', 'Main Storage'),
('FB04-0024', 'FB04', 'B010', 'Ready', '2024-07-22', '2027-07-22', 'Main Storage'),
('FB04-0025', 'FB04', 'B010', 'Ready', '2023-01-31', '2026-01-31', 'Main Storage'),
('FB04-0026', 'FB04', 'B004', 'Ready', '2024-01-23', '2027-01-22', 'Main Storage'),
('FB04-0027', 'FB04', 'B004', 'Ready', '2025-01-05', '2028-01-05', 'Main Storage'),
('FB04-0028', 'FB04', 'B004', 'Ready', '2025-09-18', '2028-09-17', 'Main Storage'),
('FB04-0029', 'FB04', 'B004', 'Ready', '2023-06-25', '2026-06-24', 'Main Storage'),
('FB04-0030', 'FB04', 'B004', 'Ready', '2025-03-24', '2028-03-23', 'Main Storage'),
('FT01-0001', 'FT01', 'B001', 'Ready', '2025-02-10', '2028-02-10', 'Main Storage'),
('FT01-0002', 'FT01', 'B001', 'Ready', '2025-04-15', '2028-04-15', 'Main Storage'),
('FT01-0003', 'FT01', 'B001', 'Ready', '2025-06-08', '2028-06-08', 'Main Storage'),
('FT01-0004', 'FT01', 'B001', 'Ready', '2025-06-08', '2028-06-08', 'Main Storage'),
('FT01-0005', 'FT01', 'B001', 'Ready', '2025-08-22', '2028-08-22', 'Main Storage'),
('FT01-0006', 'FT01', 'B002', 'Ready', '2024-01-12', '2027-01-12', 'Main Storage'),
('FT01-0007', 'FT01', 'B002', 'Ready', '2024-04-18', '2027-04-18', 'Main Storage'),
('FT01-0008', 'FT01', 'B002', 'Ready', '2024-12-08', '2027-12-08', 'Main Storage'),
('FT01-0009', 'FT01', 'B002', 'Ready', '2024-10-05', '2027-10-05', 'Main Storage'),
('FT01-0010', 'FT01', 'B002', 'Ready', '2025-02-22', '2028-02-22', 'Main Storage'),
('FT01-0011', 'FT01', 'B003', 'Ready', '2025-01-12', '2028-01-12', 'Main Storage'),
('FT01-0012', 'FT01', 'B003', 'Ready', '2025-04-18', '2028-04-18', 'Main Storage'),
('FT01-0013', 'FT01', 'B003', 'Ready', '2024-08-08', '2027-08-08', 'Main Storage'),
('FT01-0014', 'FT01', 'B003', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FT01-0015', 'FT01', 'B003', 'Ready', '2025-03-22', '2028-03-22', 'Main Storage'),
('FT01-0016', 'FT01', 'B004', 'Ready', '2024-01-30', '2027-01-30', 'Main Storage'),
('FT01-0017', 'FT01', 'B004', 'Ready', '2025-04-18', '2028-04-18', 'Main Storage'),
('FT01-0018', 'FT01', 'B004', 'Ready', '2024-12-15', '2027-12-15', 'Main Storage'),
('FT01-0019', 'FT01', 'B004', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FT01-0020', 'FT01', 'B004', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('FT01-0021', 'FT01', 'B005', 'Ready', '2024-12-12', '2027-12-12', 'Main Storage'),
('FT01-0022', 'FT01', 'B005', 'Ready', '2024-05-18', '2027-05-18', 'Main Storage'),
('FT01-0023', 'FT01', 'B005', 'Ready', '2024-10-08', '2027-10-08', 'Main Storage'),
('FT01-0024', 'FT01', 'B005', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FT01-0025', 'FT01', 'B005', 'Ready', '2025-07-22', '2028-07-22', 'Main Storage'),
('FT01-0026', 'FT01', 'B010', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('FT01-0027', 'FT01', 'B010', 'Ready', '2024-12-12', '2027-12-12', 'Main Storage'),
('FT01-0028', 'FT01', 'B010', 'Ready', '2024-05-18', '2027-05-18', 'Main Storage'),
('FT01-0029', 'FT01', 'B010', 'Ready', '2024-10-08', '2027-10-08', 'Main Storage'),
('FT01-0030', 'FT01', 'B010', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FT02-0001', 'FT02', 'B001', 'Ready', '2025-02-10', '2028-02-10', 'Main Storage'),
('FT02-0002', 'FT02', 'B001', 'Ready', '2025-04-15', '2028-04-15', 'Main Storage'),
('FT02-0003', 'FT02', 'B001', 'Ready', '2025-06-08', '2028-06-08', 'Main Storage'),
('FT02-0004', 'FT02', 'B001', 'Ready', '2025-06-08', '2028-06-08', 'Main Storage'),
('FT02-0005', 'FT02', 'B002', 'Ready', '2024-01-12', '2027-01-12', 'Main Storage'),
('FT02-0006', 'FT02', 'B002', 'Ready', '2024-04-18', '2027-04-18', 'Main Storage'),
('FT02-0007', 'FT02', 'B002', 'Ready', '2024-12-08', '2027-12-08', 'Main Storage'),
('FT02-0008', 'FT02', 'B002', 'Ready', '2024-10-05', '2027-10-05', 'Main Storage'),
('FT02-0009', 'FT02', 'B003', 'Ready', '2025-01-12', '2028-01-12', 'Main Storage'),
('FT02-0010', 'FT02', 'B003', 'Ready', '2025-04-18', '2028-04-18', 'Main Storage'),
('FT02-0011', 'FT02', 'B003', 'Ready', '2024-08-08', '2027-08-08', 'Main Storage'),
('FT02-0012', 'FT02', 'B003', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FT02-0013', 'FT02', 'B004', 'Ready', '2024-01-30', '2027-01-30', 'Main Storage'),
('FT02-0014', 'FT02', 'B004', 'Ready', '2025-04-18', '2028-04-18', 'Main Storage'),
('FT02-0015', 'FT02', 'B004', 'Ready', '2024-12-15', '2027-12-15', 'Main Storage'),
('FT02-0016', 'FT02', 'B004', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FT02-0017', 'FT02', 'B005', 'Ready', '2024-12-12', '2027-12-12', 'Main Storage'),
('FT02-0018', 'FT02', 'B005', 'Ready', '2024-05-18', '2027-05-18', 'Main Storage'),
('FT02-0019', 'FT02', 'B005', 'Ready', '2024-10-08', '2027-10-08', 'Main Storage'),
('FT02-0020', 'FT02', 'B005', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FT02-0021', 'FT02', 'B010', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('FT02-0022', 'FT02', 'B010', 'Ready', '2024-12-12', '2027-12-12', 'Main Storage'),
('FT02-0023', 'FT02', 'B010', 'Ready', '2024-05-18', '2027-05-18', 'Main Storage'),
('FT02-0024', 'FT02', 'B010', 'Ready', '2024-10-08', '2027-10-08', 'Main Storage'),
('FT03-0001', 'FT03', 'B001', 'Maintenance', '2025-02-10', '2028-02-10', 'Repair Shop'),
('FT03-0002', 'FT03', 'B001', 'Ready', '2025-04-15', '2028-04-15', 'Main Storage'),
('FT03-0003', 'FT03', 'B001', 'Ready', '2025-06-08', '2028-06-08', 'Main Storage'),
('FT03-0004', 'FT03', 'B001', 'Ready', '2025-06-08', '2028-06-08', 'Main Storage'),
('FT03-0005', 'FT03', 'B001', 'Ready', '2025-08-22', '2028-08-22', 'Main Storage'),
('FT03-0006', 'FT03', 'B001', 'Ready', '2025-08-22', '2028-08-22', 'Main Storage'),
('FT03-0007', 'FT03', 'B001', 'Ready', '2025-08-22', '2028-08-22', 'Main Storage'),
('FT03-0008', 'FT03', 'B001', 'Ready', '2025-08-22', '2028-08-22', 'Main Storage'),
('FT03-0009', 'FT03', 'B002', 'Ready', '2024-01-12', '2027-01-12', 'Main Storage'),
('FT03-0010', 'FT03', 'B002', 'Ready', '2025-07-22', '2028-07-22', 'Main Storage'),
('FT03-0011', 'FT03', 'B002', 'Ready', '2024-12-08', '2027-12-08', 'Main Storage'),
('FT03-0012', 'FT03', 'B002', 'Ready', '2024-07-22', '2027-07-22', 'Main Storage'),
('FT03-0013', 'FT03', 'B002', 'Ready', '2025-02-22', '2028-02-22', 'Main Storage'),
('FT03-0014', 'FT03', 'B002', 'Ready', '2025-02-22', '2028-02-22', 'Main Storage'),
('FT03-0015', 'FT03', 'B002', 'Ready', '2025-02-22', '2028-02-22', 'Main Storage'),
('FT03-0016', 'FT03', 'B002', 'Ready', '2025-02-22', '2028-02-22', 'Main Storage'),
('FT03-0017', 'FT03', 'B003', 'Ready', '2025-01-12', '2028-01-12', 'Main Storage'),
('FT03-0018', 'FT03', 'B003', 'Ready', '2025-04-18', '2028-04-18', 'Main Storage'),
('FT03-0019', 'FT03', 'B003', 'Ready', '2025-04-18', '2028-04-18', 'Main Storage'),
('FT03-0020', 'FT03', 'B003', 'Ready', '2025-11-15', '2028-11-15', 'Main Storage'),
('FT03-0021', 'FT03', 'B003', 'Ready', '2024-12-15', '2027-12-15', 'Main Storage'),
('FT03-0022', 'FT03', 'B003', 'Ready', '2025-11-15', '2028-11-15', 'Main Storage'),
('FT03-0023', 'FT03', 'B003', 'Ready', '2025-11-15', '2028-11-15', 'Main Storage'),
('FT03-0024', 'FT03', 'B003', 'Ready', '2025-11-15', '2028-11-15', 'Main Storage'),
('FT03-0025', 'FT03', 'B004', 'Ready', '2024-01-30', '2027-01-30', 'Main Storage'),
('FT03-0026', 'FT03', 'B004', 'Ready', '2025-04-18', '2028-04-18', 'Main Storage'),
('FT03-0027', 'FT03', 'B004', 'Ready', '2024-12-15', '2027-12-15', 'Main Storage'),
('FT03-0028', 'FT03', 'B004', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FT03-0029', 'FT03', 'B004', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('FT03-0030', 'FT03', 'B004', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('FT03-0031', 'FT03', 'B004', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('FT03-0032', 'FT03', 'B004', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('FT03-0033', 'FT03', 'B005', 'Ready', '2024-12-12', '2027-12-12', 'Main Storage'),
('FT03-0034', 'FT03', 'B005', 'Ready', '2024-05-18', '2027-05-18', 'Main Storage'),
('FT03-0035', 'FT03', 'B005', 'Ready', '2024-10-08', '2027-10-08', 'Main Storage'),
('FT03-0036', 'FT03', 'B005', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FT03-0037', 'FT03', 'B005', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('FT03-0038', 'FT03', 'B005', 'Ready', '2024-11-18', '2027-11-18', 'Main Storage'),
('FT03-0039', 'FT03', 'B005', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FT03-0040', 'FT03', 'B005', 'Ready', '2025-07-22', '2028-07-22', 'Main Storage'),
('FT03-0041', 'FT03', 'B010', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('FT03-0042', 'FT03', 'B010', 'Ready', '2024-12-12', '2027-12-12', 'Main Storage'),
('FT03-0043', 'FT03', 'B010', 'Ready', '2024-05-18', '2027-05-18', 'Main Storage'),
('FT03-0044', 'FT03', 'B010', 'Ready', '2024-10-08', '2027-10-08', 'Main Storage'),
('FT03-0045', 'FT03', 'B010', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FT03-0046', 'FT03', 'B010', 'Ready', '2024-11-18', '2027-11-18', 'Main Storage'),
('FT03-0047', 'FT03', 'B010', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('FT03-0048', 'FT03', 'B010', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('FT04-0001', 'FT04', 'B001', 'Ready', '2025-02-10', '2028-02-10', 'Main Storage'),
('FT04-0002', 'FT04', 'B001', 'Ready', '2025-04-15', '2028-04-15', 'Main Storage'),
('FT04-0003', 'FT04', 'B001', 'Ready', '2025-06-08', '2028-06-08', 'Main Storage'),
('FT04-0004', 'FT04', 'B001', 'Ready', '2025-06-08', '2028-06-08', 'Main Storage'),
('FT04-0005', 'FT04', 'B002', 'Ready', '2024-01-12', '2027-01-12', 'Main Storage'),
('FT04-0006', 'FT04', 'B002', 'Ready', '2024-11-18', '2027-11-18', 'Main Storage'),
('FT04-0007', 'FT04', 'B002', 'Ready', '2024-12-08', '2027-12-08', 'Main Storage'),
('FT04-0008', 'FT04', 'B002', 'Ready', '2024-10-05', '2027-10-05', 'Main Storage'),
('FT04-0009', 'FT04', 'B003', 'Ready', '2025-01-12', '2028-01-12', 'Main Storage'),
('FT04-0010', 'FT04', 'B003', 'Ready', '2025-04-18', '2028-04-18', 'Main Storage'),
('FT04-0011', 'FT04', 'B003', 'Ready', '2024-12-15', '2027-12-15', 'Main Storage'),
('FT04-0012', 'FT04', 'B003', 'Ready', '2025-11-15', '2028-11-15', 'Main Storage'),
('FT04-0013', 'FT04', 'B004', 'Ready', '2024-01-30', '2027-01-30', 'Main Storage'),
('FT04-0014', 'FT04', 'B004', 'Ready', '2025-04-18', '2028-04-18', 'Main Storage'),
('FT04-0015', 'FT04', 'B004', 'Ready', '2024-12-15', '2027-12-15', 'Main Storage'),
('FT04-0016', 'FT04', 'B004', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FT04-0017', 'FT04', 'B005', 'Ready', '2024-12-12', '2027-12-12', 'Main Storage'),
('FT04-0018', 'FT04', 'B005', 'Ready', '2024-05-18', '2027-05-18', 'Main Storage'),
('FT04-0019', 'FT04', 'B005', 'Ready', '2024-12-31', '2027-12-31', 'Main Storage'),
('FT04-0020', 'FT04', 'B005', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('FT04-0021', 'FT04', 'B010', 'Ready', '2025-12-22', '2028-12-22', 'Main Storage'),
('FT04-0022', 'FT04', 'B010', 'Ready', '2024-12-12', '2027-12-12', 'Main Storage'),
('FT04-0023', 'FT04', 'B010', 'Ready', '2024-05-18', '2027-05-18', 'Main Storage'),
('FT04-0024', 'FT04', 'B010', 'Ready', '2024-10-08', '2027-10-08', 'Main Storage'),
('GF01-0001', 'GF01', 'B001', 'Ready', '2024-07-06', '2027-07-06', 'Main Storage'),
('GF01-0002', 'GF01', 'B001', 'Ready', '2025-11-01', '2028-11-01', 'Main Storage'),
('GF01-0003', 'GF01', 'B001', 'Ready', '2025-08-31', '2028-08-31', 'Main Storage'),
('GF01-0004', 'GF01', 'B001', 'Ready', '2023-09-02', '2026-09-02', 'Main Storage'),
('GF01-0005', 'GF01', 'B001', 'Ready', '2025-10-16', '2028-10-16', 'Main Storage'),
('GF01-0006', 'GF01', 'B001', 'Ready', '2023-03-15', '2026-03-15', 'Main Storage'),
('GF01-0007', 'GF01', 'B002', 'Ready', '2024-10-20', '2027-10-20', 'Main Storage'),
('GF01-0008', 'GF01', 'B002', 'Ready', '2024-01-27', '2027-01-27', 'Main Storage'),
('GF01-0009', 'GF01', 'B002', 'Ready', '2024-12-15', '2027-12-15', 'Main Storage'),
('GF01-0010', 'GF01', 'B002', 'Ready', '2023-05-10', '2026-05-10', 'Main Storage'),
('GF01-0011', 'GF01', 'B002', 'Ready', '2023-02-06', '2026-02-06', 'Main Storage'),
('GF01-0012', 'GF01', 'B002', 'Ready', '2025-10-25', '2028-10-25', 'Main Storage'),
('GF01-0013', 'GF01', 'B003', 'Ready', '2025-10-26', '2028-10-26', 'Main Storage'),
('GF01-0014', 'GF01', 'B003', 'Ready', '2023-11-20', '2026-11-20', 'Main Storage'),
('GF01-0015', 'GF01', 'B003', 'Ready', '2024-05-09', '2027-05-09', 'Main Storage'),
('GF01-0016', 'GF01', 'B003', 'Ready', '2024-08-13', '2027-08-13', 'Main Storage'),
('GF01-0017', 'GF01', 'B003', 'Ready', '2023-06-23', '2026-06-23', 'Main Storage'),
('GF01-0018', 'GF01', 'B003', 'Ready', '2025-02-09', '2028-02-09', 'Main Storage'),
('GF01-0019', 'GF01', 'B005', 'Ready', '2025-01-22', '2028-01-22', 'Main Storage'),
('GF01-0020', 'GF01', 'B005', 'Ready', '2025-07-16', '2028-07-16', 'Main Storage'),
('GF01-0021', 'GF01', 'B005', 'Ready', '2024-07-06', '2027-07-06', 'Main Storage'),
('GF01-0022', 'GF01', 'B005', 'Ready', '2023-05-24', '2026-05-24', 'Main Storage'),
('GF01-0023', 'GF01', 'B005', 'Ready', '2024-11-27', '2027-11-27', 'Main Storage'),
('GF01-0024', 'GF01', 'B005', 'Ready', '2025-09-01', '2028-09-01', 'Main Storage'),
('GF01-0025', 'GF01', 'B010', 'Ready', '2023-04-16', '2026-04-16', 'Main Storage'),
('GF01-0026', 'GF01', 'B010', 'Ready', '2023-01-03', '2026-01-03', 'Main Storage'),
('GF01-0027', 'GF01', 'B010', 'Ready', '2023-02-10', '2026-02-10', 'Main Storage'),
('GF01-0028', 'GF01', 'B010', 'Ready', '2023-04-27', '2026-04-27', 'Main Storage'),
('GF01-0029', 'GF01', 'B010', 'Ready', '2023-08-12', '2026-08-12', 'Main Storage'),
('GF01-0030', 'GF01', 'B010', 'Ready', '2024-05-30', '2027-05-30', 'Main Storage'),
('GF01-0031', 'GF01', 'B004', 'Ready', '2024-08-20', '2027-08-20', 'Main Storage'),
('GF01-0032', 'GF01', 'B004', 'Ready', '2024-08-03', '2027-08-03', 'Main Storage'),
('GF01-0033', 'GF01', 'B004', 'Ready', '2024-07-09', '2027-07-09', 'Main Storage'),
('GF01-0034', 'GF01', 'B004', 'Ready', '2024-07-19', '2027-07-19', 'Main Storage'),
('GF01-0035', 'GF01', 'B004', 'Ready', '2023-03-28', '2026-03-27', 'Main Storage'),
('GF01-0036', 'GF01', 'B004', 'Ready', '2023-10-05', '2026-10-04', 'Main Storage'),
('GF02-0001', 'GF02', 'B001', 'Ready', '2023-06-08', '2026-06-08', 'Main Storage'),
('GF02-0002', 'GF02', 'B001', 'Ready', '2025-08-30', '2028-08-30', 'Main Storage'),
('GF02-0003', 'GF02', 'B001', 'Ready', '2025-09-17', '2028-09-17', 'Main Storage'),
('GF02-0004', 'GF02', 'B001', 'Ready', '2025-09-26', '2028-09-26', 'Main Storage'),
('GF02-0005', 'GF02', 'B001', 'Ready', '2024-07-07', '2027-07-07', 'Main Storage'),
('GF02-0006', 'GF02', 'B001', 'Ready', '2024-09-01', '2027-09-01', 'Main Storage'),
('GF02-0007', 'GF02', 'B002', 'Ready', '2025-07-08', '2028-07-08', 'Main Storage'),
('GF02-0008', 'GF02', 'B002', 'Ready', '2024-09-27', '2027-09-27', 'Main Storage'),
('GF02-0009', 'GF02', 'B002', 'Ready', '2024-01-16', '2027-01-16', 'Main Storage'),
('GF02-0010', 'GF02', 'B002', 'Ready', '2024-05-12', '2027-05-12', 'Main Storage'),
('GF02-0011', 'GF02', 'B002', 'Ready', '2023-05-05', '2026-05-05', 'Main Storage'),
('GF02-0012', 'GF02', 'B002', 'Ready', '2023-08-23', '2026-08-23', 'Main Storage'),
('GF02-0013', 'GF02', 'B003', 'Ready', '2025-04-16', '2028-04-16', 'Main Storage'),
('GF02-0014', 'GF02', 'B003', 'Ready', '2023-08-03', '2026-08-03', 'Main Storage'),
('GF02-0015', 'GF02', 'B003', 'Ready', '2023-06-17', '2026-06-17', 'Main Storage'),
('GF02-0016', 'GF02', 'B003', 'Ready', '2025-01-31', '2028-01-31', 'Main Storage'),
('GF02-0017', 'GF02', 'B003', 'Ready', '2023-04-23', '2026-04-23', 'Main Storage'),
('GF02-0018', 'GF02', 'B003', 'Ready', '2024-03-03', '2027-03-03', 'Main Storage'),
('GF02-0019', 'GF02', 'B005', 'Ready', '2024-12-19', '2027-12-19', 'Main Storage'),
('GF02-0020', 'GF02', 'B005', 'Ready', '2023-07-22', '2026-07-22', 'Main Storage'),
('GF02-0021', 'GF02', 'B005', 'Ready', '2023-07-10', '2026-07-10', 'Main Storage'),
('GF02-0022', 'GF02', 'B005', 'Ready', '2025-03-17', '2028-03-17', 'Main Storage'),
('GF02-0023', 'GF02', 'B005', 'Ready', '2023-04-07', '2026-04-07', 'Main Storage'),
('GF02-0024', 'GF02', 'B005', 'Ready', '2025-08-09', '2028-08-09', 'Main Storage'),
('GF02-0025', 'GF02', 'B010', 'Ready', '2024-05-18', '2027-05-18', 'Main Storage'),
('GF02-0026', 'GF02', 'B010', 'Ready', '2023-12-28', '2026-12-28', 'Main Storage'),
('GF02-0027', 'GF02', 'B010', 'Ready', '2025-11-11', '2028-11-11', 'Main Storage'),
('GF02-0028', 'GF02', 'B010', 'Ready', '2024-05-26', '2027-05-26', 'Main Storage'),
('GF02-0029', 'GF02', 'B010', 'Ready', '2025-03-31', '2028-03-31', 'Main Storage'),
('GF02-0030', 'GF02', 'B010', 'Ready', '2023-12-08', '2026-12-08', 'Main Storage'),
('GF02-0031', 'GF02', 'B004', 'Ready', '2023-11-20', '2026-11-19', 'Main Storage'),
('GF02-0032', 'GF02', 'B004', 'Ready', '2025-08-09', '2028-08-08', 'Main Storage'),
('GF02-0033', 'GF02', 'B004', 'Ready', '2024-02-08', '2027-02-07', 'Main Storage'),
('GF02-0034', 'GF02', 'B004', 'Ready', '2023-10-22', '2026-10-21', 'Main Storage'),
('GF02-0035', 'GF02', 'B004', 'Ready', '2024-11-10', '2027-11-10', 'Main Storage'),
('GF02-0036', 'GF02', 'B004', 'Ready', '2024-05-01', '2027-05-01', 'Main Storage'),
('GF03-0001', 'GF03', 'B001', 'Ready', '2024-08-08', '2027-08-08', 'Main Storage'),
('GF03-0002', 'GF03', 'B001', 'Ready', '2024-11-26', '2027-11-26', 'Main Storage'),
('GF03-0003', 'GF03', 'B001', 'Ready', '2023-01-05', '2026-01-05', 'Main Storage'),
('GF03-0004', 'GF03', 'B001', 'Ready', '2025-09-30', '2028-09-30', 'Main Storage'),
('GF03-0005', 'GF03', 'B001', 'Ready', '2024-11-09', '2027-11-09', 'Main Storage'),
('GF03-0006', 'GF03', 'B001', 'Ready', '2024-04-10', '2027-04-10', 'Main Storage'),
('GF03-0007', 'GF03', 'B002', 'Ready', '2023-08-14', '2026-08-14', 'Main Storage'),
('GF03-0008', 'GF03', 'B002', 'Ready', '2024-02-28', '2027-02-28', 'Main Storage'),
('GF03-0009', 'GF03', 'B002', 'Ready', '2024-05-07', '2027-05-07', 'Main Storage'),
('GF03-0010', 'GF03', 'B002', 'Ready', '2023-01-16', '2026-01-16', 'Main Storage'),
('GF03-0011', 'GF03', 'B002', 'Ready', '2023-10-12', '2026-10-12', 'Main Storage'),
('GF03-0012', 'GF03', 'B002', 'Ready', '2023-03-15', '2026-03-15', 'Main Storage'),
('GF03-0013', 'GF03', 'B003', 'Ready', '2024-12-03', '2027-12-03', 'Main Storage'),
('GF03-0014', 'GF03', 'B003', 'Ready', '2023-12-30', '2026-12-30', 'Main Storage'),
('GF03-0015', 'GF03', 'B003', 'Ready', '2023-01-13', '2026-01-13', 'Main Storage'),
('GF03-0016', 'GF03', 'B003', 'Ready', '2023-02-03', '2026-02-03', 'Main Storage'),
('GF03-0017', 'GF03', 'B003', 'Ready', '2023-04-06', '2026-04-06', 'Main Storage'),
('GF03-0018', 'GF03', 'B003', 'Ready', '2024-07-19', '2027-07-19', 'Main Storage'),
('GF03-0019', 'GF03', 'B005', 'Ready', '2025-10-22', '2028-10-22', 'Main Storage'),
('GF03-0020', 'GF03', 'B005', 'Ready', '2025-07-13', '2028-07-13', 'Main Storage'),
('GF03-0021', 'GF03', 'B005', 'Ready', '2023-05-05', '2026-05-05', 'Main Storage'),
('GF03-0022', 'GF03', 'B005', 'Ready', '2024-02-20', '2027-02-20', 'Main Storage'),
('GF03-0023', 'GF03', 'B005', 'Ready', '2024-01-25', '2027-01-25', 'Main Storage'),
('GF03-0024', 'GF03', 'B005', 'Ready', '2024-12-14', '2027-12-14', 'Main Storage'),
('GF03-0025', 'GF03', 'B010', 'Ready', '2024-07-01', '2027-07-01', 'Main Storage'),
('GF03-0026', 'GF03', 'B010', 'Ready', '2023-07-16', '2026-07-16', 'Main Storage'),
('GF03-0027', 'GF03', 'B010', 'Ready', '2024-09-09', '2027-09-09', 'Main Storage'),
('GF03-0028', 'GF03', 'B010', 'Ready', '2023-05-18', '2026-05-18', 'Main Storage'),
('GF03-0029', 'GF03', 'B010', 'Ready', '2024-08-10', '2027-08-10', 'Main Storage'),
('GF03-0030', 'GF03', 'B010', 'Ready', '2023-09-22', '2026-09-22', 'Main Storage'),
('GF03-0031', 'GF03', 'B004', 'Ready', '2025-08-19', '2028-08-18', 'Main Storage'),
('GF03-0032', 'GF03', 'B004', 'Ready', '2024-04-27', '2027-04-27', 'Main Storage'),
('GF03-0033', 'GF03', 'B004', 'Ready', '2024-09-29', '2027-09-29', 'Main Storage'),
('GF03-0034', 'GF03', 'B004', 'Ready', '2023-01-30', '2026-01-29', 'Main Storage'),
('GF03-0035', 'GF03', 'B004', 'Ready', '2024-06-17', '2027-06-17', 'Main Storage'),
('GF03-0036', 'GF03', 'B004', 'Ready', '2023-03-23', '2026-03-22', 'Main Storage'),
('PP01-0001', 'PP01', 'B001', 'Ready', '2023-11-25', '2026-11-25', 'Main Storage'),
('PP01-0002', 'PP01', 'B001', 'Ready', '2024-06-10', '2027-06-10', 'Main Storage'),
('PP01-0003', 'PP01', 'B001', 'Ready', '2023-09-24', '2026-09-24', 'Main Storage'),
('PP01-0004', 'PP01', 'B001', 'Ready', '2023-04-13', '2026-04-13', 'Main Storage'),
('PP01-0005', 'PP01', 'B001', 'Ready', '2024-11-21', '2027-11-21', 'Main Storage'),
('PP01-0006', 'PP01', 'B001', 'Ready', '2025-02-09', '2028-02-09', 'Main Storage'),
('PP01-0007', 'PP01', 'B001', 'Ready', '2025-08-23', '2028-08-23', 'Main Storage'),
('PP01-0008', 'PP01', 'B001', 'Ready', '2023-02-08', '2026-02-08', 'Main Storage'),
('PP01-0009', 'PP01', 'B001', 'Ready', '2025-02-01', '2028-02-01', 'Main Storage'),
('PP01-0010', 'PP01', 'B001', 'Ready', '2025-02-04', '2028-02-04', 'Main Storage'),
('PP01-0011', 'PP01', 'B002', 'Ready', '2025-08-10', '2028-08-10', 'Main Storage'),
('PP01-0012', 'PP01', 'B002', 'Ready', '2025-08-15', '2028-08-15', 'Main Storage'),
('PP01-0013', 'PP01', 'B002', 'Ready', '2025-06-30', '2028-06-30', 'Main Storage'),
('PP01-0014', 'PP01', 'B002', 'Ready', '2023-01-20', '2026-01-20', 'Main Storage'),
('PP01-0015', 'PP01', 'B002', 'Ready', '2023-11-01', '2026-11-01', 'Main Storage'),
('PP01-0016', 'PP01', 'B002', 'Ready', '2023-10-29', '2026-10-29', 'Main Storage'),
('PP01-0017', 'PP01', 'B002', 'Ready', '2024-11-20', '2027-11-20', 'Main Storage'),
('PP01-0018', 'PP01', 'B002', 'Ready', '2025-11-19', '2028-11-19', 'Main Storage'),
('PP01-0019', 'PP01', 'B002', 'Ready', '2024-12-23', '2027-12-23', 'Main Storage'),
('PP01-0020', 'PP01', 'B002', 'Ready', '2023-03-19', '2026-03-19', 'Main Storage'),
('PP01-0021', 'PP01', 'B003', 'Ready', '2023-02-28', '2026-02-28', 'Main Storage'),
('PP01-0022', 'PP01', 'B003', 'Ready', '2025-10-01', '2028-10-01', 'Main Storage'),
('PP01-0023', 'PP01', 'B003', 'Ready', '2025-03-18', '2028-03-18', 'Main Storage'),
('PP01-0024', 'PP01', 'B003', 'Ready', '2023-09-03', '2026-09-03', 'Main Storage'),
('PP01-0025', 'PP01', 'B003', 'Ready', '2023-07-17', '2026-07-17', 'Main Storage'),
('PP01-0026', 'PP01', 'B003', 'Ready', '2024-12-16', '2027-12-16', 'Main Storage'),
('PP01-0027', 'PP01', 'B003', 'Ready', '2023-07-30', '2026-07-30', 'Main Storage'),
('PP01-0028', 'PP01', 'B003', 'Ready', '2025-08-10', '2028-08-10', 'Main Storage'),
('PP01-0029', 'PP01', 'B003', 'Ready', '2024-05-28', '2027-05-28', 'Main Storage'),
('PP01-0030', 'PP01', 'B003', 'Ready', '2024-09-22', '2027-09-22', 'Main Storage'),
('PP01-0031', 'PP01', 'B005', 'Ready', '2023-07-16', '2026-07-16', 'Main Storage'),
('PP01-0032', 'PP01', 'B005', 'Ready', '2023-03-04', '2026-03-04', 'Main Storage'),
('PP01-0033', 'PP01', 'B005', 'Ready', '2023-12-05', '2026-12-05', 'Main Storage'),
('PP01-0034', 'PP01', 'B005', 'Ready', '2024-02-10', '2027-02-10', 'Main Storage'),
('PP01-0035', 'PP01', 'B005', 'Ready', '2023-10-03', '2026-10-03', 'Main Storage'),
('PP01-0036', 'PP01', 'B005', 'Ready', '2024-07-05', '2027-07-05', 'Main Storage'),
('PP01-0037', 'PP01', 'B005', 'Ready', '2025-06-15', '2028-06-15', 'Main Storage'),
('PP01-0038', 'PP01', 'B005', 'Ready', '2023-04-03', '2026-04-03', 'Main Storage'),
('PP01-0039', 'PP01', 'B005', 'Ready', '2025-06-03', '2028-06-03', 'Main Storage'),
('PP01-0040', 'PP01', 'B005', 'Ready', '2025-11-13', '2028-11-13', 'Main Storage'),
('PP01-0041', 'PP01', 'B010', 'Ready', '2023-10-14', '2026-10-14', 'Main Storage'),
('PP01-0042', 'PP01', 'B010', 'Ready', '2023-06-26', '2026-06-26', 'Main Storage'),
('PP01-0043', 'PP01', 'B010', 'Ready', '2023-06-26', '2026-06-26', 'Main Storage'),
('PP01-0044', 'PP01', 'B010', 'Ready', '2025-01-15', '2028-01-15', 'Main Storage'),
('PP01-0045', 'PP01', 'B010', 'Ready', '2025-10-05', '2028-10-05', 'Main Storage'),
('PP01-0046', 'PP01', 'B010', 'Ready', '2024-11-20', '2027-11-20', 'Main Storage'),
('PP01-0047', 'PP01', 'B010', 'Ready', '2025-06-12', '2028-06-12', 'Main Storage'),
('PP01-0048', 'PP01', 'B010', 'Ready', '2024-12-10', '2027-12-10', 'Main Storage'),
('PP01-0049', 'PP01', 'B010', 'Ready', '2025-02-23', '2028-02-23', 'Main Storage'),
('PP01-0050', 'PP01', 'B010', 'Ready', '2024-07-22', '2027-07-22', 'Main Storage'),
('PP01-0051', 'PP01', 'B004', 'Ready', '2023-09-18', '2026-09-17', 'Main Storage'),
('PP01-0052', 'PP01', 'B004', 'Ready', '2025-03-15', '2028-03-14', 'Main Storage'),
('PP01-0053', 'PP01', 'B004', 'Ready', '2025-03-31', '2028-03-30', 'Main Storage'),
('PP01-0054', 'PP01', 'B004', 'Ready', '2023-04-27', '2026-04-26', 'Main Storage'),
('PP01-0055', 'PP01', 'B004', 'Ready', '2025-11-04', '2028-11-03', 'Main Storage'),
('PP01-0056', 'PP01', 'B004', 'Ready', '2025-10-05', '2028-10-04', 'Main Storage'),
('PP01-0057', 'PP01', 'B004', 'Ready', '2023-02-11', '2026-02-10', 'Main Storage'),
('PP01-0058', 'PP01', 'B004', 'Ready', '2023-08-24', '2026-08-23', 'Main Storage'),
('PP01-0059', 'PP01', 'B004', 'Ready', '2023-08-09', '2026-08-08', 'Main Storage'),
('PP01-0060', 'PP01', 'B004', 'Ready', '2024-12-21', '2027-12-21', 'Main Storage'),
('PP02-0001', 'PP02', 'B001', 'Ready', '2024-04-27', '2027-04-27', 'Main Storage'),
('PP02-0002', 'PP02', 'B001', 'Ready', '2024-09-28', '2027-09-28', 'Main Storage'),
('PP02-0003', 'PP02', 'B001', 'Ready', '2023-06-17', '2026-06-17', 'Main Storage'),
('PP02-0004', 'PP02', 'B002', 'Ready', '2025-10-21', '2028-10-21', 'Main Storage'),
('PP02-0005', 'PP02', 'B002', 'Ready', '2025-12-23', '2028-12-23', 'Main Storage'),
('PP02-0006', 'PP02', 'B002', 'Ready', '2025-04-26', '2028-04-26', 'Main Storage'),
('PP02-0007', 'PP02', 'B003', 'Ready', '2024-04-16', '2027-04-16', 'Main Storage'),
('PP02-0008', 'PP02', 'B003', 'Ready', '2025-04-28', '2028-04-28', 'Main Storage'),
('PP02-0009', 'PP02', 'B003', 'Ready', '2023-10-21', '2026-10-21', 'Main Storage'),
('PP02-0010', 'PP02', 'B005', 'Ready', '2024-01-26', '2027-01-26', 'Main Storage'),
('PP02-0011', 'PP02', 'B005', 'Ready', '2024-03-16', '2027-03-16', 'Main Storage'),
('PP02-0012', 'PP02', 'B005', 'Ready', '2025-11-18', '2028-11-18', 'Main Storage'),
('PP02-0013', 'PP02', 'B010', 'Ready', '2025-02-23', '2028-02-23', 'Main Storage'),
('PP02-0014', 'PP02', 'B010', 'Ready', '2024-06-05', '2027-06-05', 'Main Storage'),
('PP02-0015', 'PP02', 'B010', 'Ready', '2024-05-13', '2027-05-13', 'Main Storage'),
('PP02-0016', 'PP02', 'B004', 'Ready', '2024-09-27', '2027-09-27', 'Main Storage'),
('PP02-0017', 'PP02', 'B004', 'Ready', '2025-12-14', '2028-12-13', 'Main Storage'),
('PP02-0018', 'PP02', 'B004', 'Ready', '2023-01-18', '2026-01-17', 'Main Storage'),
('PP03-0001', 'PP03', 'B001', 'Ready', '2024-06-13', '2027-06-13', 'Main Storage'),
('PP03-0002', 'PP03', 'B001', 'Ready', '2024-07-08', '2027-07-08', 'Main Storage'),
('PP03-0003', 'PP03', 'B002', 'Ready', '2024-02-01', '2027-02-01', 'Main Storage'),
('PP03-0004', 'PP03', 'B002', 'Ready', '2023-08-28', '2026-08-28', 'Main Storage'),
('PP03-0005', 'PP03', 'B003', 'Ready', '2023-10-31', '2026-10-31', 'Main Storage'),
('PP03-0006', 'PP03', 'B003', 'Ready', '2025-05-25', '2028-05-25', 'Main Storage'),
('PP03-0007', 'PP03', 'B005', 'Ready', '2025-06-11', '2028-06-11', 'Main Storage'),
('PP03-0008', 'PP03', 'B005', 'Ready', '2023-07-11', '2026-07-11', 'Main Storage'),
('PP03-0009', 'PP03', 'B010', 'Ready', '2023-09-11', '2026-09-11', 'Main Storage'),
('PP03-0010', 'PP03', 'B010', 'Ready', '2023-12-07', '2026-12-07', 'Main Storage'),
('PP03-0011', 'PP03', 'B004', 'Ready', '2023-07-08', '2026-07-07', 'Main Storage'),
('PP03-0012', 'PP03', 'B004', 'Ready', '2025-11-15', '2028-11-14', 'Main Storage'),
('PP04-0001', 'PP04', 'B001', 'Ready', '2024-09-28', '2027-09-28', 'Main Storage'),
('PP04-0002', 'PP04', 'B001', 'Ready', '2025-10-09', '2028-10-09', 'Main Storage'),
('PP04-0003', 'PP04', 'B001', 'Ready', '2025-02-05', '2028-02-05', 'Main Storage'),
('PP04-0004', 'PP04', 'B001', 'Ready', '2023-11-29', '2026-11-29', 'Main Storage'),
('PP04-0005', 'PP04', 'B001', 'Ready', '2023-09-29', '2026-09-29', 'Main Storage'),
('PP04-0006', 'PP04', 'B001', 'Ready', '2024-09-09', '2027-09-09', 'Main Storage'),
('PP04-0007', 'PP04', 'B002', 'Ready', '2024-07-14', '2027-07-14', 'Main Storage'),
('PP04-0008', 'PP04', 'B002', 'Ready', '2023-04-08', '2026-04-08', 'Main Storage'),
('PP04-0009', 'PP04', 'B002', 'Ready', '2025-04-17', '2028-04-17', 'Main Storage'),
('PP04-0010', 'PP04', 'B002', 'Ready', '2024-02-25', '2027-02-25', 'Main Storage'),
('PP04-0011', 'PP04', 'B002', 'Ready', '2025-01-05', '2028-01-05', 'Main Storage'),
('PP04-0012', 'PP04', 'B002', 'Ready', '2023-07-24', '2026-07-24', 'Main Storage'),
('PP04-0013', 'PP04', 'B003', 'Ready', '2025-01-05', '2028-01-05', 'Main Storage'),
('PP04-0014', 'PP04', 'B003', 'Ready', '2023-03-04', '2026-03-04', 'Main Storage'),
('PP04-0015', 'PP04', 'B003', 'Ready', '2025-12-25', '2028-12-25', 'Main Storage'),
('PP04-0016', 'PP04', 'B003', 'Ready', '2025-04-19', '2028-04-19', 'Main Storage'),
('PP04-0017', 'PP04', 'B003', 'Ready', '2024-06-16', '2027-06-16', 'Main Storage'),
('PP04-0018', 'PP04', 'B003', 'Ready', '2025-02-21', '2028-02-21', 'Main Storage'),
('PP04-0019', 'PP04', 'B005', 'Ready', '2025-07-19', '2028-07-19', 'Main Storage'),
('PP04-0020', 'PP04', 'B005', 'Ready', '2024-10-07', '2027-10-07', 'Main Storage'),
('PP04-0021', 'PP04', 'B005', 'Ready', '2023-08-31', '2026-08-31', 'Main Storage'),
('PP04-0022', 'PP04', 'B005', 'Ready', '2024-03-07', '2027-03-07', 'Main Storage'),
('PP04-0023', 'PP04', 'B005', 'Ready', '2023-01-31', '2026-01-31', 'Main Storage'),
('PP04-0024', 'PP04', 'B005', 'Ready', '2024-10-13', '2027-10-13', 'Main Storage'),
('PP04-0025', 'PP04', 'B010', 'Ready', '2024-10-07', '2027-10-07', 'Main Storage'),
('PP04-0026', 'PP04', 'B010', 'Ready', '2025-06-07', '2028-06-07', 'Main Storage'),
('PP04-0027', 'PP04', 'B010', 'Ready', '2025-11-09', '2028-11-09', 'Main Storage'),
('PP04-0028', 'PP04', 'B010', 'Ready', '2024-09-17', '2027-09-17', 'Main Storage'),
('PP04-0029', 'PP04', 'B010', 'Ready', '2023-10-22', '2026-10-22', 'Main Storage'),
('PP04-0030', 'PP04', 'B010', 'Ready', '2023-03-26', '2026-03-26', 'Main Storage'),
('PP04-0031', 'PP04', 'B004', 'Ready', '2024-10-12', '2027-10-12', 'Main Storage'),
('PP04-0032', 'PP04', 'B004', 'Ready', '2025-05-12', '2028-05-11', 'Main Storage'),
('PP04-0033', 'PP04', 'B004', 'Ready', '2023-01-03', '2026-01-02', 'Main Storage'),
('PP04-0034', 'PP04', 'B004', 'Ready', '2023-01-08', '2026-01-07', 'Main Storage'),
('PP04-0035', 'PP04', 'B004', 'Ready', '2025-05-04', '2028-05-03', 'Main Storage'),
('PP04-0036', 'PP04', 'B004', 'Ready', '2025-11-01', '2028-10-31', 'Main Storage'),
('PT01-0001', 'PT01', 'B001', 'Ready', '2023-10-07', '2026-10-07', 'Main Storage'),
('PT01-0002', 'PT01', 'B001', 'Ready', '2025-06-22', '2028-06-22', 'Main Storage'),
('PT01-0003', 'PT01', 'B001', 'Ready', '2023-07-21', '2026-07-21', 'Main Storage'),
('PT01-0004', 'PT01', 'B001', 'Ready', '2024-05-19', '2027-05-19', 'Main Storage'),
('PT01-0005', 'PT01', 'B001', 'Ready', '2025-04-23', '2028-04-23', 'Main Storage'),
('PT01-0006', 'PT01', 'B001', 'Ready', '2024-02-29', '2027-02-28', 'Main Storage'),
('PT01-0007', 'PT01', 'B002', 'Ready', '2023-07-28', '2026-07-28', 'Main Storage'),
('PT01-0008', 'PT01', 'B002', 'Ready', '2023-06-10', '2026-06-10', 'Main Storage'),
('PT01-0009', 'PT01', 'B002', 'Ready', '2023-01-24', '2026-01-24', 'Main Storage'),
('PT01-0010', 'PT01', 'B002', 'Ready', '2023-02-15', '2026-02-15', 'Main Storage'),
('PT01-0011', 'PT01', 'B002', 'Ready', '2024-12-08', '2027-12-08', 'Main Storage'),
('PT01-0012', 'PT01', 'B002', 'Ready', '2025-05-29', '2028-05-29', 'Main Storage'),
('PT01-0013', 'PT01', 'B003', 'Ready', '2025-08-25', '2028-08-25', 'Main Storage'),
('PT01-0014', 'PT01', 'B003', 'Ready', '2024-10-13', '2027-10-13', 'Main Storage'),
('PT01-0015', 'PT01', 'B003', 'Ready', '2023-11-28', '2026-11-28', 'Main Storage'),
('PT01-0016', 'PT01', 'B003', 'Ready', '2025-04-02', '2028-04-02', 'Main Storage'),
('PT01-0017', 'PT01', 'B003', 'Ready', '2023-05-18', '2026-05-18', 'Main Storage'),
('PT01-0018', 'PT01', 'B003', 'Ready', '2025-11-25', '2028-11-25', 'Main Storage'),
('PT01-0019', 'PT01', 'B005', 'Ready', '2023-12-14', '2026-12-14', 'Main Storage'),
('PT01-0020', 'PT01', 'B005', 'Ready', '2025-03-14', '2028-03-14', 'Main Storage'),
('PT01-0021', 'PT01', 'B005', 'Ready', '2025-04-03', '2028-04-03', 'Main Storage'),
('PT01-0022', 'PT01', 'B005', 'Ready', '2023-04-25', '2026-04-25', 'Main Storage'),
('PT01-0023', 'PT01', 'B005', 'Ready', '2024-07-15', '2027-07-15', 'Main Storage'),
('PT01-0024', 'PT01', 'B005', 'Ready', '2023-03-15', '2026-03-15', 'Main Storage'),
('PT01-0025', 'PT01', 'B010', 'Ready', '2025-06-25', '2028-06-25', 'Main Storage'),
('PT01-0026', 'PT01', 'B010', 'Ready', '2025-07-31', '2028-07-31', 'Main Storage'),
('PT01-0027', 'PT01', 'B010', 'Ready', '2023-10-06', '2026-10-06', 'Main Storage'),
('PT01-0028', 'PT01', 'B010', 'Ready', '2023-05-26', '2026-05-26', 'Main Storage'),
('PT01-0029', 'PT01', 'B010', 'Ready', '2024-01-15', '2027-01-15', 'Main Storage'),
('PT01-0030', 'PT01', 'B010', 'Ready', '2023-05-27', '2026-05-27', 'Main Storage'),
('PT01-0031', 'PT01', 'B004', 'Ready', '2023-02-27', '2026-02-26', 'Main Storage');
INSERT INTO `equipment_instances` (`instance_code`, `equipment_id`, `branch_id`, `status`, `received_date`, `expiry_date`, `current_location`) VALUES
('PT01-0032', 'PT01', 'B004', 'Ready', '2025-08-09', '2028-08-08', 'Main Storage'),
('PT01-0033', 'PT01', 'B004', 'Ready', '2024-11-18', '2027-11-18', 'Main Storage'),
('PT01-0034', 'PT01', 'B004', 'Ready', '2024-07-07', '2027-07-07', 'Main Storage'),
('PT01-0035', 'PT01', 'B004', 'Ready', '2024-07-21', '2027-07-21', 'Main Storage'),
('PT01-0036', 'PT01', 'B004', 'Ready', '2025-12-21', '2028-12-20', 'Main Storage'),
('PT02-0001', 'PT02', 'B001', 'Ready', '2023-09-05', '2026-09-05', 'Main Storage'),
('PT02-0002', 'PT02', 'B001', 'Ready', '2023-01-21', '2026-01-21', 'Main Storage'),
('PT02-0003', 'PT02', 'B001', 'Ready', '2023-10-03', '2026-10-03', 'Main Storage'),
('PT02-0004', 'PT02', 'B002', 'Ready', '2024-05-16', '2027-05-16', 'Main Storage'),
('PT02-0005', 'PT02', 'B002', 'Ready', '2024-07-10', '2027-07-10', 'Main Storage'),
('PT02-0006', 'PT02', 'B002', 'Ready', '2024-02-05', '2027-02-05', 'Main Storage'),
('PT02-0007', 'PT02', 'B003', 'Ready', '2025-10-16', '2028-10-16', 'Main Storage'),
('PT02-0008', 'PT02', 'B003', 'Ready', '2023-07-16', '2026-07-16', 'Main Storage'),
('PT02-0009', 'PT02', 'B003', 'Ready', '2024-11-29', '2027-11-29', 'Main Storage'),
('PT02-0010', 'PT02', 'B005', 'Ready', '2025-03-18', '2028-03-18', 'Main Storage'),
('PT02-0011', 'PT02', 'B005', 'Ready', '2024-10-29', '2027-10-29', 'Main Storage'),
('PT02-0012', 'PT02', 'B005', 'Ready', '2023-02-02', '2026-02-02', 'Main Storage'),
('PT02-0013', 'PT02', 'B010', 'Ready', '2025-09-26', '2028-09-26', 'Main Storage'),
('PT02-0014', 'PT02', 'B010', 'Ready', '2025-05-01', '2028-05-01', 'Main Storage'),
('PT02-0015', 'PT02', 'B010', 'Ready', '2023-11-18', '2026-11-18', 'Main Storage'),
('PT02-0016', 'PT02', 'B004', 'Ready', '2024-12-12', '2027-12-12', 'Main Storage'),
('PT02-0017', 'PT02', 'B004', 'Ready', '2024-10-21', '2027-10-21', 'Main Storage'),
('PT02-0018', 'PT02', 'B004', 'Ready', '2023-07-10', '2026-07-09', 'Main Storage'),
('PT03-0001', 'PT03', 'B001', 'Maintenance', '2024-04-07', '2027-04-07', 'Repair Shop'),
('PT03-0002', 'PT03', 'B001', 'Ready', '2023-09-02', '2026-09-02', 'Main Storage'),
('PT03-0003', 'PT03', 'B001', 'Ready', '2024-05-19', '2027-05-19', 'Main Storage'),
('PT03-0004', 'PT03', 'B002', 'Ready', '2023-09-30', '2026-09-30', 'Main Storage'),
('PT03-0005', 'PT03', 'B002', 'Ready', '2023-10-28', '2026-10-28', 'Main Storage'),
('PT03-0006', 'PT03', 'B002', 'Ready', '2023-03-16', '2026-03-16', 'Main Storage'),
('PT03-0007', 'PT03', 'B003', 'Ready', '2025-05-27', '2028-05-27', 'Main Storage'),
('PT03-0008', 'PT03', 'B003', 'Ready', '2023-02-24', '2026-02-24', 'Main Storage'),
('PT03-0009', 'PT03', 'B003', 'Ready', '2025-01-12', '2028-01-12', 'Main Storage'),
('PT03-0010', 'PT03', 'B005', 'Ready', '2025-02-16', '2028-02-16', 'Main Storage'),
('PT03-0011', 'PT03', 'B005', 'Ready', '2023-03-06', '2026-03-06', 'Main Storage'),
('PT03-0012', 'PT03', 'B005', 'Ready', '2025-02-23', '2028-02-23', 'Main Storage'),
('PT03-0013', 'PT03', 'B010', 'Ready', '2025-05-09', '2028-05-09', 'Main Storage'),
('PT03-0014', 'PT03', 'B010', 'Ready', '2024-05-19', '2027-05-19', 'Main Storage'),
('PT03-0015', 'PT03', 'B010', 'Ready', '2023-09-05', '2026-09-05', 'Main Storage'),
('PT03-0016', 'PT03', 'B004', 'Ready', '2024-06-16', '2027-06-16', 'Main Storage'),
('PT03-0017', 'PT03', 'B004', 'Ready', '2025-10-06', '2028-10-05', 'Main Storage'),
('PT03-0018', 'PT03', 'B004', 'Ready', '2025-01-16', '2028-01-16', 'Main Storage'),
('SW01-0001', 'SW01', 'B001', 'Ready', '2023-03-05', '2026-03-05', 'Main Storage'),
('SW01-0002', 'SW01', 'B001', 'Ready', '2025-08-02', '2028-08-02', 'Main Storage'),
('SW01-0003', 'SW01', 'B001', 'Ready', '2024-10-31', '2027-10-31', 'Main Storage'),
('SW01-0004', 'SW01', 'B001', 'Ready', '2025-06-12', '2028-06-12', 'Main Storage'),
('SW01-0005', 'SW01', 'B001', 'Ready', '2023-08-21', '2026-08-21', 'Main Storage'),
('SW01-0006', 'SW01', 'B001', 'Ready', '2024-05-24', '2027-05-24', 'Main Storage'),
('SW01-0007', 'SW01', 'B001', 'Ready', '2025-10-08', '2028-10-08', 'Main Storage'),
('SW01-0008', 'SW01', 'B001', 'Ready', '2024-08-12', '2027-08-12', 'Main Storage'),
('SW01-0009', 'SW01', 'B001', 'Ready', '2023-04-08', '2026-04-08', 'Main Storage'),
('SW01-0010', 'SW01', 'B001', 'Ready', '2023-03-25', '2026-03-25', 'Main Storage'),
('SW01-0011', 'SW01', 'B002', 'Ready', '2023-01-30', '2026-01-30', 'Main Storage'),
('SW01-0012', 'SW01', 'B002', 'Ready', '2023-12-18', '2026-12-18', 'Main Storage'),
('SW01-0013', 'SW01', 'B002', 'Ready', '2024-07-13', '2027-07-13', 'Main Storage'),
('SW01-0014', 'SW01', 'B002', 'Ready', '2024-08-14', '2027-08-14', 'Main Storage'),
('SW01-0015', 'SW01', 'B002', 'Ready', '2023-02-20', '2026-02-20', 'Main Storage'),
('SW01-0016', 'SW01', 'B002', 'Ready', '2024-05-15', '2027-05-15', 'Main Storage'),
('SW01-0017', 'SW01', 'B002', 'Ready', '2023-06-19', '2026-06-19', 'Main Storage'),
('SW01-0018', 'SW01', 'B002', 'Ready', '2025-03-11', '2028-03-11', 'Main Storage'),
('SW01-0019', 'SW01', 'B002', 'Ready', '2025-03-25', '2028-03-25', 'Main Storage'),
('SW01-0020', 'SW01', 'B002', 'Ready', '2024-12-05', '2027-12-05', 'Main Storage'),
('SW01-0021', 'SW01', 'B003', 'Ready', '2024-12-27', '2027-12-27', 'Main Storage'),
('SW01-0022', 'SW01', 'B003', 'Ready', '2025-03-20', '2028-03-20', 'Main Storage'),
('SW01-0023', 'SW01', 'B003', 'Ready', '2023-07-03', '2026-07-03', 'Main Storage'),
('SW01-0024', 'SW01', 'B003', 'Ready', '2023-12-30', '2026-12-30', 'Main Storage'),
('SW01-0025', 'SW01', 'B003', 'Ready', '2025-08-06', '2028-08-06', 'Main Storage'),
('SW01-0026', 'SW01', 'B003', 'Ready', '2023-12-17', '2026-12-17', 'Main Storage'),
('SW01-0027', 'SW01', 'B003', 'Ready', '2024-07-15', '2027-07-15', 'Main Storage'),
('SW01-0028', 'SW01', 'B003', 'Ready', '2023-08-27', '2026-08-27', 'Main Storage'),
('SW01-0029', 'SW01', 'B003', 'Ready', '2024-12-28', '2027-12-28', 'Main Storage'),
('SW01-0030', 'SW01', 'B003', 'Ready', '2024-08-06', '2027-08-06', 'Main Storage'),
('SW01-0031', 'SW01', 'B005', 'Ready', '2024-10-04', '2027-10-04', 'Main Storage'),
('SW01-0032', 'SW01', 'B005', 'Ready', '2025-02-27', '2028-02-27', 'Main Storage'),
('SW01-0033', 'SW01', 'B005', 'Ready', '2024-08-03', '2027-08-03', 'Main Storage'),
('SW01-0034', 'SW01', 'B005', 'Ready', '2023-09-19', '2026-09-19', 'Main Storage'),
('SW01-0035', 'SW01', 'B005', 'Ready', '2024-10-19', '2027-10-19', 'Main Storage'),
('SW01-0036', 'SW01', 'B005', 'Ready', '2025-11-01', '2028-11-01', 'Main Storage'),
('SW01-0037', 'SW01', 'B005', 'Ready', '2024-01-09', '2027-01-09', 'Main Storage'),
('SW01-0038', 'SW01', 'B005', 'Ready', '2025-05-20', '2028-05-20', 'Main Storage'),
('SW01-0039', 'SW01', 'B005', 'Ready', '2023-07-14', '2026-07-14', 'Main Storage'),
('SW01-0040', 'SW01', 'B005', 'Ready', '2023-01-31', '2026-01-31', 'Main Storage'),
('SW01-0041', 'SW01', 'B010', 'Ready', '2024-12-18', '2027-12-18', 'Main Storage'),
('SW01-0042', 'SW01', 'B010', 'Ready', '2023-04-21', '2026-04-21', 'Main Storage'),
('SW01-0043', 'SW01', 'B010', 'Ready', '2024-04-03', '2027-04-03', 'Main Storage'),
('SW01-0044', 'SW01', 'B010', 'Ready', '2023-07-19', '2026-07-19', 'Main Storage'),
('SW01-0045', 'SW01', 'B010', 'Ready', '2025-11-06', '2028-11-06', 'Main Storage'),
('SW01-0046', 'SW01', 'B010', 'Ready', '2023-02-12', '2026-02-12', 'Main Storage'),
('SW01-0047', 'SW01', 'B010', 'Ready', '2024-11-19', '2027-11-19', 'Main Storage'),
('SW01-0048', 'SW01', 'B010', 'Ready', '2025-11-20', '2028-11-20', 'Main Storage'),
('SW01-0049', 'SW01', 'B010', 'Ready', '2025-06-04', '2028-06-04', 'Main Storage'),
('SW01-0050', 'SW01', 'B010', 'Ready', '2025-11-18', '2028-11-18', 'Main Storage'),
('SW01-0051', 'SW01', 'B004', 'Ready', '2025-01-03', '2028-01-03', 'Main Storage'),
('SW01-0052', 'SW01', 'B004', 'Ready', '2023-01-01', '2025-12-31', 'Main Storage'),
('SW01-0053', 'SW01', 'B004', 'Ready', '2024-09-27', '2027-09-27', 'Main Storage'),
('SW01-0054', 'SW01', 'B004', 'Ready', '2024-05-04', '2027-05-04', 'Main Storage'),
('SW01-0055', 'SW01', 'B004', 'Ready', '2025-01-04', '2028-01-04', 'Main Storage'),
('SW01-0056', 'SW01', 'B004', 'Ready', '2025-09-22', '2028-09-21', 'Main Storage'),
('SW01-0057', 'SW01', 'B004', 'Ready', '2023-06-12', '2026-06-11', 'Main Storage'),
('SW01-0058', 'SW01', 'B004', 'Ready', '2024-06-23', '2027-06-23', 'Main Storage'),
('SW01-0059', 'SW01', 'B004', 'Ready', '2025-03-22', '2028-03-21', 'Main Storage'),
('SW01-0060', 'SW01', 'B004', 'Ready', '2023-09-12', '2026-09-11', 'Main Storage'),
('SW02-0001', 'SW02', 'B001', 'Ready', '2023-07-15', '2026-07-15', 'Main Storage'),
('SW02-0002', 'SW02', 'B001', 'Ready', '2025-12-14', '2028-12-14', 'Main Storage'),
('SW02-0003', 'SW02', 'B001', 'Ready', '2024-04-12', '2027-04-12', 'Main Storage'),
('SW02-0004', 'SW02', 'B001', 'Ready', '2023-01-30', '2026-01-30', 'Main Storage'),
('SW02-0005', 'SW02', 'B001', 'Ready', '2025-10-08', '2028-10-08', 'Main Storage'),
('SW02-0006', 'SW02', 'B001', 'Ready', '2023-07-05', '2026-07-05', 'Main Storage'),
('SW02-0007', 'SW02', 'B002', 'Ready', '2023-12-19', '2026-12-19', 'Main Storage'),
('SW02-0008', 'SW02', 'B002', 'Ready', '2025-04-22', '2028-04-22', 'Main Storage'),
('SW02-0009', 'SW02', 'B002', 'Ready', '2025-01-04', '2028-01-04', 'Main Storage'),
('SW02-0010', 'SW02', 'B002', 'Ready', '2024-10-11', '2027-10-11', 'Main Storage'),
('SW02-0011', 'SW02', 'B002', 'Ready', '2025-10-06', '2028-10-06', 'Main Storage'),
('SW02-0012', 'SW02', 'B002', 'Ready', '2023-11-15', '2026-11-15', 'Main Storage'),
('SW02-0013', 'SW02', 'B003', 'Ready', '2025-11-30', '2028-11-30', 'Main Storage'),
('SW02-0014', 'SW02', 'B003', 'Ready', '2024-10-08', '2027-10-08', 'Main Storage'),
('SW02-0015', 'SW02', 'B003', 'Ready', '2024-07-09', '2027-07-09', 'Main Storage'),
('SW02-0016', 'SW02', 'B003', 'Ready', '2024-06-07', '2027-06-07', 'Main Storage'),
('SW02-0017', 'SW02', 'B003', 'Ready', '2023-10-03', '2026-10-03', 'Main Storage'),
('SW02-0018', 'SW02', 'B003', 'Ready', '2025-10-12', '2028-10-12', 'Main Storage'),
('SW02-0019', 'SW02', 'B005', 'Ready', '2023-05-22', '2026-05-22', 'Main Storage'),
('SW02-0020', 'SW02', 'B005', 'Ready', '2024-09-02', '2027-09-02', 'Main Storage'),
('SW02-0021', 'SW02', 'B005', 'Ready', '2023-01-05', '2026-01-05', 'Main Storage'),
('SW02-0022', 'SW02', 'B005', 'Ready', '2023-09-11', '2026-09-11', 'Main Storage'),
('SW02-0023', 'SW02', 'B005', 'Ready', '2024-11-16', '2027-11-16', 'Main Storage'),
('SW02-0024', 'SW02', 'B005', 'Ready', '2025-08-16', '2028-08-16', 'Main Storage'),
('SW02-0025', 'SW02', 'B010', 'Ready', '2024-10-08', '2027-10-08', 'Main Storage'),
('SW02-0026', 'SW02', 'B010', 'Ready', '2025-12-07', '2028-12-07', 'Main Storage'),
('SW02-0027', 'SW02', 'B010', 'Ready', '2023-07-09', '2026-07-09', 'Main Storage'),
('SW02-0028', 'SW02', 'B010', 'Ready', '2025-07-19', '2028-07-19', 'Main Storage'),
('SW02-0029', 'SW02', 'B010', 'Ready', '2024-02-14', '2027-02-14', 'Main Storage'),
('SW02-0030', 'SW02', 'B010', 'Ready', '2023-06-10', '2026-06-10', 'Main Storage'),
('SW02-0031', 'SW02', 'B004', 'Ready', '2023-06-07', '2026-06-06', 'Main Storage'),
('SW02-0032', 'SW02', 'B004', 'Ready', '2025-07-26', '2028-07-25', 'Main Storage'),
('SW02-0033', 'SW02', 'B004', 'Ready', '2024-03-14', '2027-03-14', 'Main Storage'),
('SW02-0034', 'SW02', 'B004', 'Ready', '2023-01-17', '2026-01-16', 'Main Storage'),
('SW02-0035', 'SW02', 'B004', 'Ready', '2023-06-27', '2026-06-26', 'Main Storage'),
('SW02-0036', 'SW02', 'B004', 'Ready', '2025-01-21', '2028-01-21', 'Main Storage'),
('SW03-0001', 'SW03', 'B001', 'Ready', '2024-12-10', '2027-12-10', 'Main Storage'),
('SW03-0002', 'SW03', 'B001', 'Ready', '2025-07-17', '2028-07-17', 'Main Storage'),
('SW03-0003', 'SW03', 'B001', 'Ready', '2025-05-12', '2028-05-12', 'Main Storage'),
('SW03-0004', 'SW03', 'B001', 'Ready', '2025-12-30', '2028-12-30', 'Main Storage'),
('SW03-0005', 'SW03', 'B001', 'Ready', '2025-05-06', '2028-05-06', 'Main Storage'),
('SW03-0006', 'SW03', 'B001', 'Ready', '2023-10-15', '2026-10-15', 'Main Storage'),
('SW03-0007', 'SW03', 'B001', 'Ready', '2025-11-20', '2028-11-20', 'Main Storage'),
('SW03-0008', 'SW03', 'B001', 'Ready', '2024-08-22', '2027-08-22', 'Main Storage'),
('SW03-0009', 'SW03', 'B001', 'Ready', '2023-08-07', '2026-08-07', 'Main Storage'),
('SW03-0010', 'SW03', 'B001', 'Ready', '2024-08-17', '2027-08-17', 'Main Storage'),
('SW03-0011', 'SW03', 'B002', 'Ready', '2024-04-30', '2027-04-30', 'Main Storage'),
('SW03-0012', 'SW03', 'B002', 'Ready', '2025-12-18', '2028-12-18', 'Main Storage'),
('SW03-0013', 'SW03', 'B002', 'Ready', '2024-04-08', '2027-04-08', 'Main Storage'),
('SW03-0014', 'SW03', 'B002', 'Ready', '2025-11-09', '2028-11-09', 'Main Storage'),
('SW03-0015', 'SW03', 'B002', 'Ready', '2024-06-23', '2027-06-23', 'Main Storage'),
('SW03-0016', 'SW03', 'B002', 'Ready', '2025-12-06', '2028-12-06', 'Main Storage'),
('SW03-0017', 'SW03', 'B002', 'Ready', '2024-09-30', '2027-09-30', 'Main Storage'),
('SW03-0018', 'SW03', 'B002', 'Ready', '2023-05-10', '2026-05-10', 'Main Storage'),
('SW03-0019', 'SW03', 'B002', 'Ready', '2024-02-01', '2027-02-01', 'Main Storage'),
('SW03-0020', 'SW03', 'B002', 'Ready', '2025-04-12', '2028-04-12', 'Main Storage'),
('SW03-0021', 'SW03', 'B003', 'Ready', '2023-10-20', '2026-10-20', 'Main Storage'),
('SW03-0022', 'SW03', 'B003', 'Ready', '2025-12-05', '2028-12-05', 'Main Storage'),
('SW03-0023', 'SW03', 'B003', 'Ready', '2024-01-24', '2027-01-24', 'Main Storage'),
('SW03-0024', 'SW03', 'B003', 'Ready', '2024-09-30', '2027-09-30', 'Main Storage'),
('SW03-0025', 'SW03', 'B003', 'Ready', '2023-01-21', '2026-01-21', 'Main Storage'),
('SW03-0026', 'SW03', 'B003', 'Ready', '2024-08-12', '2027-08-12', 'Main Storage'),
('SW03-0027', 'SW03', 'B003', 'Ready', '2023-03-21', '2026-03-21', 'Main Storage'),
('SW03-0028', 'SW03', 'B003', 'Ready', '2025-11-24', '2028-11-24', 'Main Storage'),
('SW03-0029', 'SW03', 'B003', 'Ready', '2025-10-17', '2028-10-17', 'Main Storage'),
('SW03-0030', 'SW03', 'B003', 'Ready', '2023-11-04', '2026-11-04', 'Main Storage'),
('SW03-0031', 'SW03', 'B005', 'Ready', '2023-09-07', '2026-09-07', 'Main Storage'),
('SW03-0032', 'SW03', 'B005', 'Ready', '2025-01-21', '2028-01-21', 'Main Storage'),
('SW03-0033', 'SW03', 'B005', 'Ready', '2024-06-14', '2027-06-14', 'Main Storage'),
('SW03-0034', 'SW03', 'B005', 'Ready', '2023-11-18', '2026-11-18', 'Main Storage'),
('SW03-0035', 'SW03', 'B005', 'Ready', '2024-01-04', '2027-01-04', 'Main Storage'),
('SW03-0036', 'SW03', 'B005', 'Ready', '2024-06-23', '2027-06-23', 'Main Storage'),
('SW03-0037', 'SW03', 'B005', 'Ready', '2025-06-29', '2028-06-29', 'Main Storage'),
('SW03-0038', 'SW03', 'B005', 'Ready', '2023-06-15', '2026-06-15', 'Main Storage'),
('SW03-0039', 'SW03', 'B005', 'Ready', '2023-01-23', '2026-01-23', 'Main Storage'),
('SW03-0040', 'SW03', 'B005', 'Ready', '2023-10-19', '2026-10-19', 'Main Storage'),
('SW03-0041', 'SW03', 'B010', 'Ready', '2024-02-05', '2027-02-05', 'Main Storage'),
('SW03-0042', 'SW03', 'B010', 'Ready', '2025-12-24', '2028-12-24', 'Main Storage'),
('SW03-0043', 'SW03', 'B010', 'Ready', '2025-06-04', '2028-06-04', 'Main Storage'),
('SW03-0044', 'SW03', 'B010', 'Ready', '2023-12-11', '2026-12-11', 'Main Storage'),
('SW03-0045', 'SW03', 'B010', 'Ready', '2024-01-10', '2027-01-10', 'Main Storage'),
('SW03-0046', 'SW03', 'B010', 'Ready', '2023-10-28', '2026-10-28', 'Main Storage'),
('SW03-0047', 'SW03', 'B010', 'Ready', '2024-11-21', '2027-11-21', 'Main Storage'),
('SW03-0048', 'SW03', 'B010', 'Ready', '2025-06-19', '2028-06-19', 'Main Storage'),
('SW03-0049', 'SW03', 'B010', 'Ready', '2023-03-28', '2026-03-28', 'Main Storage'),
('SW03-0050', 'SW03', 'B010', 'Ready', '2023-02-19', '2026-02-19', 'Main Storage'),
('SW03-0051', 'SW03', 'B004', 'Ready', '2023-04-12', '2026-04-11', 'Main Storage'),
('SW03-0052', 'SW03', 'B004', 'Ready', '2024-09-02', '2027-09-02', 'Main Storage'),
('SW03-0053', 'SW03', 'B004', 'Ready', '2025-03-30', '2028-03-29', 'Main Storage'),
('SW03-0054', 'SW03', 'B004', 'Ready', '2024-04-03', '2027-04-03', 'Main Storage'),
('SW03-0055', 'SW03', 'B004', 'Ready', '2025-05-31', '2028-05-30', 'Main Storage'),
('SW03-0056', 'SW03', 'B004', 'Ready', '2023-07-03', '2026-07-02', 'Main Storage'),
('SW03-0057', 'SW03', 'B004', 'Ready', '2025-03-14', '2028-03-13', 'Main Storage'),
('SW03-0058', 'SW03', 'B004', 'Ready', '2025-05-14', '2028-05-13', 'Main Storage'),
('SW03-0059', 'SW03', 'B004', 'Ready', '2023-09-01', '2026-08-31', 'Main Storage'),
('SW03-0060', 'SW03', 'B004', 'Ready', '2024-06-23', '2027-06-23', 'Main Storage'),
('TK01-0001', 'TK01', 'B001', 'Ready', '2023-10-02', '2026-10-02', 'Main Storage'),
('TK01-0002', 'TK01', 'B001', 'Ready', '2025-04-30', '2028-04-30', 'Main Storage'),
('TK01-0003', 'TK01', 'B001', 'Ready', '2023-02-17', '2026-02-17', 'Main Storage'),
('TK01-0004', 'TK01', 'B001', 'Ready', '2024-12-14', '2027-12-14', 'Main Storage'),
('TK01-0005', 'TK01', 'B001', 'Ready', '2024-10-23', '2027-10-23', 'Main Storage'),
('TK01-0006', 'TK01', 'B001', 'Ready', '2024-05-23', '2027-05-23', 'Main Storage'),
('TK01-0007', 'TK01', 'B001', 'Ready', '2024-12-08', '2027-12-08', 'Main Storage'),
('TK01-0008', 'TK01', 'B001', 'Ready', '2023-09-10', '2026-09-10', 'Main Storage'),
('TK01-0009', 'TK01', 'B002', 'Ready', '2025-11-05', '2028-11-05', 'Main Storage'),
('TK01-0010', 'TK01', 'B002', 'Ready', '2024-04-02', '2027-04-02', 'Main Storage'),
('TK01-0011', 'TK01', 'B002', 'Ready', '2023-11-22', '2026-11-22', 'Main Storage'),
('TK01-0012', 'TK01', 'B002', 'Ready', '2025-09-20', '2028-09-20', 'Main Storage'),
('TK01-0013', 'TK01', 'B002', 'Ready', '2023-08-25', '2026-08-25', 'Main Storage'),
('TK01-0014', 'TK01', 'B002', 'Ready', '2024-02-14', '2027-02-14', 'Main Storage'),
('TK01-0015', 'TK01', 'B002', 'Ready', '2025-05-03', '2028-05-03', 'Main Storage'),
('TK01-0016', 'TK01', 'B002', 'Ready', '2025-01-29', '2028-01-29', 'Main Storage'),
('TK01-0017', 'TK01', 'B003', 'Ready', '2024-04-15', '2027-04-15', 'Main Storage'),
('TK01-0018', 'TK01', 'B003', 'Ready', '2024-07-16', '2027-07-16', 'Main Storage'),
('TK01-0019', 'TK01', 'B003', 'Ready', '2025-07-28', '2028-07-28', 'Main Storage'),
('TK01-0020', 'TK01', 'B003', 'Ready', '2024-11-15', '2027-11-15', 'Main Storage'),
('TK01-0021', 'TK01', 'B003', 'Ready', '2024-07-01', '2027-07-01', 'Main Storage'),
('TK01-0022', 'TK01', 'B003', 'Ready', '2024-03-06', '2027-03-06', 'Main Storage'),
('TK01-0023', 'TK01', 'B003', 'Ready', '2023-08-16', '2026-08-16', 'Main Storage'),
('TK01-0024', 'TK01', 'B003', 'Ready', '2025-06-17', '2028-06-17', 'Main Storage'),
('TK01-0025', 'TK01', 'B005', 'Ready', '2025-12-28', '2028-12-28', 'Main Storage'),
('TK01-0026', 'TK01', 'B005', 'Ready', '2024-05-14', '2027-05-14', 'Main Storage'),
('TK01-0027', 'TK01', 'B005', 'Ready', '2024-02-29', '2027-02-28', 'Main Storage'),
('TK01-0028', 'TK01', 'B005', 'Ready', '2024-09-04', '2027-09-04', 'Main Storage'),
('TK01-0029', 'TK01', 'B005', 'Ready', '2025-05-09', '2028-05-09', 'Main Storage'),
('TK01-0030', 'TK01', 'B005', 'Ready', '2023-08-03', '2026-08-03', 'Main Storage'),
('TK01-0031', 'TK01', 'B005', 'Ready', '2024-08-21', '2027-08-21', 'Main Storage'),
('TK01-0032', 'TK01', 'B005', 'Ready', '2025-09-18', '2028-09-18', 'Main Storage'),
('TK01-0033', 'TK01', 'B010', 'Ready', '2023-12-27', '2026-12-27', 'Main Storage'),
('TK01-0034', 'TK01', 'B010', 'Ready', '2024-09-16', '2027-09-16', 'Main Storage'),
('TK01-0035', 'TK01', 'B010', 'Ready', '2025-12-12', '2028-12-12', 'Main Storage'),
('TK01-0036', 'TK01', 'B010', 'Ready', '2023-07-16', '2026-07-16', 'Main Storage'),
('TK01-0037', 'TK01', 'B010', 'Ready', '2024-07-11', '2027-07-11', 'Main Storage'),
('TK01-0038', 'TK01', 'B010', 'Ready', '2025-08-17', '2028-08-17', 'Main Storage'),
('TK01-0039', 'TK01', 'B010', 'Ready', '2025-02-09', '2028-02-09', 'Main Storage'),
('TK01-0040', 'TK01', 'B010', 'Ready', '2023-12-21', '2026-12-21', 'Main Storage'),
('TK01-0041', 'TK01', 'B004', 'Ready', '2023-10-02', '2026-10-02', 'Main Storage'),
('TK01-0042', 'TK01', 'B004', 'Ready', '2025-04-30', '2028-04-30', 'Main Storage'),
('TK01-0043', 'TK01', 'B004', 'Ready', '2023-02-17', '2026-02-17', 'Main Storage'),
('TK01-0044', 'TK01', 'B004', 'Ready', '2024-12-14', '2027-12-14', 'Main Storage'),
('TK01-0045', 'TK01', 'B004', 'Ready', '2024-10-23', '2027-10-23', 'Main Storage'),
('TK01-0046', 'TK01', 'B004', 'Ready', '2024-05-23', '2027-05-23', 'Main Storage'),
('TK01-0047', 'TK01', 'B004', 'Ready', '2024-12-08', '2027-12-08', 'Main Storage'),
('TK01-0048', 'TK01', 'B004', 'Ready', '2023-09-10', '2026-09-10', 'Main Storage'),
('TK02-0001', 'TK02', 'B001', 'Ready', '2025-02-13', '2028-02-13', 'Main Storage'),
('TK02-0002', 'TK02', 'B002', 'Ready', '2023-11-18', '2026-11-18', 'Main Storage'),
('TK02-0003', 'TK02', 'B003', 'Ready', '2025-10-31', '2028-10-31', 'Main Storage'),
('TK02-0004', 'TK02', 'B005', 'Ready', '2025-07-12', '2028-07-12', 'Main Storage'),
('TK02-0005', 'TK02', 'B010', 'Ready', '2025-12-16', '2028-12-16', 'Main Storage'),
('TK02-0006', 'TK02', 'B004', 'Ready', '2025-02-13', '2028-02-13', 'Main Storage'),
('TN01-0001', 'TN01', 'B001', 'Ready', '2023-01-04', '2026-01-04', 'Main Storage'),
('TN01-0002', 'TN01', 'B001', 'Ready', '2025-03-02', '2028-03-02', 'Main Storage'),
('TN01-0003', 'TN01', 'B001', 'Ready', '2025-09-02', '2028-09-02', 'Main Storage'),
('TN01-0004', 'TN01', 'B001', 'Ready', '2023-01-05', '2026-01-05', 'Main Storage'),
('TN01-0005', 'TN01', 'B001', 'Ready', '2023-07-21', '2026-07-21', 'Main Storage'),
('TN01-0006', 'TN01', 'B001', 'Ready', '2023-08-03', '2026-08-03', 'Main Storage'),
('TN01-0007', 'TN01', 'B002', 'Ready', '2024-12-22', '2027-12-22', 'Main Storage'),
('TN01-0008', 'TN01', 'B002', 'Ready', '2024-11-23', '2027-11-23', 'Main Storage'),
('TN01-0009', 'TN01', 'B002', 'Ready', '2024-01-20', '2027-01-20', 'Main Storage'),
('TN01-0010', 'TN01', 'B002', 'Ready', '2025-06-29', '2028-06-29', 'Main Storage'),
('TN01-0011', 'TN01', 'B002', 'Ready', '2025-01-16', '2028-01-16', 'Main Storage'),
('TN01-0012', 'TN01', 'B002', 'Ready', '2023-01-10', '2026-01-10', 'Main Storage'),
('TN01-0013', 'TN01', 'B003', 'Ready', '2023-01-08', '2026-01-08', 'Main Storage'),
('TN01-0014', 'TN01', 'B003', 'Ready', '2025-06-23', '2028-06-23', 'Main Storage'),
('TN01-0015', 'TN01', 'B003', 'Ready', '2023-04-16', '2026-04-16', 'Main Storage'),
('TN01-0016', 'TN01', 'B003', 'Ready', '2024-03-22', '2027-03-22', 'Main Storage'),
('TN01-0017', 'TN01', 'B003', 'Ready', '2023-09-03', '2026-09-03', 'Main Storage'),
('TN01-0018', 'TN01', 'B003', 'Ready', '2023-01-07', '2026-01-07', 'Main Storage'),
('TN01-0019', 'TN01', 'B005', 'Ready', '2023-08-03', '2026-08-03', 'Main Storage'),
('TN01-0020', 'TN01', 'B005', 'Ready', '2023-04-25', '2026-04-25', 'Main Storage'),
('TN01-0021', 'TN01', 'B005', 'Ready', '2025-06-23', '2028-06-23', 'Main Storage'),
('TN01-0022', 'TN01', 'B005', 'Ready', '2024-12-23', '2027-12-23', 'Main Storage'),
('TN01-0023', 'TN01', 'B005', 'Ready', '2023-09-01', '2026-09-01', 'Main Storage'),
('TN01-0024', 'TN01', 'B005', 'Ready', '2024-03-24', '2027-03-24', 'Main Storage'),
('TN01-0025', 'TN01', 'B010', 'Ready', '2024-11-21', '2027-11-21', 'Main Storage'),
('TN01-0026', 'TN01', 'B010', 'Ready', '2024-10-16', '2027-10-16', 'Main Storage'),
('TN01-0027', 'TN01', 'B010', 'Ready', '2025-03-18', '2028-03-18', 'Main Storage'),
('TN01-0028', 'TN01', 'B010', 'Ready', '2025-05-04', '2028-05-04', 'Main Storage'),
('TN01-0029', 'TN01', 'B010', 'Ready', '2023-08-15', '2026-08-15', 'Main Storage'),
('TN01-0030', 'TN01', 'B010', 'Ready', '2024-12-03', '2027-12-03', 'Main Storage'),
('TN01-0031', 'TN01', 'B004', 'Ready', '2024-01-09', '2027-01-08', 'Main Storage'),
('TN01-0032', 'TN01', 'B004', 'Ready', '2023-07-02', '2026-07-01', 'Main Storage'),
('TN01-0033', 'TN01', 'B004', 'Ready', '2024-03-27', '2027-03-27', 'Main Storage'),
('TN01-0034', 'TN01', 'B004', 'Ready', '2023-03-27', '2026-03-26', 'Main Storage'),
('TN01-0035', 'TN01', 'B004', 'Ready', '2023-11-23', '2026-11-22', 'Main Storage'),
('TN01-0036', 'TN01', 'B004', 'Ready', '2025-02-16', '2028-02-16', 'Main Storage'),
('TN02-0001', 'TN02', 'B001', 'Ready', '2025-05-04', '2028-05-04', 'Main Storage'),
('TN02-0002', 'TN02', 'B001', 'Ready', '2024-08-20', '2027-08-20', 'Main Storage'),
('TN02-0003', 'TN02', 'B001', 'Ready', '2024-08-03', '2027-08-03', 'Main Storage'),
('TN02-0004', 'TN02', 'B001', 'Ready', '2025-03-30', '2028-03-30', 'Main Storage'),
('TN02-0005', 'TN02', 'B001', 'Ready', '2023-03-18', '2026-03-18', 'Main Storage'),
('TN02-0006', 'TN02', 'B001', 'Ready', '2025-06-26', '2028-06-26', 'Main Storage'),
('TN02-0007', 'TN02', 'B002', 'Ready', '2023-11-21', '2026-11-21', 'Main Storage'),
('TN02-0008', 'TN02', 'B002', 'Ready', '2023-11-18', '2026-11-18', 'Main Storage'),
('TN02-0009', 'TN02', 'B002', 'Ready', '2024-01-06', '2027-01-06', 'Main Storage'),
('TN02-0010', 'TN02', 'B002', 'Ready', '2023-11-03', '2026-11-03', 'Main Storage'),
('TN02-0011', 'TN02', 'B002', 'Ready', '2023-02-28', '2026-02-28', 'Main Storage'),
('TN02-0012', 'TN02', 'B002', 'Ready', '2025-10-24', '2028-10-24', 'Main Storage'),
('TN02-0013', 'TN02', 'B003', 'Ready', '2023-02-08', '2026-02-08', 'Main Storage'),
('TN02-0014', 'TN02', 'B003', 'Ready', '2023-06-12', '2026-06-12', 'Main Storage'),
('TN02-0015', 'TN02', 'B003', 'Ready', '2024-08-27', '2027-08-27', 'Main Storage'),
('TN02-0016', 'TN02', 'B003', 'Ready', '2023-10-26', '2026-10-26', 'Main Storage'),
('TN02-0017', 'TN02', 'B003', 'Ready', '2024-08-09', '2027-08-09', 'Main Storage'),
('TN02-0018', 'TN02', 'B003', 'Ready', '2024-06-04', '2027-06-04', 'Main Storage'),
('TN02-0019', 'TN02', 'B005', 'Ready', '2025-10-31', '2028-10-31', 'Main Storage'),
('TN02-0020', 'TN02', 'B005', 'Ready', '2025-04-08', '2028-04-08', 'Main Storage'),
('TN02-0021', 'TN02', 'B005', 'Ready', '2024-03-17', '2027-03-17', 'Main Storage'),
('TN02-0022', 'TN02', 'B005', 'Ready', '2025-09-19', '2028-09-19', 'Main Storage'),
('TN02-0023', 'TN02', 'B005', 'Ready', '2025-06-16', '2028-06-16', 'Main Storage'),
('TN02-0024', 'TN02', 'B005', 'Ready', '2024-08-14', '2027-08-14', 'Main Storage'),
('TN02-0025', 'TN02', 'B010', 'Ready', '2025-09-03', '2028-09-03', 'Main Storage'),
('TN02-0026', 'TN02', 'B010', 'Ready', '2024-01-06', '2027-01-06', 'Main Storage'),
('TN02-0027', 'TN02', 'B010', 'Ready', '2023-09-02', '2026-09-02', 'Main Storage'),
('TN02-0028', 'TN02', 'B010', 'Ready', '2024-09-14', '2027-09-14', 'Main Storage'),
('TN02-0029', 'TN02', 'B010', 'Ready', '2024-10-21', '2027-10-21', 'Main Storage'),
('TN02-0030', 'TN02', 'B010', 'Ready', '2023-06-06', '2026-06-06', 'Main Storage'),
('TN02-0031', 'TN02', 'B004', 'Ready', '2024-10-13', '2027-10-13', 'Main Storage'),
('TN02-0032', 'TN02', 'B004', 'Ready', '2025-04-02', '2028-04-01', 'Main Storage'),
('TN02-0033', 'TN02', 'B004', 'Ready', '2025-12-09', '2028-12-08', 'Main Storage'),
('TN02-0034', 'TN02', 'B004', 'Ready', '2024-08-29', '2027-08-29', 'Main Storage'),
('TN02-0035', 'TN02', 'B004', 'Ready', '2024-03-24', '2027-03-24', 'Main Storage'),
('TN02-0036', 'TN02', 'B004', 'Ready', '2025-03-17', '2028-03-16', 'Main Storage'),
('TN03-0001', 'TN03', 'B001', 'Ready', '2025-09-27', '2028-09-27', 'Main Storage'),
('TN03-0002', 'TN03', 'B001', 'Ready', '2025-09-25', '2028-09-25', 'Main Storage'),
('TN03-0003', 'TN03', 'B002', 'Ready', '2024-12-27', '2027-12-27', 'Main Storage'),
('TN03-0004', 'TN03', 'B002', 'Ready', '2024-05-30', '2027-05-30', 'Main Storage'),
('TN03-0005', 'TN03', 'B003', 'Ready', '2025-11-03', '2028-11-03', 'Main Storage'),
('TN03-0006', 'TN03', 'B003', 'Ready', '2025-12-04', '2028-12-04', 'Main Storage'),
('TN03-0007', 'TN03', 'B005', 'Ready', '2025-06-24', '2028-06-24', 'Main Storage'),
('TN03-0008', 'TN03', 'B005', 'Ready', '2025-07-28', '2028-07-28', 'Main Storage'),
('TN03-0009', 'TN03', 'B010', 'Ready', '2023-07-27', '2026-07-27', 'Main Storage'),
('TN03-0010', 'TN03', 'B010', 'Ready', '2024-11-03', '2027-11-03', 'Main Storage'),
('TN03-0011', 'TN03', 'B001', 'Ready', '2025-01-25', '2028-01-25', 'Main Storage'),
('TN03-0012', 'TN03', 'B001', 'Ready', '2024-05-20', '2027-05-20', 'Main Storage'),
('TN03-0013', 'TN03', 'B002', 'Ready', '2023-11-06', '2026-11-06', 'Main Storage'),
('TN03-0014', 'TN03', 'B002', 'Ready', '2024-03-29', '2027-03-29', 'Main Storage'),
('TN03-0015', 'TN03', 'B003', 'Ready', '2025-08-23', '2028-08-23', 'Main Storage'),
('TN03-0016', 'TN03', 'B003', 'Ready', '2024-08-30', '2027-08-30', 'Main Storage'),
('TN03-0017', 'TN03', 'B005', 'Ready', '2025-03-21', '2028-03-21', 'Main Storage'),
('TN03-0018', 'TN03', 'B005', 'Ready', '2023-05-10', '2026-05-10', 'Main Storage'),
('TN03-0019', 'TN03', 'B010', 'Ready', '2024-07-22', '2027-07-22', 'Main Storage'),
('TN03-0020', 'TN03', 'B010', 'Ready', '2025-02-25', '2028-02-25', 'Main Storage'),
('TN03-0021', 'TN03', 'B004', 'Ready', '2024-11-15', '2027-11-15', 'Main Storage'),
('TN03-0022', 'TN03', 'B004', 'Ready', '2024-12-28', '2027-12-28', 'Main Storage'),
('TN03-0023', 'TN03', 'B004', 'Ready', '2025-08-12', '2028-08-11', 'Main Storage'),
('TN03-0024', 'TN03', 'B004', 'Ready', '2025-04-21', '2028-04-20', 'Main Storage'),
('VB01-0001', 'VB01', 'B001', 'Ready', '2023-05-24', '2026-05-24', 'Main Storage'),
('VB01-0002', 'VB01', 'B001', 'Ready', '2024-08-14', '2027-08-14', 'Main Storage'),
('VB01-0003', 'VB01', 'B001', 'Ready', '2025-01-16', '2028-01-16', 'Main Storage'),
('VB01-0004', 'VB01', 'B001', 'Ready', '2025-01-31', '2028-01-31', 'Main Storage'),
('VB01-0005', 'VB01', 'B001', 'Ready', '2025-03-19', '2028-03-19', 'Main Storage'),
('VB01-0006', 'VB01', 'B001', 'Ready', '2025-03-19', '2028-03-19', 'Main Storage'),
('VB01-0007', 'VB01', 'B001', 'Ready', '2023-09-03', '2026-09-03', 'Main Storage'),
('VB01-0008', 'VB01', 'B001', 'Ready', '2025-04-20', '2028-04-20', 'Main Storage'),
('VB01-0009', 'VB01', 'B002', 'Ready', '2024-04-26', '2027-04-26', 'Main Storage'),
('VB01-0010', 'VB01', 'B002', 'Ready', '2024-02-16', '2027-02-16', 'Main Storage'),
('VB01-0011', 'VB01', 'B002', 'Ready', '2023-12-23', '2026-12-23', 'Main Storage'),
('VB01-0012', 'VB01', 'B002', 'Ready', '2025-11-10', '2028-11-10', 'Main Storage'),
('VB01-0013', 'VB01', 'B002', 'Ready', '2025-03-07', '2028-03-07', 'Main Storage'),
('VB01-0014', 'VB01', 'B002', 'Ready', '2023-11-03', '2026-11-03', 'Main Storage'),
('VB01-0015', 'VB01', 'B002', 'Ready', '2024-01-26', '2027-01-26', 'Main Storage'),
('VB01-0016', 'VB01', 'B002', 'Ready', '2023-01-27', '2026-01-27', 'Main Storage'),
('VB01-0017', 'VB01', 'B003', 'Ready', '2025-02-23', '2028-02-23', 'Main Storage'),
('VB01-0018', 'VB01', 'B003', 'Ready', '2023-05-30', '2026-05-30', 'Main Storage'),
('VB01-0019', 'VB01', 'B003', 'Ready', '2025-04-30', '2028-04-30', 'Main Storage'),
('VB01-0020', 'VB01', 'B003', 'Ready', '2025-10-02', '2028-10-02', 'Main Storage'),
('VB01-0021', 'VB01', 'B003', 'Ready', '2025-02-27', '2028-02-27', 'Main Storage'),
('VB01-0022', 'VB01', 'B003', 'Ready', '2024-09-22', '2027-09-22', 'Main Storage'),
('VB01-0023', 'VB01', 'B003', 'Ready', '2023-04-14', '2026-04-14', 'Main Storage'),
('VB01-0024', 'VB01', 'B003', 'Ready', '2024-06-21', '2027-06-21', 'Main Storage'),
('VB01-0025', 'VB01', 'B005', 'Ready', '2023-12-12', '2026-12-12', 'Main Storage'),
('VB01-0026', 'VB01', 'B005', 'Ready', '2024-06-22', '2027-06-22', 'Main Storage'),
('VB01-0027', 'VB01', 'B005', 'Ready', '2025-12-03', '2028-12-03', 'Main Storage'),
('VB01-0028', 'VB01', 'B005', 'Ready', '2025-05-31', '2028-05-31', 'Main Storage'),
('VB01-0029', 'VB01', 'B005', 'Ready', '2023-08-07', '2026-08-07', 'Main Storage'),
('VB01-0030', 'VB01', 'B005', 'Ready', '2023-01-26', '2026-01-26', 'Main Storage'),
('VB01-0031', 'VB01', 'B005', 'Ready', '2024-10-30', '2027-10-30', 'Main Storage'),
('VB01-0032', 'VB01', 'B005', 'Ready', '2023-08-10', '2026-08-10', 'Main Storage'),
('VB01-0033', 'VB01', 'B010', 'Ready', '2023-09-09', '2026-09-09', 'Main Storage'),
('VB01-0034', 'VB01', 'B010', 'Ready', '2024-11-24', '2027-11-24', 'Main Storage'),
('VB01-0035', 'VB01', 'B010', 'Ready', '2025-04-10', '2028-04-10', 'Main Storage'),
('VB01-0036', 'VB01', 'B010', 'Ready', '2023-06-30', '2026-06-30', 'Main Storage'),
('VB01-0037', 'VB01', 'B010', 'Ready', '2024-03-27', '2027-03-27', 'Main Storage'),
('VB01-0038', 'VB01', 'B010', 'Ready', '2024-07-26', '2027-07-26', 'Main Storage'),
('VB01-0039', 'VB01', 'B010', 'Ready', '2024-09-07', '2027-09-07', 'Main Storage'),
('VB01-0040', 'VB01', 'B010', 'Ready', '2024-11-21', '2027-11-21', 'Main Storage'),
('VB01-0041', 'VB01', 'B004', 'Ready', '2023-05-30', '2026-05-29', 'Main Storage'),
('VB01-0042', 'VB01', 'B004', 'Ready', '2024-11-14', '2027-11-14', 'Main Storage'),
('VB01-0043', 'VB01', 'B004', 'Ready', '2023-08-20', '2026-08-19', 'Main Storage'),
('VB01-0044', 'VB01', 'B004', 'Ready', '2024-04-08', '2027-04-08', 'Main Storage'),
('VB01-0045', 'VB01', 'B004', 'Ready', '2025-03-02', '2028-03-01', 'Main Storage'),
('VB01-0046', 'VB01', 'B004', 'Ready', '2025-01-04', '2028-01-04', 'Main Storage'),
('VB01-0047', 'VB01', 'B004', 'Ready', '2024-01-06', '2027-01-05', 'Main Storage'),
('VB01-0048', 'VB01', 'B004', 'Ready', '2024-11-28', '2027-11-28', 'Main Storage'),
('VB02-0001', 'VB02', 'B001', 'Ready', '2025-03-29', '2028-03-29', 'Main Storage'),
('VB02-0002', 'VB02', 'B001', 'Ready', '2023-04-21', '2026-04-21', 'Main Storage'),
('VB02-0003', 'VB02', 'B001', 'Ready', '2023-10-29', '2026-10-29', 'Main Storage'),
('VB02-0004', 'VB02', 'B001', 'Ready', '2025-06-03', '2028-06-03', 'Main Storage'),
('VB02-0005', 'VB02', 'B002', 'Ready', '2025-05-28', '2028-05-28', 'Main Storage'),
('VB02-0006', 'VB02', 'B002', 'Ready', '2024-11-16', '2027-11-16', 'Main Storage'),
('VB02-0007', 'VB02', 'B002', 'Ready', '2025-12-18', '2028-12-18', 'Main Storage'),
('VB02-0008', 'VB02', 'B002', 'Ready', '2023-05-30', '2026-05-30', 'Main Storage'),
('VB02-0009', 'VB02', 'B003', 'Ready', '2025-07-19', '2028-07-19', 'Main Storage'),
('VB02-0010', 'VB02', 'B003', 'Ready', '2024-11-26', '2027-11-26', 'Main Storage'),
('VB02-0011', 'VB02', 'B003', 'Ready', '2025-12-29', '2028-12-29', 'Main Storage'),
('VB02-0012', 'VB02', 'B003', 'Ready', '2025-08-02', '2028-08-02', 'Main Storage'),
('VB02-0013', 'VB02', 'B005', 'Ready', '2023-04-03', '2026-04-03', 'Main Storage'),
('VB02-0014', 'VB02', 'B005', 'Ready', '2024-09-13', '2027-09-13', 'Main Storage'),
('VB02-0015', 'VB02', 'B005', 'Ready', '2023-03-18', '2026-03-18', 'Main Storage'),
('VB02-0016', 'VB02', 'B005', 'Ready', '2025-09-09', '2028-09-09', 'Main Storage'),
('VB02-0017', 'VB02', 'B010', 'Ready', '2024-01-03', '2027-01-03', 'Main Storage'),
('VB02-0018', 'VB02', 'B010', 'Ready', '2025-11-15', '2028-11-15', 'Main Storage'),
('VB02-0019', 'VB02', 'B010', 'Ready', '2025-04-08', '2028-04-08', 'Main Storage'),
('VB02-0020', 'VB02', 'B010', 'Ready', '2025-01-04', '2028-01-04', 'Main Storage'),
('VB02-0021', 'VB02', 'B004', 'Ready', '2023-11-03', '2026-11-02', 'Main Storage'),
('VB02-0022', 'VB02', 'B004', 'Ready', '2023-01-09', '2026-01-08', 'Main Storage'),
('VB02-0023', 'VB02', 'B004', 'Ready', '2025-09-05', '2028-09-04', 'Main Storage'),
('VB02-0024', 'VB02', 'B004', 'Ready', '2024-10-23', '2027-10-23', 'Main Storage'),
('VB03-0001', 'VB03', 'B001', 'Ready', '2023-11-07', '2026-11-07', 'Main Storage'),
('VB03-0002', 'VB03', 'B001', 'Ready', '2023-04-27', '2026-04-27', 'Main Storage'),
('VB03-0003', 'VB03', 'B002', 'Ready', '2024-01-28', '2027-01-28', 'Main Storage'),
('VB03-0004', 'VB03', 'B002', 'Ready', '2023-12-06', '2026-12-06', 'Main Storage'),
('VB03-0005', 'VB03', 'B003', 'Ready', '2024-01-10', '2027-01-10', 'Main Storage'),
('VB03-0006', 'VB03', 'B003', 'Ready', '2025-06-30', '2028-06-30', 'Main Storage'),
('VB03-0007', 'VB03', 'B005', 'Ready', '2024-06-15', '2027-06-15', 'Main Storage'),
('VB03-0008', 'VB03', 'B005', 'Ready', '2024-07-15', '2027-07-15', 'Main Storage'),
('VB03-0009', 'VB03', 'B010', 'Ready', '2023-03-14', '2026-03-14', 'Main Storage'),
('VB03-0010', 'VB03', 'B010', 'Ready', '2023-08-26', '2026-08-26', 'Main Storage'),
('VB03-0011', 'VB03', 'B004', 'Ready', '2024-11-09', '2027-11-09', 'Main Storage'),
('VB03-0012', 'VB03', 'B004', 'Ready', '2024-10-01', '2027-10-01', 'Main Storage');

-- --------------------------------------------------------

--
-- Table structure for table `equipment_master`
--

CREATE TABLE `equipment_master` (
  `equipment_id` varchar(20) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `image_url` text DEFAULT NULL,
  `price_per_unit` decimal(10,2) DEFAULT 0.00,
  `total_stock` int(11) DEFAULT 0,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment_master`
--

INSERT INTO `equipment_master` (`equipment_id`, `category_id`, `name`, `image_url`, `price_per_unit`, `total_stock`, `description`) VALUES
('AR01', 10, 'คันธนูฝึกซ้อม', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/AR01.jpg\n', 120.00, 31, 'คันธนูสำหรับผู้เริ่มต้น ยิงเป้าได้ในร่มและกลางแจ้ง'),
('AR02', 10, 'ลูกธนู(แพ็ก)', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/AR02.jpg\n', 35.00, 48, 'ลูกศรมาตรฐานสำหรับฝึกยิงเป้า'),
('AR03', 10, 'เป้ายิงธนูโฟม', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/AR03.jpg\n', 75.00, 30, 'เป้ายิงธนูแบบโฟม'),
('AR04', 10, 'การ์ดป้องกันแขนยิงธนู', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/AR04.jpg\n', 30.00, 24, 'อุปกรณ์ป้องกันแขนขณะยิงธนู'),
('AR05', 10, 'ที่เก็บลูกศร', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/AR05.jpg\n', 40.00, 18, 'ที่ใส่ลูกศรคาดเอว'),
('AT01', 11, 'คฑาวิ่งผลัด', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/AT01.jpg\n', 40.00, 30, 'คฑาสำหรับกีฬาวิ่งผลัด ใช้ในการฝึกซ้อมและแข่งขัน'),
('AT02', 11, 'กรวยซ้อมกรีฑา(แพ็ก)', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/AT02.jpg\n', 35.00, 54, 'กรวยสำหรับจัดเลนซ้อม'),
('AT03', 11, 'บล็อกสตาร์ท', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/AT03.jpg', 120.00, 30, 'บล็อกออกตัววิ่ง'),
('BB01', 2, 'ลูกบาสเกตบอล', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/BB01.jpg', 60.00, 54, 'ลูกบาสเกตบอลขนาดมาตรฐาน เบอร์ 7'),
('BB02', 2, 'เสื้อทีมบาส', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/BB02.jpg', 35.00, 48, 'เสื้อทีมบาสสำหรับแข่งขัน'),
('BB03', 2, 'ตะกร้าแชร์บอล', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/BB03.jpg', 25.00, 30, 'ตะกร้าสำหรับเล่นแชร์บอล'),
('BB04', 2, 'ลูกแชร์บอล', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/BB04.jpg', 35.00, 30, 'ลูกแชร์บอลมาตรฐาน'),
('BD01', 4, 'ไม้แบดมินตัน', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/BD01.jpg', 50.00, 108, 'ไม้แบดน้ำหนักเบา เหมาะสำหรับผู้เริ่มต้น'),
('BD02', 4, 'ลูกขนไก่(แพ็ก)', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/BD02.jpg', 25.00, 36, 'ลูกขนไก่ไนลอนสำหรับฝึกซ้อม'),
('BD03', 4, 'ตาข่ายแบดมินตัน', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/BD03.jpg', 100.00, 12, 'ตาข่ายแบดมินตันมาตรฐาน'),
('BG01', 14, 'บอร์ดเกมโยคี', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/BG01.jpg', 60.00, 24, 'บอร์ดเกมแนวออกกำลังกายและความยืดหยุ่น สนุกและได้สุขภาพ'),
('BG02', 14, 'บอร์ดเกม Fitfriends', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/BG02.jpg', 70.00, 18, 'บอร์ดเกมแนวฟิตเนส เล่นเป็นกลุ่ม เสริมสร้างความแข็งแรง'),
('FB01', 1, 'ลูกฟุตบอลมาตรฐาน', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/FB01.jpg', 50.00, 60, 'ลูกฟุตบอลหนัง PU สำหรับฝึกซ้อมและแข่งขัน'),
('FB02', 1, 'ลูกฟุตซอล', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/FB02.jpg', 55.00, 48, 'ลูกฟุตซอลมาตรฐานสำหรับสนามในร่ม'),
('FB03', 1, 'เซ็ตกรวยซ้อมฟุตบอล', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/FB03.jpg', 50.00, 60, 'กรวยสำหรับฝึกซ้อมฟุตบอล'),
('FB04', 1, 'เสื้อเอี๊ยมฝึกซ้อม', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/FB04.jpg', 20.00, 30, 'เสื้อเอี๊ยมแบ่งทีมสำหรับซ้อม'),
('FT01', 13, 'เคตเทิลเบล', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/FT01.jpg', 50.00, 30, 'ลูกตุ้มน้ำหนักสำหรับฝึกกล้ามเนื้อและความแข็งแรง'),
('FT02', 13, 'บาเบล', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/FT02.jpg', 80.00, 24, 'บาร์เบลสำหรับยกน้ำหนัก เสริมสร้างกล้ามเนื้อ'),
('FT03', 13, 'ดัมเบล', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/FT03.jpg', 40.00, 48, 'ดัมเบลสำหรับออกกำลังกายแบบใช้มือทั้งสองข้าง'),
('FT04', 13, 'เชือกกระโดด', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/FT04.jpg', 20.00, 24, 'เชือกสำหรับคาร์ดิโอและฝึกความคล่องตัว'),
('GF01', 7, 'ไม้กอล์ฟ', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/GF01.jpg', 150.00, 36, 'ไม้กอล์ฟเหล็กสำหรับผู้เริ่มต้น'),
('GF02', 7, 'ลูกกอล์ฟ(แพ็ก)', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/GF02.jpg', 25.00, 36, 'ลูกกอล์ฟมาตรฐานสำหรับฝึกซ้อม'),
('GF03', 7, 'ถุงกอล์ฟ', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/GF03.jpg', 200.00, 36, 'ถุงกอล์ฟขนาดมาตรฐาน'),
('PP01', 8, 'ไม้ปิงปอง', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/PP01.jpg', 40.00, 60, 'ไม้ปิงปองพร้อมยาง เหมาะกับการฝึกซ้อม'),
('PP02', 8, 'เน็ตปิงปอง', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/PP02.jpg', 40.00, 18, 'ตาข่ายปิงปองมาตรฐาน'),
('PP03', 8, 'โต๊ะปิงปองพับได้', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/PP03.jpg', 300.00, 12, 'โต๊ะปิงปองพับเก็บได้'),
('PP04', 8, 'ลูกปิงปอง(แพ็ก)', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/PP04.jpg', 10.00, 36, 'ลูกปิงปองมาตรฐาน'),
('PT01', 9, 'ลูกเปตอง', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/PT01.jpg', 35.00, 36, 'ลูกเปตองโลหะสำหรับแข่งขันและฝึกซ้อม'),
('PT02', 9, 'วงกลมเปตอง', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/PT02.jpg', 25.00, 18, 'วงกลมสำหรับเริ่มเล่นเปตอง'),
('PT03', 9, 'ลูกเป้า(แพ็ก)', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/PT03.jpg', 10.00, 18, 'ลูกเป้าเปตองสำหรับฝึกซ้อม'),
('SW01', 6, 'แว่นตาว่ายน้ำ', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/SW01.jpg', 30.00, 60, 'แว่นตาว่ายน้ำกันน้ำ กันฝ้า'),
('SW02', 6, 'โฟมลอยน้ำ', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/SW02.jpg', 15.00, 36, 'โฟมช่วยลอยน้ำสำหรับฝึกว่าย'),
('SW03', 6, 'หมวกว่ายน้ำ', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/SW03.jpg', 20.00, 60, 'หมวกว่ายน้ำซิลิโคน'),
('TK01', 12, 'ลูกตะกร้อ', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/TK01.jpg', 45.00, 48, 'ลูกตะกร้อมาตรฐานใช้สำหรับแข่งขัน'),
('TK02', 12, 'ตาข่ายตะกร้อ', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/TK02.jpg', 120.00, 6, 'ตาข่ายสนามตะกร้อมาตรฐาน'),
('TN01', 5, 'ไม้เทนนิส', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/TN01.jpg', 120.00, 36, 'ไม้เทนนิสอะลูมิเนียม แข็งแรงทนทาน'),
('TN02', 5, 'ลูกเทนนิส(แพ็ก)', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/TN02.jpg', 30.00, 36, 'ลูกเทนนิสมาตรฐานสำหรับแข่งขันและฝึกซ้อม'),
('TN03', 5, 'ตาข่ายเทนนิส', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/TN03.jpg', 100.00, 24, 'ตาข่ายสนามเทนนิส'),
('VB01', 3, 'ลูกวอลเลย์บอล', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/VB01.jpg', 50.00, 48, 'ลูกวอลเลย์บอลสำหรับแข่งขันในร่ม'),
('VB02', 3, 'ลูกวอลเลย์บอลชายหาด', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/VB02.jpg', 55.00, 24, 'ลูกวอลเลย์บอลสำหรับสนามทราย'),
('VB03', 3, 'ตาข่ายวอลเลย์บอล', '/SPORTS_RENTAL_SYSTEM/uploads/equipment/VB03.jpg', 120.00, 12, 'ตาข่ายวอลเลย์บอลมาตรฐาน');

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`id`, `name`) VALUES
(9, 'คณะทันตแพทยศาสตร์'),
(14, 'คณะนิติศาสตร์'),
(15, 'คณะบริหารธุรกิจ เศรษฐศาสตร์และการสื่อสาร'),
(6, 'คณะพยาบาลศาสตร์'),
(11, 'คณะมนุษยศาสตร์'),
(3, 'คณะวิทยาศาสตร์'),
(4, 'คณะวิทยาศาสตร์การแพทย์'),
(2, 'คณะวิศวกรรมศาสตร์'),
(13, 'คณะศึกษาศาสตร์'),
(16, 'คณะสถาปัตยกรรมศาสตร์ ศิลปะและการออกแบบ'),
(7, 'คณะสหเวชศาสตร์'),
(12, 'คณะสังคมศาสตร์'),
(8, 'คณะสาธารณสุขศาสตร์'),
(1, 'คณะเกษตรศาสตร์ ทรัพยากรธรรมชาติและสิ่งแวดล้อม'),
(10, 'คณะเภสัชศาสตร์'),
(5, 'คณะแพทยศาสตร์'),
(17, 'คณะโลจิสติกส์และดิจิทัลซัพพลายเชน');

-- --------------------------------------------------------

--
-- Table structure for table `genders`
--

CREATE TABLE `genders` (
  `gender_id` int(11) NOT NULL,
  `name_en` varchar(50) NOT NULL,
  `name_th` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `genders`
--

INSERT INTO `genders` (`gender_id`, `name_en`, `name_th`) VALUES
(1, ' Male', ' ชาย'),
(2, ' Female', ' หญิง'),
(3, ' LGBTQ+', ' อื่นๆ');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_logs`
--

CREATE TABLE `maintenance_logs` (
  `log_id` bigint(20) NOT NULL,
  `instance_code` varchar(50) DEFAULT NULL,
  `branch_id` varchar(20) DEFAULT NULL,
  `reported_by_staff_id` varchar(20) DEFAULT NULL,
  `reported_by_customer_id` varchar(20) DEFAULT NULL,
  `damage_id` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `repair_cost` decimal(10,2) DEFAULT 0.00,
  `report_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance_logs`
--

INSERT INTO `maintenance_logs` (`log_id`, `instance_code`, `branch_id`, `reported_by_staff_id`, `reported_by_customer_id`, `damage_id`, `status_id`, `description`, `repair_cost`, `report_date`) VALUES
(695, 'TN01-0016', 'B003', 'S015', NULL, NULL, NULL, 'ไม้เทนนิส ผิวหนังฉีกเล็กน้อย', 94.00, '2026-01-15 13:19:44'),
(698, 'TN02-0004', 'B001', 'S005', NULL, NULL, NULL, 'ลูกเทนนิส(แพ็ก) มีฝุ่นและคราบสกปรก', 79.00, '2026-01-23 16:41:28'),
(707, 'SW01-0044', 'B010', 'S025', NULL, NULL, NULL, 'แว่นตาว่ายน้ำ แตก', 105.00, '2025-12-03 12:22:10'),
(713, 'SW03-0004', 'B001', 'S005', NULL, NULL, NULL, 'หมวกว่ายน้ำ ผิวสึก', 75.00, '2026-01-09 09:58:55'),
(715, 'SW03-0024', 'B003', 'S014', NULL, NULL, NULL, 'หมวกว่ายน้ำ มีฝุ่นและคราบสกปรก', 56.00, '2026-01-05 13:17:13'),
(720, 'GF01-0016', 'B003', 'S014', NULL, NULL, NULL, 'ไม้กอล์ฟ สีซีดจาง', 60.00, '2025-12-02 20:39:54'),
(721, 'GF01-0022', 'B005', 'S020', NULL, NULL, NULL, 'ไม้กอล์ฟ ผิวหนังฉีกเล็กน้อย', 98.00, '2026-01-13 15:56:34'),
(724, 'GF02-0010', 'B002', 'S009', NULL, NULL, NULL, 'ลูกกอล์ฟ(แพ็ก) โครงสร้างเสียหาย', 115.00, '2026-01-05 19:30:01'),
(725, 'GF02-0016', 'B003', 'S015', NULL, NULL, NULL, 'ลูกกอล์ฟ(แพ็ก) มีรอยร้าว', 87.00, '2026-01-02 17:47:32'),
(726, 'GF02-0022', 'B005', 'S019', NULL, NULL, NULL, 'ลูกกอล์ฟ(แพ็ก) มีรอยขีดข่วนเล็กน้อย', 79.00, '2026-01-19 19:32:44'),
(727, 'GF02-0028', 'B010', 'S024', NULL, NULL, NULL, 'ลูกกอล์ฟ(แพ็ก) ไม่สามารถใช้งานได้', 108.00, '2025-11-24 11:01:46'),
(731, 'GF03-0022', 'B005', 'S020', NULL, NULL, NULL, 'ถุงกอล์ฟ สายรัดหลวม', 64.00, '2025-12-03 11:31:26'),
(739, 'PP02-0006', 'B002', 'S010', NULL, NULL, NULL, 'เน็ตปิงปอง ไม่สามารถใช้งานได้', 101.00, '2026-01-02 20:12:33'),
(743, 'PP04-0004', 'B001', 'S005', NULL, NULL, NULL, 'ลูกปิงปอง(แพ็ก) สีซีดจาง', 50.00, '2026-01-07 19:23:11'),
(748, 'PT01-0004', 'B001', 'S005', NULL, NULL, NULL, 'ลูกเปตอง ผิวหนังฉีกเล็กน้อย', 82.00, '2026-01-21 11:41:28'),
(749, 'PT01-0010', 'B002', 'S009', NULL, NULL, NULL, 'ลูกเปตอง สีซีดจาง', 71.00, '2025-12-03 13:02:33'),
(752, 'PT01-0028', 'B010', 'S025', NULL, NULL, NULL, 'ลูกเปตอง ไม่สามารถใช้งานได้', 102.00, '2026-01-12 14:36:19'),
(754, 'PT02-0006', 'B002', 'S010', NULL, NULL, NULL, 'วงกลมเปตอง กลิ่นไม่พึงประสงค์', 89.00, '2025-12-03 08:28:24'),
(755, 'PT02-0009', 'B003', 'S014', NULL, NULL, NULL, 'วงกลมเปตอง สายรัดขาดบางส่วน', 96.00, '2025-11-25 11:21:50'),
(760, 'PT03-0009', 'B003', 'S014', NULL, NULL, NULL, 'ลูกเป้า(แพ็ก) สูญเสียแรงดัน', 93.00, '2025-12-31 13:32:31'),
(763, 'AR01-0004', 'B001', 'S005', NULL, NULL, NULL, 'คันธนูฝึกซ้อม กลิ่นไม่พึงประสงค์', 99.00, '2026-01-22 17:10:12'),
(764, 'AR01-0009', 'B002', 'S009', NULL, NULL, NULL, 'คันธนูฝึกซ้อม แตก', 103.00, '2025-11-24 13:29:23'),
(765, 'AR01-0014', 'B003', 'S014', NULL, NULL, NULL, 'คันธนูฝึกซ้อม มีรอยขีดข่วนเล็กน้อย', 63.00, '2026-01-19 20:38:20'),
(766, 'AR01-0019', 'B005', 'S020', NULL, NULL, NULL, 'คันธนูฝึกซ้อม สูญเสียแรงดัน', 88.00, '2026-01-06 11:07:54'),
(772, 'AR02-0036', 'B010', 'S024', NULL, NULL, NULL, 'ลูกธนู(แพ็ก) มีรอยร้าว', 98.00, '2026-01-01 12:53:18'),
(792, 'AT01-0024', 'B010', 'S024', NULL, NULL, NULL, 'คฑาวิ่งผลัด กลิ่นไม่พึงประสงค์', 100.00, '2025-11-26 15:18:21'),
(793, 'AT02-0004', 'B001', 'S005', NULL, NULL, NULL, 'กรวยซ้อมกรีฑา(แพ็ก) แตก', 116.00, '2026-01-15 14:11:42'),
(797, 'AT02-0040', 'B010', 'S025', NULL, NULL, NULL, 'กรวยซ้อมกรีฑา(แพ็ก) โครงสร้างเสียหาย', 106.00, '2025-11-23 20:50:43'),
(799, 'AT03-0009', 'B002', 'S009', NULL, NULL, NULL, 'บล็อกสตาร์ท ไม่สามารถใช้งานได้', 119.00, '2026-01-11 09:03:17'),
(801, 'AT03-0019', 'B005', 'S019', NULL, NULL, NULL, 'บล็อกสตาร์ท ผิวสึก', 54.00, '2026-01-13 13:39:16'),
(802, 'AT03-0024', 'B010', 'S025', NULL, NULL, NULL, 'บล็อกสตาร์ท โครงสร้างเสียหาย', 109.00, '2026-01-14 09:29:36'),
(807, 'TK01-0036', 'B010', 'S025', NULL, NULL, NULL, 'ลูกตะกร้อ สายรัดขาดบางส่วน', 81.00, '2025-12-02 13:16:21'),
(811, 'FB02-0044', 'B004', 'S030', NULL, NULL, NULL, 'ลูกฟุตซอล แตก', 117.00, '2026-01-11 20:21:10'),
(813, 'FB04-0029', 'B004', 'S030', NULL, NULL, NULL, 'เสื้อเอี๊ยมฝึกซ้อม มีรอยร้าว', 91.00, '2026-01-19 20:04:47'),
(814, 'BB01-0047', 'B004', 'S030', NULL, NULL, NULL, 'ลูกบาสเกตบอล สูญเสียแรงดัน', 86.00, '2026-01-02 20:40:30'),
(816, 'BB04-0030', 'B004', 'S029', NULL, NULL, NULL, 'ลูกแชร์บอล ผิวสึก', 59.00, '2025-11-30 15:17:36'),
(817, 'VB01-0047', 'B004', 'S030', NULL, NULL, NULL, 'ลูกวอลเลย์บอล ไม่สามารถใช้งานได้', 120.00, '2025-11-26 09:56:07'),
(820, 'BD01-0104', 'B004', 'S030', NULL, NULL, NULL, 'ไม้แบดมินตัน มีรอยร้าว', 96.00, '2026-01-21 18:01:39'),
(824, 'SW01-0055', 'B004', 'S030', NULL, NULL, NULL, 'แว่นตาว่ายน้ำ แตก', 106.00, '2025-11-25 13:39:37'),
(825, 'SW02-0031', 'B004', 'S029', NULL, NULL, NULL, 'โฟมลอยน้ำ มีรอยร้าว', 83.00, '2026-01-15 19:10:58'),
(826, 'SW03-0055', 'B004', 'S029', NULL, NULL, NULL, 'หมวกว่ายน้ำ มีรอยร้าว', 97.00, '2026-01-11 15:06:08'),
(830, 'AR01-0029', 'B004', 'S029', NULL, NULL, NULL, 'คันธนูฝึกซ้อม สายรัดขาดบางส่วน', 88.00, '2025-11-26 17:16:48'),
(834, 'AT02-0052', 'B004', 'S029', NULL, NULL, NULL, 'กรวยซ้อมกรีฑา(แพ็ก) ไม่สามารถใช้งานได้', 114.00, '2025-11-28 20:03:32'),
(837, 'AT03-0001', 'B001', 'S002', NULL, NULL, NULL, 'มันขาดเล็กน้อย', NULL, '2026-02-16 18:19:20'),
(847, 'AT02-0005', 'B001', 'S002', NULL, 2, 2, 'ทดสอบระบบ', 0.00, '2026-02-16 19:27:16'),
(848, 'AR01-0004', 'B001', 'S002', 'C33085', 2, 2, 'สายเอ็นขาด', 0.00, '2026-02-16 20:10:58'),
(849, 'GF03-0004', 'B001', 'S002', 'C33085', 3, 2, 'หมาขาบ', 0.00, '2026-02-16 20:49:55'),
(850, 'AR03-0002', 'B001', 'S002', 'C33085', 3, 3, 'runrang', 10.00, '2026-02-17 18:26:23'),
(851, 'AR02-0009', 'B002', 'S007', 'C88103', 1, 1, 'หัวลูกศรทู่', 0.00, '2026-02-17 18:52:07'),
(852, 'PT03-0001', 'B001', 'S005', 'C33085', 1, 1, 'ถลอก', 0.00, '2026-02-17 19:26:47'),
(853, 'AT03-0002', 'B001', 'S005', 'C33085', 1, 3, 'มันดีมาก', 500.00, '2026-02-17 20:02:38'),
(854, 'AT01-0001', 'B001', 'S002', 'C33085', 1, 3, 'คทาโดนบุบ', 50.00, '2026-02-18 20:39:02'),
(855, 'FT03-0001', 'B001', 'S001', 'C25261', 1, 2, 'มันจะหล่นทับหัว เพราะ มันคอน', 0.00, '2026-03-20 19:49:55');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_status`
--

CREATE TABLE `maintenance_status` (
  `status_id` int(11) NOT NULL,
  `name_en` varchar(50) NOT NULL,
  `name_th` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `maintenance_status`
--

INSERT INTO `maintenance_status` (`status_id`, `name_en`, `name_th`, `description`) VALUES
(1, 'PENDING', 'รอดำเนินการ', 'รอเจ้าหน้าที่ดำเนินการตรวจสอบ'),
(2, 'IN_PROGRESS', 'กำลังดำเนินการ', 'กำลังอยู่ระหว่างการซ่อม'),
(3, 'COMPLETED', 'ดำเนินการเสร็จสิ้น', 'ซ่อมเสร็จเรียบร้อยแล้ว');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` bigint(20) NOT NULL,
  `booking_id` varchar(20) NOT NULL,
  `method_id` int(11) NOT NULL,
  `branch_id` varchar(20) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_status_id` int(11) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `slip_url` text DEFAULT NULL,
  `refund_amount` decimal(10,2) DEFAULT 0.00,
  `refund_at` datetime DEFAULT NULL,
  `slip_refund` text DEFAULT NULL,
  `processed_by_staff_id` varchar(20) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `booking_id`, `method_id`, `branch_id`, `amount`, `payment_status_id`, `paid_at`, `slip_url`, `refund_amount`, `refund_at`, `slip_refund`, `processed_by_staff_id`, `note`) VALUES
(144, 'BK454414', 2, 'B003', 270.00, 3, '2026-02-15 13:06:38', '/sports_rental_system/uploads/slips/pay_BK454414_1771135598.jpg', 0.00, NULL, NULL, NULL, NULL),
(145, 'BK815266', 1, 'B003', 380.00, 3, '2026-02-15 13:12:25', NULL, 0.00, NULL, NULL, 'S012', 'ชำระเงินสด'),
(146, 'BK031829', 2, 'B003', 900.00, 3, '2026-02-15 13:15:52', NULL, 0.00, NULL, NULL, 'S012', 'ชำระผ่าน QR'),
(147, 'BK683282', 2, 'B003', 432.00, 3, '2026-02-15 13:18:57', '/sports_rental_system/uploads/slips/pay_BK683282_1771136337.jpg', 0.00, NULL, NULL, NULL, NULL),
(148, 'BK779523', 2, 'B003', 140.00, 6, '2026-02-15 13:21:41', '/sports_rental_system/uploads/slips/pay_BK779523_1771136501.jpg', 0.00, NULL, NULL, NULL, NULL),
(149, 'BK973954', 2, 'B005', 130.00, 3, '2026-02-15 19:29:42', '/sports_rental_system/uploads/slips/pay_BK973954_1771158582.jpg', 0.00, NULL, NULL, NULL, NULL),
(150, 'BK233510', 2, 'B005', 120.00, 3, '2026-02-15 19:32:33', NULL, 0.00, NULL, NULL, 'S017', 'ชำระผ่าน QR'),
(151, 'BK998748', 1, 'B001', 35.00, 3, '2026-02-16 17:45:20', NULL, 0.00, NULL, NULL, 'S002', 'ชำระเงินสด'),
(152, 'BK938347', 2, 'B001', 2099.00, 3, '2026-02-16 20:36:03', '/sports_rental_system/uploads/slips/pay_BK938347_1771248963.png', 0.00, NULL, NULL, NULL, NULL),
(153, 'BK744345', 2, 'B001', 2925.00, 3, '2026-02-16 20:46:51', '/sports_rental_system/uploads/slips/pay_BK744345_1771249611.png', 0.00, NULL, NULL, NULL, NULL),
(154, 'BK455797', 2, 'B001', 48.00, 3, '2026-02-16 21:05:14', '/sports_rental_system/uploads/slips/pay_BK455797_1771250714.png', 0.00, NULL, NULL, NULL, NULL),
(155, 'BK274344', 2, 'B001', 85.00, 5, '2026-02-17 14:04:38', '/sports_rental_system/uploads/slips/pay_BK274344_1771311878.jpg', 85.00, '2026-02-17 14:54:47', '/sports_rental_system/uploads/refunds/refund_BK274344_1771314887.jpg', 'S002', ''),
(156, 'BK144868', 1, 'B001', 50.00, 3, '2026-02-17 14:09:18', NULL, 0.00, NULL, NULL, 'S002', 'ชำระเงินสด'),
(157, 'BK950826', 1, 'B001', 60.00, 3, '2026-02-17 14:10:36', NULL, 0.00, NULL, NULL, 'S002', 'ชำระเงินสด'),
(158, 'BK050453', 1, 'B001', 70.00, 3, '2026-02-17 14:14:59', NULL, 0.00, NULL, NULL, 'S002', 'ชำระเงินสด'),
(159, 'BK972372', 2, 'B001', 35.00, 5, '2026-02-17 14:57:22', '/sports_rental_system/uploads/slips/pay_BK972372_1771315042.jpg', 35.00, '2026-02-17 15:15:03', '/sports_rental_system/uploads/refunds/refund_BK972372_1771316103.jpg', 'S002', ''),
(160, 'BK606939', 2, 'B001', 100.00, 5, '2026-02-17 15:16:30', '/sports_rental_system/uploads/slips/pay_BK606939_1771316190.png', 100.00, '2026-02-17 15:16:51', '/sports_rental_system/uploads/refunds/refund_BK606939_1771316211.jpg', 'S002', ''),
(161, 'BK942167', 2, 'B001', 100.00, 3, '2026-02-17 15:41:56', '/sports_rental_system/uploads/slips/pay_BK942167_1771317716.png', 0.00, NULL, NULL, NULL, NULL),
(162, 'BK703684', 2, 'B001', 25.00, 3, '2026-02-17 15:43:45', '/sports_rental_system/uploads/slips/pay_BK703684_1771317825.png', 0.00, NULL, NULL, NULL, NULL),
(163, 'BK949371', 2, 'B001', 35.00, 5, '2026-02-17 16:47:10', '/sports_rental_system/uploads/slips/pay_BK949371_1771321630.jpg', 35.00, '2026-02-17 16:47:40', '/sports_rental_system/uploads/refunds/refund_BK949371_1771321660.jpg', 'S002', ''),
(164, 'BK255982', 2, 'B001', 558.00, 3, '2026-02-17 18:17:49', '/sports_rental_system/uploads/slips/pay_BK255982_1771327069.jpg', 0.00, NULL, NULL, NULL, NULL),
(165, 'BK174897', 2, 'B001', 165.00, 5, '2026-02-17 18:20:17', '/sports_rental_system/uploads/slips/pay_BK174897_1771327217.jpg', 165.00, '2026-02-17 18:21:29', '/sports_rental_system/uploads/refunds/refund_BK174897_1771327289.jpg', 'S002', ''),
(166, 'BK196966', 2, 'B001', 1070.00, 3, '2026-02-17 18:22:15', '/sports_rental_system/uploads/slips/pay_BK196966_1771327335.jpg', 0.00, NULL, NULL, NULL, NULL),
(167, 'BK833839', 2, 'B002', 680.00, 3, '2026-02-17 18:32:05', '/sports_rental_system/uploads/slips/pay_BK833839_1771327925.png', 0.00, NULL, NULL, NULL, NULL),
(168, 'BK001338', 1, 'B002', 800.00, 3, '2026-02-17 18:42:15', NULL, 0.00, NULL, NULL, 'S007', 'ชำระเงินสด'),
(169, 'BK574824', 2, 'B002', 1275.00, 5, '2026-02-17 18:44:33', '/sports_rental_system/uploads/slips/pay_BK574824_1771328673.jpg', 1275.00, '2026-02-17 18:45:59', '/sports_rental_system/uploads/refunds/refund_BK574824_1771328759.jpg', 'S007', ''),
(170, 'BK076066', 2, 'B005', 150.00, 3, '2026-02-18 13:10:19', '/sports_rental_system/uploads/slips/pay_BK076066_1771395019.png', 0.00, NULL, NULL, NULL, NULL),
(171, 'BK003355', 2, 'B010', 325.00, 3, '2026-02-18 13:32:42', '/sports_rental_system/uploads/slips/pay_BK003355_1771396362.jpg', 0.00, NULL, NULL, NULL, NULL),
(172, 'BK748009', 1, 'B010', 200.00, 3, '2026-02-18 13:35:33', NULL, 0.00, NULL, NULL, 'S023', 'ชำระเงินสด'),
(173, 'BK455152', 1, 'B010', 215.00, 3, '2026-02-18 13:37:11', NULL, 0.00, NULL, NULL, 'S023', 'ชำระเงินสด'),
(174, 'BK814234', 2, 'B010', 40.00, 5, '2026-02-18 13:38:24', '/sports_rental_system/uploads/slips/pay_BK814234_1771396704.png', 40.00, '2026-02-18 13:38:53', '/sports_rental_system/uploads/refunds/refund_BK814234_1771396733.jpg', 'S023', ''),
(175, 'BK130179', 2, 'B001', 35.00, 5, '2026-02-18 18:33:35', '/sports_rental_system/uploads/slips/pay_BK130179_1771414415.png', 35.00, '2026-02-18 20:37:36', '/sports_rental_system/uploads/refunds/refund_BK130179_1771421856.png', 'S002', ''),
(176, 'BK613961', 2, 'B001', 25.00, 5, '2026-02-18 18:52:21', '/sports_rental_system/uploads/slips/pay_BK613961_1771415541.jpg', 25.00, '2026-02-18 18:53:43', '/sports_rental_system/uploads/refunds/refund_BK613961_1771415623.jpg', 'S002', ''),
(177, 'BK258702', 2, 'B001', 235.00, 3, '2026-02-18 20:32:46', '/sports_rental_system/uploads/slips/pay_BK258702_1771421566.jpg', 0.00, NULL, NULL, NULL, NULL),
(178, 'BK109874', 2, 'B001', 35.00, 5, '2026-03-18 12:59:40', '/sports_rental_system/uploads/slips/pay_BK109874_1773813580.png', 35.00, '2026-03-18 13:00:17', '/sports_rental_system/uploads/refunds/refund_BK109874_1773813617.png', 'S002', ''),
(179, 'BK615294', 2, 'B001', 360.00, 3, '2026-03-20 18:55:38', '/sports_rental_system/uploads/slips/pay_BK615294_1774007738.png', 0.00, NULL, NULL, NULL, NULL),
(180, 'BK342739', 2, 'B001', 25.00, 3, '2026-03-20 20:46:55', '/sports_rental_system/uploads/slips/pay_BK342739_1774014415.png', 0.00, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `method_id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `name_en` varchar(50) NOT NULL,
  `name_th` varchar(50) DEFAULT NULL,
  `provider` varchar(50) DEFAULT NULL,
  `fee_percent` decimal(5,2) DEFAULT 0.00,
  `supports_refund` tinyint(1) DEFAULT 1,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`method_id`, `code`, `name_en`, `name_th`, `provider`, `fee_percent`, `supports_refund`, `is_active`) VALUES
(1, 'CASH', 'Cash', 'เงินสด', 'Counter Service', 0.00, 1, 1),
(2, 'QR', 'QR Payment', 'ชำระเงินผ่าน QR Code', 'PromptPay', 0.00, 1, 1),
(3, 'CREDIT_CARD', 'Credit Card', 'บัตรเครดิต', 'Visa/Mastercard', 2.50, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `payment_status`
--

CREATE TABLE `payment_status` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name_th` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_status`
--

INSERT INTO `payment_status` (`id`, `code`, `name_th`, `description`, `created_at`) VALUES
(1, 'UNPAID', 'รอชำระเงิน', 'ยังไม่ได้โอนเงิน', '2026-02-06 11:28:54'),
(2, 'WAITING_VERIFY', 'รอตรวจสลิป', 'ลูกค้าอัปโหลดสลิปแล้ว รอ staff ตรวจ', '2026-02-06 11:28:54'),
(3, 'PAID', 'ชำระแล้ว', 'staff ตรวจผ่านและยืนยันแล้ว', '2026-02-06 11:28:54'),
(4, 'REJECTED', 'สลิปไม่ผ่าน', 'ต้องอัปโหลดใหม่', '2026-02-06 11:28:54'),
(5, 'REFUNDED', 'คืนเงินแล้ว', 'คืนเงินเต็มจำนวน', '2026-02-06 11:28:54'),
(6, 'CANCELLED', 'ยกเลิก', 'ลูกค้ายกเลิกการจอง', '2026-02-06 11:28:54'),
(7, 'EXPIRED', 'หมดเวลาชำระ', 'ไม่ชำระภายในเวลาที่กำหนด', '2026-02-06 11:28:54');

-- --------------------------------------------------------

--
-- Table structure for table `point_history`
--

CREATE TABLE `point_history` (
  `history_id` bigint(20) NOT NULL,
  `customer_id` varchar(20) DEFAULT NULL,
  `booking_id` varchar(20) DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `amount` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `point_history`
--

INSERT INTO `point_history` (`history_id`, `customer_id`, `booking_id`, `type`, `amount`, `description`) VALUES
(117, 'C88103', 'BK454414', 'earn', 2, 'ได้แต้มจากการเช่า'),
(118, 'C88103', 'BK683282', 'earn', 4, 'ได้แต้มจากการเช่า'),
(119, 'C88103', 'BK973954', 'earn', 1, 'ได้แต้มจากการเช่า'),
(120, 'C33085', 'BK938347', 'use', -1, 'ใช้แต้มจากการเช่า'),
(121, 'C33085', 'BK938347', 'earn', 20, 'ได้แต้มจากการเช่า'),
(122, 'C33085', 'BK744345', 'earn', 29, 'ได้แต้มจากการเช่า'),
(123, 'C33085', 'BK942167', 'earn', 1, 'ได้แต้มจากการเช่า'),
(124, 'C33085', 'BK255982', 'earn', 5, 'ได้แต้มจากการเช่า'),
(125, 'C33085', 'BK196966', 'earn', 10, 'ได้แต้มจากการเช่า'),
(126, 'C88103', 'BK833839', 'earn', 6, 'ได้แต้มจากการเช่า'),
(127, 'C33085', 'BK076066', 'earn', 1, 'ได้แต้มจากการเช่า'),
(128, 'C48699', 'BK003355', 'earn', 3, 'ได้แต้มจากการเช่า'),
(129, 'C33085', 'BK613961', 'use', -10, 'ใช้แต้มจากการเช่า'),
(130, 'C33085', 'BK258702', 'use', -5, 'ใช้แต้มจากการเช่า'),
(131, 'C33085', 'BK258702', 'earn', 2, 'ได้แต้มจากการเช่า'),
(132, 'C25261', 'BK615294', 'earn', 3, 'ได้แต้มจากการเช่า');

-- --------------------------------------------------------

--
-- Table structure for table `provinces`
--

CREATE TABLE `provinces` (
  `province_id` varchar(3) NOT NULL,
  `name` varchar(100) NOT NULL,
  `region_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provinces`
--

INSERT INTO `provinces` (`province_id`, `name`, `region_id`) VALUES
('1', 'กระบี่', 6),
('10', 'ชัยนาท', 2),
('11', 'ชัยภูมิ', 5),
('12', 'ชุมพร', 6),
('13', 'เชียงราย', 1),
('14', 'เชียงใหม่', 1),
('15', 'ตรัง', 6),
('16', 'ตราด', 3),
('17', 'ตาก', 1),
('18', 'นครนายก', 2),
('19', 'นครปฐม', 2),
('2', 'กรุงเทพมหานคร', 2),
('20', 'นครพนม', 5),
('21', 'นครราชสีมา', 5),
('22', 'นครศรีธรรมราช', 6),
('23', 'นครสวรรค์', 2),
('24', 'นนทบุรี', 2),
('25', 'นราธิวาส', 6),
('26', 'น่าน', 1),
('27', 'บึงกาฬ', 5),
('28', 'บุรีรัมย์', 5),
('29', 'ปทุมธานี', 2),
('3', 'กาญจนบุรี', 4),
('30', 'ประจวบคีรีขันธ์', 6),
('31', 'ปราจีนบุรี', 3),
('32', 'ปัตตานี', 6),
('33', 'พระนครศรีอยุธยา', 2),
('34', 'พะเยา', 1),
('35', 'พังงา', 6),
('36', 'พัทลุง', 6),
('37', 'พิจิตร', 2),
('38', 'พิษณุโลก', 1),
('39', 'เพชรบุรี', 4),
('4', 'กาฬสินธุ์', 5),
('40', 'เพชรบูรณ์', 2),
('41', 'แพร่', 1),
('42', 'ภูเก็ต', 6),
('43', 'มหาสารคาม', 5),
('44', 'มุกดาหาร', 5),
('45', 'แม่ฮ่องสอน', 1),
('46', 'ยะลา', 6),
('47', 'ยโสธร', 5),
('48', 'ร้อยเอ็ด', 5),
('49', 'ระนอง', 6),
('5', 'กำแพงเพชร', 2),
('50', 'ระยอง', 3),
('51', 'ราชบุรี', 4),
('52', 'ลพบุรี', 2),
('53', 'ลำปาง', 1),
('54', 'ลำพูน', 1),
('55', 'เลย', 5),
('56', 'ศรีสะเกษ', 5),
('57', 'สกลนคร', 5),
('58', 'สงขลา', 6),
('59', 'สตูล', 6),
('6', 'ขอนแก่น', 5),
('60', 'สมุทรปราการ', 2),
('61', 'สมุทรสงคราม', 2),
('62', 'สมุทรสาคร', 2),
('63', 'สระแก้ว', 3),
('64', 'สระบุรี', 2),
('65', 'สิงห์บุรี', 2),
('66', 'สุโขทัย', 1),
('67', 'สุพรรณบุรี', 2),
('68', 'สุราษฎร์ธานี', 6),
('69', 'สุรินทร์', 5),
('7', 'จันทบุรี', 3),
('70', 'หนองคาย', 5),
('71', 'หนองบัวลำภู', 5),
('72', 'อ่างทอง', 2),
('73', 'อำนาจเจริญ', 5),
('74', 'อุดรธานี', 5),
('75', 'อุตรดิตถ์', 1),
('76', 'อุทัยธานี', 2),
('77', 'อุบลราชธานี', 5),
('8', 'ฉะเชิงเทรา', 3),
('9', 'ชลบุรี', 3);

-- --------------------------------------------------------

--
-- Table structure for table `region`
--

CREATE TABLE `region` (
  `region_id` int(11) NOT NULL,
  `region_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `region`
--

INSERT INTO `region` (`region_id`, `region_name`) VALUES
(2, 'ภาคกลาง'),
(4, 'ภาคตะวันตก'),
(3, 'ภาคตะวันออก'),
(5, 'ภาคตะวันออกเฉียงเหนือ'),
(1, 'ภาคเหนือ'),
(6, 'ภาคใต้');

-- --------------------------------------------------------

--
-- Table structure for table `return_conditions`
--

CREATE TABLE `return_conditions` (
  `condition_id` int(11) NOT NULL,
  `name_en` varchar(50) NOT NULL,
  `name_th` varchar(50) NOT NULL,
  `fine_percent` decimal(5,2) DEFAULT 0.00,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `return_conditions`
--

INSERT INTO `return_conditions` (`condition_id`, `name_en`, `name_th`, `fine_percent`, `description`) VALUES
(1, 'Good', 'ปกติ/สมบูรณ์', 0.00, 'อุปกรณ์อยู่ในสภาพดี ไม่มีความเสียหาย'),
(2, 'Damaged_Minor', 'ชำรุดเล็กน้อย', 20.00, 'ชำรุดเล็กน้อย แต่ยังใช้งานได้'),
(3, 'Damaged_Major', 'ชำรุดเสียหาย', 50.00, 'อุปกรณ์ชำรุดหนัก ไม่สามารถใช้งานได้'),
(4, 'Lost', 'สูญหาย', 100.00, 'อุปกรณ์สูญหาย ลูกค้าต้องชดใช้เต็มจำนวน');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `review_id` bigint(20) NOT NULL,
  `booking_id` varchar(20) NOT NULL,
  `detail_id` bigint(20) NOT NULL,
  `instance_code` varchar(50) DEFAULT NULL,
  `venue_id` varchar(20) DEFAULT NULL,
  `review_text` text NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `review_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`review_id`, `booking_id`, `detail_id`, `instance_code`, `venue_id`, `review_text`, `rating`, `review_date`) VALUES
(35, 'BK744345', 385, 'BB01-0009', NULL, 'ดี', 5, '2026-02-16 20:50:57'),
(36, 'BK744345', 386, 'BB02-0007', NULL, 'เยี่ยมมม', 2, '2026-02-17 16:40:30'),
(37, 'BK196966', 410, 'BB01-0004', NULL, 'good', 5, '2026-02-17 18:24:57'),
(38, 'BK050453', 398, 'BG02-0001', NULL, 'good', 5, '2026-02-17 18:25:27'),
(39, 'BK833839', 413, 'AT02-0010', NULL, 'อุปกรณ์สะอาด', 5, '2026-02-17 18:39:55'),
(40, 'BK833839', 414, 'AT02-0011', NULL, 'อุปกรณ์สะอาด', 5, '2026-02-17 18:40:08'),
(41, 'BK833839', 415, 'AT01-0006', NULL, 'ดีมาก', 4, '2026-02-17 18:40:18'),
(42, 'BK833839', 416, 'AT03-0006', NULL, 'ใช้งานได้ปกติ', 5, '2026-02-17 18:40:29'),
(43, 'BK833839', 417, NULL, 'V035', 'สนามสะอาด', 5, '2026-02-17 18:40:42'),
(44, 'BK748009', 435, 'TK01-0033', NULL, 'เยี่ยมยอด เตะที เด้งดึ๋งๆๆ', 5, '2026-02-18 13:39:14'),
(45, 'BK748009', 436, NULL, 'V070', 'มีขี้นกเยอะมาก', 1, '2026-02-18 15:42:29'),
(46, 'BK455152', 437, NULL, 'V077', 'ว๊าววว', 4, '2026-02-18 15:55:07'),
(47, 'BK003355', 431, NULL, 'V065', 'สุดจ๊าบบบ', 3, '2026-02-18 15:55:16'),
(48, 'BK003355', 432, 'BD01-0073', NULL, 'ไม้จะหักอยู่ละ', 1, '2026-02-18 15:55:23'),
(49, 'BK003355', 434, 'BD02-0025', NULL, 'ก๊ากกาก ขนจะหลุดเป็นไก่ต้มละ', 1, '2026-02-18 15:55:37'),
(50, 'BK342739', 447, 'BB03-0001', NULL, 'สุดยอดเวรี่กู๊ด', 5, '2026-03-21 08:59:57'),
(51, 'BK615294', 446, 'SW01-0001', NULL, 'แว่นแก่มาก', 1, '2026-03-21 09:00:06');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `can_approve_booking` tinyint(1) NOT NULL DEFAULT 0,
  `can_process_refund` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`, `description`, `can_approve_booking`, `can_process_refund`) VALUES
(1, 'Executive', 'ผู้บริหาร', 0, 0),
(2, 'Counter Staff', 'เจ้าหน้าที่เช่า-คืนอุปกรณ์', 1, 1),
(3, 'Warehouse Admin', 'ผู้ดูแลคลังอุปกรณ์', 0, 0),
(4, 'Rector', 'อธิการบดี', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` varchar(20) NOT NULL,
  `role_id` int(11) NOT NULL,
  `gender_id` int(11) NOT NULL,
  `branch_id` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `role_id`, `gender_id`, `branch_id`, `name`, `department`, `email`, `password_hash`) VALUES
('S001', 3, 1, 'B001', 'สุเมธ วัฒนชัย', 'คลังอุปกรณ์ - ตรวจสอบสภาพ', 'sumet@nu.ac.th', 'sumet_jaidee'),
('S002', 2, 2, 'B001', 'รัตนา คงกิจ', 'เจ้าหน้าที่เช่า-คืนอุปกรณ์', 'rattana@nu.ac.th', 'rattana_jaidee'),
('S003', 2, 1, 'B001', 'ธนพล ศิริวงศ์', 'เจ้าหน้าที่เช่า-คืนอุปกรณ์', 'thanapon@nu.ac.th', 'hashed_pw003'),
('S004', 4, 1, 'B001', 'ดร.สมชาย วิริยะ', 'อธิการบดี', 'somchai@nu.ac.th', 'hashed_pw004'),
('S005', 3, 3, 'B001', 'พสุ อนันตกุล', 'คลังอุปกรณ์ - รับเข้าอุปกรณ์', 'phasu@nu.ac.th', 'hashed_pw005'),
('S006', 1, 1, NULL, 'วินัย ใจดี', 'ผู้บริหาร', 'Winai@nu.ac.th', 'winai_jaidee'),
('S007', 2, 1, 'B002', 'ภาณุเดช พัฒนกุล', 'เจ้าหน้าที่เช่า-คืนอุปกรณ์', 'phanudet@cmu.ac.th', 'hashed_pw007'),
('S008', 2, 2, 'B002', 'สุชาดา จันทร์เพ็ญ', 'เจ้าหน้าที่เช่า-คืนอุปกรณ์', 'suchada@cmu.ac.th', 'hashed_pw008'),
('S009', 3, 1, 'B002', 'สมชาย แก้วคำ', 'คลังอุปกรณ์ - ซ่อมบำรุง', 'somchai@cmu.ac.th', 'hashed_pw009'),
('S010', 3, 2, 'B002', 'อัญชลี มณีรัตน์', 'คลังอุปกรณ์ - ควบคุมสต็อก', 'anchalee@cmu.ac.th', 'hashed_pw010'),
('S011', 4, 2, 'B002', 'ดร.สุภาวดี แสงทอง', 'อธิการบดี', 'supavadee@cmu.ac.th', 'hashed_pw011'),
('S012', 2, 1, 'B003', 'อภิชาติ บุญเรือง', 'เจ้าหน้าที่เช่า-คืนอุปกรณ์', 'apichat@kku.ac.th', 'hashed_pw012'),
('S013', 2, 2, 'B003', 'พิมพ์ชนก ศรีทอง', 'เจ้าหน้าที่เช่า-คืนอุปกรณ์', 'pimchanok@kku.ac.th', 'hashed_pw013'),
('S014', 3, 1, 'B003', 'ธีรภัทร โชติวงศ์', 'คลังอุปกรณ์ - ตรวจสอบคุณภาพ', 'teerapat@kku.ac.th', 'hashed_pw014'),
('S015', 3, 3, 'B003', 'ชยพล อินทร์แก้ว', 'คลังอุปกรณ์ - รับเข้าอุปกรณ์', 'chayapon@kku.ac.th', 'hashed_pw015'),
('S016', 4, 1, 'B003', 'ดร.กิตติพงษ์ ชัยดี', 'อธิการบดี', 'kittipong@kku.ac.th', 'hashed_pw016'),
('S017', 2, 2, 'B005', 'ณัฐกานต์ พูลสวัสดิ์', 'เจ้าหน้าที่เช่า-คืนอุปกรณ์', 'nattakan@tu.ac.th', 'hashed_pw017'),
('S018', 2, 1, 'B005', 'ธันวา ภูริเดช', 'เจ้าหน้าที่เช่า-คืนอุปกรณ์', 'thanwa@tu.ac.th', 'hashed_pw018'),
('S019', 3, 2, 'B005', 'สุภาวดี จิตร์แก้ว', 'คลังอุปกรณ์ - ควบคุมสต็อก', 'supawadee@tu.ac.th', 'hashed_pw019'),
('S020', 3, 1, 'B005', 'กฤษณะ ศรีชัย', 'คลังอุปกรณ์ - ซ่อมบำรุง', 'krisana@tu.ac.th', 'hashed_pw020'),
('S021', 4, 2, 'B004', 'ดร.พิมพ์ชนก วัฒนา', 'อธิการบดี', 'pimchanok@b004.ac.th', 'hashed_pw021'),
('S022', 2, 1, 'B010', 'จักรกฤษณ์ มณีวงศ์', 'เจ้าหน้าที่เช่า-คืนอุปกรณ์', 'jakkrit@ku.ac.th', 'hashed_pw022'),
('S023', 2, 3, 'B010', 'ศุภชัย พรหมรักษ์', 'เจ้าหน้าที่เช่า-คืนอุปกรณ์', 'supachai@ku.ac.th', 'hashed_pw023'),
('S024', 3, 2, 'B010', 'กมลชนก วัฒนะ', 'คลังอุปกรณ์ - ตรวจสอบสภาพ', 'kamonchanok@ku.ac.th', 'hashed_pw024'),
('S025', 3, 1, 'B010', 'นที วงศ์วิริยะ', 'คลังอุปกรณ์ - รับเข้าอุปกรณ์', 'natee@ku.ac.th', 'hashed_pw025'),
('S026', 4, 1, 'B005', 'ดร.อนุชา ศรีสุข', 'อธิการบดี', 'anucha@tu.ac.th', 'hashed_pw026'),
('S027', 2, 1, 'B004', 'นันทนา สุขใจ', 'เจ้าหน้าที่เช่า-คืนอุปกรณ์', 'nantana@b004.ac.th', 'hashed_pw027'),
('S028', 2, 2, 'B004', 'ประสิทธิ์ รุ่งเรือง', 'เจ้าหน้าที่เช่า-คืนอุปกรณ์', 'prasit@b004.ac.th', 'hashed_pw028'),
('S029', 3, 1, 'B004', 'สุนันท์ วงศ์ไทย', 'คลังอุปกรณ์ - ตรวจสอบสภาพ', 'sunant@b004.ac.th', 'hashed_pw029'),
('S030', 3, 2, 'B004', 'มานิตย์ พัฒนา', 'คลังอุปกรณ์ - รับเข้าอุปกรณ์', 'manit@b004.ac.th', 'hashed_pw030'),
('S031', 4, 2, 'B010', 'ดร.ณัฐพร คุ้มน้อยเล็ก', 'อธิการบดี', 'nattaporn@ku.ac.th', 'hashed_pw031');

-- --------------------------------------------------------

--
-- Table structure for table `venues`
--

CREATE TABLE `venues` (
  `venue_id` varchar(20) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `branch_id` varchar(20) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `image_url` text DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `price_per_hour` decimal(10,2) DEFAULT 0.00,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `venues`
--

INSERT INTO `venues` (`venue_id`, `category_id`, `branch_id`, `name`, `image_url`, `type`, `price_per_hour`, `is_active`) VALUES
('V001', 1, 'B001', 'สนามฟุตบอล 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V001.jpg\n', 'Outdoor', 300.00, 1),
('V002', 1, 'B001', 'สนามฟุตบอล 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V002.jpg', 'Outdoor', 300.00, 1),
('V003', 7, 'B001', 'สนามซ้อมกอล์ฟ 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V003.jpg', 'Indoor', 320.00, 1),
('V004', 7, 'B001', 'สนามซ้อมกอล์ฟ 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V004.jpg', 'Indoor', 320.00, 1),
('V005', 4, 'B001', 'คอร์ทแบดมินตัน A', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V005.jpg', 'Indoor', 180.00, 1),
('V006', 4, 'B001', 'คอร์ทแบดมินตัน B', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V006.jpg', 'Indoor', 180.00, 1),
('V007', 2, 'B001', 'สนามบาสเกตบอลในร่ม', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V007.jpg', 'Indoor', 250.00, 1),
('V008', 2, 'B001', 'สนามบาสเกตบอลกลางแจ้ง', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V008.jpg', 'Outdoor', 200.00, 1),
('V009', 5, 'B001', 'สนามเทนนิส 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V009.jpg', 'Outdoor', 220.00, 1),
('V010', 5, 'B001', 'สนามเทนนิส 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V010.jpg', 'Outdoor', 220.00, 1),
('V011', 8, 'B001', 'โต๊ะปิงปอง 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V011.jpg', 'Indoor', 120.00, 1),
('V012', 8, 'B001', 'โต๊ะปิงปอง 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V012.jpg', 'Indoor', 120.00, 1),
('V013', 12, 'B001', 'สนามตะกร้อ', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V013.jpg', 'Outdoor', 150.00, 1),
('V014', 10, 'B001', 'สนามยิงธนู', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V014.jpg', 'Outdoor', 190.00, 1),
('V015', 9, 'B001', 'สนามเปตอง', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V015.jpg', 'Outdoor', 130.00, 1),
('V016', 3, 'B001', 'สนามวอลเลย์บอล', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V016.jpg', 'Outdoor', 180.00, 1),
('V017', 11, 'B001', 'ลู่วิ่งฝึกซ้อม', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V017.jpg', 'Outdoor', 100.00, 1),
('V018', 11, 'B001', 'ลู่กรีฑามาตรฐาน', '\n/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V018.jpg\n', 'Outdoor', 150.00, 1),
('V019', 7, 'B001', 'สนามซ้อมกอล์ฟ VIP', '\n/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V019.jpg\n', 'Indoor', 380.00, 1),
('V020', 4, 'B001', 'คอร์ทแบดมินตัน C', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B001\\V020.jpg', 'Indoor', 200.00, 1),
('V021', 1, 'B002', 'สนามฟุตบอลหญ้าเทียม', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V021.jpg', 'Outdoor', 450.00, 1),
('V022', 1, 'B002', 'สนามฟุตบอลซ้อม', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V022.jpg', 'Outdoor', 300.00, 1),
('V023', 7, 'B002', 'สนามซ้อมกอล์ฟ 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V023.jpg', 'Indoor', 340.00, 1),
('V024', 7, 'B002', 'สนามซ้อมกอล์ฟ 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V024.jpg', 'Indoor', 340.00, 1),
('V025', 4, 'B002', 'คอร์ทแบดมินตัน A', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V025.jpg', 'Indoor', 200.00, 1),
('V026', 4, 'B002', 'คอร์ทแบดมินตัน B', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V026.jpg', 'Indoor', 200.00, 1),
('V027', 2, 'B002', 'สนามบาสเกตบอลในร่ม', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V027.jpg', 'Indoor', 280.00, 1),
('V028', 5, 'B002', 'สนามเทนนิสหลังคาคลุม', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V028.jpg', 'Indoor', 320.00, 1),
('V029', 5, 'B002', 'สนามเทนนิสกลางแจ้ง', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V029.jpg', 'Outdoor', 250.00, 1),
('V030', 8, 'B002', 'โต๊ะปิงปองแข่งขัน', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V030.jpg', 'Indoor', 150.00, 1),
('V031', 12, 'B002', 'สนามตะกร้อ', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V031.jpg', 'Outdoor', 160.00, 1),
('V032', 10, 'B002', 'สนามยิงธนู', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V032.jpg', 'Outdoor', 200.00, 1),
('V033', 9, 'B002', 'สนามเปตอง', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V033.jpg', 'Outdoor', 140.00, 1),
('V034', 3, 'B002', 'สนามวอลเลย์บอลในร่ม', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V034.jpg', 'Indoor', 210.00, 1),
('V035', 11, 'B002', 'ลู่กรีฑา', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V035.jpg', 'Outdoor', 160.00, 1),
('V036', 11, 'B002', 'ลู่ซ้อมวิ่ง', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V036.jpg', 'Outdoor', 110.00, 1),
('V037', 7, 'B002', 'สนามซ้อมกอล์ฟ VIP', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V037.jpg', 'Indoor', 390.00, 1),
('V038', 4, 'B002', 'คอร์ทแบดมินตัน C', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V038.jpg', 'Indoor', 210.00, 1),
('V039', 2, 'B002', 'สนามบาสกลางแจ้ง 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V039.jpg', 'Outdoor', 210.00, 1),
('V040', 9, 'B002', 'สนามเปตอง B', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B002\\V040.jpg', 'Outdoor', 145.00, 1),
('V041', 1, 'B003', 'สนามฟุตบอล 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V041.jpg', 'Outdoor', 280.00, 1),
('V042', 1, 'B003', 'สนามฟุตบอล 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V042.jpg', 'Outdoor', 280.00, 1),
('V043', 7, 'B003', 'สนามซ้อมกอล์ฟ 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V043.jpg', 'Indoor', 300.00, 1),
('V044', 7, 'B003', 'สนามซ้อมกอล์ฟ 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V044.jpg', 'Indoor', 300.00, 1),
('V045', 4, 'B003', 'คอร์ทแบดมินตัน A', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V045.jpg', 'Indoor', 180.00, 1),
('V046', 4, 'B003', 'คอร์ทแบดมินตัน B', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V046.jpg', 'Indoor', 180.00, 1),
('V047', 2, 'B003', 'สนามบาสเกตบอล', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V047.jpg', 'Outdoor', 200.00, 1),
('V048', 5, 'B003', 'สนามเทนนิส', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V048.jpg', 'Outdoor', 210.00, 1),
('V049', 8, 'B003', 'โต๊ะปิงปอง', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V049.jpg', 'Indoor', 120.00, 1),
('V050', 12, 'B003', 'สนามตะกร้อ', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V050.jpg', 'Outdoor', 150.00, 1),
('V051', 10, 'B003', 'สนามยิงธนู', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V051.jpg', 'Outdoor', 185.00, 1),
('V052', 9, 'B003', 'สนามเปตอง', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V052.jpg', 'Outdoor', 130.00, 1),
('V053', 3, 'B003', 'สนามวอลเลย์บอล', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V053.jpg', 'Outdoor', 180.00, 1),
('V054', 11, 'B003', 'ลู่วิ่งฝึก', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V054.jpg', 'Outdoor', 95.00, 1),
('V055', 11, 'B003', 'ลู่กรีฑา', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V055.jpg', 'Outdoor', 140.00, 1),
('V056', 7, 'B003', 'สนามซ้อมกอล์ฟ VIP', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V056.jpg', 'Indoor', 360.00, 1),
('V057', 4, 'B003', 'คอร์ทแบด C', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V057.jpg', 'Indoor', 195.00, 1),
('V058', 2, 'B003', 'สนามบาส 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V058.jpg', 'Outdoor', 205.00, 1),
('V059', 9, 'B003', 'สนามเปตอง B', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V059.jpg', 'Outdoor', 135.00, 1),
('V060', 5, 'B003', 'สนามเทนนิส 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B003\\V060.jpg', 'Outdoor', 215.00, 1),
('V061', 1, 'B010', 'สนามฟุตบอล 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V061.jpg', 'Outdoor', 330.00, 1),
('V062', 1, 'B010', 'สนามฟุตบอล 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V062.jpg', 'Outdoor', 330.00, 1),
('V063', 7, 'B010', 'สนามซ้อมกอล์ฟ 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V063.jpg', 'Indoor', 350.00, 1),
('V064', 7, 'B010', 'สนามซ้อมกอล์ฟ 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V064.jpg', 'Indoor', 350.00, 1),
('V065', 4, 'B010', 'คอร์ทแบดมินตัน A', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V065.jpg', 'Indoor', 200.00, 1),
('V066', 4, 'B010', 'คอร์ทแบดมินตัน B', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V066.jpg', 'Indoor', 200.00, 1),
('V067', 2, 'B010', 'สนามบาสเกตบอลในร่ม', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V067.jpg', 'Indoor', 270.00, 1),
('V068', 5, 'B010', 'สนามเทนนิส', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V068.jpg', 'Outdoor', 245.00, 1),
('V069', 8, 'B010', 'โต๊ะปิงปอง', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V069.jpg', 'Indoor', 135.00, 1),
('V070', 12, 'B010', 'สนามตะกร้อ', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V070.jpg', 'Outdoor', 155.00, 1),
('V071', 10, 'B010', 'สนามยิงธนู', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V071.jpg', 'Outdoor', 205.00, 1),
('V072', 9, 'B010', 'สนามเปตอง', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V072.jpg', 'Outdoor', 145.00, 1),
('V073', 3, 'B010', 'สนามวอลเลย์บอล', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V073.jpg', 'Outdoor', 195.00, 1),
('V074', 11, 'B010', 'ลู่กรีฑา', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V074.jpg', 'Outdoor', 170.00, 1),
('V075', 11, 'B010', 'ลู่วิ่งซ้อม', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V075.jpg', 'Outdoor', 120.00, 1),
('V076', 7, 'B010', 'สนามซ้อมกอล์ฟ VIP', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V076.jpg', 'Indoor', 400.00, 1),
('V077', 4, 'B010', 'คอร์ทแบด C', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V077.jpg', 'Indoor', 215.00, 1),
('V078', 2, 'B010', 'สนามบาส 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V078.jpg', 'Outdoor', 215.00, 1),
('V079', 9, 'B010', 'สนามเปตอง B', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V079.jpg', 'Outdoor', 150.00, 1),
('V080', 5, 'B010', 'สนามเทนนิส 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B010\\V080.jpg', 'Outdoor', 250.00, 1),
('V081', 1, 'B005', 'สนามฟุตบอล 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V081.jpg', 'Outdoor', 325.00, 1),
('V082', 1, 'B005', 'สนามฟุตบอล 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V082.jpg', 'Outdoor', 325.00, 1),
('V083', 7, 'B005', 'สนามซ้อมกอล์ฟ 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V083.jpg', 'Indoor', 330.00, 1),
('V084', 7, 'B005', 'สนามซ้อมกอล์ฟ 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V084.jpg', 'Indoor', 330.00, 1),
('V085', 4, 'B005', 'คอร์ทแบดมินตัน A', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V085.jpg', 'Indoor', 190.00, 1),
('V086', 4, 'B005', 'คอร์ทแบดมินตัน B', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V086.jpg', 'Indoor', 190.00, 1),
('V087', 2, 'B005', 'สนามบาสเกตบอลในร่ม', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V087.jpg', 'Indoor', 265.00, 1),
('V088', 5, 'B005', 'สนามเทนนิส', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V088.jpg', 'Outdoor', 240.00, 1),
('V089', 8, 'B005', 'โต๊ะปิงปอง', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V089.jpg', 'Indoor', 130.00, 1),
('V090', 12, 'B005', 'สนามตะกร้อ', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V090.jpg', 'Outdoor', 150.00, 1),
('V091', 10, 'B005', 'สนามยิงธนู', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V091.jpg', 'Outdoor', 200.00, 1),
('V092', 9, 'B005', 'สนามเปตอง', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V092.jpg', 'Outdoor', 140.00, 1),
('V093', 3, 'B005', 'สนามวอลเลย์บอล', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V093.jpg', 'Outdoor', 190.00, 1),
('V094', 11, 'B005', 'ลู่กรีฑา', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V094.jpg', 'Outdoor', 160.00, 1),
('V095', 11, 'B005', 'ลู่วิ่งซ้อม', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V095.jpg', 'Outdoor', 110.00, 1),
('V096', 7, 'B005', 'สนามซ้อมกอล์ฟ VIP', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V096.jpg', 'Indoor', 390.00, 1),
('V097', 4, 'B005', 'คอร์ทแบด C', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V097.jpg', 'Indoor', 205.00, 1),
('V098', 2, 'B005', 'สนามบาส 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V098.jpg', 'Outdoor', 210.00, 1),
('V099', 9, 'B005', 'สนามเปตอง B', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V099.jpg', 'Outdoor', 145.00, 1),
('V100', 5, 'B005', 'สนามเทนนิส 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V100.jpg', 'Outdoor', 245.00, 0),
('V101', 1, 'B004', 'สนามฟุตบอล 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B005\\V101.jpg', 'Outdoor', 310.00, 1),
('V102', 1, 'B004', 'สนามฟุตบอล 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V102.jpg', 'Outdoor', 310.00, 1),
('V103', 7, 'B004', 'สนามซ้อมกอล์ฟ 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V103.jpg', 'Indoor', 330.00, 1),
('V104', 7, 'B004', 'สนามซ้อมกอล์ฟ 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V104.jpg', 'Indoor', 330.00, 1),
('V105', 4, 'B004', 'คอร์ทแบดมินตัน A', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V105.jpg', 'Indoor', 190.00, 1),
('V106', 4, 'B004', 'คอร์ทแบดมินตัน B', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V106.jpg', 'Indoor', 190.00, 1),
('V107', 2, 'B004', 'สนามบาสเกตบอลในร่ม', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V107.jpg', 'Indoor', 260.00, 1),
('V108', 2, 'B004', 'สนามบาสเกตบอลกลางแจ้ง', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V108.jpg', 'Outdoor', 220.00, 1),
('V109', 5, 'B004', 'สนามเทนนิส 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V109.jpg', 'Outdoor', 235.00, 1),
('V110', 5, 'B004', 'สนามเทนนิส 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V110.jpg', 'Outdoor', 235.00, 1),
('V111', 8, 'B004', 'โต๊ะปิงปอง 1', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V111.jpg', 'Indoor', 130.00, 1),
('V112', 8, 'B004', 'โต๊ะปิงปอง 2', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V112.jpg', 'Indoor', 130.00, 1),
('V113', 12, 'B004', 'สนามตะกร้อ', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V113.jpg', 'Outdoor', 155.00, 1),
('V114', 10, 'B004', 'สนามยิงธนู', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V114.jpg', 'Outdoor', 195.00, 1),
('V115', 9, 'B004', 'สนามเปตอง', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V115.jpg', 'Outdoor', 135.00, 1),
('V116', 3, 'B004', 'สนามวอลเลย์บอล', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V116.jpg', 'Outdoor', 185.00, 1),
('V117', 11, 'B004', 'ลู่วิ่งฝึกซ้อม', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V117.jpg', 'Outdoor', 110.00, 1),
('V118', 11, 'B004', 'ลู่กรีฑามาตรฐาน', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V118.jpg', 'Outdoor', 155.00, 1),
('V119', 7, 'B004', 'สนามซ้อมกอล์ฟ VIP', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V119.jpg', 'Indoor', 385.00, 1),
('V120', 4, 'B004', 'คอร์ทแบดมินตัน C', '/SPORTS_RENTAL_SYSTEM/uploads/field\\B004\\V120.jpg ', 'Indoor', 205.00, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `fk_booking_customer` (`customer_id`),
  ADD KEY `fk_booking_staff` (`staff_id`),
  ADD KEY `fk_booking_branch` (`branch_id`),
  ADD KEY `fk_booking_coupon` (`coupon_code`),
  ADD KEY `fk_bookings_payment_status` (`payment_status_id`),
  ADD KEY `fk_bookings_booking_status` (`booking_status_id`),
  ADD KEY `fk_bookings_booking_type` (`booking_type_id`),
  ADD KEY `fk_cancel_staff` (`cancelled_by_staff_id`),
  ADD KEY `fk_cancel_customer` (`cancelled_by_customer_id`);

--
-- Indexes for table `booking_details`
--
ALTER TABLE `booking_details`
  ADD PRIMARY KEY (`detail_id`),
  ADD KEY `fk_detail_booking` (`booking_id`),
  ADD KEY `fk_detail_equipment` (`equipment_id`),
  ADD KEY `fk_detail_venue` (`venue_id`),
  ADD KEY `fk_booking_equipment_instance` (`equipment_instance_id`);

--
-- Indexes for table `booking_item_assignments`
--
ALTER TABLE `booking_item_assignments`
  ADD PRIMARY KEY (`assignment_id`),
  ADD KEY `fk_assign_detail` (`detail_id`),
  ADD KEY `fk_assign_instance` (`instance_code`),
  ADD KEY `fk_assign_return_condition` (`return_condition_id`);

--
-- Indexes for table `booking_status`
--
ALTER TABLE `booking_status`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `booking_types`
--
ALTER TABLE `booking_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`branch_id`),
  ADD KEY `fk_branches_province` (`province_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`code`),
  ADD KEY `fk_coupon_category` (`category_id`);

--
-- Indexes for table `coupon_usages`
--
ALTER TABLE `coupon_usages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_coupon_customer` (`coupon_code`,`customer_id`),
  ADD KEY `idx_coupon` (`coupon_code`),
  ADD KEY `idx_customer` (`customer_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_customer_gender` (`gender_id`),
  ADD KEY `fk_customers_faculty` (`faculty_id`),
  ADD KEY `fk_customer_branch` (`branch_id`);

--
-- Indexes for table `damage_levels`
--
ALTER TABLE `damage_levels`
  ADD PRIMARY KEY (`damage_id`);

--
-- Indexes for table `equipment_instances`
--
ALTER TABLE `equipment_instances`
  ADD PRIMARY KEY (`instance_code`),
  ADD KEY `fk_instance_equipment` (`equipment_id`),
  ADD KEY `fk_instance_branch` (`branch_id`);

--
-- Indexes for table `equipment_master`
--
ALTER TABLE `equipment_master`
  ADD PRIMARY KEY (`equipment_id`),
  ADD KEY `fk_equipment_category` (`category_id`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `genders`
--
ALTER TABLE `genders`
  ADD PRIMARY KEY (`gender_id`),
  ADD UNIQUE KEY `name_en` (`name_en`);

--
-- Indexes for table `maintenance_logs`
--
ALTER TABLE `maintenance_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `fk_maint_instance` (`instance_code`),
  ADD KEY `fk_maint_branch` (`branch_id`),
  ADD KEY `fk_maint_staff` (`reported_by_staff_id`),
  ADD KEY `fk_maintenance_customer` (`reported_by_customer_id`),
  ADD KEY `fk_maintenance_damage` (`damage_id`),
  ADD KEY `fk_maintenance_status` (`status_id`);

--
-- Indexes for table `maintenance_status`
--
ALTER TABLE `maintenance_status`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `fk_payment_branch` (`branch_id`),
  ADD KEY `fk_payment_staff` (`processed_by_staff_id`),
  ADD KEY `idx_payments_booking` (`booking_id`),
  ADD KEY `idx_payments_method` (`method_id`),
  ADD KEY `fk_payment_status` (`payment_status_id`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`method_id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `payment_status`
--
ALTER TABLE `payment_status`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `point_history`
--
ALTER TABLE `point_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `fk_point_customer` (`customer_id`),
  ADD KEY `fk_point_booking` (`booking_id`);

--
-- Indexes for table `provinces`
--
ALTER TABLE `provinces`
  ADD PRIMARY KEY (`province_id`),
  ADD KEY `fk_province_region` (`region_id`);

--
-- Indexes for table `region`
--
ALTER TABLE `region`
  ADD PRIMARY KEY (`region_id`),
  ADD UNIQUE KEY `region_name` (`region_name`);

--
-- Indexes for table `return_conditions`
--
ALTER TABLE `return_conditions`
  ADD PRIMARY KEY (`condition_id`),
  ADD UNIQUE KEY `name_en` (`name_en`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`review_id`),
  ADD UNIQUE KEY `detail_id` (`detail_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `instance_code` (`instance_code`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_staff_role` (`role_id`),
  ADD KEY `fk_staff_gender` (`gender_id`),
  ADD KEY `fk_staff_branch` (`branch_id`);

--
-- Indexes for table `venues`
--
ALTER TABLE `venues`
  ADD PRIMARY KEY (`venue_id`),
  ADD KEY `fk_venue_category` (`category_id`),
  ADD KEY `fk_venue_branch` (`branch_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking_details`
--
ALTER TABLE `booking_details`
  MODIFY `detail_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=448;

--
-- AUTO_INCREMENT for table `booking_item_assignments`
--
ALTER TABLE `booking_item_assignments`
  MODIFY `assignment_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=208;

--
-- AUTO_INCREMENT for table `booking_status`
--
ALTER TABLE `booking_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `booking_types`
--
ALTER TABLE `booking_types`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `coupon_usages`
--
ALTER TABLE `coupon_usages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `damage_levels`
--
ALTER TABLE `damage_levels`
  MODIFY `damage_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `faculty`
--
ALTER TABLE `faculty`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `genders`
--
ALTER TABLE `genders`
  MODIFY `gender_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `maintenance_logs`
--
ALTER TABLE `maintenance_logs`
  MODIFY `log_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=856;

--
-- AUTO_INCREMENT for table `maintenance_status`
--
ALTER TABLE `maintenance_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `method_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payment_status`
--
ALTER TABLE `payment_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `point_history`
--
ALTER TABLE `point_history`
  MODIFY `history_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `return_conditions`
--
ALTER TABLE `return_conditions`
  MODIFY `condition_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `review_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `fk_booking_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`),
  ADD CONSTRAINT `fk_booking_coupon` FOREIGN KEY (`coupon_code`) REFERENCES `coupons` (`code`),
  ADD CONSTRAINT `fk_booking_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  ADD CONSTRAINT `fk_booking_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`),
  ADD CONSTRAINT `fk_bookings_booking_status` FOREIGN KEY (`booking_status_id`) REFERENCES `booking_status` (`id`),
  ADD CONSTRAINT `fk_bookings_booking_type` FOREIGN KEY (`booking_type_id`) REFERENCES `booking_types` (`id`),
  ADD CONSTRAINT `fk_bookings_payment_status` FOREIGN KEY (`payment_status_id`) REFERENCES `payment_status` (`id`),
  ADD CONSTRAINT `fk_cancel_customer` FOREIGN KEY (`cancelled_by_customer_id`) REFERENCES `customers` (`customer_id`),
  ADD CONSTRAINT `fk_cancel_staff` FOREIGN KEY (`cancelled_by_staff_id`) REFERENCES `staff` (`staff_id`);

--
-- Constraints for table `booking_details`
--
ALTER TABLE `booking_details`
  ADD CONSTRAINT `fk_booking_equipment_instance` FOREIGN KEY (`equipment_instance_id`) REFERENCES `equipment_instances` (`instance_code`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_detail_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `fk_detail_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment_master` (`equipment_id`),
  ADD CONSTRAINT `fk_detail_venue` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`venue_id`);

--
-- Constraints for table `booking_item_assignments`
--
ALTER TABLE `booking_item_assignments`
  ADD CONSTRAINT `fk_assign_detail` FOREIGN KEY (`detail_id`) REFERENCES `booking_details` (`detail_id`),
  ADD CONSTRAINT `fk_assign_instance` FOREIGN KEY (`instance_code`) REFERENCES `equipment_instances` (`instance_code`),
  ADD CONSTRAINT `fk_assign_return_condition` FOREIGN KEY (`return_condition_id`) REFERENCES `return_conditions` (`condition_id`);

--
-- Constraints for table `branches`
--
ALTER TABLE `branches`
  ADD CONSTRAINT `fk_branches_province` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`province_id`) ON UPDATE CASCADE;

--
-- Constraints for table `coupons`
--
ALTER TABLE `coupons`
  ADD CONSTRAINT `fk_coupon_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `coupon_usages`
--
ALTER TABLE `coupon_usages`
  ADD CONSTRAINT `fk_coupon_usage_coupon` FOREIGN KEY (`coupon_code`) REFERENCES `coupons` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_coupon_usage_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `fk_customer_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_customer_gender` FOREIGN KEY (`gender_id`) REFERENCES `genders` (`gender_id`),
  ADD CONSTRAINT `fk_customers_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `equipment_instances`
--
ALTER TABLE `equipment_instances`
  ADD CONSTRAINT `fk_instance_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`),
  ADD CONSTRAINT `fk_instance_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment_master` (`equipment_id`);

--
-- Constraints for table `equipment_master`
--
ALTER TABLE `equipment_master`
  ADD CONSTRAINT `fk_equipment_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `maintenance_logs`
--
ALTER TABLE `maintenance_logs`
  ADD CONSTRAINT `fk_maint_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`),
  ADD CONSTRAINT `fk_maint_instance` FOREIGN KEY (`instance_code`) REFERENCES `equipment_instances` (`instance_code`),
  ADD CONSTRAINT `fk_maint_staff` FOREIGN KEY (`reported_by_staff_id`) REFERENCES `staff` (`staff_id`),
  ADD CONSTRAINT `fk_maintenance_customer` FOREIGN KEY (`reported_by_customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_maintenance_damage` FOREIGN KEY (`damage_id`) REFERENCES `damage_levels` (`damage_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_maintenance_status` FOREIGN KEY (`status_id`) REFERENCES `maintenance_status` (`status_id`) ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payment_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `fk_payment_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`),
  ADD CONSTRAINT `fk_payment_method` FOREIGN KEY (`method_id`) REFERENCES `payment_methods` (`method_id`),
  ADD CONSTRAINT `fk_payment_staff` FOREIGN KEY (`processed_by_staff_id`) REFERENCES `staff` (`staff_id`),
  ADD CONSTRAINT `fk_payment_status` FOREIGN KEY (`payment_status_id`) REFERENCES `payment_status` (`id`);

--
-- Constraints for table `point_history`
--
ALTER TABLE `point_history`
  ADD CONSTRAINT `fk_point_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `fk_point_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `provinces`
--
ALTER TABLE `provinces`
  ADD CONSTRAINT `fk_province_region` FOREIGN KEY (`region_id`) REFERENCES `region` (`region_id`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`detail_id`) REFERENCES `booking_details` (`detail_id`),
  ADD CONSTRAINT `review_ibfk_3` FOREIGN KEY (`instance_code`) REFERENCES `equipment_instances` (`instance_code`);

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `fk_staff_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`),
  ADD CONSTRAINT `fk_staff_gender` FOREIGN KEY (`gender_id`) REFERENCES `genders` (`gender_id`),
  ADD CONSTRAINT `fk_staff_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);

--
-- Constraints for table `venues`
--
ALTER TABLE `venues`
  ADD CONSTRAINT `fk_venue_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`),
  ADD CONSTRAINT `fk_venue_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

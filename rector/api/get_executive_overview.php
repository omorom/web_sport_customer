<?php
session_start();
header('Content-Type: application/json');

error_reporting(0); 
ini_set('display_errors', 0);

if (!isset($_SESSION["staff_id"])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

require_once '../../database.php';

$branchIdRaw = $_SESSION["branch_id"] ?? '';
$branchId = $conn->real_escape_string($branchIdRaw);

// 1. รับค่าฟิลเตอร์
$range       = $_GET['range'] ?? 'all';
$bookingType = $_GET['booking_type'] ?? ''; 
$userType    = $_GET['user_type'] ?? '';    
$facultyId   = $_GET['faculty_id'] ?? '';
$year        = $_GET['year'] ?? '';
$genderId    = $_GET['gender_id'] ?? '';
$startDate   = $_GET['start_date'] ?? '';
$endDate     = $_GET['end_date'] ?? '';

$whereBooking = ["b.branch_id = '$branchId'", "b.booking_status_id != 6"]; 

// ตัวกรองประเภทการจอง
if ($bookingType === 'online') $whereBooking[] = "b.booking_type_id = 1";
elseif ($bookingType === 'walkin') $whereBooking[] = "b.booking_type_id = 2";

// ตัวกรองช่วงเวลา
if ($range === '7days') { 
    $whereBooking[] = "b.pickup_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)"; 
} elseif ($range === '30days') { 
    $whereBooking[] = "b.pickup_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)"; 
} elseif ($range === '1year') { 
    $whereBooking[] = "b.pickup_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR)"; 
} elseif ($range === 'custom' && $startDate && $endDate) {
    $s = $conn->real_escape_string($startDate);
    $e = $conn->real_escape_string($endDate);
    $whereBooking[] = "DATE(b.pickup_time) BETWEEN '$s' AND '$e'";
}

$bookingCond = " AND b.branch_id = '$branchId' AND b.booking_status_id != 6";
if ($bookingType === 'online') $bookingCond .= " AND b.booking_type_id = 1";
elseif ($bookingType === 'walkin') $bookingCond .= " AND b.booking_type_id = 2";

$whereCustomer = [];
if ($userType !== '')   $whereCustomer[] = "c.customer_type = '" . $conn->real_escape_string($userType) . "'";
if ($facultyId !== '')  $whereCustomer[] = "c.faculty_id = " . intval($facultyId);
if ($year !== '')       $whereCustomer[] = "c.study_year = " . intval($year);
if ($genderId !== '')   $whereCustomer[] = "c.gender_id = " . intval($genderId);

$combinedWhere = array_merge($whereBooking, $whereCustomer);
$whereJoinSql = "WHERE " . implode(" AND ", $combinedWhere);

$custCond = "";
if ($userType !== '')   { $custCond .= " AND c.customer_type = '" . $conn->real_escape_string($userType) . "'"; }
if ($facultyId !== '')  { $custCond .= " AND c.faculty_id = " . intval($facultyId); }
if ($year !== '')       { $custCond .= " AND c.study_year = " . intval($year); }
if ($genderId !== '')   { $custCond .= " AND c.gender_id = " . intval($genderId); }

// --- 1. KPI ---
$allUsersRes = $conn->query("
    SELECT 
        COUNT(DISTINCT b.customer_id) AS total_all,

        COUNT(DISTINCT CASE WHEN c.customer_type = 'student' AND c.branch_id = b.branch_id THEN b.customer_id END) AS total_std,

        COUNT(DISTINCT CASE WHEN c.customer_type = 'general' AND c.branch_id = b.branch_id THEN b.customer_id END) AS total_gen,
        
        COUNT(DISTINCT CASE WHEN c.branch_id != b.branch_id OR c.branch_id IS NULL THEN b.customer_id END) AS total_out
    FROM bookings b
    JOIN customers c ON b.customer_id = c.customer_id
    $whereJoinSql
")->fetch_assoc();

$totalAll = (int)($allUsersRes['total_all'] ?? 0);
$stdPct = $totalAll > 0 ? ($allUsersRes['total_std'] / $totalAll) * 100 : 0;
$genPct = $totalAll > 0 ? ($allUsersRes['total_gen'] / $totalAll) * 100 : 0;
$outPct = $totalAll > 0 ? ($allUsersRes['total_out'] / $totalAll) * 100 : 0;

$totalBookingsRes = $conn->query("
    SELECT COUNT(b.booking_id) AS total 
    FROM bookings b 
    JOIN customers c ON b.customer_id = c.customer_id 
    $whereJoinSql
")->fetch_assoc();

// --- 2. Charts ---
// Trend 
$trendLabels = []; $trendData = [];
$trendRes = $conn->query("
    SELECT DATE_FORMAT(b.pickup_time,'%Y-%m') AS m, COUNT(DISTINCT b.customer_id) AS total_users 
    FROM bookings b 
    JOIN customers c ON b.customer_id = c.customer_id 
    $whereJoinSql 
    GROUP BY m ORDER BY m
");
while ($r = $trendRes->fetch_assoc()) { $trendLabels[] = $r['m']; $trendData[] = (int)$r['total_users']; }

// Top Faculty 
$topFacLabels = []; $topFacData = [];
$topFacRes = $conn->query("
    SELECT f.name, COUNT(b.booking_id) AS total 
    FROM faculty f 
    LEFT JOIN customers c ON f.id = c.faculty_id $custCond 
    LEFT JOIN bookings b ON c.customer_id = b.customer_id $bookingCond 
    GROUP BY f.id 
    ORDER BY total DESC, f.name ASC LIMIT 5
");
while ($r = $topFacRes->fetch_assoc()) { $topFacLabels[] = $r['name']; $topFacData[] = (int)$r['total']; }

// Gender 
$genLabels = []; $genData = [];
$genRes = $conn->query("
    SELECT g.name_th, COUNT(DISTINCT b.customer_id) AS total_people 
    FROM genders g 
    LEFT JOIN customers c ON g.gender_id = c.gender_id $custCond 
    LEFT JOIN bookings b ON c.customer_id = b.customer_id $bookingCond 
    GROUP BY g.gender_id
");
while ($r = $genRes->fetch_assoc()) { $genLabels[] = $r['name_th']; $genData[] = (int)$r['total_people']; }

// Year 
$yearLabels = []; $yearData = [];
$yRes = $conn->query("
    SELECT 
        t.study_year, 
        COUNT(DISTINCT b.customer_id) AS total_users
    FROM (
        SELECT 1 AS study_year UNION SELECT 2 UNION SELECT 3 
        UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
    ) AS t
    LEFT JOIN customers c ON t.study_year = c.study_year $custCond
    LEFT JOIN bookings b ON c.customer_id = b.customer_id $bookingCond
    GROUP BY t.study_year 
    ORDER BY t.study_year
");

while ($r = $yRes->fetch_assoc()) { 
    $yearLabels[] = "ปี " . $r['study_year']; 
    $yearData[] = (int)$r['total_users']; 
}

// --- FILTER OPTIONS ---
$facultyFilter = [];
$fRes = $conn->query("SELECT id, name FROM faculty ORDER BY name");
while($r = $fRes->fetch_assoc()) { $facultyFilter[] = $r; }

$genderFilter = [];
$gRes = $conn->query("SELECT gender_id AS id, name_th AS name FROM genders");
while($r = $gRes->fetch_assoc()) { $genderFilter[] = $r; }

echo json_encode([
    "success" => true,
    "kpi" => [
        "total_users" => $totalAll,
        "student_pct" => round($stdPct, 1),
        "general_pct" => round($genPct, 1),
        "external_pct" => round($outPct, 1)
    ],
    "charts" => [
        "trend" => ["labels" => $trendLabels, "data" => $trendData],
        "top_faculty" => ["labels" => $topFacLabels, "data" => $topFacData],
        "gender" => ["labels" => $genLabels, "data" => $genData],
        "year" => ["labels" => $yearLabels, "data" => $yearData]
    ],
    "faculty" => $facultyFilter,
    "year" => [1, 2, 3, 4, 5, 6],
    "gender" => $genderFilter
]);
<?php
session_start();
header('Content-Type: application/json');

// 1. ตรวจสอบการ Login และสิทธิ์สาขา
if (!isset($_SESSION["staff_id"]) || !isset($_SESSION["branch_id"])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

require_once '../../database.php'; 

$branchId = $conn->real_escape_string($_SESSION["branch_id"]);

// 2. รับค่าจากตัวกรอง (Sidebar Filters)
$range       = $_GET['range'] ?? 'all';
$userType    = $_GET['user_type'] ?? '';   
$facultyId   = $_GET['faculty_id'] ?? '';
$year        = $_GET['year'] ?? '';
$bookingType = $_GET['booking_type'] ?? ''; 
$startDate   = $_GET['start_date'] ?? '';
$endDate     = $_GET['end_date'] ?? '';

// 3. สร้างเงื่อนไข WHERE (บังคับดูเฉพาะสาขาตนเอง)
$whereClauses = ["b.branch_id = '$branchId'", "b.booking_status_id != 6"]; 

// ตัวกรองช่วงเวลา
if ($range === '7days') {
    $whereClauses[] = "b.pickup_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
} elseif ($range === '30days') {
    $whereClauses[] = "b.pickup_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
} elseif ($range === 'custom' && $startDate && $endDate) {
    $s = $conn->real_escape_string($startDate);
    $e = $conn->real_escape_string($endDate);
    $whereClauses[] = "DATE(b.pickup_time) BETWEEN '$s' AND '$e'";
}

// ตัวกรองประเภทการจอง
if ($bookingType === 'online') $whereClauses[] = "b.booking_type_id = 1";
elseif ($bookingType === 'walkin') $whereClauses[] = "b.booking_type_id = 2";

// ตัวกรองข้อมูลลูกค้า (ต้อง JOIN customers)
if ($userType !== '')   $whereClauses[] = "c.customer_type = '$userType'";
if ($facultyId !== '')  $whereClauses[] = "c.faculty_id = " . intval($facultyId);
if ($year !== '')       $whereClauses[] = "c.study_year = " . intval($year);

$whereSql = "WHERE " . implode(" AND ", $whereClauses);

// --- 4. ดึงข้อมูล KPI ---
$kpiRes = $conn->query("
    SELECT 
        COUNT(DISTINCT b.customer_id) as total_users,
        COUNT(DISTINCT b.booking_id) as total_bookings,
        SUM(bd.price_at_booking * bd.quantity) as total_revenue 
    FROM bookings b
    LEFT JOIN booking_details bd ON b.booking_id = bd.booking_id
    LEFT JOIN customers c ON b.customer_id = c.customer_id
    $whereSql
")->fetch_assoc();

// อัตราการใช้งาน (Utilization Rate)
$totalAssets = $conn->query("
    SELECT 
        (SELECT COUNT(*) FROM equipment_instances WHERE branch_id='$branchId') + 
        (SELECT COUNT(*) FROM venues WHERE branch_id='$branchId') as total
")->fetch_assoc()['total'];

$usedAssets = $conn->query("
    SELECT COUNT(DISTINCT COALESCE(bd.equipment_id, bd.venue_id)) as used 
    FROM booking_details bd 
    JOIN bookings b ON bd.booking_id = b.booking_id 
    LEFT JOIN customers c ON b.customer_id = c.customer_id
    $whereSql
")->fetch_assoc()['used'];

$utilRate = ($totalAssets > 0) ? ($usedAssets / $totalAssets) * 100 : 0;

// --- 5. Booking Trend (ย้อนหลัง 6 เดือน) ---
$trendLabels = []; $trendValues = [];
$trendRes = $conn->query("
    SELECT DATE_FORMAT(b.pickup_time, '%b') as month_name, COUNT(DISTINCT b.booking_id) as count 
    FROM bookings b 
    LEFT JOIN customers c ON b.customer_id = c.customer_id
    $whereSql AND b.pickup_time >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY YEAR(b.pickup_time), MONTH(b.pickup_time) 
    ORDER BY b.pickup_time ASC
");
while($r = $trendRes->fetch_assoc()){
    $trendLabels[] = $r['month_name'];
    $trendValues[] = (int)$r['count'];
}

// --- 6. Online vs Walk-in ---
$sourceRes = $conn->query("
    SELECT 
        COUNT(DISTINCT CASE WHEN b.booking_type_id = 1 THEN b.booking_id END) as online,
        COUNT(DISTINCT CASE WHEN b.booking_type_id = 2 THEN b.booking_id END) as walkin
    FROM bookings b 
    LEFT JOIN customers c ON b.customer_id = c.customer_id
    $whereSql
")->fetch_assoc();

$heatmap = array_fill(1, 7, array_fill(8, 14, 0)); 
$heatRes = $conn->query("
    SELECT DAYOFWEEK(b.pickup_time) as day, HOUR(b.pickup_time) as hour, COUNT(*) as count
    FROM bookings b
    LEFT JOIN customers c ON b.customer_id = c.customer_id
    $whereSql AND HOUR(b.pickup_time) BETWEEN 8 AND 21
    GROUP BY day, hour
");
while($r = $heatRes->fetch_assoc()){
    $heatmap[$r['day']][$r['hour']] = (int)$r['count'];
}

// --- 8. ส่งข้อมูลออกเป็น JSON ---
echo json_encode([
    "success" => true,
    "branch_name" => $_SESSION["branch_name"] ?? 'Unknown',
    "kpi" => [
        "revenue" => number_format((float)$kpiRes['total_revenue'], 2),
        "users" => (int)$kpiRes['total_users'],
        "bookings" => (int)$kpiRes['total_bookings'],
        "util" => round($utilRate, 1)
    ],
    "charts" => [
        "trend" => ["labels" => $trendLabels, "data" => $trendValues],
        "source" => ["online" => (int)$sourceRes['online'], "walkin" => (int)$sourceRes['walkin']],
        "heatmap" => $heatmap
    ]
]);
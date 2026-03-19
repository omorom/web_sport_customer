<?php
header('Content-Type: application/json');
require_once '../../database.php';

/* ================= GET PARAM ================= */
$range       = $_GET['range'] ?? 'all';
$startDate   = $_GET['start_date'] ?? '';
$endDate     = $_GET['end_date'] ?? '';

$where = ["1=1"];

/* ===== date filter ===== */
if ($range === '7days') {
    $where[] = "r.review_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)"; // 
} elseif ($range === '30days') {
    $where[] = "r.review_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)"; // 
} elseif ($range === '1year') {
    $where[] = "r.review_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)"; //
} elseif ($range === 'custom' && $startDate && $endDate) {
    $s = $conn->real_escape_string($startDate);
    $e = $conn->real_escape_string($endDate);
    $where[] = "DATE(r.review_date) BETWEEN '$s' AND '$e'"; // 
}

$whereSql = "WHERE " . implode(" AND ", $where);

/* ================= KPI ================= */

/* avg review */
$avgReview = $conn->query("
    SELECT ROUND(AVG(r.rating),2) AS avg_score
    FROM review r
    $whereSql
")->fetch_assoc()['avg_score'] ?? 0;

/* total reviews */
$totalReview = $conn->query("
    SELECT COUNT(*) AS total
    FROM review r
    $whereSql
")->fetch_assoc()['total'] ?? 0;

/* maintenance count */
$totalMaintenance = $conn->query("
    SELECT COUNT(*) AS total
    FROM maintenance_logs
")->fetch_assoc()['total'] ?? 0;

/* avg wait time (ถ้ามี pickup_time & checkin_time) */
$avgWait = $conn->query("
    SELECT 
      ROUND(AVG(TIMESTAMPDIFF(MINUTE, b.pickup_time, b.actual_pickup_time)),1) AS avg_wait
    FROM bookings b
    WHERE b.pickup_time IS NOT NULL AND b.actual_pickup_time IS NOT NULL
")->fetch_assoc()['avg_wait'] ?? 0;

/* ================= Satisfaction Trend ================= */

$trendLabels = [];
$trendData   = [];

$res = $conn->query("
    SELECT 
      DATE_FORMAT(r.review_date, '%Y-%m') AS ym, -- เปลี่ยนเป็น r.review_date
      ROUND(AVG(r.rating), 2) AS score
    FROM review r 
    $whereSql 
    GROUP BY ym
    ORDER BY ym
");

while ($row = $res->fetch_assoc()) {
    $trendLabels[] = $row['ym'];
    $trendData[]   = (float)$row['score'];
}

/* ================= Monthly Reviews ================= */

$monthLabels = [];
$monthData   = [];

$res = $conn->query("
    SELECT 
      DATE_FORMAT(r.review_date, '%Y-%m') AS ym, -- เปลี่ยนเป็น r.review_date
      COUNT(*) AS total
    FROM review r 
    $whereSql 
    GROUP BY ym
    ORDER BY ym
");

while ($row = $res->fetch_assoc()) {
    $monthLabels[] = $row['ym'];
    $monthData[]   = (int)$row['total'];
}

/* ================= Complaint Types ================= */

$complaintLabels = [];
$complaintData   = [];

$resComplaint = $conn->query("
    SELECT 
        dl.name_th AS label, 
        COUNT(*) AS total 
    FROM maintenance_logs ml 
    JOIN damage_levels dl ON ml.damage_id = dl.damage_id 
    GROUP BY ml.damage_id
");

if ($resComplaint) {
    while ($row = $resComplaint->fetch_assoc()) {
        $complaintLabels[] = $row['label'];
        $complaintData[]   = (int)$row['total'];
    }
}

/* ================= OUTPUT ================= */

echo json_encode([
  "kpi" => [
    "avg_review" => (float)$avgReview,
    "total_review" => (int)$totalReview,
    "total_maintenance" => (int)$totalMaintenance,
    "avg_wait" => (float)$avgWait
  ],
  "satisfaction_trend" => [
    "labels" => $trendLabels,
    "data" => $trendData
  ],
  "monthly_reviews" => [
    "labels" => $monthLabels,
    "data" => $monthData
  ],
  "complaint_types" => [
    "labels" => $complaintLabels,
    "data" => $complaintData
  ]
]);
<?php
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

try {

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) $data = [];

/* ==============================
   RECEIVE FILTER
============================== */

$region_id       = $data["region_id"] ?? "";
$province_id     = $data["province_id"] ?? "";
$branch_id       = $data["branch_id"] ?? "";
$booking_type_id = $data["booking_type_id"] ?? "";
$range           = $data["range"] ?? "";
$start           = $data["start"] ?? "";
$end             = $data["end"] ?? "";

/* ==============================
   BUILD WHERE (BOOKINGS)
============================== */

$where = [];
$params = [];
$types = "";

if ($region_id !== "") {
    $where[] = "r.region_id = ?";
    $params[] = (int)$region_id;
    $types .= "i";
}

if ($province_id !== "") {
    $where[] = "p.province_id = ?";
    $params[] = (int)$province_id;
    $types .= "i";
}

if ($branch_id !== "") {
    $where[] = "b.branch_id = ?";
    $params[] = $branch_id;
    $types .= "s";
}

if ($booking_type_id !== "") {
    $where[] = "bk.booking_type_id = ?";
    $params[] = (int)$booking_type_id;
    $types .= "i";
}

/* DATE FILTER */

if ($range === "7days")
    $where[] = "bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
elseif ($range === "30days")
    $where[] = "bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
elseif ($range === "1year")
    $where[] = "bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
elseif ($range === "custom" && $start && $end) {
    $where[] = "DATE(bk.pickup_time) BETWEEN ? AND ?";
    $params[] = $start;
    $params[] = $end;
    $types .= "ss";
}

$whereSQL = count($where) ? "WHERE " . implode(" AND ", $where) : "";

/* ==============================
   KPI
============================== */

$sqlKPI = "
SELECT 
    COUNT(bk.booking_id) total_bookings,
    COALESCE(SUM(bk.net_amount),0) total_revenue,
    COUNT(DISTINCT bk.customer_id) total_users
FROM bookings bk
JOIN branches b ON bk.branch_id=b.branch_id
JOIN provinces p ON b.province_id=p.province_id
JOIN region r ON p.region_id=r.region_id
$whereSQL
";

$stmt = $conn->prepare($sqlKPI);
if ($types) $stmt->bind_param($types, ...$params);
$stmt->execute();
$kpi = $stmt->get_result()->fetch_assoc();

/* ==============================
   TOTAL EXPENSE (ใช้ report_date)
============================== */

$whereExp = [];
$paramsExp = [];
$typesExp = "";

if ($region_id !== "") {
    $whereExp[] = "r.region_id = ?";
    $paramsExp[] = (int)$region_id;
    $typesExp .= "i";
}

if ($province_id !== "") {
    $whereExp[] = "p.province_id = ?";
    $paramsExp[] = (int)$province_id;
    $typesExp .= "i";
}

if ($branch_id !== "") {
    $whereExp[] = "b.branch_id = ?";
    $paramsExp[] = $branch_id;
    $typesExp .= "s";
}

if ($range === "7days")
    $whereExp[] = "ml.report_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
elseif ($range === "30days")
    $whereExp[] = "ml.report_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
elseif ($range === "1year")
    $whereExp[] = "ml.report_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
elseif ($range === "custom" && $start && $end) {
    $whereExp[] = "DATE(ml.report_date) BETWEEN ? AND ?";
    $paramsExp[] = $start;
    $paramsExp[] = $end;
    $typesExp .= "ss";
}

$whereExpSQL = count($whereExp) ? "WHERE " . implode(" AND ", $whereExp) : "";

$sqlExpense = "
SELECT COALESCE(SUM(ml.repair_cost),0) total_expense
FROM maintenance_logs ml
JOIN branches b ON ml.branch_id=b.branch_id
JOIN provinces p ON b.province_id=p.province_id
JOIN region r ON p.region_id=r.region_id
$whereExpSQL
";

$stmtExp = $conn->prepare($sqlExpense);
if ($typesExp) $stmtExp->bind_param($typesExp, ...$paramsExp);
$stmtExp->execute();
$expense = $stmtExp->get_result()->fetch_assoc();

/* ==============================
   TREND (COUNT + REVENUE)
============================== */

$sqlTrend = "
SELECT 
    DATE(bk.pickup_time) d,
    COUNT(*) bookings,
    COALESCE(SUM(bk.net_amount),0) revenue
FROM bookings bk
JOIN branches b ON bk.branch_id=b.branch_id
JOIN provinces p ON b.province_id=p.province_id
JOIN region r ON p.region_id=r.region_id
$whereSQL
GROUP BY d
ORDER BY d
";

$stmtTrend = $conn->prepare($sqlTrend);
if ($types) $stmtTrend->bind_param($types, ...$params);
$stmtTrend->execute();
$resTrend = $stmtTrend->get_result();

$labels=[];
$bookings=[];
$revenue=[];

while($row=$resTrend->fetch_assoc()){
    $labels[]   = $row["d"];
    $bookings[] = (int)$row["bookings"];
    $revenue[]  = (float)$row["revenue"];
}

/* ==============================
   TOP 5 EQUIPMENT
============================== */

$sqlTop = "
SELECT 
    em.name,
    COUNT(bd.booking_id) total
FROM booking_details bd
JOIN bookings bk ON bd.booking_id = bk.booking_id
JOIN equipment_master em ON bd.equipment_id = em.equipment_id
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
JOIN region r ON p.region_id = r.region_id
$whereSQL
GROUP BY em.name
ORDER BY total DESC
LIMIT 5
";

$stmtTop = $conn->prepare($sqlTop);
if ($types) $stmtTop->bind_param($types, ...$params);
$stmtTop->execute();
$resTop = $stmtTop->get_result();

$topLabels=[];
$topCounts=[];

while($row=$resTop->fetch_assoc()){
    $topLabels[] = $row["name"];
    $topCounts[] = (int)$row["total"];
}


/* ==============================
   EXPENSE TREND (report_date)
============================== */

$sqlExpenseTrend = "
SELECT 
    DATE(ml.report_date) d,
    SUM(ml.repair_cost) expense
FROM maintenance_logs ml
JOIN branches b ON ml.branch_id=b.branch_id
JOIN provinces p ON b.province_id=p.province_id
JOIN region r ON p.region_id=r.region_id
$whereExpSQL
GROUP BY d
ORDER BY d
";

$stmtExpTrend = $conn->prepare($sqlExpenseTrend);
if ($typesExp) $stmtExpTrend->bind_param($typesExp, ...$paramsExp);
$stmtExpTrend->execute();
$resExpTrend = $stmtExpTrend->get_result();

$expenseMap=[];
while($row=$resExpTrend->fetch_assoc()){
    $expenseMap[$row["d"]] = (float)$row["expense"];
}

$expenseTrend=[];
foreach($labels as $d){
    $expenseTrend[] = $expenseMap[$d] ?? 0;
}

/* ==============================
   PAYMENT RATIO
============================== */

$sqlPayment = "
SELECT pm.name_th, COUNT(*) total
FROM payments pay
JOIN payment_methods pm ON pay.method_id = pm.method_id
JOIN bookings bk ON pay.booking_id = bk.booking_id
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
JOIN region r ON p.region_id = r.region_id
$whereSQL
GROUP BY pm.name_th
";

$stmtPay = $conn->prepare($sqlPayment);
if ($types) $stmtPay->bind_param($types, ...$params);
$stmtPay->execute();
$resPay = $stmtPay->get_result();

$payLabels = [];
$payData = [];

while ($row = $resPay->fetch_assoc()) {
    $payLabels[] = $row["name_th"];
    $payData[] = (int)$row["total"];
}


/* ==============================
   BOOKING TYPE RATIO
============================== */

$sqlRatio = "
SELECT bt.name_th, COUNT(*) total
FROM bookings bk
JOIN booking_types bt ON bk.booking_type_id = bt.id
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
JOIN region r ON p.region_id = r.region_id
$whereSQL
GROUP BY bt.name_th
";

$stmtRatio = $conn->prepare($sqlRatio);
if ($types) $stmtRatio->bind_param($types, ...$params);
$stmtRatio->execute();
$resRatio = $stmtRatio->get_result();

$ratioLabels = [];
$ratioData = [];

while ($row = $resRatio->fetch_assoc()) {
    $ratioLabels[] = $row["name_th"];
    $ratioData[] = (int)$row["total"];
}

$net_profit = (float)$kpi["total_revenue"] - (float)$expense["total_expense"];

/* ==============================
   CHANNEL DAILY (Online vs Walk-in)
============================== */

$sqlChannelDaily = "
SELECT 
    DAYOFWEEK(bk.pickup_time) AS day_num,
    SUM(CASE WHEN bt.name_th = 'ออนไลน์' THEN 1 ELSE 0 END) AS online,
    SUM(CASE WHEN bt.name_th = 'หน้าร้าน' THEN 1 ELSE 0 END) AS walkin
FROM bookings bk
JOIN booking_types bt ON bk.booking_type_id = bt.id
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
JOIN region r ON p.region_id = r.region_id
$whereSQL
GROUP BY day_num
ORDER BY FIELD(day_num,2,3,4,5,6,7,1)
";

$stmtChannel = $conn->prepare($sqlChannelDaily);
if ($types) $stmtChannel->bind_param($types, ...$params);
$stmtChannel->execute();
$resChannel = $stmtChannel->get_result();

$channelLabels = [];
$channelOnline = [];
$channelWalkin = [];

/* map วัน */
$days = [
    2 => "จันทร์",
    3 => "อังคาร",
    4 => "พุธ",
    5 => "พฤหัส",
    6 => "ศุกร์",
    7 => "เสาร์",
    1 => "อาทิตย์"
];

/* เตรียมค่าเริ่มต้น 0 */
$onlineMap = [];
$walkinMap = [];

foreach ($days as $num => $name) {
    $onlineMap[$num] = 0;
    $walkinMap[$num] = 0;
}

/* เติมค่าจาก DB */
while ($row = $resChannel->fetch_assoc()) {
    $dayNum = (int)$row["day_num"];
    $onlineMap[$dayNum] = (int)$row["online"];
    $walkinMap[$dayNum] = (int)$row["walkin"];
}

/* เรียงตาม จันทร์ → อาทิตย์ */
$channelLabels = [];
$channelOnline = [];
$channelWalkin = [];

foreach ($days as $num => $name) {
    $channelLabels[] = $name;
    $channelOnline[] = $onlineMap[$num];
    $channelWalkin[] = $walkinMap[$num];
}

/* ==============================
   RESPONSE
============================== */

echo json_encode([
    "kpi"=>[
        "total_bookings"=>(int)$kpi["total_bookings"],
        "total_revenue"=>(float)$kpi["total_revenue"],
        "total_expense"=>(float)$expense["total_expense"],
        "net_profit"=>$net_profit
    ],
    "trend"=>[
        "labels"=>$labels,
        "bookings"=>$bookings,
        "revenue"=>$revenue
    ],
    "top5"=>[
        "labels"=>$topLabels,
        "counts"=>$topCounts
    ],
    "profit_trend"=>[
        "labels"=>$labels,
        "revenue"=>$revenue,
        "expense"=>$expenseTrend
    ],
    "payment_ratio"=>[
        "labels"=>$payLabels,
        "data"=>$payData
    ],
    "booking_ratio"=>[
        "labels"=>$ratioLabels,
        "data"=>$ratioData
    ],
"channel_daily"=>[
    "labels"=>$channelLabels,
    "online"=>$channelOnline,
    "walkin"=>$channelWalkin
]
]);

} catch (Throwable $e) {

echo json_encode([
    "error" => true,
    "message" => $e->getMessage()
]);

}

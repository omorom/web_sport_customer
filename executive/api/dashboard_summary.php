<?php
require_once "../../database.php";
header("Content-Type: application/json; charset=utf-8");

try {

$data = json_decode(file_get_contents("php://input"), true) ?? [];

$region_id   = $data["region_id"] ?? "";
$province_id = $data["province_id"] ?? "";
$branch_id   = $data["branch_id"] ?? "";
$range       = $data["range"] ?? "";
$start       = $data["start"] ?? "";
$end         = $data["end"] ?? "";

/* ==============================
   FILTER
============================== */

$where = [];

if ($region_id)   $where[] = "r.region_id = '$region_id'";
if ($province_id) $where[] = "p.province_id = '$province_id'";
if ($branch_id)   $where[] = "bk.branch_id = '$branch_id'";

/* DATE */

$dataeCondition = "";

if ($range === "7days")
    $where[] = "bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
elseif ($range === "30days")
    $where[] = "bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
elseif ($range === "1year")
    $where[] = "bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
elseif ($range === "custom" && $start && $end)
    $where[] = "DATE(bk.pickup_time) BETWEEN '$start' AND '$end'";

$whereSQL = $where ? "WHERE " . implode(" AND ", $where) : "";

/* ==============================
   JOIN
============================== */

$join = "
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
JOIN region r ON p.region_id = r.region_id
";

// 🔥 WHERE สำหรับ repair (แยกจาก booking)
$whereRepair = [];

if ($region_id)   $whereRepair[] = "r.region_id = '$region_id'";
if ($province_id) $whereRepair[] = "p.province_id = '$province_id'";
if ($branch_id)   $whereRepair[] = "ml.branch_id = '$branch_id'";


$dateWhereRepair = "";
// date filter (ใช้ report_date)
if ($range === "7days")
    $whereRepair[] = "ml.report_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
elseif ($range === "30days")
    $whereRepair[] = "ml.report_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
elseif ($range === "1year")
    $whereRepair[] = "ml.report_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
elseif ($range === "custom" && $start && $end)
    $whereRepair[] = "DATE(ml.report_date) BETWEEN '$start' AND '$end'";

$whereRepairSQL = $whereRepair ? "WHERE " . implode(" AND ", $whereRepair) : "";


/* ==============================
   KPI (แยก query ชัด)
============================== */

// 🔹 total
$sqlTotal = "SELECT COUNT(*) total FROM bookings bk $join $whereSQL";
$total = $conn->query($sqlTotal)->fetch_assoc();

// 🔹 revenue (เฉพาะสำเร็จ)
$sqlRevenue = "
SELECT COALESCE(SUM(bk.net_amount),0) total_revenue
FROM bookings bk
$join
$whereSQL
" . ($whereSQL ? " AND" : " WHERE") . " bk.booking_status_id = 5
";
$rev = $conn->query($sqlRevenue)->fetch_assoc();

// 🔹 success count
$sqlSuccess = "
SELECT COUNT(*) total_success
FROM bookings bk
$join
$whereSQL
" . ($whereSQL ? " AND" : " WHERE") . " bk.booking_status_id = 5
";
$success = $conn->query($sqlSuccess)->fetch_assoc();

// 🔹 cancel count
$sqlCancel = "
SELECT COUNT(*) total_cancel
FROM bookings bk
$join
$whereSQL
" . ($whereSQL ? " AND" : " WHERE") . " bk.booking_status_id = 6
";
$cancel = $conn->query($sqlCancel)->fetch_assoc();

// 🔹 avg revenue (ถูกต้อง)
$avg_revenue = ($success["total_success"] > 0)
    ? $rev["total_revenue"] / $success["total_success"]
    : 0;

// 🔹 cancel rate (เฉพาะที่จบแล้ว)

$total = $conn->query("
SELECT COUNT(*) total
FROM bookings bk
$join
$whereSQL
")->fetch_assoc();

$cancel_rate = ($total["total"] > 0)
    ? ($cancel["total_cancel"] / $total["total"]) * 100
    : 0;

// 🔹 repair cost (ค่าใช้จ่ายรวม)
$sqlExpense = "
SELECT COALESCE(SUM(ml.repair_cost),0) total_expense
FROM maintenance_logs ml
JOIN branches b ON ml.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
JOIN region r ON p.region_id = r.region_id
$whereRepairSQL
";

$exp = $conn->query($sqlExpense)->fetch_assoc();

$net_profit = $rev["total_revenue"] - $exp["total_expense"];

/* ==============================
   TREND FINANCE
============================== */


$sqlFinance = "
SELECT 
    d,
    SUM(revenue) AS revenue,
    SUM(expense) AS expense,
    SUM(revenue) - SUM(expense) AS profit
FROM (

    -- 🔵 รายได้จาก booking
    SELECT 
        DATE(bk.pickup_time) AS d,
        SUM(
            CASE 
                WHEN bk.booking_status_id = 5 THEN bk.net_amount 
                ELSE 0 
            END
        ) AS revenue,
        0 AS expense
    FROM bookings bk
    $join
    $whereSQL
    GROUP BY DATE(bk.pickup_time)

    UNION ALL

    -- 🔴 ค่าใช้จ่ายจาก repair
    SELECT 
        DATE(ml.report_date) AS d,
        0 AS revenue,
        SUM(ml.repair_cost) AS expense
    FROM maintenance_logs ml
    JOIN branches b ON ml.branch_id = b.branch_id
    JOIN provinces p ON b.province_id = p.province_id
    JOIN region r ON p.region_id = r.region_id
    $whereRepairSQL
    GROUP BY DATE(ml.report_date)

) t

GROUP BY d
ORDER BY d
";

$resF = $conn->query($sqlFinance);

$financeLabels = [];
$financeRevenue = [];
$financeExpense = [];
$financeProfit = [];

while($row=$resF->fetch_assoc()){
    $financeLabels[] = $row["d"];
    $financeRevenue[] = (float)$row["revenue"];
    $financeExpense[] = (float)$row["expense"];
    $financeProfit[]  = (float)$row["profit"];
}


/* ==============================
   BOOKING TREND
============================== */

$sqlBooking = "
SELECT DATE(bk.pickup_time) d, COUNT(*) total
FROM bookings bk
$join
$whereSQL
GROUP BY d
ORDER BY d
";

$resB = $conn->query($sqlBooking);

$bookingLabels=[]; 
$bookingData=[];

while($row=$resB->fetch_assoc()){
    $bookingLabels[] = $row["d"];
    $bookingData[]   = (int)$row["total"];
}

/* ==============================
   CHANNEL
============================== */

$whereChannel = $whereSQL ? $whereSQL . " AND bk.booking_status_id = 5"
                         : "WHERE bk.booking_status_id = 5";

$sqlChannel = "
SELECT bt.name_th, SUM(bk.net_amount) revenue
FROM bookings bk
JOIN booking_types bt ON bk.booking_type_id = bt.id
$join
$whereChannel
GROUP BY bt.name_th
";

$resC = $conn->query($sqlChannel);

$channelLabels=[]; 
$channelData=[];

while($row=$resC->fetch_assoc()){
    $channelLabels[] = $row["name_th"];
    $channelData[]   = (float)$row["revenue"];
}

/* ==============================
   STATUS
============================== */

$sqlRatio = "
SELECT 
CASE 
    WHEN bk.booking_status_id IN (2, 3, 4, 5) THEN 'สำเร็จ'
    WHEN bk.booking_status_id = 6 THEN 'ยกเลิก'
    ELSE 'รอดำเนินการ'
END AS status,
COUNT(*) total
FROM bookings bk
$join
$whereSQL
GROUP BY status
";

$resR = $conn->query($sqlRatio);

$ratioLabels=[]; 
$ratioData=[];

while($row=$resR->fetch_assoc()){
    $ratioLabels[] = $row["status"];
    $ratioData[]   = (int)$row["total"];
}

/* ==============================
   BRANCH
============================== */

/* ==============================
   BRANCH
============================== */

// 🔹 filter location
$whereBranch = [];

if ($region_id)   $whereBranch[] = "r.region_id = '$region_id'";
if ($province_id) $whereBranch[] = "p.province_id = '$province_id'";
if ($branch_id)   $whereBranch[] = "b.branch_id = '$branch_id'";

$whereBranchSQL = $whereBranch ? "WHERE " . implode(" AND ", $whereBranch) : "";


// 🔹 date condition (ต้องอยู่ใน JOIN เท่านั้น!)
$dateCondition = "";

if ($range === "7days") {
    $dateCondition = "AND bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
}
elseif ($range === "30days") {
    $dateCondition = "AND bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
}
elseif ($range === "1year") {
    $dateCondition = "AND bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
}
elseif ($range === "custom" && $start && $end) {
    $dateCondition = "AND DATE(bk.pickup_time) BETWEEN '$start' AND '$end'";
}


// 🔹 SQL (แสดงทุกสาขาแม้ไม่มีรายได้)
$sqlBranch = "
SELECT 
    b.name,
    COALESCE(SUM(bk.net_amount),0) AS total

FROM branches b

LEFT JOIN bookings bk 
    ON bk.branch_id = b.branch_id
    AND bk.booking_status_id = 5
    $dateCondition

LEFT JOIN provinces p ON b.province_id = p.province_id
LEFT JOIN region r ON p.region_id = r.region_id

$whereBranchSQL

GROUP BY b.branch_id, b.name
ORDER BY total DESC
";


// 🔹 execute + กัน error
$resBranch = $conn->query($sqlBranch);

if(!$resBranch){
    throw new Exception("Branch Query Error: " . $conn->error);
}


// 🔹 map data ไปใช้ใน chart
$branchLabels = [];
$branchData   = [];

while($row = $resBranch->fetch_assoc()){
    $branchLabels[] = $row["name"];
    $branchData[]   = (float)$row["total"];
}
/* ==============================
   RESPONSE
============================== */

echo json_encode([
    "kpi"=>[
        "total_bookings" => (int)$total["total"],
        "total_revenue"  => (float)$rev["total_revenue"],
        "total_expense"  => (float)$exp["total_expense"],   // ✅ เพิ่ม
        "net_profit"     => (float)$net_profit,             // ✅ เพิ่ม
        "revenue_per_booking" => round($avg_revenue,2),
        "cancellation_rate"   => round($cancel_rate,2)
    ],

    "trend_finance"=>[
        "labels"=>$financeLabels,
        "revenue"=>$financeRevenue,
        "expense"=>$financeExpense,
        "profit"=>$financeProfit
    ],

    "trend_booking"=>[
        "labels"=>$bookingLabels,
        "data"=>$bookingData
    ],

    "trend_revenue"=>[
        "labels"=>$financeLabels,
        "data"=>$financeRevenue
    ],

    "channel"=>[
        "labels"=>$channelLabels,
        "data"=>$channelData
    ],

    "booking_ratio"=>[
        "labels"=>$ratioLabels,
        "data"=>$ratioData
    ],

    "branches"=>[
        "labels"=>$branchLabels,
        "data"=>$branchData
    ]
]);

} catch (Throwable $e) {

echo json_encode([
    "error"=>true,
    "message"=>$e->getMessage()
]);

}
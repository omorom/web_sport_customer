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
   DATE FILTER (BOOKING)
============================== */

$dateWhere = "";

if ($range === "7days") {
    $dateWhere = "AND bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
}
elseif ($range === "30days") {
    $dateWhere = "AND bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
}
elseif ($range === "1year") {
    $dateWhere = "AND bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
}
elseif ($range === "custom" && $start && $end) {
    $dateWhere = "AND DATE(bk.pickup_time) BETWEEN '$start' AND '$end'";
}

/* ==============================
   DATE FILTER (REPAIR)
============================== */

$dateWhereRepair = "";

if ($range === "7days") {
    $dateWhereRepair = "AND ml.report_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
}
elseif ($range === "30days") {
    $dateWhereRepair = "AND ml.report_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
}
elseif ($range === "1year") {
    $dateWhereRepair = "AND ml.report_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
}
elseif ($range === "custom" && $start && $end) {
    $dateWhereRepair = "AND DATE(ml.report_date) BETWEEN '$start' AND '$end'";
}

/* ==============================
   FILTER
============================== */

$filterJoin = "";

if ($branch_id) {
    $filterJoin .= " AND bk.branch_id = '$branch_id'";
}
if ($province_id) {
    $filterJoin .= " AND b.province_id = '$province_id'";
}
if ($region_id) {
    $filterJoin .= " AND p.region_id = '$region_id'";
}

/* ==============================
   HELPER
============================== */

function getOne($conn, $sql) {
    return $conn->query($sql)->fetch_assoc();
}

/* ==============================
   KPI
============================== */

// total equipment
$sqlTotal = "
SELECT COUNT(*) total
FROM equipment_instances ei
JOIN branches b ON ei.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
WHERE 1=1
" 
. ($branch_id ? "AND ei.branch_id = '$branch_id'" : "")
. ($province_id ? "AND b.province_id = '$province_id'" : "")
. ($region_id ? "AND p.region_id = '$region_id'" : "");

$total = getOne($conn, $sqlTotal);

// used
$sqlUsed = "
SELECT COUNT(*) used
FROM booking_details bd
JOIN bookings bk ON bd.booking_id = bk.booking_id
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
WHERE bd.item_type = 'Equipment'
$dateWhere
$filterJoin
";

$used = getOne($conn, $sqlUsed);

$usage_rate = ($total["total"] > 0)
    ? ($used["used"] * 100.0 / $total["total"])
    : 0;

// damage rate
$sqlDamage = "
SELECT 
SUM(CASE WHEN bia.return_condition_id > 1 THEN 1 ELSE 0 END) * 100.0 
/ NULLIF(COUNT(*),0) damage_rate
FROM booking_item_assignments bia
JOIN booking_details bd ON bia.detail_id = bd.detail_id
JOIN bookings bk ON bd.booking_id = bk.booking_id
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
WHERE 1=1
$dateWhere
$filterJoin
";

$damage = getOne($conn, $sqlDamage);

// repair KPI (ของจริง)
$sqlRepairKPI = "
SELECT COALESCE(SUM(ml.repair_cost),0) AS total_repair_cost
FROM maintenance_logs ml
JOIN branches b ON ml.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
WHERE 1=1
$dateWhereRepair
"
. ($branch_id ? "AND ml.branch_id = '$branch_id'" : "")
. ($province_id ? "AND b.province_id = '$province_id'" : "")
. ($region_id ? "AND p.region_id = '$region_id'" : "");

$repairKPI = getOne($conn, $sqlRepairKPI);

/* ==============================
   POPULAR
============================== */

$sqlPopular = "
SELECT 
    e.name AS equipment_name,
    COUNT(*) total
FROM booking_details bd
JOIN bookings bk ON bd.booking_id = bk.booking_id
JOIN equipment_master e ON bd.equipment_id = e.equipment_id
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
WHERE bd.item_type = 'Equipment'
$dateWhere
$filterJoin
GROUP BY e.name
ORDER BY total DESC
LIMIT 5
";

$resP = $conn->query($sqlPopular);

$popLabels=[]; 
$popData=[];

while($row=$resP->fetch_assoc()){
    $popLabels[] = $row["equipment_name"];
    $popData[]   = (int)$row["total"];
}

/* ==============================
   TREND BOOKING
============================== */

$sqlTrend = "
SELECT 
    DATE(bk.pickup_time) d,
    COUNT(*) AS bookings,
    SUM(bk.net_amount) AS revenue
FROM bookings bk
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
WHERE 1=1
$dateWhere
$filterJoin
GROUP BY d
ORDER BY d
";

$resT = $conn->query($sqlTrend);

$trendLabels=[]; 
$trendBookings=[];
$trendRevenue=[];

while($row=$resT->fetch_assoc()){
    $trendLabels[]   = $row["d"];
    $trendBookings[] = (int)$row["bookings"];
    $trendRevenue[]  = (float)$row["revenue"];
}

/* ==============================
   TREND REPAIR
============================== */

$sqlTrendRepair = "
SELECT 
    DATE(ml.report_date) d,
    SUM(ml.repair_cost) AS expense
FROM maintenance_logs ml
JOIN branches b ON ml.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
WHERE 1=1
$dateWhereRepair
GROUP BY d
ORDER BY d
";

$resTR = $conn->query($sqlTrendRepair);

$repairTrendLabels=[]; 
$repairTrendData=[];

while($row=$resTR->fetch_assoc()){
    $repairTrendLabels[] = $row["d"];
    $repairTrendData[]   = (float)$row["expense"];
}

/* ==============================
   DAMAGE PIE
============================== */

$sqlDamageChart = "
SELECT 
SUM(CASE WHEN bia.return_condition_id = 1 THEN 1 ELSE 0 END) good,
SUM(CASE WHEN bia.return_condition_id > 1 THEN 1 ELSE 0 END) damaged
FROM booking_item_assignments bia
JOIN booking_details bd ON bia.detail_id = bd.detail_id
JOIN bookings bk ON bd.booking_id = bk.booking_id
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
WHERE 1=1
$dateWhere
$filterJoin
";

$damageChart = getOne($conn, $sqlDamageChart);

/* ==============================
   DAMAGE TOP
============================== */

$sqlDamageTop = "
SELECT 
    e.name AS equipment_name,
    COUNT(*) total
FROM booking_item_assignments bia
JOIN booking_details bd ON bia.detail_id = bd.detail_id
JOIN bookings bk ON bd.booking_id = bk.booking_id
JOIN equipment_master e ON bd.equipment_id = e.equipment_id
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
WHERE bia.return_condition_id > 1
$dateWhere
$filterJoin
GROUP BY e.name
ORDER BY total DESC
LIMIT 5
";

$resD = $conn->query($sqlDamageTop);

$damageTopLabels=[]; 
$damageTopData=[];

while($row=$resD->fetch_assoc()){
    $damageTopLabels[] = $row["equipment_name"];
    $damageTopData[]   = (int)$row["total"];
}

/* ==============================
   REPAIR BY BRANCH
============================== */

$sqlRepair = "
SELECT 
    b.name,
    COALESCE(SUM(ml.repair_cost),0) AS total_cost
FROM branches b
LEFT JOIN maintenance_logs ml 
    ON ml.branch_id = b.branch_id
    $dateWhereRepair
JOIN provinces p ON b.province_id = p.province_id
WHERE 1=1
"
. ($branch_id ? "AND b.branch_id = '$branch_id'" : "")
. ($province_id ? "AND b.province_id = '$province_id'" : "")
. ($region_id ? "AND p.region_id = '$region_id'" : "") . "
GROUP BY b.branch_id, b.name
ORDER BY total_cost DESC
";

$resR = $conn->query($sqlRepair);

$repairLabels=[]; 
$repairData=[];

while($row=$resR->fetch_assoc()){
    $repairLabels[] = $row["name"];
    $repairData[]   = (float)$row["total_cost"];
}

/* ==============================
   RESPONSE
============================== */

echo json_encode([
    "kpi"=>[
        "total_equipment" => (int)$total["total"],
        "used_equipment"  => (int)$used["used"],
        "usage_rate"      => round($usage_rate,2),
        "damage_rate"     => round((float)$damage["damage_rate"],2),
        "repair_cost"     => (float)$repairKPI["total_repair_cost"]
    ],
    "popular"=>[
        "labels"=>$popLabels,
        "data"=>$popData
    ],
    "trend_booking"=>[
        "labels"=>$trendLabels,
        "data"=>$trendBookings
    ],
    "trend_revenue"=>[
        "labels"=>$trendLabels,
        "data"=>$trendRevenue
    ],
    "trend_repair"=>[
        "labels"=>$repairTrendLabels,
        "data"=>$repairTrendData
    ],
    "damage"=>[
        "data"=>[
            (int)$damageChart["good"],
            (int)$damageChart["damaged"]
        ]
    ],
    "damage_top"=>[
        "labels"=>$damageTopLabels,
        "data"=>$damageTopData
    ],
    "repair"=>[
        "labels"=>$repairLabels,
        "data"=>$repairData
    ]
]);

} catch (Throwable $e) {

echo json_encode([
    "error" => true,
    "message" => $e->getMessage()
]);

}
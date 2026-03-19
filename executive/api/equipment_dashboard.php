<?php
require_once "../../database.php";
header("Content-Type: application/json; charset=utf-8");

try {

$data = json_decode(file_get_contents("php://input"), true) ?? [];

/* ==============================
   FILTER
============================== */

$region_id   = $data["region_id"] ?? "";
$province_id = $data["province_id"] ?? "";
$branch_id   = $data["branch_id"] ?? "";
$range       = $data["range"] ?? "";
$start       = $data["start"] ?? "";
$end         = $data["end"] ?? "";

/* ==============================
   DATE FILTER
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
   FILTER BUILDER
============================== */

$filterBooking = "WHERE bd.item_type = 'Equipment'"; // 🔥 เอา status ออก
$filterEquipment = "WHERE 1=1";

if ($branch_id) {
    $filterBooking .= " AND bk.branch_id = '$branch_id'";
    $filterEquipment .= " AND ei.branch_id = '$branch_id'";
}

if ($province_id) {
    $filterBooking .= " AND b.province_id = '$province_id'";
    $filterEquipment .= " AND b.province_id = '$province_id'";
}

if ($region_id) {
    $filterBooking .= " AND p.region_id = '$region_id'";
    $filterEquipment .= " AND p.region_id = '$region_id'";
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

$sqlTotal = "
SELECT COUNT(*) total
FROM equipment_instances ei
JOIN branches b ON ei.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
$filterEquipment
";

$total = getOne($conn, $sqlTotal);

$sqlUsed = "
SELECT COUNT(*) used
FROM booking_details bd
JOIN bookings bk ON bd.booking_id = bk.booking_id
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
$filterBooking
$dateWhere
";

$used = getOne($conn, $sqlUsed);

$usage_rate = ($total["total"] > 0)
    ? ($used["used"] * 100.0 / $total["total"])
    : 0;

/* DAMAGE RATE */
$sqlDamage = "
SELECT 
SUM(CASE WHEN return_condition_id > 1 THEN 1 ELSE 0 END) * 100.0 
/ NULLIF(COUNT(*),0) damage_rate
FROM booking_item_assignments
";

$damage = getOne($conn, $sqlDamage);

/* ==============================
   POPULAR
============================== */

$sqlPopular = "
SELECT bd.equipment_id, COUNT(*) total
FROM booking_details bd
JOIN bookings bk ON bd.booking_id = bk.booking_id
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
$filterBooking
$dateWhere
GROUP BY bd.equipment_id
ORDER BY total DESC
LIMIT 5
";

$resP = $conn->query($sqlPopular);

$popLabels=[]; 
$popData=[];

while($row=$resP->fetch_assoc()){
    $popLabels[] = $row["equipment_id"];
    $popData[]   = (int)$row["total"];
}

/* ==============================
   USAGE TREND
============================== */

$sqlTrend = "
SELECT DATE(bk.pickup_time) d, COUNT(*) total
FROM booking_details bd
JOIN bookings bk ON bd.booking_id = bk.booking_id
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
$filterBooking
$dateWhere
GROUP BY d
ORDER BY d
";

$resT = $conn->query($sqlTrend);

$trendLabels=[]; 
$trendData=[];

while($row=$resT->fetch_assoc()){
    $trendLabels[] = $row["d"];
    $trendData[]   = (int)$row["total"];
}

/* ==============================
   DAMAGE PIE
============================== */

$sqlDamageChart = "
SELECT 
SUM(CASE WHEN return_condition_id = 1 THEN 1 ELSE 0 END) good,
SUM(CASE WHEN return_condition_id > 1 THEN 1 ELSE 0 END) damaged
FROM booking_item_assignments
";

$damageChart = getOne($conn, $sqlDamageChart);

/* ==============================
   🔥 TOP DAMAGED EQUIPMENT
============================== */

$sqlDamageTop = "
SELECT 
bd.equipment_id,
COUNT(*) total
FROM booking_item_assignments bia
JOIN booking_details bd 
    ON bia.detail_id = bd.detail_id
WHERE bia.return_condition_id > 1
GROUP BY bd.equipment_id
ORDER BY total DESC
LIMIT 5
";

$resD = $conn->query($sqlDamageTop);

$damageTopLabels=[]; 
$damageTopData=[];

while($row=$resD->fetch_assoc()){
    $damageTopLabels[] = $row["equipment_id"];
    $damageTopData[]   = (int)$row["total"];
}

/* ==============================
   🔥 DAMAGE BY BRANCH
============================== */

$sqlRepair = "
SELECT 
b.name,
COALESCE(SUM(
    CASE 
        WHEN bia.return_condition_id > 1 THEN 1 
        ELSE 0 
    END
),0) AS total_cost

FROM branches b

LEFT JOIN bookings bk 
    ON bk.branch_id = b.branch_id

LEFT JOIN booking_details bd 
    ON bd.booking_id = bk.booking_id 
    AND bd.item_type = 'Equipment'

LEFT JOIN booking_item_assignments bia 
    ON bd.detail_id = bia.detail_id

JOIN provinces p ON b.province_id = p.province_id

WHERE 1=1
"
. ($branch_id ? "AND b.branch_id = '$branch_id'" : "")
. ($province_id ? "AND b.province_id = '$province_id'" : "")
. ($region_id ? "AND p.region_id = '$region_id'" : "") . "

GROUP BY b.branch_id
ORDER BY total_cost DESC
";

$resR = $conn->query($sqlRepair);

$repairLabels=[]; 
$repairData=[];

while($row=$resR->fetch_assoc()){
    $repairLabels[] = $row["name"];
    $repairData[]   = (int)$row["total_cost"];
}

/* ==============================
   RESPONSE
============================== */

echo json_encode([
    "kpi"=>[
        "total_equipment" => (int)$total["total"],
        "used_equipment"  => (int)$used["used"],
        "usage_rate"      => round($usage_rate,2),
        "damage_rate"     => round((float)$damage["damage_rate"],2)
    ],
    "popular"=>[
        "labels"=>$popLabels,
        "data"=>$popData
    ],
    "usage"=>[
        "labels"=>$trendLabels,
        "data"=>$trendData
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
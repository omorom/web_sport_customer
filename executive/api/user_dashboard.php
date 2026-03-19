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
   JOIN BASE
============================== */

$join = "
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
JOIN region r ON p.region_id = r.region_id
";

/* ==============================
   WHERE (BOOKING BASE)
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
    $where[] = "bk.branch_id = ?";
    $params[] = $branch_id;
    $types .= "s";
}

/* DATE */

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
   HELPER
============================== */

function runQuery($conn, $sql, $types, $params) {
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception($conn->error);
    }
    if ($types) $stmt->bind_param($types, ...$params);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

/* ==============================
   KPI
============================== */

$totalCustomer = runQuery($conn,"
SELECT COUNT(DISTINCT bk.customer_id) total_customers
FROM bookings bk
$join
$whereSQL
", $types, $params);

$totalCust = (int)$totalCustomer["total_customers"];

/*  REPEAT (LIFETIME) */
$repeat = runQuery($conn,"
SELECT COUNT(*) repeat_customers FROM (
    SELECT customer_id
    FROM bookings
    GROUP BY customer_id
    HAVING COUNT(*) > 1
) t
WHERE customer_id IN (
    SELECT DISTINCT bk.customer_id
    FROM bookings bk
    $join
    $whereSQL
)
", $types, $params)['repeat_customers'];

$repeat_rate = ($totalCust > 0) ? ($repeat / $totalCust) * 100 : 0;

/* AVG BOOKING */
$avgBooking = runQuery($conn,"
SELECT COUNT(*) / NULLIF(COUNT(DISTINCT bk.customer_id),0) avg_booking
FROM bookings bk
$join
$whereSQL
", $types, $params);

/* ARPU */
$arpu = runQuery($conn,"
SELECT 
SUM(bk.net_amount) / NULLIF(COUNT(DISTINCT CASE WHEN bk.booking_status_id = 5 THEN bk.customer_id END),0) arpu
FROM bookings bk
$join
$whereSQL
AND bk.booking_status_id = 5
", $types, $params);


/* ==============================
   CHART 1: NEW VS RETURNING
============================== */

$newReturn = runQuery($conn,"
SELECT 
SUM(CASE WHEN cnt = 1 THEN 1 ELSE 0 END) new_customers,
SUM(CASE WHEN cnt > 1 THEN 1 ELSE 0 END) returning_customers
FROM (
    SELECT bk.customer_id, COUNT(*) cnt
    FROM bookings bk
    $join
    $whereSQL
    GROUP BY bk.customer_id
) t
", $types, $params);

/* ==============================
   CHART 2: BOOKING GROUP
============================== */

$stmt = $conn->prepare("
SELECT 
    CASE 
        WHEN cnt BETWEEN 1 AND 4 THEN '(1–4 ครั้ง)'
        WHEN cnt BETWEEN 5 AND 10 THEN '(5–10 ครั้ง)'
        ELSE '(11 ครั้งขึ้นไป)'
    END AS booking_group,
    COUNT(*) total
FROM (
    SELECT bk.customer_id, COUNT(*) cnt
    FROM bookings bk
    $join
    $whereSQL
    GROUP BY bk.customer_id
) t
GROUP BY booking_group
ORDER BY 
    CASE 
        WHEN booking_group = '(1–4 ครั้ง)' THEN 1
        WHEN booking_group = '(5–10 ครั้ง)' THEN 2
        ELSE 3
    END
");

if (!$stmt) throw new Exception($conn->error);
if ($types) $stmt->bind_param($types, ...$params);

$stmt->execute();
$res = $stmt->get_result();

$labels = [];
$data   = [];

while ($row = $res->fetch_assoc()) {
    $labels[] = $row["booking_group"];
    $data[]   = (int)$row["total"];
}

/* ==============================
   CHART 3: REVENUE BY TYPE
============================== */

$typeWhere = $where;
$typeWhere[] = "bk.booking_status_id = 5";

$typeSQL = count($typeWhere)
    ? "WHERE " . implode(" AND ", $typeWhere)
    : "";

$stmtType = $conn->prepare("
SELECT 
    c.customer_type,
    SUM(bk.net_amount) revenue
FROM bookings bk
JOIN customers c ON bk.customer_id = c.customer_id
$join
$typeSQL
GROUP BY c.customer_type
");

if (!$stmtType) throw new Exception($conn->error);
if ($types) $stmtType->bind_param($types, ...$params);

$stmtType->execute();

$typeLabels = [];
$typeData = [];

$resType = $stmtType->get_result();
while ($row = $resType->fetch_assoc()) {
    $typeLabels[] = $row["customer_type"];
    $typeData[]   = (float)$row["revenue"];
}

/* ==============================
   CHART 4: CANCEL BY TYPE
============================== */

$typeWhere = $where;
$typeWhere[] = "bk.booking_status_id = 6";

$typeSQL = count($typeWhere)
    ? "WHERE " . implode(" AND ", $typeWhere)
    : "";

$stmtCT = $conn->prepare("
SELECT 
    c.customer_type,
    COUNT(*) cancelled
FROM bookings bk
JOIN customers c ON bk.customer_id = c.customer_id
$join
$typeSQL
GROUP BY c.customer_type
");

if (!$stmtCT) throw new Exception($conn->error);
if ($types) $stmtCT->bind_param($types, ...$params);

$stmtCT->execute();

$cancelTypeLabels = [];
$cancelTypeData = [];

$resCT = $stmtCT->get_result();
while ($row = $resCT->fetch_assoc()) {
    $cancelTypeLabels[] = $row["customer_type"];
    $cancelTypeData[]   = (int)$row["cancelled"];
}

/* ==============================
   CHART 5: CUSTOMER BY BRANCH
============================== */

$paramsBranch = [];
$typesBranch = "";

$sqlBranch = "
SELECT 
    b.name,
    COUNT(DISTINCT bk.customer_id) total_customers
FROM branches b
LEFT JOIN provinces p ON b.province_id = p.province_id
LEFT JOIN region r ON p.region_id = r.region_id
LEFT JOIN bookings bk 
    ON bk.branch_id = b.branch_id
";

/* DATE */
if ($range === "7days") {
    $sqlBranch .= " AND bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
}
elseif ($range === "30days") {
    $sqlBranch .= " AND bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
}
elseif ($range === "1year") {
    $sqlBranch .= " AND bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
}
elseif ($range === "custom" && $start && $end) {
    $sqlBranch .= " AND DATE(bk.pickup_time) BETWEEN ? AND ?";
    $paramsBranch[] = $start;
    $paramsBranch[] = $end;
    $typesBranch .= "ss";
}

$whereBranch = [];

if ($region_id !== "") {
    $whereBranch[] = "r.region_id = ?";
    $paramsBranch[] = (int)$region_id;
    $typesBranch .= "i";
}

if ($province_id !== "") {
    $whereBranch[] = "p.province_id = ?";
    $paramsBranch[] = (int)$province_id;
    $typesBranch .= "i";
}

if ($branch_id !== "") {
    $whereBranch[] = "b.branch_id = ?";
    $paramsBranch[] = $branch_id;
    $typesBranch .= "s";
}

if ($whereBranch) {
    $sqlBranch .= " WHERE " . implode(" AND ", $whereBranch);
}

$sqlBranch .= " GROUP BY b.branch_id ORDER BY total_customers DESC";

$stmtB = $conn->prepare($sqlBranch);
if (!$stmtB) throw new Exception($conn->error);
if ($typesBranch) $stmtB->bind_param($typesBranch, ...$paramsBranch);
$stmtB->execute();

$resB = $stmtB->get_result();

$branchLabels = [];
$branchData = [];

while ($row = $resB->fetch_assoc()) {
    $branchLabels[] = $row["name"];
    $branchData[]   = (int)$row["total_customers"];
}

/* ==============================
   RESPONSE
============================== */

echo json_encode([
    "kpi"=>[
        "total_customers" => $totalCust,
        "repeat_rate"     => round($repeat_rate,2),
        "avg_booking"     => (float)$avgBooking["avg_booking"],
        "arpu"            => (float)$arpu["arpu"]
    ],
    "charts"=>[
        "new_vs_returning"=>[
            "new" => (int)$newReturn["new_customers"],
            "returning" => (int)$newReturn["returning_customers"]
        ],
        "booking_group"=>[
        "labels"=>$labels,
        "data"=>$data
        ],
        "revenue_by_type"=>[
            "labels"=>$typeLabels,
            "data"=>$typeData
        ],
        "cancel_by_type"=>[
            "labels"=>$cancelTypeLabels,
            "data"=>$cancelTypeData
        ],
        "customers_by_branch"=>[
            "labels"=>$branchLabels,
            "data"=>$branchData
        ]
    ]
]);

} catch (Throwable $e) {

echo json_encode([
    "error" => true,
    "message" => $e->getMessage()
]);

}
<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

$branchId   = $_GET["branch_id"] ?? null;
$categories = $_GET["categories"] ?? "";
$minPrice   = $_GET["min_price"] ?? null;
$maxPrice   = $_GET["max_price"] ?? null;
$q          = $_GET["q"] ?? null;

// ===== เวลาเช่า =====
$date  = $_GET["date"] ?? null;
$time  = $_GET["time"] ?? null;
$hours = intval($_GET["hours"] ?? 0);

$where = [];

// ================== BRANCH ==================
if ($branchId) {
    $branchId = $conn->real_escape_string($branchId);
    $where[] = "ei.branch_id = '$branchId'";
}

// ================== CATEGORY ==================
if ($categories) {
    $ids = array_map("intval", explode(",", $categories));
    if (!empty($ids)) {
        $in  = implode(",", $ids);
        $where[] = "em.category_id IN ($in)";
    }
}

// ================== PRICE ==================
if ($minPrice !== null) {
    $where[] = "em.price_per_unit >= " . floatval($minPrice);
}

if ($maxPrice !== null) {
    $where[] = "em.price_per_unit <= " . floatval($maxPrice);
}

// ================== SEARCH ==================
if ($q) {
    $safe = $conn->real_escape_string($q);
    $where[] = "em.name LIKE '%$safe%'";
}

// ================== TIME PARSE ==================

$timeCondition = "";

if ($date && $time && $hours > 0) {

    $dt =
        DateTime::createFromFormat("d/m/Y H:i", "$date $time")
        ?: DateTime::createFromFormat("d/m/Y H", "$date $time");

    if ($dt) {
        $start = $dt->format("Y-m-d H:i:s");
        $end   = date("Y-m-d H:i:s", strtotime("$start +$hours hour"));

        $start = $conn->real_escape_string($start);
        $end   = $conn->real_escape_string($end);

        // 👇 OR เฉพาะเวลา ไม่สน status
        $timeCondition = "
            AND (
                b.pickup_time BETWEEN '$start' AND '$end'
                OR b.due_return_time BETWEEN '$start' AND '$end'
            )
        ";
    }
}

// ================== SQL ==================

$sql = "
SELECT 
    em.equipment_id,
    em.name,
    em.image_url,
    em.price_per_unit,
    em.category_id,

    GREATEST(
        COUNT(ei.instance_code) - IFNULL(bk.booked_qty,0),
        0
    ) AS available_stock

FROM equipment_master em

LEFT JOIN equipment_instances ei 
    ON em.equipment_id = ei.equipment_id
    AND ei.status = 'Ready'

LEFT JOIN (
    SELECT 
        bd.equipment_id,
        SUM(bd.quantity) AS booked_qty
    FROM booking_details bd
    INNER JOIN bookings b 
        ON bd.booking_id = b.booking_id
    WHERE bd.item_type = 'Equipment'
      $timeCondition
    GROUP BY bd.equipment_id
) bk ON em.equipment_id = bk.equipment_id
";

// ================== WHERE ==================
if ($where) {
    $sql .= " WHERE " . implode(" AND ", $where);
}

// ================== GROUP / HAVING / ORDER ==================
$sql .= "
GROUP BY 
    em.equipment_id,
    em.name,
    em.image_url,
    em.price_per_unit,
    em.category_id
HAVING available_stock > 0
ORDER BY em.name
";

// ================== EXECUTE ==================

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "mysql_error" => $conn->error,
        "sql" => $sql
    ]);
    exit;
}

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);

$conn->close();

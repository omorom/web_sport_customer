<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

$branchId = $_SESSION["branch_id"] ?? null;

if (!$branchId) {
    echo json_encode([
        "success" => false,
        "message" => "No branch in session"
    ]);
    exit;
}

/* ===== รับค่าจาก GET ===== */

$q           = $_GET["q"] ?? "";
$status      = $_GET["status"] ?? "";
$categoryId  = $_GET["category_id"] ?? "";
$expiry      = $_GET["expiry"] ?? "";
$minPrice    = $_GET["min_price"] ?? "";
$maxPrice    = $_GET["max_price"] ?? "";
$sort        = $_GET["sort"] ?? "";

/* ===== SQL หลัก ===== */

$sql = "
SELECT 
    ei.instance_code,
    ei.status,
    ei.current_location,
    ei.expiry_date,
    ei.received_date,
    e.equipment_id,
    e.name AS name,
    e.price_per_unit,
    c.category_id,
    c.name AS category_name
FROM equipment_instances ei
JOIN equipment_master e 
    ON ei.equipment_id = e.equipment_id
JOIN categories c 
    ON e.category_id = c.category_id
WHERE ei.branch_id = ?
";

$params = [$branchId];
$types  = "s";

/* ===== SEARCH ===== */

if ($q !== "") {
    $sql .= " AND (ei.instance_code LIKE ? OR e.name LIKE ?)";
    $search = "%$q%";
    $params[] = $search;
    $params[] = $search;
    $types .= "ss";
}

/* ===== STATUS ===== */

if ($status !== "") {
    $sql .= " AND ei.status = ?";
    $params[] = $status;
    $types .= "s";
}

/* ===== CATEGORY ===== */

if ($categoryId !== "") {
    $sql .= " AND c.category_id = ?";
    $params[] = $categoryId;
    $types .= "s";
}

/* ===== EXPIRY ===== */

if ($expiry === "expired") {
    $sql .= " AND ei.expiry_date < CURDATE()";
}
elseif ($expiry === "near") {
    $sql .= " AND ei.expiry_date BETWEEN CURDATE() 
              AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)";
}

/* ===== PRICE RANGE ===== */

if ($minPrice !== "") {
    $sql .= " AND e.price_per_unit >= ?";
    $params[] = $minPrice;
    $types .= "d";
}

if ($maxPrice !== "") {
    $sql .= " AND e.price_per_unit <= ?";
    $params[] = $maxPrice;
    $types .= "d";
}

/* ===== SORT ===== */

switch ($sort) {
    case "price_asc":
        $sql .= " ORDER BY e.price_per_unit ASC";
        break;

    case "price_desc":
        $sql .= " ORDER BY e.price_per_unit DESC";
        break;

    case "newest":
        $sql .= " ORDER BY ei.received_date DESC";
        break;

    case "oldest":
        $sql .= " ORDER BY ei.received_date ASC";
        break;

    default:
        $sql .= " ORDER BY c.name, e.name";
}

/* ===== PREPARE & EXECUTE ===== */

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode([
    "success" => true,
    "data" => $data
]);

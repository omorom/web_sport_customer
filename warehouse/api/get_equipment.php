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

$sql = "
    SELECT 
    ei.instance_code,
    ei.status,
    ei.current_location,
    ei.expiry_date,
    e.equipment_id,
    e.name AS equipment_name,
    c.category_id,
    c.name AS category_name
FROM equipment_instances ei
JOIN equipment_master e 
    ON ei.equipment_id = e.equipment_id
JOIN categories c 
    ON e.category_id = c.category_id
WHERE ei.branch_id = ?
ORDER BY c.name, e.name;

";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $branchId);
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
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
    m.log_id,
    m.instance_code,
    m.description,
    m.report_date,
    m.repair_cost,
    d.name_th AS damage_name_th,
    s.status_id,
    s.name_th AS status_name_th
FROM Maintenance_logs m
JOIN equipment_instances ei 
    ON m.instance_code = ei.instance_code
LEFT JOIN damage_levels d 
    ON m.damage_id = d.damage_id
LEFT JOIN maintenance_status s 
    ON m.status_id = s.status_id
WHERE ei.branch_id = ?
ORDER BY m.report_date DESC
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

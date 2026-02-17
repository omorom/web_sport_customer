<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

$categoryId = $_GET["category_id"] ?? "";

$sql = "
SELECT equipment_id, name
FROM equipment_master
WHERE category_id = ?
ORDER BY name
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $categoryId);
$stmt->execute();

$result = $stmt->get_result();
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(["success" => true, "data" => $data]);

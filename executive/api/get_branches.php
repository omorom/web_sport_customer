<?php
require_once "../../database.php";
header("Content-Type: application/json");

$province_id = $_GET["province_id"] ?? null;

$sql = "SELECT branch_id, name FROM branches";
$params = [];
$types = "";

if (!empty($province_id)) {
    $sql .= " WHERE province_id = ?";
    $params[] = $province_id;
    $types = "s";
}

$sql .= " ORDER BY name";

$stmt = $conn->prepare($sql);
if ($types) $stmt->bind_param($types, ...$params);
$stmt->execute();

$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    "success" => true,
    "data" => $rows
]);

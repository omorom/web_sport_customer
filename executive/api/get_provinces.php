<?php
require_once "../../database.php";
header("Content-Type: application/json");

$region_id = $_GET["region_id"] ?? null;

$sql = "SELECT province_id, name FROM provinces";
$params = [];
$types = "";

if (!empty($region_id)) {
    $sql .= " WHERE region_id = ?";
    $params[] = (int)$region_id;
    $types = "i";
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

<?php
require_once "../../database.php";
header("Content-Type: application/json");

$sql = "SELECT region_id, region_name FROM region ORDER BY region_name";
$result = $conn->query($sql);

$rows = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    "success" => true,
    "data" => $rows
]);
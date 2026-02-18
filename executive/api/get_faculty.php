<?php
require_once "../../database.php";
header("Content-Type: application/json; charset=utf-8");

$sql = "SELECT id, name FROM faculty ORDER BY name";

$result = $conn->query($sql);

$data = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "data" => $data
]);

<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["branch_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
    exit;
}

$sql = "
    SELECT category_id, name
    FROM categories
    ORDER BY name
";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

$conn->close();

echo json_encode([
    "success" => true,
    "data" => $data
]);

<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["staff_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
    exit;
}

$id = $_GET["id"] ?? null;

if (!$id) {
    echo json_encode([
        "success" => false,
        "message" => "missing customer id"
    ]);
    exit;
}

$stmt = $conn->prepare("
    SELECT 
        c.customer_id,
        c.name,
        c.phone,
        c.customer_type,
        c.current_points,
        c.study_year,
        f.name AS faculty_name
    FROM customers c
    LEFT JOIN faculty f
        ON c.faculty_id = f.id
    WHERE c.customer_id = ?
    LIMIT 1
");

$stmt->bind_param("s", $id);
$stmt->execute();

$res = $stmt->get_result()->fetch_assoc();

if (!$res) {
    echo json_encode([
        "success" => false,
        "message" => "not found"
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "customer" => $res
]);

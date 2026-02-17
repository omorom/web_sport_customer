<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

$branchId = $_SESSION["branch_id"] ?? null;

if (!$branchId) {
    echo json_encode(["success" => false]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$instanceCode = $data["instance_code"] ?? "";

if (!$instanceCode) {
    echo json_encode(["success" => false]);
    exit;
}

$stmt = $conn->prepare("
    UPDATE equipment_instances
    SET status = 'Expired',
        current_location = 'Expired Storage'
    WHERE instance_code = ?
    AND branch_id = ?
");

$stmt->bind_param("ss", $instanceCode, $branchId);
$stmt->execute();

echo json_encode(["success" => true]);

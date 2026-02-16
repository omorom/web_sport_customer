<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["staff_id"])) {
    echo json_encode(["success" => false]);
    exit;
}

$branchId = $_SESSION["branch_id"] ?? null;

if (!$branchId) {
    echo json_encode(["success" => false]);
    exit;
}

$sql = "SELECT name FROM branches WHERE branch_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $branchId);
$stmt->execute();
$result = $stmt->get_result();
$branch = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "staff_id" => $_SESSION["staff_id"],
    "branch_id" => $branchId,
    "branch_name" => $branch["name"] ?? "ไม่พบสาขา"
]);
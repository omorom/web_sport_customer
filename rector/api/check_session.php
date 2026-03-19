<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["staff_id"])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

echo json_encode([
    "success" => true,
    "staff_id" => $_SESSION["staff_id"],
    "branch_id" => $_SESSION["branch_id"] ?? null,
    "branch_name" => $_SESSION["branch_name"] ?? "ไม่ระบุสาขา"
]);
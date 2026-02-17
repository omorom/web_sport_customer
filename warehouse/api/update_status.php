<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

// =============================
// ตรวจสอบ branch ใน session
// =============================
$branchId = $_SESSION["branch_id"] ?? null;

if (!$branchId) {
    echo json_encode([
        "success" => false,
        "message" => "No branch in session"
    ]);
    exit;
}

// =============================
// รับ JSON
// =============================
$data = json_decode(file_get_contents("php://input"), true);

$logId = $data["log_id"] ?? null;
$statusId = $data["status_id"] ?? null;

if (!$logId || !$statusId) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid input"
    ]);
    exit;
}

// =============================
// ตรวจสอบว่า log นี้อยู่ในสาขานี้จริงไหม
// =============================
$checkSql = "
    SELECT m.log_id
    FROM Maintenance_logs m
    JOIN equipment_instances ei
        ON m.instance_code = ei.instance_code
    WHERE m.log_id = ?
      AND ei.branch_id = ?
";

$stmtCheck = $conn->prepare($checkSql);
$stmtCheck->bind_param("is", $logId, $branchId);
$stmtCheck->execute();
$result = $stmtCheck->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized or invalid log"
    ]);
    exit;
}

$stmtCheck->close();

// =============================
// อัปเดตสถานะ
// =============================
$updateSql = "
    UPDATE Maintenance_logs
    SET status_id = ?
    WHERE log_id = ?
";

$stmtUpdate = $conn->prepare($updateSql);
$stmtUpdate->bind_param("ii", $statusId, $logId);

if ($stmtUpdate->execute()) {
    echo json_encode([
        "success" => true
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Update failed"
    ]);
}

$stmtUpdate->close();
$conn->close();

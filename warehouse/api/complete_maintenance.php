<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

$branchId = $_SESSION["branch_id"] ?? null;

if (!$branchId) {
    echo json_encode([
        "success" => false,
        "message" => "No branch in session"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$logId = $data["log_id"] ?? null;
$instanceCode = $data["instance_code"] ?? null;
$repairCost = $data["repair_cost"] ?? null;

if (!$logId || !$instanceCode || !$repairCost) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid input"
    ]);
    exit;
}

// ==========================
// ตรวจสอบว่าเป็นของสาขานี้จริง
// ==========================

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
        "message" => "Unauthorized"
    ]);
    exit;
}

$stmtCheck->close();

$conn->begin_transaction();

try {

    //  1 อัปเดต maintenance
    $stmt1 = $conn->prepare("
        UPDATE Maintenance_logs
        SET status_id = 3,
            repair_cost = ?
        WHERE log_id = ?
    ");
    $stmt1->bind_param("di", $repairCost, $logId);
    $stmt1->execute();
    $stmt1->close();

    // 2️ อัปเดต equipment
    $stmt2 = $conn->prepare("
        UPDATE equipment_instances
        SET status = 'Ready',
            current_location = 'Main Storage'
        WHERE instance_code = ?
    ");
    $stmt2->bind_param("s", $instanceCode);
    $stmt2->execute();
    $stmt2->close();

    $conn->commit();

    echo json_encode([
        "success" => true
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();

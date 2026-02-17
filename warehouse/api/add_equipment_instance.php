<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

$branchId = $_SESSION["branch_id"] ?? null;

if (!$branchId) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$equipmentId = trim($data["equipment_id"] ?? "");
$instanceCode = trim($data["instance_code"] ?? "");
$receivedDate = $data["received_date"] ?? "";
$expiryDate = $data["expiry_date"] ?? "";

/* ===== VALIDATION ===== */

if (!$equipmentId || !$instanceCode || !$receivedDate || !$expiryDate) {
    echo json_encode([
        "success" => false,
        "message" => "ข้อมูลไม่ครบ"
    ]);
    exit;
}

$conn->begin_transaction();

try {

    /* ===== CHECK DUPLICATE ===== */

    $check = $conn->prepare("
        SELECT 1 FROM equipment_instances
        WHERE instance_code = ?
        LIMIT 1
    ");

    $check->bind_param("s", $instanceCode);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        $conn->rollback();
        echo json_encode([
            "success" => false,
            "message" => "รหัสอุปกรณ์นี้มีอยู่แล้ว"
        ]);
        exit;
    }

    /* ===== INSERT INSTANCE ===== */

    $stmt = $conn->prepare("
        INSERT INTO equipment_instances
        (instance_code, equipment_id, branch_id, status,
         received_date, expiry_date, current_location)
        VALUES (?, ?, ?, 'Ready', ?, ?, 'Main Storage')
    ");

    if (!$stmt) {
        throw new Exception("Prepare insert failed");
    }

    $stmt->bind_param(
        "sssss",
        $instanceCode,
        $equipmentId,
        $branchId,
        $receivedDate,
        $expiryDate
    );

    $stmt->execute();

    /* ===== UPDATE TOTAL STOCK ===== */

    $update = $conn->prepare("
        UPDATE equipment_master
        SET total_stock = total_stock + 1
        WHERE equipment_id = ?
    ");

    if (!$update) {
        throw new Exception("Prepare update failed");
    }

    $update->bind_param("s", $equipmentId);
    $update->execute();

    $conn->commit();

    echo json_encode(["success" => true]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => "เกิดข้อผิดพลาดในระบบ"
    ]);
}

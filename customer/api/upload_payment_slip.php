<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["customer_id"])) {
    echo json_encode(["success" => false, "message" => "กรุณาเข้าสู่ระบบ"]);
    exit;
}

$customerId = $_SESSION["customer_id"];
$bookingCode = $_POST["booking_code"] ?? null;

if (!$bookingCode || !isset($_FILES["slip"])) {
    echo json_encode(["success" => false, "message" => "ข้อมูลไม่ครบ"]);
    exit;
}

$file = $_FILES["slip"];

if ($file["error"] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "message" => "อัปโหลดไฟล์ไม่สำเร็จ"]);
    exit;
}

$ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
if (!in_array($ext, ["jpg","jpeg","png"])) {
    echo json_encode(["success" => false, "message" => "อนุญาตเฉพาะ JPG/PNG"]);
    exit;
}

$conn->begin_transaction();

try {

    /* ===== โหลด booking + lock ===== */

    $stmt = $conn->prepare("
        SELECT branch_id, net_amount, points_used
        FROM bookings
        WHERE booking_id = ?
          AND customer_id = ?
          AND payment_status_id = (
              SELECT id FROM payment_status WHERE code='UNPAID' LIMIT 1
          )
        FOR UPDATE
    ");

    $stmt->bind_param("ss", $bookingCode, $customerId);
    $stmt->execute();
    $booking = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$booking) {
        throw new Exception("ไม่พบรายการจอง หรือชำระแล้ว");
    }

    $branchId   = $booking["branch_id"];
    $amount     = $booking["net_amount"];
    $usedPoints = (int)$booking["points_used"];

    /* ===== upload file ===== */

    $uploadDir = __DIR__ . "/../../uploads/slips/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $newName = "pay_{$bookingCode}_" . time() . "." . $ext;
    $target  = $uploadDir . $newName;

    if (!move_uploaded_file($file["tmp_name"], $target)) {
        throw new Exception("บันทึกไฟล์ไม่สำเร็จ");
    }

    $relativePath = "/sports_rental_system/uploads/slips/" . $newName;

    /* ===== get status + method ===== */

    $paidStatus = $conn->query("
        SELECT id FROM payment_status WHERE code='WAITING_VERIFY' LIMIT 1
    ")->fetch_assoc()["id"];

    $methodId = $conn->query("
        SELECT method_id FROM payment_methods WHERE code='QR' LIMIT 1
    ")->fetch_assoc()["method_id"];

    /* ===== insert payments ===== */

    $pStmt = $conn->prepare("
        INSERT INTO payments
        (booking_id, method_id, branch_id, amount, payment_status_id, paid_at, slip_url)
        VALUES (?, ?, ?, ?, ?, NOW(), ?)
    ");

    $pStmt->bind_param("sisdis",
        $bookingCode,
        $methodId,
        $branchId,
        $amount,
        $paidStatus,
        $relativePath
    );

    $pStmt->execute();
    $pStmt->close();

    /* ===== update booking ===== */

    $uStmt = $conn->prepare("
        UPDATE bookings
        SET payment_status_id = ?
        WHERE booking_id = ?
    ");

    $uStmt->bind_param("is", $paidStatus, $bookingCode);
    $uStmt->execute();
    $uStmt->close();

    /* ===== ตัดแต้ม ===== */

    if ($usedPoints > 0) {

        $updatePoint = $conn->prepare("
            UPDATE customers
            SET current_points = current_points - ?
            WHERE customer_id = ?
        ");

        $updatePoint->bind_param("is", $usedPoints, $customerId);
        $updatePoint->execute();
        $updatePoint->close();

        $minus = -$usedPoints;

        $log = $conn->prepare("
            INSERT INTO point_history
            (customer_id, booking_id, type, amount, description)
            VALUES (?, ?, 'use', ?, 'ใช้แต้มจากการเช่า')
        ");

        $log->bind_param("ssi", $customerId, $bookingCode, $minus);
        $log->execute();
        $log->close();
    }

    $conn->commit();

    echo json_encode(["success" => true]);

} catch (Exception $e) {

    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();

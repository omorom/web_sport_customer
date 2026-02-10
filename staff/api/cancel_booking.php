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

$data = json_decode(file_get_contents("php://input"), true);

$bookingId = $data["booking_id"] ?? null;
$reason    = trim($data["reason"] ?? "");

if (!$bookingId || !$reason) {
    echo json_encode([
        "success" => false,
        "message" => "ข้อมูลไม่ครบ"
    ]);
    exit;
}

$conn->begin_transaction();

try {

    $bsRow = $conn
        ->query("SELECT id FROM booking_status WHERE code='CANCELLED'")
        ->fetch_assoc();

    $psRow = $conn
        ->query("SELECT id FROM payment_status WHERE code='CANCELLED'")
        ->fetch_assoc();

    if (!$bsRow || !$psRow) {
        throw new Exception("ไม่พบ CANCELLED status");
    }

    $cancelBookingId = (int)$bsRow["id"];
    $cancelPaymentId = (int)$psRow["id"];

    /* lock booking */

    $lockStmt = $conn->prepare("
        SELECT booking_id
        FROM bookings
        WHERE booking_id = ?
        FOR UPDATE
    ");

    $lockStmt->bind_param("s", $bookingId);
    $lockStmt->execute();

    if (!$lockStmt->get_result()->fetch_assoc()) {
        throw new Exception("ไม่พบ booking");
    }

    /* update bookings */

    $stmt = $conn->prepare("
        UPDATE bookings
        SET
            booking_status_id = ?,
            payment_status_id = ?,
            cancellation_reason = ?,
            cancelled_at = NOW(),
            cancelled_by_staff_id = ?,
            cancelled_by_customer_id = NULL
        WHERE booking_id = ?
    ");

    $stmt->bind_param(
        "iisss",
        $cancelBookingId,
        $cancelPaymentId,
        $reason,
        $_SESSION["staff_id"],
        $bookingId
    );

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    if ($stmt->affected_rows === 0) {
        throw new Exception("ไม่สามารถอัปเดต booking");
    }

    /* update payments */

    $stmt2 = $conn->prepare("
        UPDATE payments
        SET payment_status_id = ?
        WHERE booking_id = ?
    ");

    $stmt2->bind_param(
        "is",
        $cancelPaymentId,
        $bookingId
    );

    if (!$stmt2->execute()) {
        throw new Exception($stmt2->error);
    }

    if ($stmt2->affected_rows === 0) {
        throw new Exception("ไม่พบ payment record");
    }

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

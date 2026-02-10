<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$booking = $data["booking_id"] ?? null;
$reason  = $data["reason"] ?? "";
$cid     = $_SESSION["customer_id"] ?? null;

if (!$booking || !$cid) {
    echo json_encode([
        "success" => false,
        "message" => "ข้อมูลไม่ครบ"
    ]);
    exit;
}

$conn->begin_transaction();

try {

    // =============================
    // GET STATUS IDS
    // =============================

    $bsRow = $conn
        ->query("SELECT id FROM booking_status WHERE code='CANCELLED'")
        ->fetch_assoc();

    $psRow = $conn
        ->query("SELECT id FROM payment_status WHERE code='CANCELLED'")
        ->fetch_assoc();

    if (!$bsRow || !$psRow) {
        throw new Exception("ไม่พบสถานะในระบบ");
    }

    $bs = $bsRow["id"];
    $ps = $psRow["id"];

    // =============================
    // UPDATE BOOKINGS
    // =============================

    $stmt = $conn->prepare("
        UPDATE bookings
        SET booking_status_id = ?,
            payment_status_id = ?,
            cancellation_reason = ?,
            cancelled_by_customer_id = ?,
            cancelled_at = NOW()
        WHERE booking_id = ?
          AND customer_id = ?
          AND booking_status_id = (
              SELECT id FROM booking_status WHERE code='WAITING_STAFF'
          )
    ");

    $stmt->bind_param(
        "iissss",
        $bs,
        $ps,
        $reason,
        $cid,
        $booking,
        $cid
    );

    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        throw new Exception("ไม่สามารถยกเลิกการจองนี้ได้");
    }

    // =============================
    // UPDATE PAYMENTS TABLE
    // =============================

    $stmt2 = $conn->prepare("
        UPDATE payments
        SET payment_status_id = ?
        WHERE booking_id = ?
    ");

    $stmt2->bind_param(
        "is",
        $ps,
        $booking
    );

    $stmt2->execute();

    // =============================
    // COMMIT
    // =============================

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "ยกเลิกเรียบร้อย รอเจ้าหน้าที่คืนเงิน"
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

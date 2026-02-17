<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["staff_id"])) {
    echo json_encode(["success"=>false,"message"=>"กรุณาเข้าสู่ระบบ"]);
    exit;
}

$staffId      = $_SESSION["staff_id"];
$bookingCode  = $_POST["booking_code"] ?? null;
$refundAmount = floatval($_POST["refund_amount"] ?? 0);
$note         = $_POST["note"] ?? "";

if (!$bookingCode || $refundAmount <= 0 || !isset($_FILES["slip"])) {
    echo json_encode(["success"=>false,"message"=>"ข้อมูลไม่ครบ"]);
    exit;
}

$conn->begin_transaction();

try {

    $stmt = $conn->prepare("
        SELECT payment_id, amount
        FROM payments
        WHERE booking_id = ?
        FOR UPDATE
    ");
    $stmt->bind_param("s", $bookingCode);
    $stmt->execute();
    $payment = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$payment) {
        throw new Exception("ไม่พบข้อมูลการชำระเงิน");
    }

    if ($refundAmount > $payment["amount"]) {
        throw new Exception("จำนวนเงินคืนมากกว่ายอดที่ชำระ");
    }

    $file = $_FILES["slip"];
    $ext  = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));

    if (!in_array($ext, ["jpg","jpeg","png"])) {
        throw new Exception("อนุญาตเฉพาะ JPG/PNG");
    }

    $uploadDir = __DIR__ . "/../../uploads/refunds/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $newName = "refund_{$bookingCode}_" . time() . "." . $ext;
    $target  = $uploadDir . $newName;

    if (!move_uploaded_file($file["tmp_name"], $target)) {
        throw new Exception("อัปโหลดไฟล์ไม่สำเร็จ");
    }

    $relativePath = "/sports_rental_system/uploads/refunds/" . $newName;

    $refundedStatus = $conn->query("
        SELECT id FROM payment_status WHERE code='REFUNDED' LIMIT 1
    ")->fetch_assoc()["id"];

    $update = $conn->prepare("
        UPDATE payments
        SET refund_amount = ?,
            refund_at = NOW(),
            slip_refund = ?,
            processed_by_staff_id = ?,
            note = ?,
            payment_status_id = ?
        WHERE payment_id = ?
    ");

    $update->bind_param(
        "dsssii",
        $refundAmount,
        $relativePath,
        $staffId,
        $note,
        $refundedStatus,
        $payment["payment_id"]
    );

    $update->execute();
    $update->close();

    $updateBooking = $conn->prepare("
    UPDATE bookings
    SET payment_status_id = ?
    WHERE booking_id = ?
    ");

    $updateBooking->bind_param(
        "is",
        $refundedStatus,
        $bookingCode
    );

$updateBooking->execute();
$updateBooking->close();



    $conn->commit();

    echo json_encode(["success"=>true]);

} catch (Exception $e) {

    $conn->rollback();
    echo json_encode(["success"=>false,"message"=>$e->getMessage()]);
}
/* ================= UPDATE BOOKING ================= */


$conn->close();

<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once "database.php";

header("Content-Type: application/json; charset=utf-8");

/* ===============================
   CHECK LOGIN
================================ */

$customerId = $_SESSION["customer_id"] ?? null;

if (!$customerId) {
    echo json_encode([
        "success" => false,
        "message" => "กรุณาเข้าสู่ระบบ"
    ]);
    exit;
}

/* ===============================
   INPUT
================================ */

$bookingCode = $_POST["booking_code"] ?? null;

if (!$bookingCode || !isset($_FILES["slip"])) {
    echo json_encode([
        "success" => false,
        "message" => "ข้อมูลไม่ครบ"
    ]);
    exit;
}

$file = $_FILES["slip"];

/* ===============================
   VALIDATE FILE
================================ */

if ($file["error"] !== UPLOAD_ERR_OK) {
    echo json_encode([
        "success" => false,
        "message" => "อัปโหลดไฟล์ไม่สำเร็จ"
    ]);
    exit;
}

if ($file["size"] > 5 * 1024 * 1024) {
    echo json_encode([
        "success" => false,
        "message" => "ไฟล์ใหญ่เกิน 5MB"
    ]);
    exit;
}

$ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
$allowed = ["jpg", "jpeg", "png"];

if (!in_array($ext, $allowed)) {
    echo json_encode([
        "success" => false,
        "message" => "อนุญาตเฉพาะ JPG / PNG"
    ]);
    exit;
}

/* ===============================
   GET BOOKING DATA
================================ */

$stmt = $conn->prepare("
    SELECT booking_id, branch_id, net_amount
    FROM bookings
    WHERE booking_id = ?
      AND customer_id = ?
      AND payment_status_id = (
        SELECT id FROM payment_status WHERE code = 'UNPAID'
      )
");

$stmt->bind_param("ss", $bookingCode, $customerId);
$stmt->execute();

$res = $stmt->get_result();
$row = $res->fetch_assoc();

if (!$row) {
    echo json_encode([
        "success" => false,
        "message" => "ไม่พบรายการจอง หรือชำระแล้ว"
    ]);
    exit;
}

$branchId = $row["branch_id"];   // FK ตรง ๆ
$amount   = $row["net_amount"];

/* ===============================
   UPLOAD FILE
================================ */

$uploadDir = __DIR__ . "/../uploads/slips/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$newName =
    "pay_" .
    $bookingCode . "_" .
    time() . "_" .
    rand(1000, 9999) .
    "." . $ext;

$target = $uploadDir . $newName;

if (!move_uploaded_file($file["tmp_name"], $target)) {
    echo json_encode([
        "success" => false,
        "message" => "บันทึกไฟล์ไม่สำเร็จ"
    ]);
    exit;
}

$relativePath = "uploads/slips/" . $newName;

/* ===============================
   TRANSACTION
================================ */

$conn->begin_transaction();

try {

    /* ===== PAYMENT STATUS ID (WAITING_VERIFY) ===== */

    $statusStmt = $conn->prepare("
        SELECT id
        FROM payment_status
        WHERE code = 'WAITING_VERIFY'
    ");

    $statusStmt->execute();
    $statusRow = $statusStmt->get_result()->fetch_assoc();

    if (!$statusRow) {
        throw new Exception("ไม่พบ payment status WAITING_VERIFY");
    }

    $paymentStatusId = (int)$statusRow["id"];

    /* ===== PAYMENT METHOD QR ===== */

    $methodStmt = $conn->prepare("
        SELECT method_id
        FROM payment_methods
        WHERE code = 'QR'
    ");

    $methodStmt->execute();
    $methodRow = $methodStmt->get_result()->fetch_assoc();

    if (!$methodRow) {
        throw new Exception("ไม่พบ payment method QR");
    }

    $methodId = (int)$methodRow["method_id"];

    /* ===== INSERT PAYMENTS ===== */

    $pStmt = $conn->prepare("
        INSERT INTO payments (
            booking_id,
            method_id,
            branch_id,
            amount,
            payment_status_id,
            paid_at,
            slip_url
        )
        VALUES (?, ?, ?, ?, ?, NOW(), ?)
    ");

    $pStmt->bind_param(
        "sisdis",
        $bookingCode,
        $methodId,
        $branchId,
        $amount,
        $paymentStatusId,
        $relativePath
    );

    if (!$pStmt->execute()) {
        throw new Exception($pStmt->error);
    }

    /* ===== UPDATE BOOKINGS STATUS ===== */

    $uStmt = $conn->prepare("
        UPDATE bookings
        SET payment_status_id = ?
        WHERE booking_id = ?
    ");

    $uStmt->bind_param(
        "is",
        $paymentStatusId,
        $bookingCode
    );

    if (!$uStmt->execute()) {
        throw new Exception($uStmt->error);
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "อัปโหลดสลิปเรียบร้อย รอตรวจสอบ"
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

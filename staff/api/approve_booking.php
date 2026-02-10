<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

/* ================= AUTH ================= */

if (!isset($_SESSION["staff_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
    exit;
}

$staffId = $_SESSION["staff_id"];

/* ================= READ POST ================= */

$bookingId = $_POST["booking_id"] ?? null;

if (!$bookingId) {
    echo json_encode([
        "success" => false,
        "message" => "Missing booking_id"
    ]);
    exit;
}

$conn->begin_transaction();

try {

    /* ================= STAFF BRANCH ================= */

    $sStmt = $conn->prepare("
        SELECT branch_id
        FROM staff
        WHERE staff_id = ?
    ");

    $sStmt->bind_param("s", $staffId);
    $sStmt->execute();

    $staff = $sStmt->get_result()->fetch_assoc();

    if (!$staff) {
        throw new Exception("ไม่พบ staff");
    }

    $branchId = $staff["branch_id"];

    /* ================= GET STATUS IDS ================= */

    $bsRow = $conn
        ->query("SELECT id FROM booking_status WHERE code='CONFIRMED_WAITING_PICKUP'")
        ->fetch_assoc();

    $psRow = $conn
        ->query("SELECT id FROM payment_status WHERE code='PAID'")
        ->fetch_assoc();

    if (!$bsRow || !$psRow) {
        throw new Exception("ไม่พบ status master");
    }

    $approvedStatusId = (int)$bsRow["id"];
    $paidPaymentId    = (int)$psRow["id"];

    /* ================= LOCK BOOKING ================= */

    $lockStmt = $conn->prepare("
        SELECT booking_id
        FROM bookings
        WHERE booking_id = ?
          AND branch_id = ?
        FOR UPDATE
    ");

    $lockStmt->bind_param("ss", $bookingId, $branchId);
    $lockStmt->execute();

    if (!$lockStmt->get_result()->fetch_assoc()) {
        throw new Exception("ไม่พบ booking ในสาขานี้");
    }

    /* ================= UPDATE BOOKINGS ================= */

    $uStmt = $conn->prepare("
        UPDATE bookings
        SET
            booking_status_id = ?,
            payment_status_id = ?
        WHERE booking_id = ?
          AND booking_status_id = (
              SELECT id FROM booking_status WHERE code='WAITING_STAFF'
          )
    ");

    $uStmt->bind_param(
        "iis",
        $approvedStatusId,
        $paidPaymentId,
        $bookingId
    );

    if (!$uStmt->execute()) {
        throw new Exception($uStmt->error);
    }

    if ($uStmt->affected_rows === 0) {
        throw new Exception("ไม่สามารถ approve รายการนี้ได้");
    }

    /* ================= UPDATE PAYMENTS TABLE ================= */

    $pStmt = $conn->prepare("
        UPDATE payments
        SET payment_status_id = ?
        WHERE booking_id = ?
    ");

    $pStmt->bind_param(
        "is",
        $paidPaymentId,
        $bookingId
    );

    if (!$pStmt->execute()) {
        throw new Exception($pStmt->error);
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

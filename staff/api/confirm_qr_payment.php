<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

/* ===============================
   STAFF AUTH
================================ */

if (!isset($_SESSION["staff_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "เฉพาะเจ้าหน้าที่"
    ]);
    exit;
}

$staffId = $_SESSION["staff_id"];

/* ===============================
   READ JSON
================================ */

$data = json_decode(file_get_contents("php://input"), true);

$bookingCode = $data["booking_code"] ?? null;

if (!$bookingCode) {
    echo json_encode([
        "success" => false,
        "message" => "ไม่พบ booking_code"
    ]);
    exit;
}

/* ===============================
   TRANSACTION
================================ */

$conn->begin_transaction();

try {

    function getIdByCode($conn, $table, $code) {

        $pkMap = [
            "payment_status"  => "id",
            "booking_status"  => "id",
            "payment_methods" => "method_id"
        ];

        $pk = $pkMap[$table];

        $stmt = $conn->prepare(
            "SELECT {$pk} FROM {$table} WHERE code = ? LIMIT 1"
        );

        $stmt->bind_param("s", $code);
        $stmt->execute();

        $res = $stmt->get_result()->fetch_assoc();

        return $res ? (int)$res[$pk] : null;
    }

    $paidStatusId = getIdByCode($conn,"payment_status","PAID");
    $usingStatusId = getIdByCode($conn,"booking_status","IN_USE");
    $qrMethodId = getIdByCode($conn,"payment_methods","QR");

    if (!$paidStatusId || !$usingStatusId || !$qrMethodId) {
        throw new Exception("ไม่พบ master status");
    }

    $stmt = $conn->prepare("
        SELECT branch_id, net_amount
        FROM bookings
        WHERE booking_id = ?
    ");

    $stmt->bind_param("s", $bookingCode);
    $stmt->execute();

    $booking = $stmt->get_result()->fetch_assoc();

    if (!$booking) {
        throw new Exception("ไม่พบ booking");
    }

    $branchId = $booking["branch_id"];
    $amount = $booking["net_amount"];

    $note = "ชำระผ่าน QR";

    $pStmt = $conn->prepare("
        INSERT INTO payments (
            booking_id,
            method_id,
            branch_id,
            amount,
            payment_status_id,
            paid_at,
            processed_by_staff_id,
            note
        )
        VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)
    ");

    $pStmt->bind_param(
        "sisdiss",
        $bookingCode,
        $qrMethodId,
        $branchId,
        $amount,
        $paidStatusId,
        $staffId,
        $note
    );

    if (!$pStmt->execute()) {
        throw new Exception($pStmt->error);
    }

    $uStmt = $conn->prepare("
        UPDATE bookings
        SET
            payment_status_id = ?,
            booking_status_id = ?
        WHERE booking_id = ?
    ");

    $uStmt->bind_param(
        "iis",
        $paidStatusId,
        $usingStatusId,
        $bookingCode
    );

    $uStmt->execute();

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "รับเงินผ่าน QR เรียบร้อย",
        "redirect" =>
            "/sports_rental_system/staff/frontend/history.html"
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();

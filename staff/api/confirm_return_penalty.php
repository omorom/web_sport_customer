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
$bookingCode = $data["booking_code"] ?? null;

if (!$bookingCode) {
    echo json_encode([
        "success" => false,
        "message" => "Missing booking code"
    ]);
    exit;
}

$conn->begin_transaction();

try {

    /* ================= LOCK BOOKING ================= */

    $stmt = $conn->prepare("
        SELECT booking_id
        FROM bookings
        WHERE booking_id = ?
          AND booking_status_id = (
              SELECT id FROM booking_status WHERE code='RETURNING'
          )
        FOR UPDATE
    ");

    $stmt->bind_param("s", $bookingCode);
    $stmt->execute();

    if (!$stmt->get_result()->fetch_assoc()) {
        throw new Exception("ไม่พบรายการที่อยู่ในสถานะ RETURNING");
    }

    $stmt->close();

    /* ================= UPDATE STATUS TO COMPLETED ================= */

    $update = $conn->prepare("
        UPDATE bookings
        SET booking_status_id = (
            SELECT id FROM booking_status WHERE code='COMPLETED'
        )
        WHERE booking_id = ?
    ");

    $update->bind_param("s", $bookingCode);

    if (!$update->execute()) {
        throw new Exception($update->error);
    }

    $update->close();

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

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
$items = $data["items"] ?? [];

if (!$bookingCode || empty($items)) {
    echo json_encode([
        "success" => false,
        "message" => "ข้อมูลไม่ครบ"
    ]);
    exit;
}

$conn->begin_transaction();

try {

    /* ===============================
       LOCK BOOKING
    ================================ */

    $stmt = $conn->prepare("
        SELECT booking_id, due_return_time
        FROM bookings
        WHERE booking_id = ?
        FOR UPDATE
    ");
    $stmt->bind_param("s", $bookingCode);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows === 0) {
        throw new Exception("ไม่พบรายการจอง");
    }

    $booking = $res->fetch_assoc();
    $stmt->close();

    /* ===============================
       CALCULATE LATE FEE
    ================================ */

    $lateFee = 0;
    $dueDate = new DateTime($booking["due_return_time"]);
    $now = new DateTime();

    if ($now > $dueDate) {
        $secondsLate = $now->getTimestamp() - $dueDate->getTimestamp();

        if ($secondsLate > 3600) {
            $daysLate = floor(($secondsLate - 3600) / 86400) + 1;
            $lateFee = $daysLate * 50;
        }
    }

    /* ===============================
       PROCESS ITEMS
    ================================ */

    $damageFee = 0;

    foreach ($items as $item) {

        $detailId    = (int)$item["detail_id"];
        $conditionId = (int)$item["condition_id"];
        $note        = $item["note"] ?? null;

        /* ===== GET BOOKING DETAIL ===== */

        $detailStmt = $conn->prepare("
            SELECT equipment_instance_id, price_at_booking
            FROM booking_details
            WHERE detail_id = ?
        ");
        $detailStmt->bind_param("i", $detailId);
        $detailStmt->execute();
        $detailRes = $detailStmt->get_result();
        $detail = $detailRes->fetch_assoc();
        $detailStmt->close();

        if (!$detail) continue;

        $instanceCode = $detail["equipment_instance_id"];
        $price        = (float)$detail["price_at_booking"];

        /* ===== GET CONDITION ===== */

        $condStmt = $conn->prepare("
            SELECT fine_percent
            FROM return_conditions
            WHERE condition_id = ?
        ");
        $condStmt->bind_param("i", $conditionId);
        $condStmt->execute();
        $condRes = $condStmt->get_result();
        $cond = $condRes->fetch_assoc();
        $condStmt->close();

        if ($cond) {
            $damageFee += ($price * $cond["fine_percent"] / 100);
        }

        /* ===== INSERT RETURN ASSIGNMENT ===== */

        $assignStmt = $conn->prepare("
            INSERT INTO booking_item_assignments
            (detail_id, instance_code, return_condition_id, note)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                return_condition_id = VALUES(return_condition_id),
                note = VALUES(note)
        ");

        $assignStmt->bind_param(
            "isis",
            $detailId,
            $instanceCode,
            $conditionId,
            $note
        );

        if (!$assignStmt->execute()) {
            throw new Exception("ASSIGN ERROR: " . $assignStmt->error);
        }

        $assignStmt->close();

        /* ===== UPDATE EQUIPMENT INSTANCE ===== */

        if (!empty($instanceCode)) {

            $updateEquip = $conn->prepare("
                UPDATE equipment_instances
                SET status = 'Ready',
                    current_location = 'Main Storage'
                WHERE instance_code = ?
            ");

            $updateEquip->bind_param("s", $instanceCode);

            if (!$updateEquip->execute()) {
                throw new Exception($updateEquip->error);
            }

            $updateEquip->close();
        }
    }

    $totalPenalty = $lateFee + $damageFee;

    /* ===============================
       UPDATE BOOKING STATUS
    ================================ */

    $statusCode = ($totalPenalty <= 0)
        ? "COMPLETED"
        : "RETURNING";

    $statusStmt = $conn->prepare("
        SELECT id FROM booking_status WHERE code = ?
    ");
    $statusStmt->bind_param("s", $statusCode);
    $statusStmt->execute();
    $statusRes = $statusStmt->get_result();
    $status = $statusRes->fetch_assoc();
    $statusStmt->close();

    if (!$status) {
        throw new Exception("ไม่พบ booking status: " . $statusCode);
    }

    $updateBooking = $conn->prepare("
        UPDATE bookings
        SET booking_status_id = ?,
            actual_return_time = NOW(),
            penalty_fee = ?
        WHERE booking_id = ?
    ");

    $updateBooking->bind_param(
        "ids",
        $status["id"],
        $totalPenalty,
        $bookingCode
    );

    if (!$updateBooking->execute()) {
        throw new Exception($updateBooking->error);
    }

    $updateBooking->close();

    $conn->commit();

    echo json_encode([
        "success" => true,
        "total_penalty" => $totalPenalty,
        "auto_completed" => ($totalPenalty <= 0)
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();

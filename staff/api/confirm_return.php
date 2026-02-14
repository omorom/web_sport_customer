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
       GET BOOKING
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

        // เกิน 1 ชั่วโมงก่อน ถึงเริ่มคิด
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

        $detailId = $item["detail_id"];
        $conditionId = $item["condition_id"];

        $stmt = $conn->prepare("
            SELECT equipment_instance_id, price_at_booking
            FROM booking_details
            WHERE detail_id = ?
        ");
        $stmt->bind_param("i", $detailId);
        $stmt->execute();
        $res = $stmt->get_result();
        $detail = $res->fetch_assoc();
        $stmt->close();

        if (!$detail) continue;

        $instanceCode = $detail["equipment_instance_id"];
        $price = $detail["price_at_booking"];

        /* ===== fine percent ===== */

        $stmt = $conn->prepare("
            SELECT fine_percent
            FROM return_conditions
            WHERE condition_id = ?
        ");
        $stmt->bind_param("i", $conditionId);
        $stmt->execute();
        $res = $stmt->get_result();
        $cond = $res->fetch_assoc();
        $stmt->close();

        if ($cond) {
            $damageFee += ($price * $cond["fine_percent"] / 100);
        }

        /* ===== Save return condition ===== */

        $note = $item["note"] ?? null;

        $stmt = $conn->prepare("
            INSERT INTO booking_item_assignments
            (detail_id, instance_code, return_condition_id, note)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                return_condition_id = VALUES(return_condition_id),
                note = VALUES(note)
        ");

        $stmt->bind_param(
            "isis",
            $detailId,
            $instanceCode,
            $conditionId,
            $note
        );

        /* ===== คืนอุปกรณ์ ===== */

        if ($instanceCode) {
            $stmt = $conn->prepare("
                UPDATE equipment_instances
                SET status = 'Ready',
                    current_location = 'Main Storage'
                WHERE instance_code = ?
            ");
            $stmt->bind_param("s", $instanceCode);
            $stmt->execute();
            $stmt->close();
        }
    }

    $totalPenalty = $lateFee + $damageFee;

    /* ===============================
       UPDATE STATUS
    ================================ */

    $statusCode = ($totalPenalty <= 0)
        ? "COMPLETED"
        : "RETURNING";

    $stmt = $conn->prepare("
        SELECT id FROM booking_status WHERE code = ?
    ");
    $stmt->bind_param("s", $statusCode);
    $stmt->execute();
    $res = $stmt->get_result();
    $status = $res->fetch_assoc();
    $stmt->close();

    if (!$status) {
        throw new Exception("ไม่พบ booking status: " . $statusCode);
    }

    $stmt = $conn->prepare("
        UPDATE bookings
        SET booking_status_id = ?,
            actual_return_time = NOW(),
            penalty_fee = ?
        WHERE booking_id = ?
    ");
    $stmt->bind_param("ids", $status["id"], $totalPenalty, $bookingCode);
    $stmt->execute();
    $stmt->close();

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

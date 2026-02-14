<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["staff_id"])) {
    echo json_encode(["success"=>false,"message"=>"Unauthorized"]);
    exit;
}

$staffId = $_SESSION["staff_id"];
$bookingId = $_POST["booking_id"] ?? null;

if (!$bookingId) {
    echo json_encode(["success"=>false,"message"=>"Missing booking_id"]);
    exit;
}

$conn->begin_transaction();

try {

    /* ===== get staff branch ===== */

    $sStmt = $conn->prepare("SELECT branch_id FROM staff WHERE staff_id=?");
    $sStmt->bind_param("s",$staffId);
    $sStmt->execute();
    $branchId = $sStmt->get_result()->fetch_assoc()["branch_id"];
    $sStmt->close();

    /* ===== lock booking ===== */

    $lock = $conn->prepare("
        SELECT customer_id, points_earned
        FROM bookings
        WHERE booking_id=? AND branch_id=?
        FOR UPDATE
    ");

    $lock->bind_param("ss",$bookingId,$branchId);
    $lock->execute();
    $booking = $lock->get_result()->fetch_assoc();
    $lock->close();

    if (!$booking) throw new Exception("ไม่พบ booking");

    $customerId  = $booking["customer_id"];
    $earnedPoints = (int)$booking["points_earned"];

    /* ===== status ids ===== */

    $bookingStatus = $conn->query("
        SELECT id FROM booking_status WHERE code='CONFIRMED_WAITING_PICKUP' LIMIT 1
    ")->fetch_assoc()["id"];

    $paidStatus = $conn->query("
        SELECT id FROM payment_status WHERE code='PAID' LIMIT 1
    ")->fetch_assoc()["id"];

    /* ===== update booking ===== */

    $uStmt = $conn->prepare("
        UPDATE bookings
        SET booking_status_id=?, payment_status_id=?, staff_id=?
        WHERE booking_id=?
          AND booking_status_id=(
              SELECT id FROM booking_status WHERE code='WAITING_STAFF' LIMIT 1
          )
    ");

    $uStmt->bind_param("iiss",
        $bookingStatus,
        $paidStatus,
        $staffId,
        $bookingId
    );

    if (!$uStmt->execute() || $uStmt->affected_rows===0) {
        throw new Exception("ไม่สามารถ approve ได้");
    }

    $uStmt->close();

    /* ===== update payments ===== */

    $pStmt = $conn->prepare("
        UPDATE payments SET payment_status_id=? WHERE booking_id=?
    ");

    $pStmt->bind_param("is",$paidStatus,$bookingId);
    $pStmt->execute();
    $pStmt->close();

    /* ===== เพิ่มแต้ม ===== */

    if ($earnedPoints > 0) {

        $add = $conn->prepare("
            UPDATE customers
            SET current_points = current_points + ?
            WHERE customer_id = ?
        ");

        $add->bind_param("is",$earnedPoints,$customerId);
        $add->execute();
        $add->close();

        $log = $conn->prepare("
            INSERT INTO point_history
            (customer_id, booking_id, type, amount, description)
            VALUES (?, ?, 'earn', ?, 'ได้แต้มจากการเช่า')
        ");

        $log->bind_param("ssi",$customerId,$bookingId,$earnedPoints);
        $log->execute();
        $log->close();
    }

    $conn->commit();
    echo json_encode(["success"=>true]);

} catch (Exception $e) {

    $conn->rollback();
    echo json_encode(["success"=>false,"message"=>$e->getMessage()]);
}

$conn->close();

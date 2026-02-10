<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

$data = json_decode(file_get_contents("php://input"), true);

$bookingId = $data["booking_id"] ?? null;
$items = $data["items"] ?? [];

if (!$bookingId || empty($items)) {
    echo json_encode([
        "success" => false,
        "message" => "missing data"
    ]);
    exit;
}

$conn->begin_transaction();

try {

    /* ============================
       UPDATE EQUIPMENT INSTANCE
    ============================ */

    $stmt = $conn->prepare("
        UPDATE booking_details
        SET equipment_instance_id = ?
        WHERE detail_id = ?
          AND item_type = 'Equipment'
    ");

    foreach ($items as $i) {

        // 👉 ถ้าไม่มี instance = venue → ข้าม
        if (empty($i["instance_code"])) {
            continue;
        }

        $stmt->bind_param(
            "si",
            $i["instance_code"],
            $i["detail_id"]
        );

        if (!$stmt->execute()) {
            throw new Exception("update booking_details failed");
        }
    }

    /* ============================
       SET STATUS = IN_USE
    ============================ */

    $row = $conn
        ->query("
            SELECT id
            FROM booking_status
            WHERE code='IN_USE'
        ")
        ->fetch_assoc();

    if (!$row) {
        throw new Exception("missing IN_USE status");
    }

    $statusId = $row["id"];

    $stmt2 = $conn->prepare("
        UPDATE bookings
        SET booking_status_id = ?
        WHERE booking_id = ?
    ");

    $stmt2->bind_param("is", $statusId, $bookingId);

    if (!$stmt2->execute()) {
        throw new Exception("update booking status failed");
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

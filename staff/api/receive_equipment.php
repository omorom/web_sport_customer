<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

$data = json_decode(file_get_contents("php://input"), true);

$bookingId = $data["booking_id"] ?? null;
$items = $data["items"] ?? [];

if (!$bookingId || !$items) {
    echo json_encode([
        "success" => false,
        "message" => "missing data"
    ]);
    exit;
}

$conn->begin_transaction();

try {

    $stmt = $conn->prepare("
        UPDATE booking_details
        SET item_id = ?
        WHERE detail_id = ?
    ");

    foreach ($items as $i) {

        $stmt->bind_param(
            "ss",
            $i["instance_code"],
            $i["detail_id"]
        );

        if (!$stmt->execute()) {
            throw new Exception("update failed");
        }
    }

    $row = $conn->query(
        "SELECT id FROM booking_status WHERE code='IN_USE'"
    )->fetch_assoc();

    if (!$row) {
        throw new Exception("missing IN_USE");
    }

    $statusId = $row["id"];

    $stmt2 = $conn->prepare("
        UPDATE bookings
        SET booking_status_id = ?
        WHERE booking_id = ?
    ");

    $stmt2->bind_param("is", $statusId, $bookingId);
    $stmt2->execute();

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

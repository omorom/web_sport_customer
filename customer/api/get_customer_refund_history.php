<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["customer_id"])) {
    echo json_encode(["success"=>false]);
    exit;
}

$customerId = $_SESSION["customer_id"];

$stmt = $conn->prepare("
    SELECT 
        b.booking_id,
        DATE(b.cancelled_at) AS cancelled_at,
        p.refund_amount,
        DATE(p.refund_at) AS refund_at,
        p.slip_refund
    FROM bookings b
    JOIN payments p ON b.booking_id = p.booking_id
    WHERE b.customer_id = ?
    AND b.booking_status_id IN (
        SELECT id FROM booking_status WHERE code = 'CANCELLED'
    )
    ORDER BY b.cancelled_at DESC
");

$stmt->bind_param("s", $customerId);
$stmt->execute();

$res = $stmt->get_result();

$data = [];

while ($row = $res->fetch_assoc()) {

    $data[] = [
        "booking_id" => $row["booking_id"],
        "cancelled_at" => $row["cancelled_at"],
        "refund_amount" => $row["refund_amount"] ?? 0,
        "refund_at" => $row["refund_at"],
        "slip_path" => $row["slip_refund"]
    ];
}

echo json_encode([
    "success"=>true,
    "data"=>$data
]);

$conn->close();

<?php
session_start();
require_once "database.php";

header("Content-Type: application/json; charset=utf-8");

$code = $_GET["code"] ?? null;

if (!$code) {
    echo json_encode([
        "success" => false,
        "message" => "missing booking code"
    ]);
    exit;
}

/* ===============================
   LOAD BOOKING
================================ */

$stmt = $conn->prepare("
    SELECT 
        booking_id,
        net_amount
    FROM bookings
    WHERE booking_id = ?
    LIMIT 1
");

$stmt->bind_param("s", $code);
$stmt->execute();

$row = $stmt->get_result()->fetch_assoc();

if (!$row) {
    echo json_encode([
        "success" => false,
        "message" => "ไม่พบ booking นี้"
    ]);
    exit;
}

/* ===============================
   QR IMAGE
================================ */

$qrUrl = "/sports_rental_system/uploads/qr_promptpay.jpg";

echo json_encode([
    "success" => true,
    "amount" => $row["net_amount"],
    "qr_url" => $qrUrl
]);

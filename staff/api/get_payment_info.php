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

/* ===============================
   INPUT
================================ */

$code = $_GET["code"] ?? null;

if (!$code) {
    echo json_encode([
        "success" => false,
        "message" => "ไม่พบ booking code"
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

$result = $stmt->get_result()->fetch_assoc();

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "ไม่พบข้อมูล booking"
    ]);
    exit;
}

/* ===============================
   RESPONSE
================================ */

echo json_encode([
    "success" => true,
    "amount" => (float)$result["net_amount"]
]);

$conn->close();

<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["staff_id"])) {
    echo json_encode(["success" => false, "message" => "กรุณาเข้าสู่ระบบ"]);
    exit;
}

$bookingCode = $_GET["code"] ?? null;

if (!$bookingCode) {
    echo json_encode(["success" => false, "message" => "ไม่พบรหัสการจอง"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT 
        c.name AS customer_name,
        b.cancellation_reason, 
        c.refund_bank,
        c.refund_account_name,
        c.refund_account_number,
        p.amount
    FROM bookings b
    JOIN customers c ON b.customer_id = c.customer_id
    JOIN payments p ON b.booking_id = p.booking_id
    WHERE b.booking_id = ?
    LIMIT 1
");

$stmt->bind_param("s", $bookingCode);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();
$stmt->close();

if (!$data) {
    echo json_encode(["success" => false, "message" => "ไม่พบข้อมูล"]);
    exit;
}

echo json_encode([
    "success" => true,
    "customer_name" => $data["customer_name"],
    "paid_amount" => $data["amount"],
    "cancellation_reason" => $data["cancellation_reason"],
    "bank_name" => $data["refund_bank"],
    "account_name" => $data["refund_account_name"],
    "account_number" => $data["refund_account_number"]
]);

$conn->close();

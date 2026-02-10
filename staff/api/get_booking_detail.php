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

$code = $_GET["code"] ?? null;

if (!$code) {
    echo json_encode([
        "success" => false,
        "message" => "Missing booking code"
    ]);
    exit;
}

/* ================= BOOKING + CUSTOMER ================= */

$stmt = $conn->prepare("
    SELECT
        b.booking_id,
        b.pickup_time,
        b.due_return_time,
        b.net_amount,

        bs.code AS booking_status,
        ps.code AS payment_status,

        c.name AS customer_name,
        c.phone,
        c.email

    FROM bookings b

    JOIN booking_status bs
        ON b.booking_status_id = bs.id

    JOIN payment_status ps
        ON b.payment_status_id = ps.id

    JOIN customers c
        ON b.customer_id = c.customer_id

    WHERE b.booking_id = ?
");

$stmt->bind_param("s", $code);
$stmt->execute();

$booking = $stmt->get_result()->fetch_assoc();

if (!$booking) {
    echo json_encode([
        "success" => false,
        "message" => "ไม่พบ booking"
    ]);
    exit;
}

/* ================= BOOKING ITEMS ================= */

$itemStmt = $conn->prepare("
    SELECT
        bd.item_type,
        bd.quantity,
        bd.price_at_booking,

        e.name AS equipment_name,
        v.name AS venue_name

    FROM booking_details bd

    LEFT JOIN equipment_master e
        ON bd.equipment_id = e.equipment_id

    LEFT JOIN venues v
        ON bd.venue_id = v.venue_id

    WHERE bd.booking_id = ?
");

$itemStmt->bind_param("s", $code);
$itemStmt->execute();

$items = [];

$res = $itemStmt->get_result();

while ($r = $res->fetch_assoc()) {
    $items[] = $r;
}

/* ================= PAYMENT ================= */

$pStmt = $conn->prepare("
    SELECT
        p.amount,
        p.paid_at,
        p.slip_url,
        p.refund_amount,
        p.refund_at,
        p.slip_refund,
        ps.code AS status
    FROM payments p

    JOIN payment_status ps
        ON p.payment_status_id = ps.id

    WHERE p.booking_id = ?
    ORDER BY p.payment_id DESC
    LIMIT 1
");

$pStmt->bind_param("s", $code);
$pStmt->execute();

$payment = $pStmt->get_result()->fetch_assoc();

/* ================= RESPONSE ================= */

echo json_encode([
    "success" => true,
    "data" => [
        "booking_id" => $booking["booking_id"],
        "pickup_time" => $booking["pickup_time"],
        "due_return_time" => $booking["due_return_time"],
        "net_amount" => $booking["net_amount"],

        "booking_status" => $booking["booking_status"],
        "payment_status" => $booking["payment_status"],

        "customer" => [
            "name" => $booking["customer_name"],
            "phone" => $booking["phone"],
            "email" => $booking["email"]
        ],

        "items" => $items,

        "payment" => $payment
    ]
]);

$conn->close();

<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);

session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

$code    = $_GET["code"] ?? null;
$staffId = $_SESSION["staff_id"] ?? null;

/* ===============================
   VALIDATION
================================ */

if (!$staffId) {
    echo json_encode([
        "success" => false,
        "message" => "no staff session"
    ]);
    exit;
}

if (!$code) {
    echo json_encode([
        "success" => false,
        "message" => "missing booking code"
    ]);
    exit;
}

/* ===============================
   MAIN BOOKING
================================ */

$stmt = $conn->prepare("
    SELECT 
        b.booking_id,
        b.pickup_time,
        b.due_return_time,
        b.total_amount,
        b.net_amount,
        b.discount_amount,
        b.extra_hour_fee,
        b.points_used,
        b.points_used_value,
        b.points_earned,
        b.coupon_code,
        b.cancelled_at,
        b.cancellation_reason,

        bs.name_th   AS booking_status,
        ps.name_th   AS payment_status,

        br.name AS branch_name,

        p.slip_url,
        p.paid_at,
        pm.code AS payment_method

    FROM bookings b
    JOIN booking_status bs ON b.booking_status_id = bs.id
    JOIN payment_status ps ON b.payment_status_id = ps.id
    JOIN branches br ON b.branch_id = br.branch_id
    LEFT JOIN payments p ON p.booking_id = b.booking_id
    LEFT JOIN payment_methods pm ON p.method_id = pm.method_id

    WHERE b.booking_id = ?
    LIMIT 1
");

$stmt->bind_param("s", $code);
$stmt->execute();

$booking = $stmt->get_result()->fetch_assoc();

if (!$booking) {
    echo json_encode([
        "success" => false,
        "message" => "ไม่พบรายการจอง"
    ]);
    exit;
}

/* ===============================
   DETAILS
================================ */

$dStmt = $conn->prepare("
    SELECT
        d.item_type,
        d.quantity,
        d.price_at_booking,

        e.name AS equipment_name,
        e.image_url AS equipment_image,

        v.name AS venue_name,
        v.image_url AS venue_image

    FROM booking_details d
    LEFT JOIN equipment_master e 
        ON d.equipment_id = e.equipment_id
    LEFT JOIN venues v
        ON d.venue_id = v.venue_id

    WHERE d.booking_id = ?
");

$dStmt->bind_param("s", $code);
$dStmt->execute();

$res = $dStmt->get_result();
$items = [];

while ($row = $res->fetch_assoc()) {

    if ($row["item_type"] === "Venue") {
        $items[] = [
            "type"  => "venue",
            "name"  => $row["venue_name"],
            "image" => $row["venue_image"],
            "qty"   => $row["quantity"],
            "price" => $row["price_at_booking"]
        ];
    } else {
        $items[] = [
            "type"  => "equipment",
            "name"  => $row["equipment_name"],
            "image" => $row["equipment_image"],
            "qty"   => $row["quantity"],
            "price" => $row["price_at_booking"]
        ];
    }
}

/* ===============================
   RESPONSE
================================ */

echo json_encode([
    "success" => true,
    "booking" => $booking,
    "items"   => $items
]);

exit;

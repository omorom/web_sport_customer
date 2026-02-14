<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

/* ===============================
  CHECK STAFF LOGIN
================================ */
if (!isset($_SESSION["staff_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
    exit;
}

/* ===============================
  GET BOOKING ID
================================ */
$bookingId =
    $_GET["booking_id"]
    ?? $_GET["code"]
    ?? null;

if (!$bookingId) {
    echo json_encode([
        "success" => false,
        "message" => "ไม่พบรหัสการจอง"
    ]);
    exit;
}

/* ===============================
  GET BOOKING (คำนวณค่าคืนช้า)
================================ */
$bookingStmt = $conn->prepare("
    SELECT due_return_time
    FROM bookings
    WHERE booking_id = ?
");
$bookingStmt->bind_param("s", $bookingId);
$bookingStmt->execute();
$bookingRes = $bookingStmt->get_result();

if ($bookingRes->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "ไม่พบรายการจอง"
    ]);
    exit;
}

$booking = $bookingRes->fetch_assoc();

$lateFee = 0;
$LATE_FEE_PER_DAY = 50;

$dueDate = new DateTime($booking["due_return_time"]);
$now = new DateTime();

if ($now > $dueDate) {
    $interval = $dueDate->diff($now);
    $lateDays = (int)$interval->format("%a");
    $lateFee = $lateDays * $LATE_FEE_PER_DAY;
}

$bookingStmt->close();

/* ===============================
  GET ITEMS
================================ */
$sql = "
SELECT 
    bd.detail_id,
    bd.quantity,
    bd.price_at_booking,
    bd.equipment_instance_id,
    bd.venue_id,

    ei.instance_code,
    em.name AS equipment_name,
    em.image_url AS equipment_image,

    v.name AS venue_name,
    v.image_url AS venue_image

FROM booking_details bd

LEFT JOIN equipment_instances ei
    ON bd.equipment_instance_id = ei.instance_code

LEFT JOIN equipment_master em
    ON ei.equipment_id = em.equipment_id

LEFT JOIN venues v
    ON bd.venue_id = v.venue_id

WHERE bd.booking_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $bookingId);
$stmt->execute();
$res = $stmt->get_result();

$items = [];

while ($row = $res->fetch_assoc()) {

    $name = null;
    $image = null;
    $instance = null;

    if (!empty($row["equipment_name"])) {
        $name = $row["equipment_name"];
        $image = $row["equipment_image"];
        $instance = $row["instance_code"];
    }

    if (!empty($row["venue_name"])) {
        $name = $row["venue_name"];
        $image = $row["venue_image"];
        $instance = null;
    }

    if (!empty($image) && stripos($image, "/sports_rental_system") === false) {
        $image = "/sports_rental_system" . $image;
    }

    $items[] = [
        "detail_id" => $row["detail_id"],
        "name" => $name,
        "instance_code" => $instance,
        "quantity" => (int)$row["quantity"],
        "price_at_booking" => (float)$row["price_at_booking"],
        "image" => $image
    ];
}

$stmt->close();

/* ===============================
  GET RETURN CONDITIONS
================================ */
$conditionResult = $conn->query("
    SELECT condition_id, name_th, fine_percent
    FROM return_conditions
    ORDER BY condition_id ASC
");

$conditions = [];

while ($c = $conditionResult->fetch_assoc()) {
    $conditions[] = [
        "condition_id" => (int)$c["condition_id"],
        "name_th" => $c["name_th"],
        "fine_percent" => (float)$c["fine_percent"]
    ];
}

/* ===============================
  RETURN JSON
================================ */
echo json_encode([
    "success" => true,
    "late_fee" => $lateFee,
    "items" => $items,
    "conditions" => $conditions
]);

$conn->close();

<?php
session_start();
require_once "../../database.php";
header("Content-Type: application/json; charset=utf-8");

ini_set('display_errors', 0);

$cid = $_SESSION["customer_id"] ?? null;

if (!$cid) {
    echo json_encode(["success" => false, "message" => "no session"]);
    exit;
}

if (!$conn) {
    echo json_encode(["success" => false, "message" => "db connection failed"]);
}

$sql = "SELECT 
            b.booking_id,
            b.pickup_time,
            b.due_return_time,
            b.net_amount,
            bs.name_th AS status_name,
            bs.code AS status_code,
            ps.name_th AS payment_status_name,
            ps.code AS payment_status_code,
            d.detail_id,
            d.item_type,
            d.venue_id,
            em.name AS equipment_name,
            em.image_url AS equipment_image,
            d.quantity,
            v.name AS venue_name,
            v.image_url AS venue_image,
            ei.instance_code AS instance_code,
            r.review_text,
            r.rating,
            CASE 
                WHEN r.review_id IS NOT NULL THEN 1 
                ELSE 0 
            END AS is_reviewed
        FROM bookings b
        INNER JOIN booking_details d ON b.booking_id = d.booking_id
        LEFT JOIN equipment_master em ON d.equipment_id = em.equipment_id
        LEFT JOIN venues v ON d.venue_id = v.venue_id
        LEFT JOIN equipment_instances ei ON d.equipment_instance_id = ei.instance_code
        LEFT JOIN booking_status bs ON b.booking_status_id = bs.id
        LEFT JOIN payment_status ps ON b.payment_status_id = ps.id
        LEFT JOIN review r ON b.booking_id = r.booking_id AND d.detail_id = r.detail_id
        WHERE b.customer_id = ?
        ORDER BY b.booking_id DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $cid);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "เกิดข้อผิดพลาดในการดึงข้อมูล"]);
    exit;
}

$res = $stmt->get_result();
$items = [];

while ($row = $res->fetch_assoc()) {
    $is_venue = ($row['item_type'] === 'Venue');

    $items[] = [
        "booking_id"          => $row['booking_id'],
        "instance_code"       => $row['instance_code'],
        "item_type"           => $row['item_type'],
        "venue_id"            => $row['venue_id'],
        "detail_id"           => (int)$row['detail_id'],      
        "display_name"        => $is_venue ? $row['venue_name'] : $row['equipment_name'],
        "display_image"       => $is_venue ? $row['venue_image'] : $row['equipment_image'],
        "pickup_time"         => $row['pickup_time'],
        "due_return_time"     => $row['due_return_time'],
        "net_amount"          => $row['net_amount'],
        "status_name"         => $row['status_name'],
        "status_code"         => $row['status_code'],
        "quantity"            => (int)$row['quantity'],
        "is_reviewed"         => (bool)$row['is_reviewed'],
        "payment_status_name" => $row['payment_status_name'],
        "payment_status_code" => $row['payment_status_code'],
        "review_text"         => $row['review_text'],
        "rating"              => $row['rating']
    ];
}

echo json_encode([
    "success" => true,
    "items" => $items
]);

$stmt->close();
$conn->close();
<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

$bookingId =
    $_GET["booking_id"]
    ?? $_GET["code"]
    ?? null;

if (!$bookingId) {
    echo json_encode([
        "success" => false,
        "message" => "missing booking_id"
    ]);
    exit;
}

$sql = "
SELECT 
    bd.detail_id,
    bd.item_type,
    bd.equipment_id,
    bd.venue_id,
    bd.quantity,

    e.name AS equipment_name,
    e.image_url AS equipment_image,

    v.name AS venue_name,
    v.image_url AS venue_image

FROM booking_details bd

LEFT JOIN equipment_master e
  ON bd.equipment_id = e.equipment_id

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

    if (!empty($row["equipment_image"])) {
        $row["image"] = $row["equipment_image"];
    }

    if (!empty($row["venue_image"])) {
        $row["image"] = $row["venue_image"];
    }

    $items[] = $row;
}

echo json_encode([
    "success" => true,
    "items" => $items
]);

$conn->close();

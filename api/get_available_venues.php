<?php
require_once "database.php";

header("Content-Type: application/json");

$date  = $_GET["date"] ?? null;
$time  = $_GET["time"] ?? null;
$hours = intval($_GET["hours"] ?? 3);

if (!$date || !$time) {
  echo json_encode([
    "success" => false,
    "message" => "missing params"
  ]);
  exit;
}

$dt =
  DateTime::createFromFormat("d/m/Y H:i", "$date $time")
  ?: DateTime::createFromFormat("d/m/Y H", "$date $time");

if (!$dt) {
  echo json_encode([
    "success" => false,
    "error" => "date parse failed",
    "date" => $date,
    "time" => $time
  ]);
  exit;
}


$start = $dt->format("Y-m-d H:i:s");
$end   = date("Y-m-d H:i:s", strtotime("$start +$hours hour"));

$sql = "
SELECT DISTINCT bd.venue_id
FROM bookings b
JOIN booking_details bd
  ON b.booking_id = bd.booking_id
WHERE
  bd.item_type = 'venue'
  AND b.status_id IN (3,4)
  AND (
    b.pickup_time < ?
    AND b.due_return_time > ?
  )
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $end, $start);
$stmt->execute();

$result = $stmt->get_result();

$unavailable = [];

while ($row = $result->fetch_assoc()) {
  $unavailable[] = $row["venue_id"];
}

echo json_encode([
  "success" => true,
  "unavailable_ids" => $unavailable
]);

$stmt->close();
$conn->close();

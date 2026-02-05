<?php
require_once "database.php";

header("Content-Type: application/json");

$branchId = $_GET["branch_id"] ?? null;
$date     = $_GET["date"] ?? null;
$time     = $_GET["time"] ?? null;
$hours    = $_GET["hours"] ?? 3;

if (!$branchId || !$date || !$time) {
    echo json_encode([
        "success" => false,
        "message" => "missing params"
    ]);
    exit;
}

/* ==========================
   🔥 TIME RANGE USER WANT
========================== */

$start = date("Y-m-d H:i:s", strtotime("$date $time"));
$end   = date("Y-m-d H:i:s", strtotime("$start +$hours hour"));

/* ==========================
   MAIN QUERY
========================== */

$sql = "
SELECT 
    v.*,

    CASE 
        WHEN EXISTS (
            SELECT 1
            FROM booking b
            JOIN booking_detail bd 
                ON b.booking_id = bd.booking_id
            WHERE 
                bd.venue_id = v.venue_id
                AND bd.item_type = 'venue'
                AND b.status_id = 4
                AND (
                    b.pickup_time < '$end'
                    AND b.due_return_time > '$start'
                )
        )
        THEN 0
        ELSE 1
    END AS is_available

FROM venues v
WHERE v.branch_id = '$branchId'
  AND v.is_active = 1
";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data,
    "requested" => [
        "start" => $start,
        "end" => $end
    ]
]);

$conn->close();

<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

if (!isset($_SESSION["staff_id"])) {
    echo json_encode(["success"=>false]);
    exit;
}

$staffId = $_SESSION["staff_id"];

/* หา branch */
$stmt = $conn->prepare("
    SELECT branch_id
    FROM staff
    WHERE staff_id = ?
");
$stmt->bind_param("s", $staffId);
$stmt->execute();
$staff = $stmt->get_result()->fetch_assoc();
$stmt->close();

$branchId = $staff["branch_id"];

/* โหลดประวัติ */
$stmt = $conn->prepare("
    SELECT 
        b.booking_id,
        c.name AS customer_name,
        b.net_amount,
        bs.code AS booking_status,
        ps.code AS payment_status,
        b.due_return_time,
        p.refund_at
    FROM bookings b
    JOIN customers c ON b.customer_id = c.customer_id
    JOIN booking_status bs ON b.booking_status_id = bs.id
    LEFT JOIN payments p ON b.booking_id = p.booking_id
    LEFT JOIN payment_status ps ON p.payment_status_id = ps.id
    WHERE b.branch_id = ?
    AND (
        bs.code = 'COMPLETED'
        OR ps.code = 'REFUNDED'
    )
    ORDER BY 
        COALESCE(p.refund_at, b.due_return_time) DESC
");

$stmt->bind_param("s", $branchId);
$stmt->execute();

$res = $stmt->get_result();

$data = [];

while ($row = $res->fetch_assoc()) {

    $type = "COMPLETED";
    $finishedAt = $row["due_return_time"];

    if ($row["payment_status"] === "REFUNDED") {
        $type = "REFUNDED";
        $finishedAt = $row["refund_at"];
    }

    $data[] = [
        "booking_id" => $row["booking_id"],
        "customer_name" => $row["customer_name"],
        "net_amount" => $row["net_amount"],
        "status_type" => $type,
        "finished_at" => substr($finishedAt, 0, 10) // ตัดเหลือแค่วันที่
    ];
}

echo json_encode([
    "success"=>true,
    "data"=>$data
]);

$conn->close();

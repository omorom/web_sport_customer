<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

/* ================= AUTH ================= */

if (!isset($_SESSION["staff_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "เฉพาะเจ้าหน้าที่"
    ]);
    exit;
}

$staffId = $_SESSION["staff_id"];

/* ================= STAFF BRANCH ================= */

$stmt = $conn->prepare("
    SELECT branch_id
    FROM staff
    WHERE staff_id = ?
");
$stmt->bind_param("s", $staffId);
$stmt->execute();

$staff = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$staff) {
    echo json_encode([
        "success" => false,
        "message" => "ไม่พบข้อมูล staff"
    ]);
    exit;
}

$branchId = $staff["branch_id"];

/* ================= LOAD BOOKINGS ================= */

$stmt = $conn->prepare("
    SELECT
        b.booking_id,
        b.pickup_time,
        b.due_return_time,
        b.net_amount,
        bs.code AS status_code,
        c.name AS customer_name,
        ps.code AS payment_status_code
    FROM bookings b
    JOIN booking_status bs
        ON b.booking_status_id = bs.id
    JOIN customers c
        ON b.customer_id = c.customer_id
    LEFT JOIN payments p
        ON b.booking_id = p.booking_id
    LEFT JOIN payment_status ps
        ON p.payment_status_id = ps.id
    WHERE b.branch_id = ?
    AND bs.code IN (
        'WAITING_STAFF',
        'CONFIRMED_WAITING_PICKUP',
        'IN_USE',
        'CANCELLED'
    )
    ORDER BY b.pickup_time DESC
");

$stmt->bind_param("s", $branchId);
$stmt->execute();

$res = $stmt->get_result();

$rows = [];

while ($r = $res->fetch_assoc()) {

    // 🔥 ถ้าไม่มี payment ให้ default เป็น NULL
    if (!$r["payment_status_code"]) {
        $r["payment_status_code"] = null;
    }

    $rows[] = $r;
}

echo json_encode([
    "success" => true,
    "bookings" => $rows
]);

$stmt->close();
$conn->close();

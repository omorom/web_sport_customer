<?php
require_once "../../database.php";
session_start();

header("Content-Type: application/json; charset=utf-8");

/* ===============================
   ตรวจสอบสิทธิ์ staff
=============================== */

if (!isset($_SESSION["staff_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
    exit;
}

$status = $_GET["status"] ?? "IN_USE";

/* ===============================
   เงื่อนไข dynamic
=============================== */

$whereCondition = "";

// ===== กำลังใช้งาน (ยังไม่เกินกำหนด) =====
if ($status === "IN_USE") {

    $whereCondition = "
        bs.code = 'IN_USE'
        AND b.due_return_time >= NOW()
    ";
}

// ===== เกินกำหนด =====
elseif ($status === "OVERDUE") {

    $whereCondition = "
        bs.code = 'IN_USE'
        AND b.due_return_time < NOW()
    ";
}

// ===== คืนแล้ว =====
elseif ($status === "RETURNED") {

    $whereCondition = "
        bs.code = 'RETURNED'
    ";
}

// ===== ALL (ใช้สำหรับนับ count) =====
elseif ($status === "ALL") {

    // ดึงเฉพาะที่ยัง IN_USE แล้วให้ frontend แยกเอง
    $whereCondition = "
        bs.code = 'IN_USE'
    ";
}

// ===== default =====
else {

    $whereCondition = "
        bs.code = 'IN_USE'
    ";
}

/* ===============================
   QUERY
=============================== */

$sql = "
SELECT
    b.booking_id,
    c.name AS customer_name,
    b.due_return_time,
    bs.code AS status,

    CASE
        WHEN b.due_return_time < NOW()
        THEN DATEDIFF(CURDATE(), DATE(b.due_return_time))
        ELSE 0
    END AS overdue_days

FROM bookings b
JOIN customers c
    ON b.customer_id = c.customer_id
JOIN booking_status bs
    ON b.booking_status_id = bs.id

WHERE $whereCondition

ORDER BY b.due_return_time ASC
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

$data = [];

while ($row = $result->fetch_assoc()) {

    $data[] = [
        "booking_id"      => $row["booking_id"],
        "customer_name"   => $row["customer_name"],
        "due_return_time" => $row["due_return_time"],
        "status"          => $row["status"],
        "overdue_days"    => (int)$row["overdue_days"]
    ];
}

echo json_encode([
    "success" => true,
    "data"    => $data
]);

$conn->close();

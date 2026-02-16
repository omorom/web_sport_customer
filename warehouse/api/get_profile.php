<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");

// เช็คสิทธิ์พนักงานจาก Session
$staffId = $_SESSION["staff_id"] ?? null;

if (!$staffId) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

// SQL JOIN: ดึงชื่อพนักงาน และชื่อตำแหน่งจากตาราง roles
$sql = "
    SELECT 
        staff_id,
        name, 
        email,
        department 
    FROM staff 
    WHERE staff_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $staffId);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        "success" => true,
        "staff_id" => $row["staff_id"], 
        "name" => $row["name"],
        "email" => $row["email"],
        "department" => $row["department"]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "ไม่พบข้อมูลพนักงาน"]);
}
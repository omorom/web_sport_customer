<?php
require_once "../../database.php";
session_start();

header("Content-Type: application/json; charset=utf-8");

ini_set('display_errors', 0);
error_reporting(0);

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if ($email === "" || $password === "") {
    echo json_encode([
        "success" => false,
        "message" => "กรุณากรอกข้อมูลให้ครบ"
    ]);
    exit;
}

$stmt = $conn->prepare("
    SELECT 
        staff_id, 
        password_hash, 
        role_id
    FROM staff
    WHERE email = ?
    LIMIT 1
");

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if (!$row = $result->fetch_assoc()) {
    echo json_encode([
        "success" => false,
        "message" => "ไม่พบผู้ใช้งานนี้ในระบบ"
    ]);
    exit;
}

/* เช็ครหัสผ่าน */
if ($password !== $row["password_hash"]) {
    echo json_encode([
        "success" => false,
        "message" => "รหัสผ่านไม่ถูกต้อง"
    ]);
    exit;
}

/* เช็ค role */
if ((int)$row["role_id"] !== 1) {
    echo json_encode([
        "success" => false,
        "message" => "คุณไม่มีสิทธิ์เข้าใช้งาน (เฉพาะผู้บริหาร)"
    ]);
    exit;
}

/* Login สำเร็จ */
$_SESSION["staff_id"] = $row["staff_id"];
$_SESSION["role_id"]  = 1;
$_SESSION["is_admin"] = true;

echo json_encode([
    "success" => true,
    "staff_id" => $row["staff_id"],
    "role_id" => 1
]);

$stmt->close();
$conn->close();

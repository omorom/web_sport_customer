<?php
require_once "../../database.php";
session_start();

header("Content-Type: application/json; charset=utf-8");

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
        s.staff_id, 
        s.password_hash, 
        s.branch_id, 
        s.role_id,
        b.name AS branch_name
    FROM staff s
    LEFT JOIN branches b ON s.branch_id = b.branch_id 
    WHERE s.email = ? 
    LIMIT 1
");

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {

    if ($password === $row["password_hash"]) {

        // 2. ตรวจสอบสิทธิ์ (ต้องมี role_id เป็น 3 เท่านั้น)
        if ($row["role_id"] == 3) { 
            $_SESSION["staff_id"] = $row["staff_id"];
            $_SESSION["branch_name"] = $row["branch_name"];
            $_SESSION["branch_id"] = $row["branch_id"]; 

            echo json_encode([
                "success" => true,
                "staff_id" => $row["staff_id"],
                "branch_id" => $row["branch_id"],
                "branch_name" => $row["branch_name"]
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "คุณไม่มีสิทธิ์เข้าใช้งาน (เฉพาะเจ้าหน้าที่เท่านั้น)"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "รหัสผ่านไม่ถูกต้อง"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "ไม่พบผู้ใช้งานนี้ในระบบ"
    ]);
}

$stmt->close();
$conn->close();
<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
require_once "../../database.php"; 

header("Content-Type: application/json; charset=utf-8");

if (!isset($conn)) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$cid = $_SESSION["customer_id"] ?? null;

if (!$cid) {
    echo json_encode(["success" => false, "message" => "กรุณาเข้าสู่ระบบ"]);
    exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "ข้อมูลรูปแบบไม่ถูกต้อง"]);
    exit;
}

$booking_id = trim($data['booking_id'] ?? '');
$detail_id     = intval($data['detail_id'] ?? 0);
$instance_code = trim($data['instance_code'] ?? '');
$review_text   = trim($data['review_text'] ?? '');
$rating        = intval($data['rating'] ?? 0);

if (empty($instance_code)) {
    $instance_code = null;
}

if ($instance_code === '' || $instance_code === 'N/A') {
    $instance_code = null;
}

/* ===============================
   3. ตรวจสอบความถูกต้อง (Security & Duplicate Check)
================================ */
$sqlCheck = "SELECT booking_id FROM bookings WHERE booking_id = ? AND customer_id = ?";

$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("ss", $booking_id, $cid);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result();

if ($resultCheck->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "ไม่พบสิทธิ์ในการเข้าถึงข้อมูลนี้"]);
    exit;
}

$sqlDup = "SELECT review_id FROM review WHERE       
booking_id = ? AND detail_id = ?";

$stmtDup = $conn->prepare($sqlDup);
$stmtDup->bind_param("si", $booking_id, $detail_id);
$stmtDup->execute();
$resultDup = $stmtDup->get_result();

if ($resultDup->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "คุณได้รีวิวรายการนี้ไปแล้ว"]);
    exit;
}

/* ===============================
   4. บันทึกข้อมูลลงตาราง review
================================ */
$sqlInsert = "INSERT INTO review 
(booking_id, detail_id, instance_code, review_text, rating) 
VALUES (?, ?, ?, ?, ?)";

$stmtInsert = $conn->prepare($sqlInsert);
$stmtInsert->bind_param("sissi", 
    $booking_id, 
    $detail_id, 
    $instance_code, 
    $review_text, 
    $rating
);

if ($stmtInsert->execute()) {
    $response = ["success" => true, "message" => "ขอบคุณสำหรับการรีวิว!"];
} else {
    $response = ["success" => false, "message" => $stmtInsert->error];
}

$stmtCheck->close();
$stmtDup->close();
$stmtInsert->close();
$conn->close();

if (ob_get_length()) ob_clean(); 
echo json_encode($response);
exit;
<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once "../../database.php";

date_default_timezone_set('Asia/Bangkok');
header("Content-Type: application/json; charset=utf-8");

/* ===============================
   STAFF AUTH
================================ */
if (!isset($_SESSION["staff_id"])) {
    echo json_encode([
        "success" => false,
        "message" => "เฉพาะเจ้าหน้าที่เท่านั้น"
    ]);
    exit;
}

$staffId = $_SESSION["staff_id"];

/* ===============================
   READ JSON
================================ */
$raw  = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "JSON ไม่ถูกต้อง"
    ]);
    exit;
}

/* ===============================
   INPUT
================================ */
$cart       = $data["cart"] ?? [];
$rentDate   = $data["rentDate"] ?? null;
$timeSlot   = isset($data["timeSlot"]) ? (int)$data["timeSlot"] : null;
$rentHours  = (int)($data["rentHours"] ?? 1);

$usedPoints     = (int)($data["usedPoints"] ?? 0);
$couponDiscount = (float)($data["couponDiscount"] ?? 0);
$couponCode     = !empty($data["couponCode"]) ? trim($data["couponCode"]) : null;

$branchId   = $data["branchId"] ?? null;
$customerId = $data["customerId"] ?? null;

/* ===============================
   VALIDATE
================================ */
if (!$customerId || !$branchId || !$rentDate || $timeSlot === null || empty($cart)) {
    echo json_encode([
        "success" => false,
        "message" => "ข้อมูลไม่ครบ"
    ]);
    exit;
}

$conn->begin_transaction();

try {

    /* ===============================
       GENERATE BOOKING CODE
    ================================ */
    function generateBookingCode($conn) {
        do {
            $code = "BK" . str_pad(random_int(0, 999999), 6, "0", STR_PAD_LEFT);
            $stmt = $conn->prepare("SELECT 1 FROM bookings WHERE booking_id = ?");
            $stmt->bind_param("s", $code);
            $stmt->execute();
            $stmt->store_result();
        } while ($stmt->num_rows > 0);
        return $code;
    }

    $bookingCode = generateBookingCode($conn);

    

    /* ===============================
       DATETIME
    ================================ */
    $pickup = date("Y-m-d H:i:s", strtotime("$rentDate $timeSlot:00"));
    $return = date("Y-m-d H:i:s", strtotime("+$rentHours hours", strtotime($pickup)));

    /* ===============================
       CALCULATE MONEY
    ================================ */
    $totalAmount = 0;

    foreach ($cart as $i) {
        $totalAmount += (float)$i["price"] * $rentHours;
    }

    $extraHourFee = 0;
    if ($rentHours === 4) $extraHourFee = 100;
    elseif ($rentHours === 5) $extraHourFee = 200;
    elseif ($rentHours >= 6) $extraHourFee = 300;

    $gross = $totalAmount + $extraHourFee;
    $netAmount = max($gross - $couponDiscount - $usedPoints, 0);
    $pointsEarned = floor($netAmount / 100);

    /* ===============================
       INSERT BOOKINGS
    ================================ */
    $bookingTypeId   = 2;
    $bookingStatusId = 1;
    $paymentStatusId = 1;

    $stmt = $conn->prepare("
        INSERT INTO bookings (
            booking_id, customer_id, staff_id, branch_id,
            booking_type_id, booking_status_id, payment_status_id,
            pickup_time, due_return_time, actual_pickup_time,
            total_amount, discount_amount, extra_hour_fee,
            net_amount, coupon_code, points_used,
            points_used_value, points_earned
        )
        VALUES (?,?,?,?,?,?,?,?,?,NOW(),?,?,?,?,?,?,?,?)
    ");

    $stmt->bind_param(
        "ssssiiissddddsiii",
        $bookingCode, $customerId, $staffId, $branchId,
        $bookingTypeId, $bookingStatusId, $paymentStatusId,
        $pickup, $return,
        $totalAmount, $couponDiscount, $extraHourFee,
        $netAmount, $couponCode,
        $usedPoints, $usedPoints, $pointsEarned
    );

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    /* ===============================
       INSERT BOOKING DETAILS
    ================================ */
    $dStmt = $conn->prepare("
        INSERT INTO booking_details
        (booking_id, item_type, equipment_id, equipment_instance_id, venue_id, quantity, price_at_booking)
        VALUES (?,?,?,?,?,?,?)
    ");

    foreach ($cart as $item) {

        $type = strtolower($item["type"] ?? "");

        $equipmentId = null;
        $equipmentInstanceId = null;
        $venueId = null;

        if ($type === "field" || $type === "venue") {

            $itemType = "Venue";
            $venueId = $item["id"];
            $qty = 1;
            $price = (float)$item["price"];

        } else {

            $itemType = "Equipment";
            $equipmentId = $item["id"];
            $equipmentInstanceId = $item["instance_code"] ?? null;

            if (!$equipmentInstanceId) {
                throw new Exception("ยังไม่ได้เลือกหมายเลขอุปกรณ์");
            }

            $qty = 1;
            $price = (float)$item["price"];
        }

        $dStmt->bind_param(
            "sssssid",
            $bookingCode,
            $itemType,
            $equipmentId,
            $equipmentInstanceId,
            $venueId,
            $qty,
            $price
        );

        if (!$dStmt->execute()) {
            throw new Exception($dStmt->error);
        }
    }

    /* ===============================
       UPDATE EQUIPMENT STATUS
    ================================ */
    $updateEquip = $conn->prepare("
        UPDATE equipment_instances
        SET status = 'Rented',
            current_location = 'Customer'
        WHERE instance_code = ?
        AND status = 'Ready'
    ");

    foreach ($cart as $item) {

        if (strtolower($item["type"] ?? "") === "equipment") {

            $instanceCode = $item["instance_code"] ?? null;

            if (!$instanceCode) {
                throw new Exception("ไม่พบ instance_code");
            }

            $updateEquip->bind_param("s", $instanceCode);

            if (!$updateEquip->execute()) {
                throw new Exception($updateEquip->error);
            }

            if ($updateEquip->affected_rows === 0) {
                throw new Exception("อุปกรณ์ถูกใช้งานอยู่แล้ว");
            }
        }
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "booking_code" => $bookingCode,
        "redirect" =>
            "/sports_rental_system/staff/frontend/payment_method.html?code=" .
            $bookingCode
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();

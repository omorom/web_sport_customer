<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once "database.php";

header("Content-Type: application/json; charset=utf-8");

/* ===============================
   READ JSON INPUT
================================ */

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "JSON ไม่ถูกต้อง",
        "raw" => $raw
    ]);
    exit;
}

/* ===============================
   INPUT
================================ */

$cart       = $data["cart"] ?? [];
$rentDate  = $data["rentDate"] ?? null;
$timeSlot  = isset($data["timeSlot"]) ? (int)$data["timeSlot"] : null;
$rentHours = (int)($data["rentHours"] ?? 1);

$usedPoints     = (int)($data["usedPoints"] ?? 0);
$couponDiscount = (int)($data["couponDiscount"] ?? 0);
$couponCode     = (!empty($data["couponCode"])) ? $data["couponCode"] : null;

$branchId   = $data["branchId"] ?? null;
$customerId = $_SESSION["customer_id"] ?? null;

/* ===============================
   VALIDATE
================================ */

$missing = [];

if (!$customerId) $missing[] = "customerId";
if (!$branchId)   $missing[] = "branchId";
if (!$rentDate)  $missing[] = "rentDate";
if ($timeSlot === null) $missing[] = "timeSlot";
if (empty($cart)) $missing[] = "cart";

if (!empty($missing)) {
    echo json_encode([
        "success" => false,
        "message" => "ข้อมูลไม่ครบ",
        "missing" => $missing
    ]);
    exit;
}

/* ===============================
   TRANSACTION
================================ */

$conn->begin_transaction();

try {

    /* ===============================
       HELPER
    ================================ */

    function getIdByCode($conn, $table, $code) {

        $sql = "SELECT id FROM {$table} WHERE code = ? LIMIT 1";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $code);
        $stmt->execute();

        $res = $stmt->get_result()->fetch_assoc();
        return $res ? (int)$res["id"] : null;
    }

    function generateBookingCode($conn) {

        do {

            $num = random_int(0, 999999);
            $code = "BK" . str_pad($num, 6, "0", STR_PAD_LEFT);

            $stmt = $conn->prepare(
                "SELECT 1 FROM bookings WHERE booking_id = ?"
            );
            $stmt->bind_param("s", $code);
            $stmt->execute();
            $stmt->store_result();

        } while ($stmt->num_rows > 0);

        return $code;
    }

    /* ===============================
       LOOKUP MASTER
    ================================ */

    $bookingStatusId = getIdByCode($conn, "booking_status", "WAITING_STAFF");
    $paymentStatusId = getIdByCode($conn, "payment_status", "UNPAID");
    $bookingTypeId   = getIdByCode($conn, "booking_types", "ONLINE");

    if (!$bookingStatusId || !$paymentStatusId || !$bookingTypeId) {
        throw new Exception("ไม่พบ master status/type ในระบบ");
    }

    /* ===============================
       DATETIME
    ================================ */

    $pickup = date(
        "Y-m-d H:i:s",
        strtotime("$rentDate $timeSlot:00")
    );

    $return = date(
        "Y-m-d H:i:s",
        strtotime("+$rentHours hours", strtotime($pickup))
    );

    /* ===============================
       MONEY
    ================================ */

    $totalAmount = 0;

    foreach ($cart as $i) {

        $price = (float)$i["price"];
        $qty   = (int)$i["qty"];

        $totalAmount += $price * $qty * $rentHours;
    }

    $extraHourFee = 0;
    if ($rentHours === 4) $extraHourFee = 100;
    elseif ($rentHours === 5) $extraHourFee = 200;
    elseif ($rentHours >= 6) $extraHourFee = 300;

    $discountAmount = $couponDiscount;

    $POINT_RATE = 1;
    $pointsUsedValue = $usedPoints * $POINT_RATE;

    $netAmount =
        max(
            ($totalAmount + $extraHourFee)
            - $discountAmount
            - $pointsUsedValue,
            0
        );

    $pointsEarned = floor($netAmount / 100);

    /* ===============================
       INSERT BOOKINGS
    ================================ */

    $bookingCode = generateBookingCode($conn);

    $stmt = $conn->prepare("
        INSERT INTO bookings (
            booking_id,
            customer_id,
            branch_id,
            booking_type_id,
            booking_status_id,
            payment_status_id,
            pickup_time,
            due_return_time,
            total_amount,
            discount_amount,
            extra_hour_fee,
            net_amount,
            coupon_code,
            points_used,
            points_used_value,
            points_earned
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ");

    $stmt->bind_param(
        "sssiiissddddsidi",
        $bookingCode,
        $customerId,
        $branchId,
        $bookingTypeId,
        $bookingStatusId,
        $paymentStatusId,
        $pickup,
        $return,
        $totalAmount,
        $discountAmount,
        $extraHourFee,
        $netAmount,
        $couponCode,
        $usedPoints,
        $pointsUsedValue,
        $pointsEarned
    );

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    /* ===============================
       INSERT DETAILS
    ================================ */

    $dStmt = $conn->prepare("
        INSERT INTO booking_details (
            booking_id,
            item_type,
            equipment_id,
            venue_id,
            quantity,
            price_at_booking
        )
        VALUES (?,?,?,?,?,?)
    ");

    foreach ($cart as $item) {

        /* ===== NORMALIZE TYPE ===== */

        $type = $item["type"] ?? null;

        if ($type) {
            $type = strtolower($type);
        }

        if (!$type) {
            $type = str_starts_with($item["id"], "V")
                ? "venue"
                : "equipment";
        }

        $equipmentId = null;
        $venueId = null;

        if ($type === "venue" || $type === "field") {

            $type = "Venue";
            $venueId = (string)$item["id"];

        } else {

            $type = "Equipment";
            $equipmentId = (string)$item["id"];
        }

        $qty   = (int)$item["qty"];
        $price = (float)$item["price"];

        $dStmt->bind_param(
            "ssssid",
            $bookingCode,
            $type,
            $equipmentId,
            $venueId,
            $qty,
            $price
        );

        if (!$dStmt->execute()) {
            throw new Exception("booking_details error: " . $dStmt->error);
        }
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "booking_code" => $bookingCode
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

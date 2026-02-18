<?php
require_once "../../database.php";
header("Content-Type: application/json; charset=utf-8");

try {

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) $data = [];

/* ===============================
   RECEIVE FILTER
================================ */

$range         = $data["range"] ?? "";
$start         = $data["start"] ?? "";
$end           = $data["end"] ?? "";
$region_id     = $data["region_id"] ?? "";
$province_id   = $data["province_id"] ?? "";
$branch_id     = $data["branch_id"] ?? "";
$customer_type = $data["customer_type"] ?? "";
$faculty_id    = $data["faculty_id"] ?? "";
$study_year    = $data["study_year"] ?? "";

/* ===============================
   BUILD WHERE
================================ */

$where = [];
$params = [];
$types = "";

/* DATE */

if ($range === "7days")
    $where[] = "bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
elseif ($range === "30days")
    $where[] = "bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
elseif ($range === "1year")
    $where[] = "bk.pickup_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
elseif ($range === "custom" && $start && $end) {
    $where[] = "DATE(bk.pickup_time) BETWEEN ? AND ?";
    $params[] = $start;
    $params[] = $end;
    $types .= "ss";
}

/* LOCATION */

if ($region_id !== "") {
    $where[] = "r.region_id = ?";
    $params[] = (int)$region_id;
    $types .= "i";
}

if ($province_id !== "") {
    $where[] = "p.province_id = ?";
    $params[] = (int)$province_id;
    $types .= "i";
}

if ($branch_id !== "") {
    $where[] = "bk.branch_id = ?";
    $params[] = (int)$branch_id;
    $types .= "i";
}

/* CUSTOMER */

if ($customer_type !== "") {
    $where[] = "c.customer_type = ?";
    $params[] = $customer_type;
    $types .= "s";
}

if ($faculty_id !== "") {
    $where[] = "c.faculty_id = ?";
    $params[] = (int)$faculty_id;
    $types .= "i";
}

if ($study_year !== "") {
    $where[] = "c.study_year = ?";
    $params[] = (int)$study_year;
    $types .= "i";
}

$whereSQL = count($where) ? "WHERE " . implode(" AND ", $where) : "";

/* =================================
   BASE JOIN
================================= */

$baseJoin = "
FROM bookings bk
JOIN customers c ON bk.customer_id = c.customer_id
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
JOIN region r ON p.region_id = r.region_id
";

/* =================================
   TOTAL USERS
================================= */

$sqlTotal = "
SELECT COUNT(DISTINCT c.customer_id) total
$baseJoin
$whereSQL
";

$stmt = $conn->prepare($sqlTotal);
if ($types) $stmt->bind_param($types, ...$params);
$stmt->execute();
$total_users = (int)($stmt->get_result()->fetch_assoc()["total"] ?? 0);

/* =================================
   STUDENT / EXTERNAL COUNT
================================= */

$sqlType = "
SELECT c.customer_type, COUNT(DISTINCT c.customer_id) total
$baseJoin
$whereSQL
GROUP BY c.customer_type
";

$stmtType = $conn->prepare($sqlType);
if ($types) $stmtType->bind_param($types, ...$params);
$stmtType->execute();
$resType = $stmtType->get_result();

$student_count = 0;
$external_count = 0;

while ($row = $resType->fetch_assoc()) {
    if ($row["customer_type"] === "student")
        $student_count = (int)$row["total"];
    elseif ($row["customer_type"] === "general")
        $external_count = (int)$row["total"];
}

/* CALCULATE PERCENT */

$student_percent = $total_users > 0
    ? round(($student_count / $total_users) * 100)
    : 0;

$external_percent = $total_users > 0
    ? round(($external_count / $total_users) * 100)
    : 0;

/* =================================
   AVG BOOKING PER USER
================================= */

$sqlAvg = "
SELECT COUNT(bk.booking_id) total_booking,
       COUNT(DISTINCT c.customer_id) total_user
$baseJoin
$whereSQL
";

$stmtAvg = $conn->prepare($sqlAvg);
if ($types) $stmtAvg->bind_param($types, ...$params);
$stmtAvg->execute();
$rowAvg = $stmtAvg->get_result()->fetch_assoc();

$total_booking = (int)($rowAvg["total_booking"] ?? 0);
$total_user    = (int)($rowAvg["total_user"] ?? 0);

$avg_booking = $total_user > 0
    ? round($total_booking / $total_user, 2)
    : 0;

/* =================================
   GENDER RATIO
================================= */

$sqlGender = "
SELECT g.name_th, COUNT(DISTINCT c.customer_id) total
$baseJoin
JOIN genders g ON c.gender_id = g.gender_id
$whereSQL
GROUP BY g.name_th
";

$stmtGender = $conn->prepare($sqlGender);
if ($types) $stmtGender->bind_param($types, ...$params);
$stmtGender->execute();
$resGender = $stmtGender->get_result();

$genderLabels = [];
$genderData = [];

while($row = $resGender->fetch_assoc()){
    $genderLabels[] = trim($row["name_th"]);
    $genderData[] = (int)$row["total"];
}

/* =================================
   TOP FACULTY
================================= */

$sqlFaculty = "
SELECT f.name, COUNT(DISTINCT c.customer_id) total
$baseJoin
JOIN faculty f ON c.faculty_id = f.id
$whereSQL
GROUP BY f.name
ORDER BY total DESC
LIMIT 5
";

$stmtFaculty = $conn->prepare($sqlFaculty);
if ($types) $stmtFaculty->bind_param($types, ...$params);
$stmtFaculty->execute();
$resFaculty = $stmtFaculty->get_result();

$facultyLabels = [];
$facultyData = [];

while($row = $resFaculty->fetch_assoc()){
    $facultyLabels[] = $row["name"];
    $facultyData[] = (int)$row["total"];
}

/* =================================
   USER BY STUDY YEAR
================================= */

$sqlYear = "
SELECT c.study_year, COUNT(DISTINCT c.customer_id) total
$baseJoin
$whereSQL
AND c.study_year IS NOT NULL
GROUP BY c.study_year
ORDER BY c.study_year ASC
";

$stmtYear = $conn->prepare($sqlYear);
if ($types) $stmtYear->bind_param($types, ...$params);
$stmtYear->execute();
$resYear = $stmtYear->get_result();

$yearLabels = [];
$yearData = [];

while($row = $resYear->fetch_assoc()){
    $yearLabels[] = "ปี " . $row["study_year"];
    $yearData[] = (int)$row["total"];
}

/* =================================
   USER BY BRANCH
================================= */

$sqlBranch = "
SELECT b.name, COUNT(DISTINCT c.customer_id) total
$baseJoin
$whereSQL
GROUP BY b.branch_id
ORDER BY total DESC
LIMIT 5
";

$stmtBranch = $conn->prepare($sqlBranch);
if ($types) $stmtBranch->bind_param($types, ...$params);
$stmtBranch->execute();
$resBranch = $stmtBranch->get_result();

$branchLabels = [];
$branchData = [];

while($row = $resBranch->fetch_assoc()){
    $branchLabels[] = $row["name"];
    $branchData[] = (int)$row["total"];
}

/* =================================
   TOP 10 USERS
================================= */

$sqlTopUser = "
SELECT c.name, COUNT(bk.booking_id) total
$baseJoin
$whereSQL
GROUP BY c.customer_id
ORDER BY total DESC
LIMIT 10
";

$stmtTop = $conn->prepare($sqlTopUser);
if ($types) $stmtTop->bind_param($types, ...$params);
$stmtTop->execute();
$resTop = $stmtTop->get_result();

$topUserLabels = [];
$topUserData = [];

while($row = $resTop->fetch_assoc()){
    $topUserLabels[] = $row["name"];
    $topUserData[] = (int)$row["total"];
}

/* =================================
   RESPONSE
================================= */

echo json_encode([
    "kpi" => [
        "total_users"      => $total_users,
        "student_percent"  => $student_percent,
        "external_percent" => $external_percent,
        "avg_booking"      => $avg_booking
    ],
    "gender_ratio" => [
        "labels" => $genderLabels,
        "data"   => $genderData
    ],
    "user_by_year" => [
    "labels" => $yearLabels,
    "data"   => $yearData
    ],
    "top_faculty" => [
        "labels" => $facultyLabels,
        "data"   => $facultyData
    ],
    "user_by_branch" => [
    "labels" => $branchLabels,
    "data"   => $branchData
],
    "top_users" => [
        "labels" => $topUserLabels,
        "data"   => $topUserData
    ]
]);

} catch (Throwable $e) {

echo json_encode([
    "error" => true,
    "message" => $e->getMessage()
]);

}

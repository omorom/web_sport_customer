<?php
require_once "../../database.php";
header("Content-Type: application/json; charset=utf-8");

try {

$data = json_decode(file_get_contents("php://input"), true) ?? [];

/* ==========================
   RECEIVE FILTER
========================== */

$range        = $data["range"] ?? "";
$start        = $data["start"] ?? "";
$end          = $data["end"] ?? "";
$region_id    = $data["region_id"] ?? "";
$province_id  = $data["province_id"] ?? "";
$branch_id    = $data["branch_id"] ?? "";
$category_id  = $data["category_id"] ?? "";
$equipment_id = $data["equipment_id"] ?? "";

/* =========================================================
   1️⃣  BUILD EQUIPMENT FILTER
========================================================= */

$whereEquip = [];
$paramsEquip = [];
$typesEquip = "";

/* ---- location ---- */

if ($region_id !== "") {
    $whereEquip[] = "r.region_id = ?";
    $paramsEquip[] = (int)$region_id;
    $typesEquip .= "i";
}

if ($province_id !== "") {
    $whereEquip[] = "p.province_id = ?";
    $paramsEquip[] = $province_id;
    $typesEquip .= "s";
}

if ($branch_id !== "") {
    $whereEquip[] = "b.branch_id = ?";
    $paramsEquip[] = $branch_id;
    $typesEquip .= "s";
}

/* ---- equipment specific ---- */

if ($category_id !== "") {
    $whereEquip[] = "em.category_id = ?";
    $paramsEquip[] = (int)$category_id;
    $typesEquip .= "i";
}

if ($equipment_id !== "") {
    $whereEquip[] = "em.equipment_id = ?";
    $paramsEquip[] = $equipment_id;
    $typesEquip .= "s";
}

$whereSQL_Equip = count($whereEquip)
    ? "WHERE " . implode(" AND ", $whereEquip)
    : "";

/* ---- review date condition (JOIN only) ---- */

$reviewDateEquip = "";

if ($range === "7days") {
    $reviewDateEquip = " AND rv.review_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
}
elseif ($range === "30days") {
    $reviewDateEquip = " AND rv.review_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
}
elseif ($range === "1year") {
    $reviewDateEquip = " AND rv.review_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
}
elseif ($range === "custom" && $start && $end) {
    $reviewDateEquip = " AND rv.review_date BETWEEN ? AND ?";
    $paramsEquip[] = $start;
    $paramsEquip[] = $end;
    $typesEquip .= "ss";
}

/* =========================================================
   2️⃣  BUILD VENUE FILTER
========================================================= */

$whereVenue = [];
$paramsVenue = [];
$typesVenue = "";

if ($region_id !== "") {
    $whereVenue[] = "r.region_id = ?";
    $paramsVenue[] = (int)$region_id;
    $typesVenue .= "i";
}

if ($province_id !== "") {
    $whereVenue[] = "p.province_id = ?";
    $paramsVenue[] = $province_id;
    $typesVenue .= "s";
}

if ($branch_id !== "") {
    $whereVenue[] = "b.branch_id = ?";
    $paramsVenue[] = $branch_id;
    $typesVenue .= "s";
}

$whereSQL_Venue = count($whereVenue)
    ? "WHERE " . implode(" AND ", $whereVenue)
    : "";

/* ---- review date for venue ---- */

$reviewDateVenue = "";

if ($range === "7days") {
    $reviewDateVenue = " AND rv.review_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
}
elseif ($range === "30days") {
    $reviewDateVenue = " AND rv.review_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
}
elseif ($range === "1year") {
    $reviewDateVenue = " AND rv.review_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
}
elseif ($range === "custom" && $start && $end) {
    $reviewDateVenue = " AND rv.review_date BETWEEN ? AND ?";
    $paramsVenue[] = $start;
    $paramsVenue[] = $end;
    $typesVenue .= "ss";
}

/* =========================================================
   KPI EQUIPMENT
========================================================= */

$sqlKPI = "
SELECT 
    COUNT(DISTINCT ei.instance_code) total_equipment,
    IFNULL(ROUND(AVG(rv.rating),1),0) avg_equipment_rating
FROM equipment_instances ei
JOIN equipment_master em ON ei.equipment_id = em.equipment_id
LEFT JOIN branches b ON ei.branch_id = b.branch_id
LEFT JOIN provinces p ON b.province_id = p.province_id
LEFT JOIN region r ON p.region_id = r.region_id
LEFT JOIN review rv 
    ON rv.instance_code = ei.instance_code
    $reviewDateEquip
$whereSQL_Equip
";

$stmt = $conn->prepare($sqlKPI);
if ($typesEquip) $stmt->bind_param($typesEquip, ...$paramsEquip);
$stmt->execute();
$kpiEquip = $stmt->get_result()->fetch_assoc();

/* =========================================================
   KPI VENUE
========================================================= */

$sqlVenueKPI = "
SELECT 
    COUNT(DISTINCT v.venue_id) total_venues,
    IFNULL(ROUND(AVG(rv.rating),1),0) avg_venue_rating
FROM venues v
LEFT JOIN branches b ON v.branch_id = b.branch_id
LEFT JOIN provinces p ON b.province_id = p.province_id
LEFT JOIN region r ON p.region_id = r.region_id
LEFT JOIN review rv 
    ON rv.venue_id = v.venue_id
    $reviewDateVenue
$whereSQL_Venue
";

$stmt = $conn->prepare($sqlVenueKPI);
if ($typesVenue) $stmt->bind_param($typesVenue, ...$paramsVenue);
$stmt->execute();
$venueKpi = $stmt->get_result()->fetch_assoc();

$sqlBestEquip = "
SELECT 
    em.name,
    ROUND(AVG(rv.rating),1) AS avg_rating,
    COUNT(rv.rating) AS review_count
FROM equipment_instances ei
JOIN equipment_master em ON ei.equipment_id = em.equipment_id
LEFT JOIN branches b ON ei.branch_id = b.branch_id
LEFT JOIN provinces p ON b.province_id = p.province_id
LEFT JOIN region r ON p.region_id = r.region_id
LEFT JOIN review rv 
    ON rv.instance_code = ei.instance_code
    $reviewDateEquip
$whereSQL_Equip
GROUP BY em.equipment_id
HAVING review_count > 0
ORDER BY avg_rating DESC
LIMIT 5
";

$stmt = $conn->prepare($sqlBestEquip);
if ($typesEquip) $stmt->bind_param($typesEquip, ...$paramsEquip);
$stmt->execute();
$topBestEquip = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$sqlWorstEquip = "
SELECT 
    em.name,
    ROUND(AVG(rv.rating),1) AS avg_rating,
    COUNT(rv.rating) AS review_count
FROM equipment_instances ei
JOIN equipment_master em ON ei.equipment_id = em.equipment_id
LEFT JOIN branches b ON ei.branch_id = b.branch_id
LEFT JOIN provinces p ON b.province_id = p.province_id
LEFT JOIN region r ON p.region_id = r.region_id
LEFT JOIN review rv 
    ON rv.instance_code = ei.instance_code
    $reviewDateEquip
$whereSQL_Equip
GROUP BY em.equipment_id
HAVING review_count > 0
ORDER BY avg_rating ASC
LIMIT 5
";

$stmt = $conn->prepare($sqlWorstEquip);
if ($typesEquip) $stmt->bind_param($typesEquip, ...$paramsEquip);
$stmt->execute();
$topWorstEquip = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);


$sqlBestVenue = "
SELECT 
    v.name,
    ROUND(AVG(rv.rating),1) AS avg_rating,
    COUNT(rv.rating) AS review_count
FROM venues v
LEFT JOIN branches b ON v.branch_id = b.branch_id
LEFT JOIN provinces p ON b.province_id = p.province_id
LEFT JOIN region r ON p.region_id = r.region_id
LEFT JOIN review rv 
    ON rv.venue_id = v.venue_id
    $reviewDateVenue
$whereSQL_Venue
GROUP BY v.venue_id
HAVING review_count > 0
ORDER BY avg_rating DESC
LIMIT 5
";

$stmt = $conn->prepare($sqlBestVenue);
if ($typesVenue) $stmt->bind_param($typesVenue, ...$paramsVenue);
$stmt->execute();
$topBestVenue = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$sqlWorstVenue = "
SELECT 
    v.name,
    ROUND(AVG(rv.rating),1) AS avg_rating,
    COUNT(rv.rating) AS review_count
FROM venues v
LEFT JOIN branches b ON v.branch_id = b.branch_id
LEFT JOIN provinces p ON b.province_id = p.province_id
LEFT JOIN region r ON p.region_id = r.region_id
LEFT JOIN review rv 
    ON rv.venue_id = v.venue_id
    $reviewDateVenue
$whereSQL_Venue
GROUP BY v.venue_id
HAVING review_count > 0
ORDER BY avg_rating ASC
LIMIT 5
";

$stmt = $conn->prepare($sqlWorstVenue);
if ($typesVenue) $stmt->bind_param($typesVenue, ...$paramsVenue);
$stmt->execute();
$topWorstVenue = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);



/* =========================================================
   EXPIRING SOON
========================================================= */

$whereExpire = $whereEquip;        // reuse filter logic
$paramsExpire = $paramsEquip;
$typesExpire  = $typesEquip;

/* เพิ่มเงื่อนไขวันหมดอายุ */
$whereExpire[] = "ei.expiry_date BETWEEN CURDATE() 
                  AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)";

$whereSQL_Expire = "WHERE " . implode(" AND ", $whereExpire);

$sqlExpire = "
SELECT em.name,
       COUNT(ei.instance_code) total
FROM equipment_instances ei
JOIN equipment_master em ON ei.equipment_id = em.equipment_id
LEFT JOIN branches b ON ei.branch_id = b.branch_id
LEFT JOIN provinces p ON b.province_id = p.province_id
LEFT JOIN region r ON p.region_id = r.region_id
$whereSQL_Expire
GROUP BY em.equipment_id
ORDER BY total DESC
LIMIT 5
";

$stmt = $conn->prepare($sqlExpire);
if ($typesExpire) $stmt->bind_param($typesExpire, ...$paramsExpire);
$stmt->execute();
$expiring = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

/* =========================================================
   CATEGORY POPULAR
========================================================= */

$whereCategory = [];
$paramsCategory = [];
$typesCategory  = "";

/* location filter */
if ($region_id !== "") {
    $whereCategory[] = "r.region_id = ?";
    $paramsCategory[] = (int)$region_id;
    $typesCategory .= "i";
}

if ($province_id !== "") {
    $whereCategory[] = "p.province_id = ?";
    $paramsCategory[] = (int)$province_id;
    $typesCategory .= "i";
}

if ($branch_id !== "") {
    $whereCategory[] = "b.branch_id = ?";
    $paramsCategory[] = $branch_id;
    $typesCategory .= "s";
}

/* filter category */
if ($category_id !== "") {
    $whereCategory[] = "c.category_id = ?";
    $paramsCategory[] = (int)$category_id;
    $typesCategory .= "i";
}

/* filter equipment */
if ($equipment_id !== "") {
    $whereCategory[] = "em.equipment_id = ?";
    $paramsCategory[] = $equipment_id;
    $typesCategory .= "s";
}

$whereSQL_Category = count($whereCategory)
    ? "WHERE " . implode(" AND ", $whereCategory)
    : "";

$sqlCategory = "
SELECT c.name, COUNT(DISTINCT bd.detail_id) total
FROM booking_details bd
JOIN bookings bk ON bd.booking_id = bk.booking_id
JOIN branches b ON bk.branch_id = b.branch_id
JOIN provinces p ON b.province_id = p.province_id
JOIN region r ON p.region_id = r.region_id
JOIN equipment_master em ON bd.equipment_id = em.equipment_id
JOIN categories c ON em.category_id = c.category_id
$whereSQL_Category
GROUP BY c.category_id
ORDER BY total DESC
LIMIT 5
";


$stmt = $conn->prepare($sqlCategory);
if ($typesCategory) $stmt->bind_param($typesCategory, ...$paramsCategory);
$stmt->execute();
$catRes = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$catLabels = [];
$catData = [];

foreach ($catRes as $row) {
    $catLabels[] = $row["name"];
    $catData[] = (int)$row["total"];
}


/* =========================================================
   RESPONSE
========================================================= */

echo json_encode([
    "kpi" => array_merge($kpiEquip, $venueKpi),
    "top_best_equipment"  => $topBestEquip,
    "top_worst_equipment" => $topWorstEquip,
    "top_best_venue"      => $topBestVenue,
    "top_worst_venue"     => $topWorstVenue,
    "expiring_soon"       => $expiring,
    "category_popular"    => [
        "labels" => $catLabels,
        "data"   => $catData
    ]
]);

} catch (Throwable $e) {
    echo json_encode([
        "error" => true,
        "message" => $e->getMessage()
    ]);
}

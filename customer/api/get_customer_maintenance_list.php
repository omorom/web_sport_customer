<?php
session_start();
require_once "../../database.php";

header("Content-Type: application/json; charset=utf-8");
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {

    // ================== AUTH ==================
    if (!isset($_SESSION["customer_id"])) {
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized"
        ]);
        exit;
    }

    $customerId = $_SESSION["customer_id"];
    $branchId   = $_SESSION["branch_id"] ?? null;

    if (!$branchId) {
        echo json_encode([
            "success" => false,
            "message" => "No branch selected"
        ]);
        exit;
    }

    // ================== FILTERS ==================
    $search   = $_GET["q"] ?? null;
    $statusId = $_GET["status_id"] ?? null;
    $damageId = $_GET["damage_id"] ?? null;

    // ================== BASE QUERY ==================
    $sql = "
        SELECT 
            m.log_id,
            m.instance_code,
            m.description,
            m.report_date,
            d.name_th AS damage_name_th,
            s.name_th AS status_name_th
        FROM maintenance_logs m
        LEFT JOIN damage_levels d 
            ON m.damage_id = d.damage_id
        LEFT JOIN maintenance_status s 
            ON m.status_id = s.status_id
        WHERE m.reported_by_customer_id = ?
        AND m.branch_id = ?
    ";

    // customer_id = int
    // branch_id   = string (เช่น B003)
    $params = [$customerId, $branchId];
    $types  = "ss";

    // ================== STATUS FILTER ==================
    if (!empty($statusId)) {
        $sql .= " AND m.status_id = ?";
        $params[] = (int)$statusId;
        $types .= "i";
    }

    // ================== DAMAGE FILTER ==================
    if (!empty($damageId)) {
        $sql .= " AND m.damage_id = ?";
        $params[] = (int)$damageId;
        $types .= "i";
    }

    // ================== SEARCH FILTER ==================
    if (!empty($search)) {
        $sql .= " AND (m.instance_code LIKE ? OR m.description LIKE ?)";
        $searchParam = "%{$search}%";
        $params[] = $searchParam;
        $params[] = $searchParam;
        $types .= "ss";
    }

    $sql .= " ORDER BY m.report_date DESC";

    // ================== EXECUTE ==================
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();

    $result = $stmt->get_result();
    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

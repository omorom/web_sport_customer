<?php
require_once "../../database.php";
header("Content-Type: application/json; charset=utf-8");

try {

    $category_id = $_GET["category_id"] ?? null;

    $sql = "SELECT equipment_id, name 
            FROM equipment_master";

    $params = [];
    $types = "";

    if (!empty($category_id)) {
        $sql .= " WHERE category_id = ?";
        $params[] = (int)$category_id;
        $types .= "i";
    }

    $sql .= " ORDER BY name ASC";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception($conn->error);
    }

    if ($types) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $rows = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $rows
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

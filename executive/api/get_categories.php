<?php
require_once "../../database.php";
header("Content-Type: application/json; charset=utf-8");

try {

    $sql = "SELECT category_id, TRIM(name) AS name 
            FROM categories
            ORDER BY name ASC";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception($conn->error);
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

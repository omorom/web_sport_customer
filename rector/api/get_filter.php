<?php
header('Content-Type: application/json');
require_once '../../database.php';

$filters = [];


$facRes = $conn->query("SELECT id, name FROM faculty ORDER BY name ASC");
$filters['faculties'] = $facRes->fetch_all(MYSQLI_ASSOC);

$catRes = $conn->query("SELECT category_id AS id, name FROM categories ORDER BY name ASC");
$filters['categories'] = $catRes->fetch_all(MYSQLI_ASSOC);

$typeRes = $conn->query("SELECT id, name_th AS name FROM booking_types ORDER BY id ASC");
$filters['booking_types'] = $typeRes->fetch_all(MYSQLI_ASSOC);

echo json_encode($filters);
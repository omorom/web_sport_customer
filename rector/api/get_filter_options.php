<?php
require_once "../../database.php";
header("Content-Type: application/json; charset=utf-8");

// faculty
$faculty = [];
$res = $conn->query("SELECT id, name FROM faculty ORDER BY name");
while ($r = $res->fetch_assoc()) {
    $faculty[] = $r;
}

// year
$year = [];
$res = $conn->query("SELECT DISTINCT study_year FROM customers ORDER BY study_year");
while ($r = $res->fetch_assoc()) {
    $year[] = (int)$r['study_year'];
}

// gender
$gender = [];
$res = $conn->query("SELECT gender_id AS id, name_th AS name FROM genders");
while ($r = $res->fetch_assoc()) {
    $gender[] = $r;
}

echo json_encode([
    "faculty" => $faculty,
    "year" => $year,
    "gender" => $gender
]);
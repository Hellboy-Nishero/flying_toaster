<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$request = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

$path = parse_url($request, PHP_URL_PATH);
$path = str_replace('/api', '', $path);

if ($path === '') {
    $path = '/';
}

switch ($path) {
    case '/':
    case '/index.php':
        if ($method === 'GET') {
            echo json_encode(['message' => 'Flying Toaster API', 'version' => '1.0']);
            break;
        }

        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;

    case '/toasts':
        require_once 'db.php';
        require_once 'toasts.php';
        break;

    case '/settings':
        require_once 'db.php';
        require_once 'settings.php';
        break;

    case '/stats':
        require_once 'db.php';
        require_once 'stats.php';
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}
?>

<?php

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query('SELECT * FROM stats WHERE id = 1');
        $stats = $stmt->fetch();

        if (!$stats) {
            $pdo->exec('INSERT INTO stats (id, total_toasts, total_time, favorite_time) VALUES (1, 0, 0, 0)');
            $stats = ['id' => 1, 'total_toasts' => 0, 'total_time' => 0, 'favorite_time' => 0];
        }

        echo json_encode($stats);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'No data provided']);
            break;
        }

        $fields = [];
        $values = [];

        if (isset($data['total_toasts'])) {
            $fields[] = 'total_toasts = ?';
            $values[] = intval($data['total_toasts']);
        }

        if (isset($data['total_time'])) {
            $fields[] = 'total_time = ?';
            $values[] = intval($data['total_time']);
        }

        if (isset($data['favorite_time'])) {
            $fields[] = 'favorite_time = ?';
            $values[] = intval($data['favorite_time']);
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No valid fields provided']);
            break;
        }

        $fields[] = 'updated_at = CURRENT_TIMESTAMP';
        $values[] = 1;

        $stmt = $pdo->prepare('UPDATE stats SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $stmt->execute($values);

        echo json_encode(['message' => 'Statistics updated successfully']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

<?php

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare('SELECT * FROM toasts WHERE id = ?');
            $stmt->execute([$_GET['id']]);
            $toast = $stmt->fetch();
            echo json_encode($toast ?: ['error' => 'Toast not found']);
            break;
        }

        $conditions = [];
        $params = [];

        if (isset($_GET['status'])) {
            $conditions[] = 'status = ?';
            $params[] = $_GET['status'];
        }

        if (isset($_GET['temperature_min'])) {
            $conditions[] = 'temperature >= ?';
            $params[] = intval($_GET['temperature_min']);
        }

        if (isset($_GET['temperature_max'])) {
            $conditions[] = 'temperature <= ?';
            $params[] = intval($_GET['temperature_max']);
        }

        $sql = 'SELECT id, status, time_minutes, toasts_amount, temperature FROM toasts';
        if (!empty($conditions)) {
            $sql .= ' WHERE ' . implode(' AND ', $conditions);
        }
        $sql .= ' ORDER BY id DESC';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !isset($data['time_minutes']) || !isset($data['toasts_amount']) || !isset($data['temperature'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields: time_minutes, toasts_amount, temperature']);
            break;
        }

        $temperature = intval($data['temperature']);
        $timeMinutes = intval($data['time_minutes']);
        $toastsAmount = intval($data['toasts_amount']);

        if ($timeMinutes < 0 || $toastsAmount <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'time_minutes must be >= 0 and toasts_amount must be > 0']);
            break;
        }

        if ($temperature < 200 || $temperature > 500) {
            http_response_code(400);
            echo json_encode(['error' => 'temperature must be between 200 and 500']);
            break;
        }

        $status = $data['status'] ?? null;
        if (!$status) {
            if ($timeMinutes === 0) {
                $status = 'untoasted';
            } elseif ($timeMinutes <= 15) {
                $status = 'lightly toasted';
            } elseif ($timeMinutes < 30) {
                $status = 'strong toasted';
            } else {
                $status = 'burnt';
            }
        }

        $stmt = $pdo->prepare("
            INSERT INTO toasts (status, time_minutes, toasts_amount, temperature)
            VALUES (?, ?, ?, ?)
            RETURNING id
        ");

        $stmt->execute([
            $status,
            $timeMinutes,
            $toastsAmount,
            $temperature,
        ]);

        $id = $stmt->fetchColumn();
        echo json_encode(['id' => $id, 'message' => 'Toast usage recorded successfully']);
        break;

    case 'PUT':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Toast ID required']);
            break;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'No data provided']);
            break;
        }

        $allowedFields = [
            'status' => 'status',
            'time_minutes' => 'time_minutes',
            'toasts_amount' => 'toasts_amount',
            'temperature' => 'temperature',
        ];

        $fields = [];
        $params = [];

        foreach ($allowedFields as $fieldKey => $columnName) {
            if (array_key_exists($fieldKey, $data)) {
                $fields[] = "$columnName = ?";
                $params[] = $data[$fieldKey];
            }
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No valid fields provided for update']);
            break;
        }

        $sql = 'UPDATE toasts SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $params[] = $_GET['id'];

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        echo json_encode(['message' => 'Toast record updated successfully']);
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Toast ID required']);
            break;
        }

        $stmt = $pdo->prepare('DELETE FROM toasts WHERE id = ?');
        $stmt->execute([$_GET['id']]);

        echo json_encode(['message' => 'Toast deleted successfully']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Gibt alle Einstellungen oder eine bestimmte Einstellung zurueck.
        if (isset($_GET['key'])) {
            $stmt = $pdo->prepare("SELECT * FROM settings WHERE key = ?");
            $stmt->execute([$_GET['key']]);
            $setting = $stmt->fetch();
            echo json_encode($setting ?: ['error' => 'Setting not found']);
        } else {
            $stmt = $pdo->query("SELECT * FROM settings ORDER BY key");
            $settings = $stmt->fetchAll();
            echo json_encode($settings);
        }
        break;

    case 'POST':
    case 'PUT':
        // Erstellt oder aktualisiert eine Einstellung.
        $data = json_decode(file_get_contents('php://input'), true);

        if (!$data || !isset($data['key']) || !isset($data['value'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields: key, value']);
            break;
        }

        $stmt = $pdo->prepare("
            INSERT INTO settings (key, value, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT (key) DO UPDATE SET
                value = EXCLUDED.value,
                updated_at = CURRENT_TIMESTAMP
        ");

        $stmt->execute([$data['key'], $data['value']]);
        echo json_encode(['message' => 'Setting saved successfully']);
        break;

    case 'DELETE':
        // Loescht eine Einstellung.
        if (!isset($_GET['key'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Setting key required']);
            break;
        }

        $stmt = $pdo->prepare("DELETE FROM settings WHERE key = ?");
        $stmt->execute([$_GET['key']]);

        echo json_encode(['message' => 'Setting deleted successfully']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>

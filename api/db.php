<?php

$host = getenv('DB_HOST') ?: 'db';
$dbname = getenv('DB_NAME') ?: 'flying_toaster_db';
$user = getenv('DB_USER') ?: 'postgres';
$password = getenv('DB_PASSWORD') ?: 'postgres';
$port = getenv('DB_PORT') ?: '5432';

try {
    $pdo = new PDO(
        "pgsql:host=$host;port=$port;dbname=$dbname",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

$initSql = "
CREATE TABLE IF NOT EXISTS toasts (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'untoasted',
    time_minutes INTEGER NOT NULL,
    toasts_amount INTEGER NOT NULL,
    temperature INTEGER NOT NULL DEFAULT 200
);

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY,
    total_toasts INTEGER DEFAULT 0,
    total_time INTEGER DEFAULT 0,
    favorite_time INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS toasts
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'untoasted',
    ADD COLUMN IF NOT EXISTS time_minutes INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS toasts_amount INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS temperature INTEGER NOT NULL DEFAULT 200,
    DROP COLUMN IF EXISTS username,
    DROP COLUMN IF EXISTS user_email,
    DROP COLUMN IF EXISTS shafts,
    DROP COLUMN IF EXISTS color,
    DROP COLUMN IF EXISTS device,
    DROP COLUMN IF EXISTS user_agent,
    DROP COLUMN IF EXISTS ip_address,
    DROP COLUMN IF EXISTS notes,
    DROP COLUMN IF EXISTS created_at,
    DROP COLUMN IF EXISTS updated_at;

INSERT INTO stats (id, total_toasts, total_time, favorite_time)
VALUES (1, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;
";

try {
    $pdo->exec($initSql);
} catch (PDOException $e) {
    error_log('Database initialization failed: ' . $e->getMessage());
}

-- V10__Create_Push_Subscriptions_Table.sql
-- Web Push Subscriptions and Notification Delivery Tracking

CREATE TABLE push_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    festival_id BIGINT REFERENCES festivals(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    endpoint VARCHAR(1000) NOT NULL UNIQUE,
    p256dh_key VARCHAR(500) NOT NULL,
    auth_key VARCHAR(500) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    last_success_at TIMESTAMP,
    last_failure_at TIMESTAMP,
    failure_count INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_push_sub_festival ON push_subscriptions(festival_id);
CREATE INDEX idx_push_sub_enabled ON push_subscriptions(enabled);
CREATE INDEX idx_push_sub_endpoint ON push_subscriptions(endpoint);

-- Alter festival_notifications to track push broadcast status & prevent duplicate sends
ALTER TABLE festival_notifications ADD COLUMN IF NOT EXISTS send_push BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE festival_notifications ADD COLUMN IF NOT EXISTS push_sent BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE festival_notifications ADD COLUMN IF NOT EXISTS push_sent_at TIMESTAMP;

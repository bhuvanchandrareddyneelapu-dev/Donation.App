-- V9__Create_Festival_Notifications_Table.sql
-- Live Festival Notification & Smart Popup System for Donation.App

CREATE TABLE festival_notifications (
    id BIGSERIAL PRIMARY KEY,
    festival_id BIGINT NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    scheduled_start TIMESTAMP,
    scheduled_end TIMESTAMP,
    event_date DATE,
    event_time TIME,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    dismissible BOOLEAN NOT NULL DEFAULT TRUE,
    repeat_mode VARCHAR(30) NOT NULL DEFAULT 'ONCE_PER_SESSION',
    display_duration_seconds INT DEFAULT 10,
    action_label VARCHAR(100),
    action_url VARCHAR(255),
    created_by VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fest_notif_festival_id ON festival_notifications(festival_id);
CREATE INDEX idx_fest_notif_enabled ON festival_notifications(enabled);
CREATE INDEX idx_fest_notif_priority ON festival_notifications(priority);
CREATE INDEX idx_fest_notif_schedule ON festival_notifications(scheduled_start, scheduled_end);
CREATE INDEX idx_fest_notif_event_date ON festival_notifications(event_date);

-- Seed initial sample notifications for Unicode Estates Ganesh Chaturthi 2026 (Festival ID 1)
INSERT INTO festival_notifications (
    festival_id, title, message, notification_type, priority,
    scheduled_start, scheduled_end, event_date, event_time,
    enabled, dismissible, repeat_mode, display_duration_seconds,
    action_label, action_url, created_by, created_at, updated_at
) VALUES 
(
    1, 
    'Ganesh Chaturthi Countdown', 
    '🪔 Ganesh Chaturthi celebrations are approaching! Get ready for Bappa''s grand arrival at Unicode Estates.', 
    'FESTIVAL_COUNTDOWN', 
    'HIGH', 
    '2026-09-01 00:00:00', '2026-09-14 23:59:59', 
    '2026-09-14', NULL, 
    TRUE, TRUE, 'ONCE_PER_DAY', 10, 
    'View Festival Details', '/donate', 
    'SYSTEM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    1, 
    'Grand Ganesh Sthapana & Morning Puja', 
    '🙏 Morning Sthapana Puja begins at 7:00 AM. Residents are requested to gather near the Ganesh Mandap.', 
    'PUJA_REMINDER', 
    'HIGH', 
    '2026-09-14 05:00:00', '2026-09-14 11:00:00', 
    '2026-09-14', '07:00:00', 
    TRUE, TRUE, 'ONCE_PER_SESSION', 12, 
    'View Puja Schedule', '/donate', 
    'SYSTEM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    1, 
    'Mandap Decoration Drive', 
    '🌸 Mandap decoration starts at 5:00 PM today. All residents are welcome to join and support the team.', 
    'DECORATION', 
    'NORMAL', 
    '2026-09-13 14:00:00', '2026-09-13 20:00:00', 
    '2026-09-13', '17:00:00', 
    TRUE, TRUE, 'ONCE_PER_SESSION', 8, 
    'Join Volunteer Group', '/community', 
    'SYSTEM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    1, 
    'Cultural & Music Night', 
    '🎶 Today''s Cultural Program starts at 5:00 PM. Children and adults performances near celebration area.', 
    'CULTURAL_PROGRAM', 
    'NORMAL', 
    '2026-09-15 15:00:00', '2026-09-15 22:00:00', 
    '2026-09-15', '17:00:00', 
    TRUE, TRUE, 'ONCE_PER_SESSION', 10, 
    'See Program Details', '/donate', 
    'SYSTEM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    1, 
    'Classical Dance Performances', 
    '💃 Classical and Group Dance performances begin at 7:30 PM. Please gather near the main stage.', 
    'DANCE_PROGRAM', 
    'NORMAL', 
    '2026-09-16 17:00:00', '2026-09-16 23:00:00', 
    '2026-09-16', '19:30:00', 
    TRUE, TRUE, 'ONCE_PER_SESSION', 10, 
    'View Events', '/donate', 
    'SYSTEM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);

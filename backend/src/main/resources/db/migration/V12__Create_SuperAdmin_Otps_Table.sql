-- Flyway Migration V12: Create SuperAdmin OTPs Table for Secure Password & Phone Recovery

CREATE TABLE IF NOT EXISTS superadmin_otps (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp_hash VARCHAR(255) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    target_phone VARCHAR(50),
    attempts INT DEFAULT 0,
    used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_superadmin_otps_user_purpose ON superadmin_otps(user_id, purpose);

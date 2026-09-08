-- V7__Add_Donation_Audit_Log.sql
CREATE TABLE IF NOT EXISTS donation_audit_log (
    id BIGSERIAL PRIMARY KEY,
    donation_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_amount NUMERIC(12, 2),
    new_amount NUMERIC(12, 2),
    reason VARCHAR(500),
    performed_by VARCHAR(255) NOT NULL,
    performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_donation_audit_log_donation FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_donation_audit_log_donation_id ON donation_audit_log(donation_id);

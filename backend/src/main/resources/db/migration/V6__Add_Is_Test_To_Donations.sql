-- V6__Add_Is_Test_To_Donations.sql
ALTER TABLE donations ADD COLUMN IF NOT EXISTS is_test BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_donations_test ON donations(is_test);

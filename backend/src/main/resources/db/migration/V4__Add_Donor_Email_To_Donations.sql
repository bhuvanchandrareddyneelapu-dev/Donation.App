-- Migration V4: Add donor_email column to donations table
ALTER TABLE donations ADD COLUMN IF NOT EXISTS donor_email VARCHAR(255);

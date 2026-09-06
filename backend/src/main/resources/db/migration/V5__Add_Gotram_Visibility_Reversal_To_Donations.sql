-- Migration V5: Add Gotram, Family Details, Public Visibility, and Reversal columns to donations table
ALTER TABLE donations ADD COLUMN IF NOT EXISTS gotram VARCHAR(255);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS family_details VARCHAR(500);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS public_visibility BOOLEAN DEFAULT TRUE;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS is_reversed BOOLEAN DEFAULT FALSE;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS reversed_by VARCHAR(255);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS reversed_at TIMESTAMP;
ALTER TABLE donations ADD COLUMN IF NOT EXISTS reversal_reason VARCHAR(500);
ALTER TABLE donations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

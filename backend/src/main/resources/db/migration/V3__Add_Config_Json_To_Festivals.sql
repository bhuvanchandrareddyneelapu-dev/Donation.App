-- Flyway Migration V3: Add config_json column to festivals table for dynamic admin festival management
ALTER TABLE festivals ADD COLUMN IF NOT EXISTS config_json TEXT;

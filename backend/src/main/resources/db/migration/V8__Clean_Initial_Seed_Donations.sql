-- V8__Clean_Initial_Seed_Donations.sql
-- Safe Flyway migration to clear initial V2 seed demo donations for Festival ID 1 on production/Render deployment
-- Ensures initial collection state starts at strictly ₹0 Collected / ₹0 Target / 0% Progress

DELETE FROM receipts WHERE donation_id IN (SELECT id FROM donations WHERE festival_id = 1);
DELETE FROM cash_donation_logs WHERE donation_id IN (SELECT id FROM donations WHERE festival_id = 1);
DELETE FROM donation_audit_log WHERE donation_id IN (SELECT id FROM donations WHERE festival_id = 1);
DELETE FROM donations WHERE festival_id = 1;
UPDATE festivals SET target_amount = 0.00, current_collection = 0.00 WHERE id = 1;

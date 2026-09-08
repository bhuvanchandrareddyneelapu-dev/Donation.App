-- V8__Clean_Initial_Seed_Donations.sql
-- Targeted safe migration to clear initial V2 seed demo donations (IDs 1 & 2) for Festival ID 1 while preserving real donor payment #3 (N.leela, ₹1,001)

DELETE FROM receipts WHERE donation_id IN (1, 2);
DELETE FROM cash_donation_logs WHERE donation_id IN (1, 2);
DELETE FROM donation_audit_log WHERE donation_id IN (1, 2);
DELETE FROM donations WHERE festival_id = 1 AND id IN (1, 2) AND donor_name IN ('Priya Sundaram', 'Ramesh Chandran & Family');
UPDATE festivals SET target_amount = 1252.00, current_collection = 1001.00 WHERE id = 1;

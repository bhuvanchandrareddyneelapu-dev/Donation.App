-- Flyway Migration V11: Clean Seed Expenses & Add Committee RBAC Support

-- 1. Remove initial demo seeded expenses while preserving real expenses
DELETE FROM expense_proofs WHERE expense_id IN (
    SELECT id FROM expenses WHERE title IN (
        'Eco-friendly Floral Pandal & Theme Decor',
        'Daily 24x7 Mahaprasadam & Modak Kitchen (15,000 Devotees)'
    )
);

DELETE FROM expenses WHERE title IN (
    'Eco-friendly Floral Pandal & Theme Decor',
    'Daily 24x7 Mahaprasadam & Modak Kitchen (15,000 Devotees)'
);

-- 2. Ensure schema enhancements on expenses table
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'VERIFIED';
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 3. Ensure seed committee users exist with proper roles
INSERT INTO users (name, email, phone, password, role, created_at) VALUES
('Super Admin', 'superadmin@donation.app', '+91 9876543210', '$2a$10$w9G.x3f98R76.99128sJ.u1', 'SUPER_ADMIN', CURRENT_TIMESTAMP),
('Org Admin', 'admin@donation.app', '+91 9876543215', '$2a$10$w9G.x3f98R76.99128sJ.u1', 'ADMIN', CURRENT_TIMESTAMP),
('Festival Admin', 'festivaladmin@donation.app', '+91 9876543211', '$2a$10$w9G.x3f98R76.99128sJ.u1', 'FESTIVAL_ADMIN', CURRENT_TIMESTAMP),
('Volunteer User', 'volunteer@donation.app', '+91 9876543213', '$2a$10$w9G.x3f98R76.99128sJ.u1', 'VOLUNTEER', CURRENT_TIMESTAMP)
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;

-- Flyway Migration V2: Seed Data for Ganesh Chaturthi and Dasara (Version 1)

INSERT INTO users (id, name, email, phone, password, role, created_at) VALUES
(1, 'Vikramaditya Sharma', 'superadmin@donation.app', '+91 9876543210', '$2a$10$w9G.x3f98R76.99128sJ.u1', 'SUPER_ADMIN', CURRENT_TIMESTAMP),
(2, 'Rajesh Kulkarni', 'festivaladmin@donation.app', '+91 9876543211', '$2a$10$w9G.x3f98R76.99128sJ.u1', 'FESTIVAL_ADMIN', CURRENT_TIMESTAMP),
(3, 'Sunil Deshmukh', 'treasurer@donation.app', '+91 9876543212', '$2a$10$w9G.x3f98R76.99128sJ.u1', 'TREASURER', CURRENT_TIMESTAMP),
(4, 'Aarav Patel', 'volunteer@donation.app', '+91 9876543213', '$2a$10$w9G.x3f98R76.99128sJ.u1', 'VOLUNTEER', CURRENT_TIMESTAMP),
(5, 'Priya Sundaram', 'donor@donation.app', '+91 9876543214', '$2a$10$w9G.x3f98R76.99128sJ.u1', 'DONOR', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO organizations (id, name, org_type, registration_no, contact_email, phone, address, created_at) VALUES
(1, 'Lalbaugcha Raja Sarvajanik Ganeshotsav Mandal', 'FESTIVAL_COMMITTEE', 'REG/MH/2026/8941', 'contact@lalbaugcharaja.org', '+91 22 2471 3456', 'Lalbaug, Parel, Mumbai, Maharashtra 400012', CURRENT_TIMESTAMP),
(2, 'Mysore Dasara Executive Committee', 'FESTIVAL_COMMITTEE', 'REG/KA/2026/1102', 'info@mysoredasara.gov.in', '+91 821 242 1234', 'Mysore Palace Premises, Mysuru, Karnataka 570001', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO festivals (id, organization_id, name, festival_type, banner_url, idol_image_url, description, venue, organizer, target_amount, current_collection, installation_date, immersion_date, active, created_at) VALUES
(1, 1, 'Unicode Estates Ganesh Chaturthi Celebrations 2026', 'GANESH_CHATURTHI', '/assets/images/unicode-estates-ganesh-idol.png', '/assets/images/unicode-estates-ganesh-idol.png', 'Come together with our Unicode Estates community to celebrate Ganpati Bappa with devotion, joy, togetherness and new beginnings.', 'Unicode Estates', 'Unicode Estates Cultural & Festival Committee', 0.00, 0.00, '2026-09-14', '2026-09-24', true, CURRENT_TIMESTAMP),
(2, 2, 'Grand Mysore Dasara & Navaratri Festival 2026', 'DASARA', 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=1200', 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800', 'World-famous 10-day Mysore Dasara celebration featuring illuminated Mysore Palace, Jumboo Savari procession, and Chamundeshwari Temple pujas.', 'Mysore Palace Grounds, Mysuru', 'Mysore Dasara Committee', 0.00, 0.00, '2026-10-15', '2026-10-24', true, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;



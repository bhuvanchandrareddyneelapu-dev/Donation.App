-- Flyway Migration V2: Seed Data for Ganesh Chaturthi and Dasara (Version 1)

INSERT INTO users (id, name, email, phone, password, role) VALUES
(1, 'Vikramaditya Sharma', 'superadmin@donation.app', '+91 9876543210', '$2a$10$w9G.x3f98R76.99128sJ.u1', 'SUPER_ADMIN'),
(2, 'Rajesh Kulkarni', 'festivaladmin@donation.app', '+91 9876543211', '$2a$10$w9G.x3f98R76.99128sJ.u1', 'FESTIVAL_ADMIN'),
(3, 'Sunil Deshmukh', 'treasurer@donation.app', '+91 9876543212', '$2a$10$w9G.x3f98R76.99128sJ.u1', 'TREASURER'),
(4, 'Aarav Patel', 'volunteer@donation.app', '+91 9876543213', '$2a$10$w9G.x3f98R76.99128sJ.u1', 'VOLUNTEER'),
(5, 'Priya Sundaram', 'donor@donation.app', '+91 9876543214', '$2a$10$w9G.x3f98R76.99128sJ.u1', 'DONOR');

INSERT INTO organizations (id, name, org_type, registration_no, contact_email, phone, address) VALUES
(1, 'Lalbaugcha Raja Sarvajanik Ganeshotsav Mandal', 'FESTIVAL_COMMITTEE', 'REG/MH/2026/8941', 'contact@lalbaugcharaja.org', '+91 22 2471 3456', 'Lalbaug, Parel, Mumbai, Maharashtra 400012'),
(2, 'Mysore Dasara Executive Committee', 'FESTIVAL_COMMITTEE', 'REG/KA/2026/1102', 'info@mysoredasara.gov.in', '+91 821 242 1234', 'Mysore Palace Premises, Mysuru, Karnataka 570001');

INSERT INTO festivals (id, organization_id, name, festival_type, banner_url, idol_image_url, description, venue, organizer, target_amount, current_collection, installation_date, immersion_date, active) VALUES
(1, 1, 'Grand Ganesh Chaturthi Mahotsav 2026', 'GANESH_CHATURTHI', 'https://images.unsplash.com/photo-1605626830588-4663e26b1c5a?w=1200', 'https://images.unsplash.com/photo-1605626830588-4663e26b1c5a?w=800', 'Celebrating 92 years of divine grand Ganeshotsav with 24x7 Mahaprasadam, free medical camps, and community blood donation drives.', 'Lalbaug Ground, Mumbai', 'Lalbaugcha Raja Executive Committee', 5000000.00, 3450000.00, '2026-09-14', '2026-09-24', true),
(2, 2, 'Grand Mysore Dasara & Navaratri Festival 2026', 'DASARA', 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=1200', 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800', 'World-famous 10-day Mysore Dasara celebration featuring illuminated Mysore Palace, Jumboo Savari procession, and Chamundeshwari Temple pujas.', 'Mysore Palace Grounds, Mysuru', 'Mysore Dasara Committee', 4000000.00, 2650000.00, '2026-10-15', '2026-10-24', true);

-- Flyway Migration V1: Initial Normalized Schema for Donation.app Version 1

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    profile_pic VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    org_type VARCHAR(100),
    registration_no VARCHAR(100),
    logo_url VARCHAR(500),
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    address VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS festivals (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    festival_type VARCHAR(50) NOT NULL, -- GANESH_CHATURTHI or DASARA
    banner_url VARCHAR(500),
    idol_image_url VARCHAR(500),
    description TEXT,
    venue VARCHAR(255),
    organizer VARCHAR(255),
    target_amount NUMERIC(15, 2) NOT NULL,
    current_collection NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    installation_date DATE,
    immersion_date DATE,
    qr_code_url VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donations (
    id BIGSERIAL PRIMARY KEY,
    festival_id BIGINT NOT NULL REFERENCES festivals(id),
    donor_id BIGINT REFERENCES users(id),
    donor_name VARCHAR(255) NOT NULL,
    donor_phone VARCHAR(50) NOT NULL,
    donor_address VARCHAR(500),
    amount NUMERIC(15, 2) NOT NULL,
    payment_type VARCHAR(50) NOT NULL, -- ONLINE or CASH
    payment_status VARCHAR(50) NOT NULL, -- PENDING, VERIFIED, COMPLETED
    transaction_id VARCHAR(100),
    is_anonymous BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    recorded_by_volunteer_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cash_donation_logs (
    id BIGSERIAL PRIMARY KEY,
    donation_id BIGINT NOT NULL REFERENCES donations(id),
    volunteer_id BIGINT NOT NULL REFERENCES users(id),
    verified_by_treasurer_id BIGINT REFERENCES users(id),
    status VARCHAR(50) NOT NULL,
    deposit_reference VARCHAR(100),
    verification_date TIMESTAMP,
    remarks TEXT,
    offline_synced BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS receipts (
    id BIGSERIAL PRIMARY KEY,
    donation_id BIGINT NOT NULL REFERENCES donations(id),
    receipt_number VARCHAR(100) NOT NULL UNIQUE,
    qr_code_hash VARCHAR(255) NOT NULL,
    pdf_url VARCHAR(500),
    generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expenses (
    id BIGSERIAL PRIMARY KEY,
    festival_id BIGINT NOT NULL REFERENCES festivals(id),
    category VARCHAR(50) NOT NULL, -- DECORATION, LIGHTING, SOUND, FOOD, STAGE, GENERATOR, MISC
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    vendor_name VARCHAR(255),
    paid_by VARCHAR(255),
    approved_by VARCHAR(255),
    payment_date DATE NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expense_proofs (
    id BIGSERIAL PRIMARY KEY,
    expense_id BIGINT NOT NULL REFERENCES expenses(id),
    proof_type VARCHAR(50), -- INVOICE, BILL, RECEIPT
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255),
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS volunteers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    festival_id BIGINT NOT NULL REFERENCES festivals(id),
    assigned_area VARCHAR(255),
    qr_badge_code VARCHAR(100) NOT NULL UNIQUE,
    daily_target NUMERIC(15, 2),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_images (
    id BIGSERIAL PRIMARY KEY,
    festival_id BIGINT NOT NULL REFERENCES festivals(id),
    album_name VARCHAR(100) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    uploaded_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_posts (
    id BIGSERIAL PRIMARY KEY,
    festival_id BIGINT NOT NULL REFERENCES festivals(id),
    author_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    media_url VARCHAR(500),
    media_type VARCHAR(50),
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    is_announcement BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS post_comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES community_posts(id),
    author_id BIGINT NOT NULL REFERENCES users(id),
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS festival_schedules (
    id BIGSERIAL PRIMARY KEY,
    festival_id BIGINT NOT NULL REFERENCES festivals(id),
    event_title VARCHAR(255) NOT NULL,
    date_time TIMESTAMP NOT NULL,
    location VARCHAR(255),
    description TEXT
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255),
    user_role VARCHAR(50),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

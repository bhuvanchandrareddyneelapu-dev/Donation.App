# API Documentation - Donation.app (Version 1)

**Base URL**: `/api/v1`

---

## 🔑 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /auth/login`
Authenticates committee members and issues a JWT token.
- **Request Body**:
  ```json
  {
    "email": "festivaladmin@donation.app",
    "password": "admin123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "id": 2,
    "name": "Festival Admin",
    "email": "festivaladmin@donation.app",
    "role": "FESTIVAL_ADMIN"
  }
  ```

---

## 🕉️ 2. Festival Endpoints (`/api/v1/festivals`)

### `GET /festivals`
Returns active Version 1 festivals (Ganesh Chaturthi & Dasara).
- **Response `200 OK`**: Array of `FestivalResponse` objects.

### `GET /festivals/{id}`
Returns details for a specific festival.

---

## 💳 3. Donation Endpoints (`/api/v1/donations`)

### `POST /donations/online`
Processes an online contribution and generates a digital receipt.
- **Request Body**:
  ```json
  {
    "festivalId": 1,
    "donorName": "Bhuvan",
    "donorPhone": "+91 98765 43210",
    "amount": 500.00,
    "paymentType": "ONLINE",
    "isAnonymous": false,
    "remarks": "Devotee contribution"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "id": 105,
    "receiptNumber": "GAN-2026-000245",
    "qrCodeHash": "HASH_QR_VERIFIED_770192",
    "donorName": "Bhuvan",
    "amount": 500.00,
    "paymentStatus": "COMPLETED"
  }
  ```

### `POST /donations/cash`
Records an on-ground cash collection by an assigned volunteer.
- **Request Body**:
  ```json
  {
    "festivalId": 1,
    "donorName": "Ramesh Kumar",
    "donorPhone": "+91 9443218765",
    "amount": 11000.00,
    "paymentType": "CASH",
    "remarks": "Recorded at Gate 2 counter"
  }
  ```

---

## 💵 4. Treasurer Cash Approvals (`/api/v1/cash-donations`)

### `GET /cash-donations/pending`
Returns pending cash collections requiring bank deposit verification. (Requires `TREASURER`, `FESTIVAL_ADMIN`, or `SUPER_ADMIN` role).

### `POST /cash-donations/verify`
Marks a cash collection verified and deposited into committee bank account.

---

## 🛡️ 5. Financial Transparency (`/api/v1/transparency`)

### `GET /transparency/festival/{id}/summary`
Returns collection total, itemized expenses, and remaining balance.

---

## 🔍 6. Public Receipt Verification (`/api/v1/receipts`)

### `GET /receipts/verify/{hashOrNumber}`
Verifies receipt authenticity via cryptographic hash or receipt number.

### `GET /receipts/{receiptNumber}/pdf`
Generates and downloads official signed PDF receipt.

---

## 📊 7. Reports Export (`/api/v1/reports`)

### `GET /reports/donations/pdf`
Downloads complete donation audit report in PDF format.

### `GET /reports/donations/csv`
Downloads complete donation audit report in CSV format.

### `GET /reports/expenses/csv`
Downloads line-item expense ledger in CSV format.

---

## 📱 8. Donor Phone OTP Portal (`/api/v1/donor`)

### `POST /donor/send-otp?phone={phone}`
Sends 4-digit OTP via WhatsApp to donor.

### `POST /donor/verify-otp?phone={phone}&otp={otp}`
Verifies OTP and returns donor's past contribution history.

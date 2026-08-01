# Donation.app (Version 1) - Enterprise Festival Management & Digital Transparency Platform

**Donation.app (Version 1)** is a production-ready, enterprise-grade digital donation, festival management, volunteer cash tracking, community engagement, and financial transparency platform designed **exclusively for Ganesh Chaturthi and Dasara (Dussehra)** organizing committees.

---

## 🏗️ Architecture Overview

```
+-----------------------------------------------------------------------------------+
|                              REACT 19 FRONTEND                                    |
|   HomePage (Ganesh & Dasara) | GaneshPage | DasaraPage | TransparencyPage         |
|   CommunityFeed | VerifyReceipt | Dashboard (5 Roles) | ReportsModal              |
+-----------------------------------------------------------------------------------+
                                      │  (Axios Interceptor + JWT)
                                      ▼
+-----------------------------------------------------------------------------------+
|                           SPRING BOOT 3 BACKEND (JAVA 21)                          |
|   Security (JWT + BCrypt) | Controllers | Services | Repositories | DataSeeder   |
+-----------------------------------------------------------------------------------+
       │                         │                        │                       │
       ▼                         ▼                        ▼                       ▼
  PostgreSQL / Flyway    Razorpay Service       WhatsApp Service        OpenPDF Receipt Engine
 (V1 Schema + V2 Seed)  (HMAC SHA256 Verify)  (Meta Cloud API Abstr.) (Cryptographic QR Hash)
```

---

## ✨ Features & Version 1 Scope

- **Supported Festivals (Version 1 Exclusive)**:
  - 🕉️ **Grand Ganesh Chaturthi Mahotsav** (`/ganesh`)
  - 🏹 **Grand Mysore Dasara & Navaratri Festival** (`/dasara`)
- **User Roles & RBAC (5 Roles)**:
  - `SUPER_ADMIN`, `FESTIVAL_ADMIN`, `TREASURER`, `VOLUNTEER`, `DONOR`
- **Dual Payment & Cash Flow**:
  - **Online Payments**: Razorpay order creation & HMAC-SHA256 signature verification (`RazorpayService.java`).
  - **Volunteer Cash Entry**: Mobile-optimized cash recorder with **Offline Queue Mode** (`offlineStore.ts`) for weak network areas.
  - **Treasurer Approval**: Verification & bank deposit reconciliation in `DashboardPage.tsx`.
- **Public Financial Transparency Portal**:
  - Line-item expense ledgers (Decoration, Sound, Lighting, Food/Prasadam, Stage, Generator, Permits).
  - Uploaded vendor bill & invoice proof image viewer modal.
  - Chart.js pie chart category breakdown (`ExpenseChart.tsx`).
- **Messaging & Notifications**:
  - WhatsApp Business API service abstraction (`WhatsAppService.java`) with Meta Cloud API environment variable configuration (`WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`).
- **Reports Export**:
  - Downloadable Donation & Expense Audit Reports in **PDF**, **Excel**, and **CSV** formats (`ReportsModal.tsx`).
- **Cryptographic PDF Receipts & QR Validation**:
  - OpenPDF receipt engine (`PdfReceiptService.java`) and public receipt hash verifier (`VerifyReceiptPage.tsx`).

---

## 🛠️ Environment Variables Configuration

| Variable Name | Description | Default / Example |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC Connection URL | `jdbc:postgresql://localhost:5432/donationappdb` |
| `SPRING_DATASOURCE_USERNAME` | Database User | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database Password | `postgrespassword` |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID | `rzp_test_key_12345` |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret | `rzp_test_secret_67890` |
| `WHATSAPP_API_TOKEN` | Meta WhatsApp Cloud API Token | `EAAG...` |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta WhatsApp Phone Number ID | `10599281...` |
| `DONATIONAPP_JWT_SECRET` | JWT Signing Secret Key | `404E635266556A586E327235...` |

---

## 🚀 Running Locally & Deployment Guide

### 1. Frontend Setup & Production Build
```bash
cd frontend
cmd /c npm install
cmd /c npm run build
```
Starts local dev server at `http://localhost:3000`.

### 2. Backend Setup
```bash
cd backend
java -jar target/donationapp-backend-1.0.0.jar
```
Swagger OpenAPI docs available at `http://localhost:8080/swagger-ui.html`.

### 3. Docker Compose Full Deployment
```bash
docker-compose up --build -d
```

---

## 🔑 Demo Credentials on Login Page (`/login`)

- **Super Admin**: `superadmin@donation.app` / `admin123`
- **Festival Admin**: `festivaladmin@donation.app` / `admin123`
- **Treasurer**: `treasurer@donation.app` / `treasurer123`
- **Volunteer**: `volunteer@donation.app` / `volunteer123`
- **Donor**: `donor@donation.app` / `donor123`

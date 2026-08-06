# Changelog - Donation.app

All notable changes to **Donation.app** will be documented in this file.

---

## [1.0.0] - 2026-08-02 (Production Release for Ganesh Chaturthi & Dasara)

### Added
- **Zero-Friction Public Donation Flow**: Donors browse `/`, `/ganesh`, or `/dasara` and donate in under 1 minute without registration.
- **High-Impact Festival Hero Banners**: Full-width photography of decorated Ganesh idol in floral mandap and Mysore Palace illumination.
- **Razorpay Integration & HMAC Verification**: Order creation and HMAC-SHA256 signature verification in `RazorpayService.java`.
- **Meta WhatsApp Business Cloud API Integration**: HTTPS REST client in `WhatsAppService.java` for dual message dispatch (Thank You + Receipt & Community Invite).
- **Phone-OTP Donor History Portal**: Donors access past contribution history at `/donor/history` via WhatsApp OTP without creating passwords.
- **Live Devotee Donor Wall**: Real-time recent contributions display (`DonorWall.tsx`) and live collection progress gauge.
- **Volunteer On-Ground Cash Workflow**: `CashDonationModal.tsx` with offline storage queue mode (`offlineStore.ts`).
- **Treasurer Deposit Approval**: Bank deposit reconciliation and pending cash approvals tab in `DashboardPage.tsx`.
- **Itemized Expense Transparency & Proof Viewer**: Line-item ledgers, Chart.js category pie charts, and uploaded vendor bill image modals.
- **Public Receipt Verification**: Authenticity lookup portal (`VerifyReceiptPage.tsx`) via receipt number or QR hash.
- **Audit Reports Export**: Single-click PDF and CSV export modal (`ReportsModal.tsx`).
- **Security & Rate Limiting**: `RateLimitingFilter.java` and `GlobalExceptionHandler.java`.
- **Flyway Database Migrations**: `V1__Init_Schema.sql` and `V2__Seed_Ganesh_Dasara.sql`.

---

## [Post-Festival Phase 3 Roadmap - Deferred]
- PWA & Mobile Push Notifications
- Apartment Welfare Association multi-event templates
- Temple Trust annual subscription passes
- Annadanam & Prasadam kitchen inventory management

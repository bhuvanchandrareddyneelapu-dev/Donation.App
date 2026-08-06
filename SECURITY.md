# Security Policy & Architecture - Donation.app

**Donation.app** follows enterprise security standards to protect financial records, user identities, and public audit integrity.

---

## 🛡️ 1. Security Architecture & Defenses

### Authentication & Authorization
- **JWT (JSON Web Tokens)**: Signed using HMAC-SHA256 with 24-hour expiration. Embedded user role claims strictly enforced via Spring Security 6 filter chain.
- **Password Encryption**: BCrypt salted password hashing with cost factor 10 (`BCryptPasswordEncoder`).

### Data Protection & Input Sanitization
- **SQL Injection Defenses**: All database queries execute via Spring Data JPA parameterized queries and Criteria API.
- **XSS (Cross-Site Scripting) Defenses**: Frontend inputs sanitized; React automatic HTML context escaping prevents inline script execution.
- **Payment Signature Integrity**: Razorpay webhook & order payments verified using HMAC-SHA256 signature algorithm (`RazorpayService.java`).

### Network & Infrastructure Protection
- **Rate Limiting Filter**: `RateLimitingFilter.java` enforces a maximum of 60 requests/minute per client IP to mitigate brute-force and Denial of Service (DoS) attacks.
- **CORS Policies**: Explicit cross-origin resource sharing headers configured for authorized frontend origins.
- **Cryptographic Receipt Hashes**: OpenPDF receipt engine generates SHA-256 hashes for public authenticity verification.

---

## 🔍 2. Vulnerability Reporting Policy

If you discover a security vulnerability or security bug:
1. Do NOT disclose it publicly.
2. Email details to `security@donation.app`.
3. Include step-by-step reproduction instructions and proof-of-concept.

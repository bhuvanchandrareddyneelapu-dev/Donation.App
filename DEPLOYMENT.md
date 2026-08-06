# Production Deployment Guide - Donation.app (Version 1)

This guide provides step-by-step instructions for deploying **Donation.app** to production cloud platforms.

---

## 🏗️ Recommended Cloud Stack

| Component | Provider | Recommended Plan |
| :--- | :--- | :--- |
| **Frontend UI** | Vercel / Netlify | Free Tier / Pro |
| **Backend REST API** | Railway / Render | Developer / Starter Container |
| **PostgreSQL Database** | Neon / Supabase / Railway | Managed PostgreSQL 16 |
| **Media & Bill Proofs** | Cloudinary / S3 | Free / Standard Bucket |

---

## 1. Managed PostgreSQL Database Setup (Neon / Supabase / Railway)

1. Create a PostgreSQL 16 database instance on [Neon.tech](https://neon.tech), [Supabase.com](https://supabase.com), or Railway.
2. Note the JDBC database URL credentials:
   ```env
   SPRING_DATASOURCE_URL=jdbc:postgresql://ep-example-12345.ap-southeast-1.aws.neon.tech/donationappdb?sslmode=require
   SPRING_DATASOURCE_USERNAME=donationapp_user
   SPRING_DATASOURCE_PASSWORD=your_secure_password
   ```
3. Flyway migrations (`V1__Init_Schema.sql` & `V2__Seed_Ganesh_Dasara.sql`) will execute automatically on application startup.

---

## 2. Spring Boot Backend Deployment (Railway / Render / Docker)

### Option A: Railway Deployment
1. Connect your GitHub repository to [Railway.app](https://railway.app).
2. Set root directory to `/backend`.
3. Configure Environment Variables in Railway Dashboard:
   ```env
   SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:<port>/<dbname>?sslmode=require
   SPRING_DATASOURCE_USERNAME=<db_user>
   SPRING_DATASOURCE_PASSWORD=<db_password>
   RAZORPAY_KEY_ID=rzp_live_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   WHATSAPP_API_TOKEN=EAAG_your_meta_cloud_token
   WHATSAPP_PHONE_NUMBER_ID=10599281...
   DONATIONAPP_JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250655368566D5970
   ```
4. Build command: `mvn clean package -DskipTests`
5. Start command: `java -jar target/donationapp-backend-1.0.0.jar`

### Option B: Docker Compose Deployment
```bash
docker-compose up --build -d
```

---

## 3. React Frontend Deployment (Vercel / Netlify)

1. Connect your repository to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Set root directory to `/frontend`.
3. Configure Environment Variable:
   ```env
   VITE_API_BASE_URL=https://your-backend-api.up.railway.app/api/v1
   ```
4. Build command: `npm run build`
5. Output directory: `dist`

---

## 4. Razorpay & Meta WhatsApp Webhooks Configuration

1. **Razorpay Dashboard**:
   - Go to Razorpay Settings -> API Keys. Copy Key ID and Secret.
   - Add Webhook URL: `https://your-backend-api.up.railway.app/api/v1/donations/razorpay/verify-signature`
2. **Meta WhatsApp Business Cloud API**:
   - Go to Meta Developers Portal -> WhatsApp -> API Setup.
   - Copy Permanent Access Token and Phone Number ID into `WHATSAPP_API_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID`.

---

## 5. Deployment Verification Checklist

- [ ] Database Flyway migrations initialized cleanly without errors.
- [ ] Swagger OpenAPI docs accessible at `https://your-backend-api/swagger-ui.html`.
- [ ] Test ₹1 donation on frontend connected to Razorpay Test Mode.
- [ ] Confirm receipt generated and WhatsApp message dispatched.
- [ ] Verify SSL/HTTPS certificate active on both frontend and backend domains.

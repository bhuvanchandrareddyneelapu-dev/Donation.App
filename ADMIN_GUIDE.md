# Committee Admin & Organizer Guide - Donation.app

This guide is for festival committee members (`SUPER_ADMIN`, `FESTIVAL_ADMIN`, `TREASURER`, `VOLUNTEER`) managing festival operations, cash collections, financial ledgers, and audit reports.

---

## 🔐 1. Accessing the Organizer Admin Portal

1. Access the dedicated Admin Portal at **`/admin`**.
2. Log in using your assigned committee credentials or quick demo single-click buttons:
   - **Super Admin**: `superadmin@donation.app` / `admin123`
   - **Festival Admin**: `festivaladmin@donation.app` / `admin123`
   - **Treasurer**: `treasurer@donation.app` / `treasurer123`
   - **Volunteer**: `volunteer@donation.app` / `volunteer123`

---

## 💵 2. Volunteer Workflow (Recording Cash Collections)

Volunteers stationed at mandap counters or collecting door-to-door:
1. Log in to `/admin` as a **Volunteer**.
2. Click **Record Cash Donation**.
3. Enter Donor Name, Phone Number, Amount (₹), and Counter Location.
4. Click **Generate Instant Cash Receipt**.
5. An instant receipt is issued to the donor with status `Pending Treasurer Verification`.
6. *Offline Support*: If network connectivity is lost, cash entries are automatically queued in offline storage (`offlineStore.ts`) and synced when connection resumes.

---

## 🏦 3. Treasurer Workflow (Verifying Cash & Expenses)

Treasurers overseeing financial integrity:
1. Log in to `/admin` as a **Treasurer**.
2. Navigate to **Treasurer Cash Approvals**.
3. Review pending cash entries submitted by assigned volunteers.
4. Verify physical cash received and click **Approve & Verify Deposit** to mark money deposited into committee bank accounts.
5. Review line-item expenses under **Transparency Ledger** and upload vendor invoice bill proofs.

---

## 📊 4. Exporting Audit Reports (PDF & CSV)

1. Log in as **Festival Admin**, **Treasurer**, or **Super Admin**.
2. On the Dashboard, click **Export Reports**.
3. Download:
   - **Donation Summary Audit Report** (PDF or CSV)
   - **Line-Item Expense Ledger Report** (CSV)

package com.donationapp.config;

import com.donationapp.entity.*;
import com.donationapp.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final FestivalRepository festivalRepository;
    private final DonationRepository donationRepository;
    private final CashDonationLogRepository cashDonationLogRepository;
    private final ReceiptRepository receiptRepository;
    private final ExpenseRepository expenseRepository;
    private final ExpenseProofRepository expenseProofRepository;
    private final VolunteerRepository volunteerRepository;
    private final CommunityPostRepository communityPostRepository;
    private final PostCommentRepository postCommentRepository;
    private final FestivalScheduleRepository scheduleRepository;
    private final PasswordEncoder passwordEncoder;

    private final JdbcTemplate jdbcTemplate;

    public DataSeeder(UserRepository userRepository, OrganizationRepository organizationRepository,
                      FestivalRepository festivalRepository, DonationRepository donationRepository,
                      CashDonationLogRepository cashDonationLogRepository, ReceiptRepository receiptRepository,
                      ExpenseRepository expenseRepository, ExpenseProofRepository expenseProofRepository,
                      VolunteerRepository volunteerRepository, CommunityPostRepository communityPostRepository,
                      PostCommentRepository postCommentRepository, FestivalScheduleRepository scheduleRepository,
                      PasswordEncoder passwordEncoder, org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.festivalRepository = festivalRepository;
        this.donationRepository = donationRepository;
        this.cashDonationLogRepository = cashDonationLogRepository;
        this.receiptRepository = receiptRepository;
        this.expenseRepository = expenseRepository;
        this.expenseProofRepository = expenseProofRepository;
        this.volunteerRepository = volunteerRepository;
        this.communityPostRepository = communityPostRepository;
        this.postCommentRepository = postCommentRepository;
        this.scheduleRepository = scheduleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        runDdlQuietly("ALTER TABLE donations ADD COLUMN IF NOT EXISTS gotram VARCHAR(255)");
        runDdlQuietly("ALTER TABLE donations ADD COLUMN IF NOT EXISTS family_details VARCHAR(500)");
        runDdlQuietly("ALTER TABLE donations ADD COLUMN IF NOT EXISTS public_visibility BOOLEAN DEFAULT TRUE");
        runDdlQuietly("ALTER TABLE donations ADD COLUMN IF NOT EXISTS is_reversed BOOLEAN DEFAULT FALSE");
        runDdlQuietly("ALTER TABLE donations ADD COLUMN IF NOT EXISTS reversed_by VARCHAR(255)");
        runDdlQuietly("ALTER TABLE donations ADD COLUMN IF NOT EXISTS reversed_at TIMESTAMP");
        runDdlQuietly("ALTER TABLE donations ADD COLUMN IF NOT EXISTS reversal_reason VARCHAR(500)");
        runDdlQuietly("ALTER TABLE donations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP");
        runDdlQuietly("ALTER TABLE donations ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT FALSE");

        runDdlQuietly("CREATE TABLE IF NOT EXISTS donation_audit_log (" +
            "id BIGSERIAL PRIMARY KEY, " +
            "donation_id BIGINT NOT NULL, " +
            "action VARCHAR(50) NOT NULL, " +
            "old_amount NUMERIC(12,2), " +
            "new_amount NUMERIC(12,2), " +
            "reason VARCHAR(500), " +
            "performed_by VARCHAR(255) NOT NULL, " +
            "performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)");

        runDdlQuietly("DELETE FROM receipts WHERE donation_id IN (1, 2)");
        runDdlQuietly("DELETE FROM cash_donation_logs WHERE donation_id IN (1, 2)");
        runDdlQuietly("DELETE FROM donation_audit_log WHERE donation_id IN (1, 2)");
        runDdlQuietly("DELETE FROM donations WHERE festival_id = 1 AND id IN (1, 2) AND donor_name IN ('Priya Sundaram', 'Ramesh Chandran & Family')");
        runDdlQuietly("UPDATE festivals SET target_amount = 1252.00, current_collection = 1001.00 WHERE id = 1");

        try {
            if (userRepository.count() > 0) {
                return; // Seed data already loaded
            }

            System.out.println("🌱 Seeding Donation.app Version 1 Database (Ganesh Chaturthi & Dasara)...");

            // 1. Create Core Users for All 5 Version 1 Roles
            User superAdmin = userRepository.save(new User("Vikramaditya Sharma", "superadmin@donation.app", "+91 9876543210", passwordEncoder.encode("admin123"), User.Role.SUPER_ADMIN));
            User festivalAdmin = userRepository.save(new User("Rajesh Kulkarni", "festivaladmin@donation.app", "+91 9876543211", passwordEncoder.encode("admin123"), User.Role.FESTIVAL_ADMIN));
            User treasurer = userRepository.save(new User("Sunil Deshmukh", "treasurer@donation.app", "+91 9876543212", passwordEncoder.encode("treasurer123"), User.Role.TREASURER));
            User volunteerUser = userRepository.save(new User("Aarav Patel", "volunteer@donation.app", "+91 9876543213", passwordEncoder.encode("volunteer123"), User.Role.VOLUNTEER));
            User donorUser = userRepository.save(new User("Priya Sundaram", "donor@donation.app", "+91 9876543214", passwordEncoder.encode("donor123"), User.Role.DONOR));

            // 2. Create Organizations
            Organization ganeshOrg = new Organization("Lalbaugcha Raja Sarvajanik Ganeshotsav Mandal", "FESTIVAL_COMMITTEE", "REG/MH/2026/8941", "contact@lalbaugcharaja.org", "+91 22 2471 3456", "Lalbaug, Parel, Mumbai 400012");
            ganeshOrg.setLogoUrl("https://images.unsplash.com/photo-1605626830588-4663e26b1c5a?w=400");
            organizationRepository.save(ganeshOrg);

            Organization dasaraOrg = new Organization("Mysore Dasara Executive Committee", "FESTIVAL_COMMITTEE", "REG/KA/2026/1102", "info@mysoredasara.gov.in", "+91 821 242 1234", "Mysore Palace Premises, Mysuru 570001");
            dasaraOrg.setLogoUrl("https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=400");
            organizationRepository.save(dasaraOrg);

            // 3. Create Ganesh Chaturthi & Dasara Festivals
            Festival ganesh = new Festival();
            ganesh.setOrganization(ganeshOrg);
            ganesh.setName("Unicode Estates Ganesh Chaturthi Celebrations 2026");
            ganesh.setFestivalType(Festival.FestivalType.GANESH_CHATURTHI);
            ganesh.setBannerUrl("/assets/images/unicode-estates-ganesh-idol.png");
            ganesh.setIdolImageUrl("/assets/images/unicode-estates-ganesh-idol.png");
            ganesh.setDescription("Come together with our Unicode Estates community to celebrate Ganpati Bappa with devotion, joy, togetherness and new beginnings.");
            ganesh.setVenue("Unicode Estates");
            ganesh.setOrganizer("Unicode Estates Cultural & Festival Committee");
            ganesh.setTargetAmount(BigDecimal.ZERO);
            ganesh.setCurrentCollection(BigDecimal.ZERO);
            ganesh.setInstallationDate(LocalDate.of(2026, 9, 14));
            ganesh.setImmersionDate(LocalDate.of(2026, 9, 24));
            ganesh.setQrCodeUrl("https://donation.app/qr/festivals/1");
            festivalRepository.save(ganesh);

            Festival dasara = new Festival();
            dasara.setOrganization(dasaraOrg);
            dasara.setName("Maha Dasara & Vijayadashami Festival 2026");
            dasara.setFestivalType(Festival.FestivalType.DASARA);
            dasara.setBannerUrl("https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=1200");
            dasara.setIdolImageUrl("https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800");
            dasara.setDescription("World-famous 10-day Mysore Dasara celebration featuring illuminated Mysore Palace, Jumboo Savari procession, and Chamundeshwari Temple pujas.");
            dasara.setVenue("Mysore Palace Grounds, Mysuru");
            dasara.setOrganizer("Mysore Dasara Committee");
            dasara.setTargetAmount(new BigDecimal("4000000.00")); // ₹40 Lakhs
            dasara.setCurrentCollection(new BigDecimal("2650000.00"));
            dasara.setInstallationDate(LocalDate.of(2026, 10, 15));
            dasara.setImmersionDate(LocalDate.of(2026, 10, 24));
            dasara.setQrCodeUrl("https://donation.app/qr/festivals/2");
            festivalRepository.save(dasara);

            // 4. Create Volunteer Assignments
            Volunteer v1 = new Volunteer(volunteerUser, ganesh, "Gate 2 - VIP & General Queue", "VOL-BADGE-8841");
            v1.setDailyTarget(new BigDecimal("100000.00"));
            volunteerRepository.save(v1);

            // 5. Seed Online & Cash Donations
            Donation d1 = new Donation();
            d1.setFestival(ganesh);
            d1.setDonor(donorUser);
            d1.setDonorName("Priya Sundaram");
            d1.setDonorPhone("+91 9876543214");
            d1.setDonorAddress("Jayanagar 4th Block, Bengaluru");
            d1.setAmount(new BigDecimal("25000.00"));
            d1.setPurpose(ganesh.getFestivalType());
            d1.setPaymentType(Donation.PaymentType.ONLINE);
            d1.setPaymentStatus(Donation.PaymentStatus.COMPLETED);
            d1.setTransactionId("PAY_RAZORPAY_882910");
            donationRepository.save(d1);

            Receipt r1 = new Receipt(d1, "REC-2026-1001", "HASH_QR_99812401");
            receiptRepository.save(r1);

            Donation d2 = new Donation();
            d2.setFestival(ganesh);
            d2.setDonorName("Ramesh Chandran & Family");
            d2.setDonorPhone("+91 9443218765");
            d2.setDonorAddress("Dadar West, Mumbai");
            d2.setAmount(new BigDecimal("11000.00"));
            d2.setPurpose(ganesh.getFestivalType());
            d2.setPaymentType(Donation.PaymentType.CASH);
            d2.setPaymentStatus(Donation.PaymentStatus.VERIFIED);
            d2.setTransactionId("CASH_VOL_44910");
            d2.setRecordedByVolunteer(volunteerUser);
            donationRepository.save(d2);

            Receipt r2 = new Receipt(d2, "REC-CASH-2026-1002", "HASH_QR_CASH_1002");
            receiptRepository.save(r2);

            CashDonationLog log2 = new CashDonationLog();
            log2.setDonation(d2);
            log2.setVolunteer(volunteerUser);
            log2.setVerifiedByTreasurer(treasurer);
            log2.setStatus(Donation.PaymentStatus.VERIFIED);
            log2.setDepositReference("HDFC_DEP_991823");
            log2.setVerificationDate(LocalDateTime.now().minusHours(4));
            cashDonationLogRepository.save(log2);

            // 6. Seed Expenses for Transparency Module
            Expense e1 = new Expense();
            e1.setFestival(ganesh);
            e1.setCategory(Expense.ExpenseCategory.DECORATION);
            e1.setTitle("Eco-friendly Floral Pandal & Theme Decor");
            e1.setAmount(new BigDecimal("450000.00"));
            e1.setVendorName("Maharashtrian Floral Designers & Decorators");
            e1.setPaidBy("Treasurer - Sunil Deshmukh");
            e1.setApprovedBy("Festival Admin - Rajesh Kulkarni");
            e1.setPaymentDate(LocalDate.now().minusDays(3));
            expenseRepository.save(e1);

            ExpenseProof ep1 = new ExpenseProof(e1, "INVOICE", "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600", "Pandal_Floral_Invoice_450k.pdf");
            expenseProofRepository.save(ep1);

            Expense e2 = new Expense();
            e2.setFestival(ganesh);
            e2.setCategory(Expense.ExpenseCategory.PRASADAM);
            e2.setTitle("Daily 24x7 Mahaprasadam & Modak Kitchen");
            e2.setAmount(new BigDecimal("680000.00"));
            e2.setVendorName("Shree Annapurna Catering Services");
            e2.setPaidBy("Treasurer - Sunil Deshmukh");
            e2.setApprovedBy("Festival Admin - Rajesh Kulkarni");
            e2.setPaymentDate(LocalDate.now().minusDays(1));
            expenseRepository.save(e2);

            ExpenseProof ep2 = new ExpenseProof(e2, "BILL", "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600", "Annapurna_Catering_Bill.jpg");
            expenseProofRepository.save(ep2);

            // 7. Seed Schedules
            scheduleRepository.save(new FestivalSchedule(ganesh, "Grand Arrival & Prana Pratishtha Puja", LocalDateTime.of(2026, 9, 14, 6, 0), "Main Pandal Stage", "Vedic chantings by 21 priests"));
            scheduleRepository.save(new FestivalSchedule(ganesh, "Maha Aarti & Cultural Evening", LocalDateTime.of(2026, 9, 14, 19, 30), "Main Pandal Stage", "Live Bhajan performance"));

            scheduleRepository.save(new FestivalSchedule(dasara, "Grand Mysore Palace Lighting & Navaratri Puja", LocalDateTime.of(2026, 10, 15, 18, 30), "Mysore Palace Courtyard", "Inauguration of 100,000 palace bulbs illumination"));
            scheduleRepository.save(new FestivalSchedule(dasara, "Jumboo Savari Elephant Procession & Vijayadashami", LocalDateTime.of(2026, 10, 24, 14, 0), "Palace Grounds to Bannimantap", "Golden Howdah procession featuring Goddess Chamundeshwari"));

            // 8. Seed Community Posts
            CommunityPost p1 = new CommunityPost();
            p1.setFestival(ganesh);
            p1.setAuthor(festivalAdmin);
            p1.setTitle("🚩 Grand Inauguration & Prana Pratishtha Schedule Announced!");
            p1.setContent("We are thrilled to announce that the divine idol installation will commence at 6:00 AM on 14th September 2026. Special VVIP Aarti will be held at 7:30 PM followed by Mahaprasadam distribution.");
            p1.setMediaUrl("https://images.unsplash.com/photo-1605626830588-4663e26b1c5a?w=800");
            p1.setMediaType("IMAGE");
            p1.setAnnouncement(true);
            p1.setLikesCount(142);
            p1.setCommentsCount(2);
            communityPostRepository.save(p1);

            postCommentRepository.save(new PostComment(p1, donorUser, "Ganpati Bappa Morya! 🙏"));
            postCommentRepository.save(new PostComment(p1, volunteerUser, "Volunteer team ready at Gate 2. 🚩"));

            System.out.println("✅ Donation.app Version 1 Database Seeded Successfully (Ganesh Chaturthi & Dasara)!");
        } catch (Throwable t) {
            System.err.println("⚠️ DataSeeder warning: Database seeding skipped or encountered an issue: " + t.getMessage());
        }
    }

    private void runDdlQuietly(String sql) {
        try {
            jdbcTemplate.execute(sql);
        } catch (Exception e) {
            System.err.println("DDL execution notice (" + sql + "): " + e.getMessage());
        }
    }
}

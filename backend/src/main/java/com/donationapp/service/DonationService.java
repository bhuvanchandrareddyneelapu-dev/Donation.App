package com.donationapp.service;

import com.donationapp.dto.req.DonationCreateRequest;
import com.donationapp.dto.req.RazorpayVerifyRequest;
import com.donationapp.dto.resp.DonationResponse;
import com.donationapp.entity.*;
import com.donationapp.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final FestivalRepository festivalRepository;
    private final UserRepository userRepository;
    private final ReceiptRepository receiptRepository;
    private final CashDonationLogRepository cashDonationLogRepository;
    private final NotificationService notificationService;
    private final AuditLogRepository auditLogRepository;
    private final EmailService emailService;

    public DonationService(DonationRepository donationRepository, FestivalRepository festivalRepository,
                           UserRepository userRepository, ReceiptRepository receiptRepository,
                           CashDonationLogRepository cashDonationLogRepository, NotificationService notificationService,
                           AuditLogRepository auditLogRepository, EmailService emailService) {
        this.donationRepository = donationRepository;
        this.festivalRepository = festivalRepository;
        this.userRepository = userRepository;
        this.receiptRepository = receiptRepository;
        this.cashDonationLogRepository = cashDonationLogRepository;
        this.notificationService = notificationService;
        this.auditLogRepository = auditLogRepository;
        this.emailService = emailService;
    }

    @Transactional
    public DonationResponse processVerifiedOnlineDonation(RazorpayVerifyRequest req) {
        if (req.getAmount() == null || req.getAmount().compareTo(new BigDecimal("1000")) < 0) {
            throw new RuntimeException("Minimum contribution is ₹1,000.");
        }

        // Prevent duplicate processing
        Optional<Donation> existing = donationRepository.findByRazorpayPaymentId(req.getRazorpay_payment_id());
        if (existing.isPresent()) {
            Receipt existingReceipt = receiptRepository.findByDonationId(existing.get().getId()).orElse(null);
            return mapToResponse(existing.get(), existingReceipt, null);
        }

        Festival festival = festivalRepository.findById(req.getFestivalId())
                .orElseThrow(() -> new RuntimeException("Festival not found with ID: " + req.getFestivalId()));

        User donor = null;
        if (req.getDonorId() != null) {
            donor = userRepository.findById(req.getDonorId()).orElse(null);
        }

        Donation donation = new Donation();
        donation.setFestival(festival);
        donation.setDonor(donor);
        donation.setDonorName(req.getDonorName());
        donation.setDonorPhone(req.getDonorPhone());
        donation.setDonorAddress(req.getDonorAddress());
        donation.setDonorEmail(req.getDonorEmail());
        donation.setGotram(req.getGotram());
        donation.setFamilyDetails(req.getFamilyDetails());
        donation.setPublicVisibility(req.isPublicVisibility());
        donation.setAmount(req.getAmount());
        donation.setPurpose(req.getPurpose() != null ? req.getPurpose() : festival.getFestivalType());
        donation.setPaymentType(Donation.PaymentType.ONLINE);
        donation.setPaymentStatus(Donation.PaymentStatus.COMPLETED);
        donation.setTransactionId(req.getRazorpay_payment_id());
        donation.setRazorpayOrderId(req.getRazorpay_order_id());
        donation.setRazorpayPaymentId(req.getRazorpay_payment_id());
        donation.setRazorpaySignature(req.getRazorpay_signature());
        donation.setAnonymous(req.isAnonymous());
        donation.setRemarks(req.getRemarks());

        donation = donationRepository.save(donation);

        // Update festival current collection dynamically
        festival.setCurrentCollection(festival.getCurrentCollection().add(req.getAmount()));
        festivalRepository.save(festival);

        // Generate unique format receipt
        String prefix = festival.getReceiptPrefix();
        String receiptNo = String.format("%s-%d-%06d", prefix, LocalDate.now().getYear(), donation.getId());
        String qrHash = UUID.randomUUID().toString().replace("-", "");
        Receipt receipt = new Receipt(donation, receiptNo, qrHash);
        receipt.setPdfUrl("/api/v1/receipts/" + receiptNo + "/pdf");
        receiptRepository.save(receipt);

        // Trigger Email Notification
        notificationService.sendDonationConfirmation(donation, receipt);

        return mapToResponse(donation, receipt, null);
    }

    @Transactional
    public DonationResponse processOnlineDonation(DonationCreateRequest req) {
        if (req.getAmount() == null || req.getAmount().compareTo(new BigDecimal("1000")) < 0) {
            throw new RuntimeException("Minimum contribution is ₹1,000.");
        }

        Festival festival = festivalRepository.findById(req.getFestivalId())
                .orElseThrow(() -> new RuntimeException("Festival not found with ID: " + req.getFestivalId()));

        User donor = null;
        if (req.getDonorId() != null) {
            donor = userRepository.findById(req.getDonorId()).orElse(null);
        }

        Donation donation = new Donation();
        donation.setFestival(festival);
        donation.setDonor(donor);
        donation.setDonorName(req.getDonorName());
        donation.setDonorPhone(req.getDonorPhone());
        donation.setDonorAddress(req.getDonorAddress());
        donation.setDonorEmail(req.getDonorEmail());
        donation.setGotram(req.getGotram());
        donation.setFamilyDetails(req.getFamilyDetails());
        donation.setPublicVisibility(req.isPublicVisibility());
        donation.setAmount(req.getAmount());
        donation.setPurpose(req.getPurpose() != null ? req.getPurpose() : festival.getFestivalType());
        donation.setPaymentType(req.getPaymentType());
        donation.setPaymentStatus(Donation.PaymentStatus.COMPLETED);
        donation.setTransactionId("PAY_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        donation.setAnonymous(req.isAnonymous());
        donation.setRemarks(req.getRemarks());

        donation = donationRepository.save(donation);

        // Update festival collection
        festival.setCurrentCollection(festival.getCurrentCollection().add(req.getAmount()));
        festivalRepository.save(festival);

        // Generate Receipt
        String receiptNo = "REC-" + System.currentTimeMillis() % 1000000;
        String qrHash = UUID.randomUUID().toString().replace("-", "");
        Receipt receipt = new Receipt(donation, receiptNo, qrHash);
        receipt.setPdfUrl("/api/v1/receipts/" + receiptNo + "/pdf");
        receiptRepository.save(receipt);

        // Trigger Email Notification Automation
        notificationService.sendDonationConfirmation(donation, receipt);

        return mapToResponse(donation, receipt, null);
    }

    @Transactional
    public DonationResponse processCashDonation(DonationCreateRequest req, Long volunteerId) {
        if (req.getAmount() == null || req.getAmount().compareTo(new BigDecimal("1000")) < 0) {
            throw new RuntimeException("Minimum contribution is ₹1,000.");
        }

        Festival festival = festivalRepository.findById(req.getFestivalId())
                .orElseThrow(() -> new RuntimeException("Festival not found with ID: " + req.getFestivalId()));

        User volunteer = volunteerId != null ? userRepository.findById(volunteerId).orElse(null) : null;

        Donation donation = new Donation();
        donation.setFestival(festival);
        donation.setDonorName(req.getDonorName());
        donation.setDonorPhone(req.getDonorPhone());
        donation.setDonorAddress(req.getDonorAddress());
        donation.setDonorEmail(req.getDonorEmail());
        donation.setGotram(req.getGotram());
        donation.setFamilyDetails(req.getFamilyDetails());
        donation.setPublicVisibility(req.isPublicVisibility());
        donation.setAmount(req.getAmount());
        donation.setPurpose(req.getPurpose() != null ? req.getPurpose() : festival.getFestivalType());
        donation.setPaymentType(Donation.PaymentType.CASH);
        donation.setPaymentStatus(Donation.PaymentStatus.COMPLETED); // Instant verified when recorded by Supervisor/Head
        donation.setTransactionId("CASH_" + System.currentTimeMillis() % 100000);
        donation.setAnonymous(req.isAnonymous());
        donation.setRemarks(req.getRemarks());
        donation.setRecordedByVolunteer(volunteer);

        donation = donationRepository.save(donation);

        // Update festival collection
        festival.setCurrentCollection(festival.getCurrentCollection().add(req.getAmount()));
        festivalRepository.save(festival);

        // Log Cash Entry for Audit
        CashDonationLog log = new CashDonationLog();
        log.setDonation(donation);
        log.setVolunteer(volunteer);
        log.setStatus(Donation.PaymentStatus.COMPLETED);
        log.setRemarks("Recorded by supervisor/volunteer: " + (volunteer != null ? volunteer.getName() : "Admin"));
        cashDonationLogRepository.save(log);

        // Generate instant receipt
        String receiptNo = "REC-CASH-" + System.currentTimeMillis() % 1000000;
        String qrHash = UUID.randomUUID().toString().replace("-", "");
        Receipt receipt = new Receipt(donation, receiptNo, qrHash);
        receipt.setPdfUrl("/api/v1/receipts/" + receiptNo + "/pdf");
        receiptRepository.save(receipt);

        // Trigger Email Notification if email is provided
        notificationService.sendDonationConfirmation(donation, receipt);

        return mapToResponse(donation, receipt, volunteer != null ? volunteer.getName() : "Admin");
    }

    @Transactional
    public DonationResponse reverseDonation(Long donationId, String reason, String adminUsername, String adminRole) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found: " + donationId));

        if (donation.isReversed()) {
            throw new RuntimeException("Donation ID " + donationId + " is already reversed.");
        }

        donation.setReversed(true);
        donation.setReversedBy(adminUsername);
        donation.setReversedAt(LocalDateTime.now());
        donation.setReversalReason(reason);
        donation.setPaymentStatus(Donation.PaymentStatus.FAILED);
        donation.setUpdatedAt(LocalDateTime.now());

        donation = donationRepository.save(donation);

        // Subtract amount from festival collection
        Festival festival = donation.getFestival();
        if (festival != null && festival.getCurrentCollection() != null) {
            BigDecimal newColl = festival.getCurrentCollection().subtract(donation.getAmount());
            festival.setCurrentCollection(newColl.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : newColl);
            festivalRepository.save(festival);
        }

        // Log Audit Event
        AuditLog audit = new AuditLog(
                adminUsername,
                adminRole,
                "REVERSE_DONATION",
                "Donation",
                String.valueOf(donationId),
                "Reversed donation of ₹" + donation.getAmount() + ". Reason: " + reason
        );
        auditLogRepository.save(audit);

        Receipt receipt = receiptRepository.findByDonationId(donationId).orElse(null);
        return mapToResponse(donation, receipt, null);
    }

    public void resendReceiptEmail(Long donationId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found: " + donationId));
        Receipt receipt = receiptRepository.findByDonationId(donationId)
                .orElseThrow(() -> new RuntimeException("Receipt not found for donation: " + donationId));

        emailService.sendDonationReceiptEmail(donation, receipt);
    }

    public List<DonationResponse> getDonationsByFestival(Long festivalId) {
        return donationRepository.findByFestivalId(festivalId).stream()
                .map(d -> {
                    Receipt r = receiptRepository.findByDonationId(d.getId()).orElse(null);
                    String volName = d.getRecordedByVolunteer() != null ? d.getRecordedByVolunteer().getName() : null;
                    return mapToResponse(d, r, volName);
                })
                .collect(Collectors.toList());
    }

    public List<DonationResponse> getPublicDonations(Long festivalId) {
        return donationRepository.findByFestivalIdAndPublicVisibilityTrueAndIsReversedFalseOrderByIdDesc(festivalId).stream()
                .map(d -> {
                    Receipt r = receiptRepository.findByDonationId(d.getId()).orElse(null);
                    return mapToPublicResponse(d, r);
                })
                .collect(Collectors.toList());
    }

    public List<DonationResponse> searchDonations(String query) {
        return donationRepository.findByDonorPhoneContainingOrDonorNameContainingOrTransactionIdContaining(query, query, query)
                .stream()
                .map(d -> {
                    Receipt r = receiptRepository.findByDonationId(d.getId()).orElse(null);
                    return mapToResponse(d, r, null);
                })
                .collect(Collectors.toList());
    }

    private DonationResponse mapToResponse(Donation donation, Receipt receipt, String volunteerName) {
        DonationResponse resp = new DonationResponse();
        resp.setId(donation.getId());
        resp.setFestivalId(donation.getFestival().getId());
        resp.setFestivalName(donation.getFestival().getName());
        resp.setDonorName(donation.isAnonymous() ? "Anonymous Donor" : donation.getDonorName());
        resp.setDonorPhone(donation.getDonorPhone());
        resp.setDonorAddress(donation.getDonorAddress());
        resp.setDonorEmail(donation.getDonorEmail());
        resp.setGotram(donation.getGotram());
        resp.setFamilyDetails(donation.getFamilyDetails());
        resp.setPublicVisibility(donation.isPublicVisibility());
        resp.setAmount(donation.getAmount());
        resp.setPurpose(donation.getPurpose());
        resp.setPaymentType(donation.getPaymentType());
        resp.setPaymentStatus(donation.getPaymentStatus());
        resp.setTransactionId(donation.getTransactionId());
        if (receipt != null) {
            resp.setReceiptNumber(receipt.getReceiptNumber());
            resp.setQrCodeHash(receipt.getQrCodeHash());
        }
        resp.setAnonymous(donation.isAnonymous());
        resp.setVolunteerName(volunteerName);
        resp.setReversed(donation.isReversed());
        resp.setReversedBy(donation.getReversedBy());
        resp.setReversalReason(donation.getReversalReason());
        resp.setCreatedAt(donation.getCreatedAt());
        return resp;
    }

    private DonationResponse mapToPublicResponse(Donation donation, Receipt receipt) {
        DonationResponse resp = new DonationResponse();
        resp.setId(donation.getId());
        resp.setFestivalId(donation.getFestival().getId());
        resp.setFestivalName(donation.getFestival().getName());
        resp.setDonorName(donation.isAnonymous() ? "Anonymous Devotee" : donation.getDonorName());
        // Privacy enforcement: NEVER expose email or phone number in public responses
        resp.setDonorPhone(null);
        resp.setDonorEmail(null);
        resp.setDonorAddress(null);

        // Expose gotram and family details ONLY if donor opted into public visibility
        if (donation.isPublicVisibility() && !donation.isAnonymous()) {
            resp.setGotram(donation.getGotram());
            resp.setFamilyDetails(donation.getFamilyDetails());
        } else {
            resp.setGotram(null);
            resp.setFamilyDetails(null);
        }

        resp.setPublicVisibility(donation.isPublicVisibility());
        resp.setAmount(donation.getAmount());
        resp.setPurpose(donation.getPurpose());
        resp.setPaymentType(donation.getPaymentType());
        resp.setPaymentStatus(donation.getPaymentStatus());
        resp.setTransactionId(donation.getTransactionId());
        if (receipt != null) {
            resp.setReceiptNumber(receipt.getReceiptNumber());
            resp.setQrCodeHash(receipt.getQrCodeHash());
        }
        resp.setAnonymous(donation.isAnonymous());
        resp.setCreatedAt(donation.getCreatedAt());
        return resp;
    }
}

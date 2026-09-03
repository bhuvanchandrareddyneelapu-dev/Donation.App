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

    public DonationService(DonationRepository donationRepository, FestivalRepository festivalRepository,
                           UserRepository userRepository, ReceiptRepository receiptRepository,
                           CashDonationLogRepository cashDonationLogRepository, NotificationService notificationService) {
        this.donationRepository = donationRepository;
        this.festivalRepository = festivalRepository;
        this.userRepository = userRepository;
        this.receiptRepository = receiptRepository;
        this.cashDonationLogRepository = cashDonationLogRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public DonationResponse processVerifiedOnlineDonation(RazorpayVerifyRequest req) {
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

        // Update festival current collection
        festival.setCurrentCollection(festival.getCurrentCollection().add(req.getAmount()));
        festivalRepository.save(festival);

        // Generate unique format receipt: GAN-2026-000001 or DAS-2026-000001
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
        donation.setAmount(req.getAmount());
        donation.setPurpose(req.getPurpose() != null ? req.getPurpose() : festival.getFestivalType());
        donation.setPaymentType(req.getPaymentType());
        donation.setPaymentStatus(Donation.PaymentStatus.COMPLETED); // Instant completed for Online/UPI
        donation.setTransactionId("PAY_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        donation.setAnonymous(req.isAnonymous());
        donation.setRemarks(req.getRemarks());

        donation = donationRepository.save(donation);

        // Update festival current collection
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
        Festival festival = festivalRepository.findById(req.getFestivalId())
                .orElseThrow(() -> new RuntimeException("Festival not found with ID: " + req.getFestivalId()));

        User volunteer = userRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer user not found with ID: " + volunteerId));

        Donation donation = new Donation();
        donation.setFestival(festival);
        donation.setDonorName(req.getDonorName());
        donation.setDonorPhone(req.getDonorPhone());
        donation.setDonorAddress(req.getDonorAddress());
        donation.setAmount(req.getAmount());
        donation.setPurpose(req.getPurpose() != null ? req.getPurpose() : festival.getFestivalType());
        donation.setPaymentType(Donation.PaymentType.CASH);
        donation.setPaymentStatus(Donation.PaymentStatus.PENDING); // Pending treasurer deposit verification
        donation.setTransactionId("CASH_" + System.currentTimeMillis() % 100000);
        donation.setAnonymous(req.isAnonymous());
        donation.setRemarks(req.getRemarks());
        donation.setRecordedByVolunteer(volunteer);

        donation = donationRepository.save(donation);

        // Log Cash Entry for Audit
        CashDonationLog log = new CashDonationLog();
        log.setDonation(donation);
        log.setVolunteer(volunteer);
        log.setStatus(Donation.PaymentStatus.PENDING);
        log.setRemarks("Recorded on-ground by volunteer: " + volunteer.getName());
        cashDonationLogRepository.save(log);

        // Generate instant receipt
        String receiptNo = "REC-CASH-" + System.currentTimeMillis() % 1000000;
        String qrHash = UUID.randomUUID().toString().replace("-", "");
        Receipt receipt = new Receipt(donation, receiptNo, qrHash);
        receipt.setPdfUrl("/api/v1/receipts/" + receiptNo + "/pdf");
        receiptRepository.save(receipt);

        // Trigger Email Notification
        notificationService.sendDonationConfirmation(donation, receipt);

        return mapToResponse(donation, receipt, volunteer.getName());
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
        resp.setCreatedAt(donation.getCreatedAt());
        return resp;
    }
}

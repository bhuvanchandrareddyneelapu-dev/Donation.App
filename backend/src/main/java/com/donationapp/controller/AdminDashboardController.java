package com.donationapp.controller;

import com.donationapp.dto.req.DonationCreateRequest;
import com.donationapp.dto.resp.DonationResponse;
import com.donationapp.entity.AuditLog;
import com.donationapp.entity.Festival;

import com.donationapp.repository.AuditLogRepository;
import com.donationapp.repository.DonationRepository;
import com.donationapp.repository.FestivalRepository;
import com.donationapp.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/admin")
public class AdminDashboardController {

    private final DonationService donationService;
    private final DonationRepository donationRepository;
    private final FestivalRepository festivalRepository;
    private final AuditLogRepository auditLogRepository;

    public AdminDashboardController(DonationService donationService,
                                    DonationRepository donationRepository,
                                    FestivalRepository festivalRepository,
                                    AuditLogRepository auditLogRepository) {
        this.donationService = donationService;
        this.donationRepository = donationRepository;
        this.festivalRepository = festivalRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasAnyRole('HEAD', 'SUPER_ADMIN', 'SUPERVISOR', 'FESTIVAL_ADMIN', 'TREASURER', 'VOLUNTEER')")
    public ResponseEntity<?> getDashboardStats(@RequestParam(defaultValue = "1") Long festivalId) {
        Festival festival = festivalRepository.findById(festivalId)
                .orElse(null);

        BigDecimal totalCollection = donationRepository.sumTotalCollectionByFestivalId(festivalId);
        if (totalCollection == null) totalCollection = BigDecimal.ZERO;

        BigDecimal onlineCollection = donationRepository.calculateTotalOnlineCollection(festivalId);
        if (onlineCollection == null) onlineCollection = BigDecimal.ZERO;

        BigDecimal cashCollection = donationRepository.calculateTotalCashCollection(festivalId);
        if (cashCollection == null) cashCollection = BigDecimal.ZERO;

        Long totalDonationsCount = donationRepository.countValidDonationsByFestivalId(festivalId);
        if (totalDonationsCount == null) totalDonationsCount = 0L;

        BigDecimal testCollection = donationRepository.sumTestCollectionByFestivalId(festivalId);
        if (testCollection == null) testCollection = BigDecimal.ZERO;

        Long testDonationsCount = donationRepository.countTestDonationsByFestivalId(festivalId);
        if (testDonationsCount == null) testDonationsCount = 0L;

        BigDecimal targetAmount = totalCollection.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : totalCollection.multiply(new BigDecimal("1.25")).setScale(0, java.math.RoundingMode.CEILING);

        BigDecimal remainingAmount = targetAmount.subtract(totalCollection);
        if (remainingAmount.compareTo(BigDecimal.ZERO) < 0) remainingAmount = BigDecimal.ZERO;

        Map<String, Object> stats = new HashMap<>();
        stats.put("festivalId", festivalId);
        stats.put("festivalName", festival != null ? festival.getName() : "Unicode Estates Ganesh Chaturthi 2026");
        stats.put("totalCollection", totalCollection);
        stats.put("onlineCollection", onlineCollection);
        stats.put("cashCollection", cashCollection);
        stats.put("totalDonations", totalDonationsCount);
        stats.put("testCollection", testCollection);
        stats.put("testDonations", testDonationsCount);
        stats.put("isTestMode", donationService.isTestMode());
        stats.put("targetAmount", targetAmount);
        stats.put("remainingAmount", remainingAmount);
        stats.put("todayCollection", totalCollection); // Live aggregate

        return ResponseEntity.ok(stats);
    }

    @PostMapping("/donations/cash")
    @PreAuthorize("hasAnyRole('HEAD', 'SUPER_ADMIN', 'SUPERVISOR', 'FESTIVAL_ADMIN', 'TREASURER', 'VOLUNTEER')")
    public ResponseEntity<?> addCashDonation(@Valid @RequestBody com.donationapp.dto.req.ManualDonationRequest req, Authentication auth) {
        String username = auth != null ? auth.getName() : "Supervisor";
        DonationResponse resp = donationService.processManualDonation(req, username);

        // Audit Log
        AuditLog audit = new AuditLog(username, "SUPERVISOR", "ADD_CASH_DONATION", "Donation", String.valueOf(resp.getId()), "Added cash donation of ₹" + req.getAmount() + " for " + req.getDonorName());
        auditLogRepository.save(audit);

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/donations/{id}/reverse")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> reverseDonation(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        String reason = body.getOrDefault("reason", "Administrative correction");
        String username = auth != null ? auth.getName() : "Admin";

        DonationResponse resp = donationService.reverseDonation(id, reason, username, "SUPER_ADMIN");
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/donations/{id}/resend-email")
    @PreAuthorize("hasAnyRole('HEAD', 'SUPER_ADMIN', 'SUPERVISOR', 'FESTIVAL_ADMIN')")
    public ResponseEntity<?> resendReceiptEmail(@PathVariable Long id) {
        donationService.resendReceiptEmail(id);
        return ResponseEntity.ok(Map.of("message", "Receipt email dispatched successfully for donation ID: " + id));
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAll());
    }

    @GetMapping("/reports/export-csv")
    @PreAuthorize("hasAnyRole('HEAD', 'SUPER_ADMIN', 'SUPERVISOR', 'FESTIVAL_ADMIN')")
    public ResponseEntity<byte[]> exportCsvReport(@RequestParam(defaultValue = "1") Long festivalId) {
        List<DonationResponse> list = donationService.getDonationsByFestival(festivalId);

        StringBuilder csv = new StringBuilder();
        csv.append("Donation ID,Receipt Number,Donor Name,Gotram,Family Details,Phone,Email,Amount,Payment Method,Payment Status,Reversed,Date\n");

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        for (DonationResponse d : list) {
            csv.append(d.getId()).append(",")
                    .append(cleanCsv(d.getReceiptNumber())).append(",")
                    .append(cleanCsv(d.getDonorName())).append(",")
                    .append(cleanCsv(d.getGotram())).append(",")
                    .append(cleanCsv(d.getFamilyDetails())).append(",")
                    .append(cleanCsv(d.getDonorPhone())).append(",")
                    .append(cleanCsv(d.getDonorEmail())).append(",")
                    .append(d.getAmount()).append(",")
                    .append(d.getPaymentType()).append(",")
                    .append(d.getPaymentStatus()).append(",")
                    .append(d.isReversed()).append(",")
                    .append(d.getCreatedAt() != null ? d.getCreatedAt().format(fmt) : "").append("\n");
        }

        byte[] bytes = csv.toString().getBytes();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Donation_Report_Unicode_Estates_2026.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    private String cleanCsv(String val) {
        if (val == null) return "\"\"";
        return "\"" + val.replace("\"", "\"\"") + "\"";
    }
}

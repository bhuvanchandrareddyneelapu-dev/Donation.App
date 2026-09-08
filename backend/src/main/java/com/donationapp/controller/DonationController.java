package com.donationapp.controller;

import com.donationapp.dto.req.DonationCreateRequest;
import com.donationapp.dto.req.DonationUpdateRequest;
import com.donationapp.dto.req.ManualDonationRequest;
import com.donationapp.dto.resp.DonationResponse;
import com.donationapp.entity.DonationAuditLog;
import com.donationapp.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping("/online")
    public ResponseEntity<DonationResponse> processOnlineDonation(@Valid @RequestBody DonationCreateRequest req) {
        return ResponseEntity.ok(donationService.processOnlineDonation(req));
    }

    @PostMapping("/cash")
    public ResponseEntity<DonationResponse> processCashDonation(
            @Valid @RequestBody DonationCreateRequest req,
            @RequestParam(defaultValue = "4") Long volunteerId) {
        return ResponseEntity.ok(donationService.processCashDonation(req, volunteerId));
    }

    @PostMapping("/manual")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<DonationResponse> processManualDonation(
            @Valid @RequestBody ManualDonationRequest req,
            Authentication auth) {
        String adminUsername = auth != null ? auth.getName() : "Super Admin";
        return ResponseEntity.ok(donationService.processManualDonation(req, adminUsername));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<DonationResponse> updateDonation(
            @PathVariable Long id,
            @Valid @RequestBody DonationUpdateRequest req,
            Authentication auth) {
        String adminUsername = auth != null ? auth.getName() : "Super Admin";
        return ResponseEntity.ok(donationService.updateDonation(id, req, adminUsername));
    }

    @PostMapping("/{id}/reverse")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<DonationResponse> reverseDonation(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        String reason = body != null && body.containsKey("reason") ? body.get("reason") : "Administrative cancellation";
        String adminUsername = auth != null ? auth.getName() : "Super Admin";
        return ResponseEntity.ok(donationService.reverseDonation(id, reason, adminUsername, "SUPER_ADMIN"));
    }

    @GetMapping("/{id}/audit-trail")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<DonationAuditLog>> getDonationAuditTrail(@PathVariable Long id) {
        return ResponseEntity.ok(donationService.getDonationAuditTrail(id));
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<DonationAuditLog>> getAllDonationAuditLogs() {
        return ResponseEntity.ok(donationService.getAllDonationAuditLogs());
    }

    @GetMapping("/festival/{festivalId}")
    public ResponseEntity<List<DonationResponse>> getDonationsByFestival(@PathVariable Long festivalId) {
        return ResponseEntity.ok(donationService.getDonationsByFestival(festivalId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<DonationResponse>> searchDonations(@RequestParam String query) {
        return ResponseEntity.ok(donationService.searchDonations(query));
    }
}


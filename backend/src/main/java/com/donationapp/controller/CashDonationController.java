package com.donationapp.controller;

import com.donationapp.dto.req.CashVerifyRequest;
import com.donationapp.entity.CashDonationLog;
import com.donationapp.service.CashDonationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/cash-donations")
public class CashDonationController {

    private final CashDonationService cashDonationService;

    public CashDonationController(CashDonationService cashDonationService) {
        this.cashDonationService = cashDonationService;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<CashDonationLog>> getPendingCashDonations() {
        return ResponseEntity.ok(cashDonationService.getPendingCashDonations());
    }

    @PostMapping("/verify")
    public ResponseEntity<CashDonationLog> verifyCashDonation(@RequestBody CashVerifyRequest req) {
        return ResponseEntity.ok(cashDonationService.verifyAndApproveCashDonation(req));
    }
}

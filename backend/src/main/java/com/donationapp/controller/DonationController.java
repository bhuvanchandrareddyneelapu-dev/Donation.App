package com.donationapp.controller;

import com.donationapp.dto.req.DonationCreateRequest;
import com.donationapp.dto.resp.DonationResponse;
import com.donationapp.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/festival/{festivalId}")
    public ResponseEntity<List<DonationResponse>> getDonationsByFestival(@PathVariable Long festivalId) {
        return ResponseEntity.ok(donationService.getDonationsByFestival(festivalId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<DonationResponse>> searchDonations(@RequestParam String query) {
        return ResponseEntity.ok(donationService.searchDonations(query));
    }
}

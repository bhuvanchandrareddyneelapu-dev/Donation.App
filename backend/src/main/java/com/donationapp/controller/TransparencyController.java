package com.donationapp.controller;

import com.donationapp.dto.resp.ExpenseProofResponse;
import com.donationapp.dto.resp.ExpenseResponse;
import com.donationapp.entity.Expense;
import com.donationapp.service.TransparencyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/transparency")
public class TransparencyController {

    private final TransparencyService transparencyService;
    private final com.donationapp.service.DonationService donationService;

    public TransparencyController(TransparencyService transparencyService, com.donationapp.service.DonationService donationService) {
        this.transparencyService = transparencyService;
        this.donationService = donationService;
    }

    @GetMapping("/donors")
    public ResponseEntity<?> getPublicDonors(@RequestParam(defaultValue = "1") Long festivalId) {
        return ResponseEntity.ok(donationService.getPublicDonations(festivalId));
    }

    @GetMapping("/festival/{festivalId}/summary")
    public ResponseEntity<Map<String, Object>> getFestivalSummary(@PathVariable Long festivalId) {
        return ResponseEntity.ok(transparencyService.getFestivalTransparencySummary(festivalId));
    }

    @GetMapping("/festival/{festivalId}/expenses")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByFestival(@PathVariable Long festivalId) {
        return ResponseEntity.ok(transparencyService.getExpensesByFestival(festivalId));
    }

    @GetMapping("/expense/{expenseId}/proofs")
    public ResponseEntity<List<ExpenseProofResponse>> getProofsByExpense(@PathVariable Long expenseId) {
        return ResponseEntity.ok(transparencyService.getProofsByExpense(expenseId));
    }

    @PostMapping("/expenses")
    public ResponseEntity<ExpenseResponse> recordExpense(
            @RequestBody Expense expense,
            @RequestParam(required = false) List<String> proofUrls) {
        return ResponseEntity.ok(transparencyService.recordExpense(expense, proofUrls));
    }
}

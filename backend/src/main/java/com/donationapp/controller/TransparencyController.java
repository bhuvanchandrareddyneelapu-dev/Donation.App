package com.donationapp.controller;

import com.donationapp.entity.Expense;
import com.donationapp.entity.ExpenseProof;
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

    public TransparencyController(TransparencyService transparencyService) {
        this.transparencyService = transparencyService;
    }

    @GetMapping("/festival/{festivalId}/summary")
    public ResponseEntity<Map<String, Object>> getFestivalSummary(@PathVariable Long festivalId) {
        return ResponseEntity.ok(transparencyService.getFestivalTransparencySummary(festivalId));
    }

    @GetMapping("/festival/{festivalId}/expenses")
    public ResponseEntity<List<Expense>> getExpensesByFestival(@PathVariable Long festivalId) {
        return ResponseEntity.ok(transparencyService.getExpensesByFestival(festivalId));
    }

    @GetMapping("/expense/{expenseId}/proofs")
    public ResponseEntity<List<ExpenseProof>> getProofsByExpense(@PathVariable Long expenseId) {
        return ResponseEntity.ok(transparencyService.getProofsByExpense(expenseId));
    }

    @PostMapping("/expenses")
    public ResponseEntity<Expense> recordExpense(
            @RequestBody Expense expense,
            @RequestParam(required = false) List<String> proofUrls) {
        return ResponseEntity.ok(transparencyService.recordExpense(expense, proofUrls));
    }
}

package com.donationapp.service;

import com.donationapp.entity.Expense;
import com.donationapp.entity.ExpenseProof;
import com.donationapp.entity.Festival;
import com.donationapp.repository.ExpenseProofRepository;
import com.donationapp.repository.ExpenseRepository;
import com.donationapp.repository.FestivalRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class TransparencyService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseProofRepository expenseProofRepository;
    private final FestivalRepository festivalRepository;

    public TransparencyService(ExpenseRepository expenseRepository, ExpenseProofRepository expenseProofRepository,
                               FestivalRepository festivalRepository) {
        this.expenseRepository = expenseRepository;
        this.expenseProofRepository = expenseProofRepository;
        this.festivalRepository = festivalRepository;
    }

    public List<Expense> getExpensesByFestival(Long festivalId) {
        return expenseRepository.findByFestivalId(festivalId);
    }

    public List<ExpenseProof> getProofsByExpense(Long expenseId) {
        return expenseProofRepository.findByExpenseId(expenseId);
    }

    public Expense recordExpense(Expense expense, List<String> proofUrls) {
        Expense savedExpense = expenseRepository.save(expense);

        if (proofUrls != null && !proofUrls.isEmpty()) {
            for (String url : proofUrls) {
                ExpenseProof proof = new ExpenseProof(savedExpense, "INVOICE", url, "Bill_Receipt.jpg");
                expenseProofRepository.save(proof);
            }
        }

        return savedExpense;
    }

    public Map<String, Object> getFestivalTransparencySummary(Long festivalId) {
        Festival festival = festivalRepository.findById(festivalId)
                .orElseThrow(() -> new RuntimeException("Festival not found with ID: " + festivalId));

        BigDecimal totalExpenses = expenseRepository.sumTotalExpenseByFestivalId(festivalId);
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;

        BigDecimal totalCollection = festival.getCurrentCollection();
        BigDecimal remainingTarget = festival.getTargetAmount().subtract(totalCollection);
        BigDecimal netBalance = totalCollection.subtract(totalExpenses);

        List<Expense> expenses = expenseRepository.findByFestivalId(festivalId);

        // Expense category breakdown for charts
        Map<String, BigDecimal> categoryBreakdown = new HashMap<>();
        for (Expense e : expenses) {
            categoryBreakdown.put(
                e.getCategory().name(),
                categoryBreakdown.getOrDefault(e.getCategory().name(), BigDecimal.ZERO).add(e.getAmount())
            );
        }

        Map<String, Object> response = new HashMap<>();
        response.put("festivalId", festival.getId());
        response.put("festivalName", festival.getName());
        response.put("targetAmount", festival.getTargetAmount());
        response.put("totalCollection", totalCollection);
        response.put("totalExpenses", totalExpenses);
        response.put("netBalance", netBalance);
        response.put("remainingTarget", remainingTarget.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : remainingTarget);
        response.put("categoryBreakdown", categoryBreakdown);
        response.put("expenseList", expenses);

        return response;
    }
}

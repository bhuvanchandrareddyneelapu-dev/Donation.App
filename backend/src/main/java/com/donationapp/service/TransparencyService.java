package com.donationapp.service;

import com.donationapp.dto.resp.ExpenseProofResponse;
import com.donationapp.dto.resp.ExpenseResponse;
import com.donationapp.entity.Expense;
import com.donationapp.entity.ExpenseProof;
import com.donationapp.entity.Festival;
import com.donationapp.repository.ExpenseProofRepository;
import com.donationapp.repository.ExpenseRepository;
import com.donationapp.repository.FestivalRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TransparencyService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseProofRepository expenseProofRepository;
    private final FestivalRepository festivalRepository;

    private final com.donationapp.repository.DonationRepository donationRepository;

    public TransparencyService(ExpenseRepository expenseRepository, ExpenseProofRepository expenseProofRepository,
                               FestivalRepository festivalRepository, com.donationapp.repository.DonationRepository donationRepository) {
        this.expenseRepository = expenseRepository;
        this.expenseProofRepository = expenseProofRepository;
        this.festivalRepository = festivalRepository;
        this.donationRepository = donationRepository;
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByFestival(Long festivalId) {
        return expenseRepository.findByFestivalId(festivalId)
                .stream()
                .map(ExpenseResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExpenseProofResponse> getProofsByExpense(Long expenseId) {
        return expenseProofRepository.findByExpenseId(expenseId)
                .stream()
                .map(ExpenseProofResponse::new)
                .collect(Collectors.toList());
    }

    public ExpenseResponse recordExpense(Expense expense, List<String> proofUrls) {
        Expense savedExpense = expenseRepository.save(expense);

        if (proofUrls != null && !proofUrls.isEmpty()) {
            for (String url : proofUrls) {
                ExpenseProof proof = new ExpenseProof(savedExpense, "INVOICE", url, "Bill_Receipt.jpg");
                expenseProofRepository.save(proof);
            }
        }

        return new ExpenseResponse(savedExpense);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getFestivalTransparencySummary(Long festivalId) {
        Festival festival = festivalRepository.findById(festivalId)
                .orElse(null);

        BigDecimal totalExpenses = expenseRepository.sumTotalExpenseByFestivalId(festivalId);
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;

        BigDecimal totalCollection = donationRepository.sumTotalCollectionByFestivalId(festivalId);
        if (totalCollection == null) totalCollection = BigDecimal.ZERO;

        BigDecimal targetAmount = festival != null && festival.getTargetAmount() != null ? festival.getTargetAmount() : BigDecimal.ZERO;
        BigDecimal remainingTarget = targetAmount.subtract(totalCollection);
        BigDecimal netBalance = totalCollection.subtract(totalExpenses);

        List<Expense> expenses = expenseRepository.findByFestivalId(festivalId);

        // Expense category breakdown for charts
        Map<String, BigDecimal> categoryBreakdown = new HashMap<>();
        List<ExpenseResponse> expenseList = new ArrayList<>();
        for (Expense e : expenses) {
            categoryBreakdown.put(
                e.getCategory().name(),
                categoryBreakdown.getOrDefault(e.getCategory().name(), BigDecimal.ZERO).add(e.getAmount())
            );
            expenseList.add(new ExpenseResponse(e));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("festivalId", festival != null ? festival.getId() : festivalId);
        response.put("festivalName", festival != null ? festival.getName() : "");
        response.put("targetAmount", targetAmount);
        response.put("totalCollection", totalCollection);
        response.put("totalExpenses", totalExpenses);
        response.put("netBalance", netBalance);
        response.put("remainingTarget", remainingTarget.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : remainingTarget);
        response.put("categoryBreakdown", categoryBreakdown);
        response.put("expenseList", expenseList);

        return response;
    }
}

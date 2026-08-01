package com.donationapp.repository;

import com.donationapp.entity.ExpenseProof;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseProofRepository extends JpaRepository<ExpenseProof, Long> {
    List<ExpenseProof> findByExpenseId(Long expenseId);
}

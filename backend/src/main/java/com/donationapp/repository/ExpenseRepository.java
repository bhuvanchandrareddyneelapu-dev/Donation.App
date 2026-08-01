package com.donationapp.repository;

import com.donationapp.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByFestivalId(Long festivalId);
    List<Expense> findByFestivalIdAndCategory(Long festivalId, Expense.ExpenseCategory category);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.festival.id = :festivalId")
    BigDecimal sumTotalExpenseByFestivalId(@Param("festivalId") Long festivalId);
}

package com.donationapp.service;

import com.donationapp.entity.Expense;
import com.donationapp.entity.Festival;
import com.donationapp.repository.ExpenseProofRepository;
import com.donationapp.repository.ExpenseRepository;
import com.donationapp.repository.FestivalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransparencyServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private ExpenseProofRepository expenseProofRepository;

    @Mock
    private FestivalRepository festivalRepository;

    @InjectMocks
    private TransparencyService transparencyService;

    private Festival festival;

    @BeforeEach
    void setUp() {
        festival = new Festival();
        festival.setId(1L);
        festival.setName("Grand Ganesh Chaturthi Mahotsav 2026");
        festival.setTargetAmount(new BigDecimal("5000000.00"));
        festival.setCurrentCollection(new BigDecimal("3450000.00"));
    }

    @Test
    void testGetFestivalTransparencySummary_Success() {
        when(festivalRepository.findById(1L)).thenReturn(Optional.of(festival));
        when(expenseRepository.sumTotalExpenseByFestivalId(1L)).thenReturn(new BigDecimal("1500000.00"));
        when(expenseRepository.findByFestivalId(1L)).thenReturn(List.of());

        Map<String, Object> summary = transparencyService.getFestivalTransparencySummary(1L);

        assertNotNull(summary);
        assertEquals("Grand Ganesh Chaturthi Mahotsav 2026", summary.get("festivalName"));
        assertEquals(new BigDecimal("3450000.00"), summary.get("totalCollection"));
        assertEquals(new BigDecimal("1500000.00"), summary.get("totalExpenses"));
        assertEquals(new BigDecimal("1950000.00"), summary.get("netBalance"));
    }
}

package com.donationapp.service;

import com.donationapp.dto.req.DonationUpdateRequest;
import com.donationapp.dto.req.ManualDonationRequest;
import com.donationapp.dto.resp.CollectionSummaryResponse;
import com.donationapp.dto.resp.DonationResponse;
import com.donationapp.entity.Donation;
import com.donationapp.entity.DonationAuditLog;
import com.donationapp.entity.Festival;
import com.donationapp.entity.Receipt;
import com.donationapp.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CollectionWorkflowTest {

    @Mock
    private FestivalRepository festivalRepository;

    @Mock
    private DonationRepository donationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ReceiptRepository receiptRepository;

    @Mock
    private CashDonationLogRepository cashDonationLogRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private DonationAuditLogRepository donationAuditLogRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private FestivalService festivalService;

    @InjectMocks
    private DonationService donationService;

    private Festival festival;

    @BeforeEach
    void setUp() {
        festival = new Festival();
        festival.setId(1L);
        festival.setName("Unicode Estates Ganesh Chaturthi Celebrations 2026");
        festival.setFestivalType(Festival.FestivalType.GANESH_CHATURTHI);
        festival.setTargetAmount(BigDecimal.ZERO);
        festival.setCurrentCollection(BigDecimal.ZERO);
    }

    @Test
    void testZeroCollection_InitialState() {
        when(donationRepository.sumTotalCollectionByFestivalId(1L)).thenReturn(BigDecimal.ZERO);
        when(donationRepository.countValidDonationsByFestivalId(1L)).thenReturn(0L);

        CollectionSummaryResponse summary = festivalService.getCollectionSummary(1L);

        assertNotNull(summary);
        assertEquals(BigDecimal.ZERO, summary.getCollectedAmount());
        assertEquals(BigDecimal.ZERO, summary.getTargetAmount());
        assertEquals(BigDecimal.ZERO, summary.getRemainingAmount());
        assertEquals(0.0, summary.getPercentage());
    }

    @Test
    void testDynamicTargetRule_WithDonation() {
        // Collected = ₹1,001 -> Target = ₹1,252 (1001 * 1.25 rounded), Remaining = ₹251, Progress = ~80%
        BigDecimal collected = new BigDecimal("1001.00");
        when(donationRepository.sumTotalCollectionByFestivalId(1L)).thenReturn(collected);
        when(donationRepository.countValidDonationsByFestivalId(1L)).thenReturn(1L);

        CollectionSummaryResponse summary = festivalService.getCollectionSummary(1L);

        assertNotNull(summary);
        assertEquals(collected, summary.getCollectedAmount());
        assertEquals(0, new BigDecimal("1252").compareTo(summary.getTargetAmount()));
        assertEquals(0, new BigDecimal("251").compareTo(summary.getRemainingAmount()));
        assertTrue(summary.getPercentage() >= 79.9 && summary.getPercentage() <= 80.0);
    }

    @Test
    void testProcessManualDonation_Success() {
        ManualDonationRequest req = new ManualDonationRequest();
        req.setFestivalId(1L);
        req.setDonorName("Ravi Kumar");
        req.setAmount(new BigDecimal("1001.00"));
        req.setPaymentType(Donation.PaymentType.CASH);
        req.setGotram("Kashyapa");
        req.setFamilyDetails("Ravi & Family");
        req.setPublicVisibility(true);

        Donation donation = new Donation();
        donation.setId(101L);
        donation.setFestival(festival);
        donation.setDonorName(req.getDonorName());
        donation.setAmount(req.getAmount());
        donation.setPaymentType(Donation.PaymentType.CASH);
        donation.setPaymentStatus(Donation.PaymentStatus.COMPLETED);
        donation.setGotram(req.getGotram());
        donation.setFamilyDetails(req.getFamilyDetails());
        donation.setPublicVisibility(true);

        when(festivalRepository.findById(1L)).thenReturn(Optional.of(festival));
        when(donationRepository.save(any(Donation.class))).thenReturn(donation);
        when(receiptRepository.save(any(Receipt.class))).thenAnswer(i -> i.getArgument(0));

        DonationResponse resp = donationService.processManualDonation(req, "Super Admin");

        assertNotNull(resp);
        assertEquals("Ravi Kumar", resp.getDonorName());
        assertEquals(new BigDecimal("1001.00"), resp.getAmount());
        assertEquals(Donation.PaymentType.CASH, resp.getPaymentType());
        verify(donationAuditLogRepository, times(1)).save(any(DonationAuditLog.class));
    }

    @Test
    void testUpdateDonation_WithAmountEditAndAuditTrail() {
        Donation donation = new Donation();
        donation.setId(201L);
        donation.setFestival(festival);
        donation.setDonorName("Ravi Kumar");
        donation.setAmount(new BigDecimal("1001.00"));
        donation.setPaymentType(Donation.PaymentType.CASH);
        donation.setPaymentStatus(Donation.PaymentStatus.COMPLETED);

        DonationUpdateRequest req = new DonationUpdateRequest();
        req.setAmount(new BigDecimal("1500.00"));
        req.setEditReason("Cash correction verified by Super Admin");

        when(donationRepository.findById(201L)).thenReturn(Optional.of(donation));
        when(donationRepository.save(any(Donation.class))).thenReturn(donation);
        when(donationRepository.sumTotalCollectionByFestivalId(1L)).thenReturn(new BigDecimal("1500.00"));

        DonationResponse resp = donationService.updateDonation(201L, req, "Super Admin");

        assertNotNull(resp);
        assertEquals(new BigDecimal("1500.00"), resp.getAmount());
        verify(donationAuditLogRepository, times(1)).save(any(DonationAuditLog.class));
    }

    @Test
    void testReversal_ExcludesFromCollection() {
        Donation donation = new Donation();
        donation.setId(301L);
        donation.setFestival(festival);
        donation.setDonorName("Test Devotee");
        donation.setAmount(new BigDecimal("500.00"));
        donation.setPaymentType(Donation.PaymentType.CASH);
        donation.setPaymentStatus(Donation.PaymentStatus.COMPLETED);

        when(donationRepository.findById(301L)).thenReturn(Optional.of(donation));
        when(donationRepository.save(any(Donation.class))).thenReturn(donation);
        when(donationRepository.sumTotalCollectionByFestivalId(1L)).thenReturn(new BigDecimal("1001.00"));

        DonationResponse resp = donationService.reverseDonation(301L, "Duplicate entry correction", "Super Admin", "SUPER_ADMIN");

        assertNotNull(resp);
        assertTrue(resp.isReversed());
        assertEquals("Duplicate entry correction", resp.getReversalReason());
        verify(donationAuditLogRepository, times(1)).save(any(DonationAuditLog.class));
    }
}

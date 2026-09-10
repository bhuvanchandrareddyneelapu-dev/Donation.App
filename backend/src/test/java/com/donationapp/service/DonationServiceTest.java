package com.donationapp.service;

import com.donationapp.dto.req.DonationCreateRequest;
import com.donationapp.dto.resp.DonationResponse;
import com.donationapp.entity.Donation;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DonationServiceTest {

    @Mock
    private DonationRepository donationRepository;

    @Mock
    private FestivalRepository festivalRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ReceiptRepository receiptRepository;

    @Mock
    private CashDonationLogRepository cashDonationLogRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private EmailService emailService;

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
    void testProcessOnlineDonation_Success() {
        DonationCreateRequest req = new DonationCreateRequest();
        req.setFestivalId(1L);
        req.setDonorName("Ramesh Kumar");
        req.setDonorPhone("+91 9876543210");
        req.setAmount(new BigDecimal("5001.00"));
        req.setPaymentType(Donation.PaymentType.ONLINE);

        Donation donation = new Donation();
        donation.setId(10L);
        donation.setFestival(festival);
        donation.setDonorName(req.getDonorName());
        donation.setDonorPhone(req.getDonorPhone());
        donation.setAmount(req.getAmount());
        donation.setPaymentType(Donation.PaymentType.ONLINE);
        donation.setPaymentStatus(Donation.PaymentStatus.COMPLETED);

        when(festivalRepository.findById(1L)).thenReturn(Optional.of(festival));
        when(donationRepository.save(any(Donation.class))).thenReturn(donation);
        when(receiptRepository.save(any(Receipt.class))).thenAnswer(i -> i.getArgument(0));

        DonationResponse resp = donationService.processOnlineDonation(req);

        assertNotNull(resp);
        assertEquals("Ramesh Kumar", resp.getDonorName());
        assertEquals(new BigDecimal("5001.00"), resp.getAmount());
        assertEquals(Donation.PaymentStatus.COMPLETED, resp.getPaymentStatus());

        verify(donationRepository, times(1)).save(any(Donation.class));
        verify(festivalRepository, times(1)).save(any(Festival.class));
    }

    @Test
    void testResendReceiptEmail_Success() {
        Donation donation = new Donation();
        donation.setId(50L);
        Receipt receipt = new Receipt();
        receipt.setReceiptNumber("REC-50");

        when(donationRepository.findById(50L)).thenReturn(Optional.of(donation));
        when(receiptRepository.findByDonationId(50L)).thenReturn(Optional.of(receipt));

        assertDoesNotThrow(() -> donationService.resendReceiptEmail(50L));

        verify(emailService, times(1)).resendDonationReceiptEmail(donation, receipt);
    }

    @Test
    void testResendReceiptEmail_ReceiptNotFound_ThrowsException() {
        Donation donation = new Donation();
        donation.setId(50L);

        when(donationRepository.findById(50L)).thenReturn(Optional.of(donation));
        when(receiptRepository.findByDonationId(50L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> donationService.resendReceiptEmail(50L));
        assertTrue(ex.getMessage().contains("Receipt not found"));
    }

    @Test
    void testProcessVerifiedOnlineDonation_DuplicatePaymentId_DoesNotTriggerNotificationOrReSaveDonation() {
        com.donationapp.dto.req.RazorpayVerifyRequest req = new com.donationapp.dto.req.RazorpayVerifyRequest();
        req.setRazorpay_order_id("order_dup123");
        req.setRazorpay_payment_id("pay_dup123");
        req.setRazorpay_signature("sig_dup123");
        req.setFestivalId(1L);
        req.setDonorName("Devotee");
        req.setDonorPhone("+91 9999999999");
        req.setAmount(new BigDecimal("1001.00"));

        Donation existingDonation = new Donation();
        existingDonation.setId(88L);
        existingDonation.setFestival(festival);
        existingDonation.setDonorName("Devotee");
        existingDonation.setAmount(new BigDecimal("1001.00"));
        existingDonation.setPaymentStatus(Donation.PaymentStatus.COMPLETED);
        existingDonation.setRazorpayPaymentId("pay_dup123");

        Receipt existingReceipt = new Receipt(existingDonation, "REC-DUP-88", "HASH88");

        when(donationRepository.findByRazorpayPaymentId("pay_dup123")).thenReturn(Optional.of(existingDonation));
        when(receiptRepository.findByDonationId(88L)).thenReturn(Optional.of(existingReceipt));

        DonationResponse resp = donationService.processVerifiedOnlineDonation(req);

        assertNotNull(resp);
        assertEquals("REC-DUP-88", resp.getReceiptNumber());

        // Duplicate payment callback MUST NOT re-save donation or re-trigger email notifications
        verify(donationRepository, never()).save(any());
        verify(notificationService, never()).sendDonationConfirmation(any(), any());
    }
}

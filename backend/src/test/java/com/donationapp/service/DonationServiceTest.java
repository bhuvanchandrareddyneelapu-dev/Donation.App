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

    @InjectMocks
    private DonationService donationService;

    private Festival festival;

    @BeforeEach
    void setUp() {
        festival = new Festival();
        festival.setId(1L);
        festival.setName("Grand Ganesh Chaturthi Mahotsav 2026");
        festival.setFestivalType(Festival.FestivalType.GANESH_CHATURTHI);
        festival.setTargetAmount(new BigDecimal("5000000.00"));
        festival.setCurrentCollection(new BigDecimal("100000.00"));
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
}

package com.donationapp.controller;

import com.donationapp.repository.DonationRepository;
import com.donationapp.repository.FestivalRepository;
import com.donationapp.service.DonationService;
import com.donationapp.service.RazorpayService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentControllerTest {

    @Mock
    private RazorpayService razorpayService;

    @Mock
    private DonationService donationService;

    @Mock
    private FestivalRepository festivalRepository;

    @Mock
    private DonationRepository donationRepository;

    @InjectMocks
    private PaymentController paymentController;

    @Test
    void testGetPaymentConfig_WhenConfigured_ReturnsConfiguredMap() {
        when(razorpayService.getRazorpayKeyId()).thenReturn("rzp_test_12345");
        when(donationService.isTestMode()).thenReturn(true);
        when(donationService.getTestMinAmount()).thenReturn(new BigDecimal("10.00"));

        ResponseEntity<?> response = paymentController.getPaymentConfig();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();

        assertEquals(true, body.get("configured"));
        assertEquals("CONFIGURED", body.get("status"));
        assertEquals("razorpay", body.get("provider"));
        assertEquals("INR", body.get("currency"));
        assertEquals(true, body.get("testMode"));
        assertEquals("rzp_test_12345", body.get("razorpayKeyId"));
        assertNull(body.get("razorpayKeySecret")); // Ensure secrets are not exposed
    }

    @Test
    void testGetPaymentConfig_WhenUnconfigured_ReturnsUnconfiguredMap() {
        when(razorpayService.getRazorpayKeyId()).thenReturn(null);
        when(donationService.isTestMode()).thenReturn(false);

        ResponseEntity<?> response = paymentController.getPaymentConfig();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();

        assertEquals(false, body.get("configured"));
        assertEquals("UNCONFIGURED", body.get("status"));
        assertEquals("", body.get("razorpayKeyId"));
    }
}

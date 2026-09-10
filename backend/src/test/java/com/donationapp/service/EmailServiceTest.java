package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Festival;
import com.donationapp.entity.Receipt;
import com.donationapp.service.email.ResendEmailProvider;
import com.donationapp.service.email.SmtpEmailProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @Mock
    private ResendEmailProvider resendEmailProvider;

    @Mock
    private SmtpEmailProvider smtpEmailProvider;

    @Mock
    private PdfReceiptService pdfReceiptService;

    private EmailService emailService;
    private Donation donation;
    private Receipt receipt;

    @BeforeEach
    void setUp() {
        emailService = new EmailService(resendEmailProvider, smtpEmailProvider, pdfReceiptService);

        ReflectionTestUtils.setField(emailService, "fromEmail", "notifications@donation.app");
        ReflectionTestUtils.setField(emailService, "adminEmail", "admin@donation.app");
        ReflectionTestUtils.setField(emailService, "appBaseUrl", "https://donation-app-frontend-150r.onrender.com");

        Festival festival = new Festival();
        festival.setName("Unicode Estates Ganesh Chaturthi 2026");

        donation = new Donation();
        donation.setId(200L);
        donation.setDonorName("N. LEELA");
        donation.setDonorEmail("donor@example.com");
        donation.setAmount(new BigDecimal("1001.00"));
        donation.setPaymentType(Donation.PaymentType.ONLINE);
        donation.setCreatedAt(LocalDateTime.now());
        donation.setFestival(festival);

        receipt = new Receipt();
        receipt.setReceiptNumber("REC-MANUAL-272201");
        receipt.setQrCodeHash("HASH272201");
        receipt.setDonation(donation);
    }

    @Test
    void testIsConfigured_ReturnsTrueWhenResendConfigured() {
        when(resendEmailProvider.isConfigured()).thenReturn(true);

        assertTrue(emailService.isConfigured());
        assertEquals(resendEmailProvider, emailService.getActiveProvider());
    }

    @Test
    void testIsConfigured_ReturnsTrueWhenSmtpConfiguredAsFallback() {
        when(resendEmailProvider.isConfigured()).thenReturn(false);
        when(smtpEmailProvider.isConfigured()).thenReturn(true);

        assertTrue(emailService.isConfigured());
        assertEquals(smtpEmailProvider, emailService.getActiveProvider());
    }

    @Test
    void testIsConfigured_ReturnsFalseWhenNeitherConfigured() {
        when(resendEmailProvider.isConfigured()).thenReturn(false);
        when(smtpEmailProvider.isConfigured()).thenReturn(false);

        assertFalse(emailService.isConfigured());
    }

    @Test
    void testGetEmailStatusMap_ReportsProviderDetails() {
        when(resendEmailProvider.isConfigured()).thenReturn(true);
        when(resendEmailProvider.getStatusMap()).thenReturn(Map.of(
                "provider", "resend",
                "transport", "https",
                "apiConfigured", true
        ));

        Map<String, Object> status = emailService.getEmailStatusMap();
        assertTrue((Boolean) status.get("configured"));
        assertEquals("resend", status.get("provider"));
        assertEquals("https", status.get("transport"));
    }

    @Test
    void testResendDonationReceiptEmail_Success() throws Exception {
        when(resendEmailProvider.isConfigured()).thenReturn(true);
        when(pdfReceiptService.generateReceiptPdf(any(), any())).thenReturn("%PDF-dummy".getBytes());

        assertDoesNotThrow(() -> emailService.resendDonationReceiptEmail(donation, receipt));

        verify(resendEmailProvider, times(1)).sendDonorReceipt(
                eq(donation), eq(receipt), eq("donor@example.com"),
                contains("Unicode Estates"), contains("Dear N. LEELA"), contains("<!DOCTYPE html>"), any(), eq(true)
        );
        verify(pdfReceiptService, times(1)).generateReceiptPdf(donation, receipt);
    }

    @Test
    void testResendDonationReceiptEmail_MissingDonorEmail_ThrowsException() {
        when(resendEmailProvider.isConfigured()).thenReturn(true);
        donation.setDonorEmail(null);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                emailService.resendDonationReceiptEmail(donation, receipt)
        );

        assertTrue(ex.getMessage().contains("No donor email address provided"));
    }

    @Test
    void testResendDonationReceiptEmail_ProviderException_ThrowsException() throws Exception {
        when(resendEmailProvider.isConfigured()).thenReturn(true);
        when(pdfReceiptService.generateReceiptPdf(any(), any())).thenReturn("%PDF-dummy".getBytes());
        doThrow(new RuntimeException("Resend API 401 Unauthorized")).when(resendEmailProvider)
                .sendDonorReceipt(any(), any(), anyString(), anyString(), anyString(), anyString(), any(), anyBoolean());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                emailService.resendDonationReceiptEmail(donation, receipt)
        );

        assertTrue(ex.getMessage().contains("Failed to resend receipt email"));
    }

    @Test
    void testSendAdminTestEmail_Success() throws Exception {
        when(resendEmailProvider.isConfigured()).thenReturn(true);

        assertDoesNotThrow(() -> emailService.sendAdminTestEmail());

        verify(resendEmailProvider, times(1)).sendTestEmail(
                eq("Donation.App Production Email Test"),
                contains("Donation.App Email Delivery Test"),
                contains("Donation.App Email Delivery Test"),
                eq("admin@donation.app")
        );
    }

    @Test
    void testSendAdminTestEmail_Unconfigured_ThrowsIllegalStateException() {
        when(resendEmailProvider.isConfigured()).thenReturn(false);
        when(smtpEmailProvider.isConfigured()).thenReturn(false);

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                emailService.sendAdminTestEmail()
        );

        assertTrue(ex.getMessage().contains("Production email configuration is incomplete"));
    }

    @Test
    void testSendAdminDonationNotificationEmail_Success() throws Exception {
        when(resendEmailProvider.isConfigured()).thenReturn(true);

        assertDoesNotThrow(() -> emailService.sendAdminDonationNotificationEmail(donation, receipt));

        verify(resendEmailProvider, times(1)).sendAdminNotification(
                eq(donation), eq(receipt), eq("admin@donation.app"),
                contains("New Contribution"), contains("Donation.App Committee Admin Notification")
        );
    }

    @Test
    void testSendDonationReceiptEmail_DoesNotRollbackOnProviderError() throws Exception {
        when(resendEmailProvider.isConfigured()).thenReturn(true);
        when(pdfReceiptService.generateReceiptPdf(any(), any())).thenReturn("%PDF-dummy".getBytes());
        doThrow(new RuntimeException("API Connection Failed")).when(resendEmailProvider)
                .sendDonorReceipt(any(), any(), anyString(), anyString(), anyString(), anyString(), any(), anyBoolean());

        // Should log error without throwing exception (safe for core transaction)
        assertDoesNotThrow(() -> emailService.sendDonationReceiptEmail(donation, receipt));
    }
}

package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Festival;
import com.donationapp.entity.Receipt;
import com.donationapp.service.email.BrevoEmailProvider;
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
    private BrevoEmailProvider brevoEmailProvider;

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
        emailService = new EmailService(brevoEmailProvider, resendEmailProvider, smtpEmailProvider, pdfReceiptService);

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
    void testIsConfigured_ReturnsTrueWhenBrevoConfigured() {
        when(brevoEmailProvider.isConfigured()).thenReturn(true);

        assertTrue(emailService.isConfigured());
        assertEquals(brevoEmailProvider, emailService.getActiveProvider());
    }

    @Test
    void testIsConfigured_ReturnsTrueWhenResendConfiguredAsFallback() {
        when(brevoEmailProvider.isConfigured()).thenReturn(false);
        when(resendEmailProvider.isConfigured()).thenReturn(true);

        assertTrue(emailService.isConfigured());
        assertEquals(resendEmailProvider, emailService.getActiveProvider());
    }

    @Test
    void testIsConfigured_ReturnsTrueWhenSmtpConfiguredAsFallback() {
        when(brevoEmailProvider.isConfigured()).thenReturn(false);
        when(resendEmailProvider.isConfigured()).thenReturn(false);
        when(smtpEmailProvider.isConfigured()).thenReturn(true);

        assertTrue(emailService.isConfigured());
        assertEquals(smtpEmailProvider, emailService.getActiveProvider());
    }

    @Test
    void testIsConfigured_ReturnsFalseWhenNeitherConfigured() {
        when(brevoEmailProvider.isConfigured()).thenReturn(false);
        when(resendEmailProvider.isConfigured()).thenReturn(false);
        when(smtpEmailProvider.isConfigured()).thenReturn(false);

        assertFalse(emailService.isConfigured());
    }

    @Test
    void testGetEmailStatusMap_ReportsBrevoProviderDetails() {
        when(brevoEmailProvider.isConfigured()).thenReturn(true);
        when(brevoEmailProvider.getStatusMap()).thenReturn(Map.of(
                "provider", "brevo",
                "transport", "https",
                "apiConfigured", true
        ));

        Map<String, Object> status = emailService.getEmailStatusMap();
        assertTrue((Boolean) status.get("configured"));
        assertEquals("brevo", status.get("provider"));
        assertEquals("https", status.get("transport"));
    }

    @Test
    void testResendDonationReceiptEmail_Success() throws Exception {
        when(brevoEmailProvider.isConfigured()).thenReturn(true);
        when(pdfReceiptService.generateReceiptPdf(any(), any())).thenReturn("%PDF-dummy".getBytes());

        assertDoesNotThrow(() -> emailService.resendDonationReceiptEmail(donation, receipt));

        verify(brevoEmailProvider, times(1)).sendDonorReceipt(
                eq(donation), eq(receipt), eq("donor@example.com"),
                contains("Unicode Estates"), contains("Dear N. LEELA"), contains("<!DOCTYPE html>"), any(), eq(true)
        );
        verify(pdfReceiptService, times(1)).generateReceiptPdf(donation, receipt);
    }

    @Test
    void testResendDonationReceiptEmail_MissingDonorEmail_ThrowsException() {
        when(brevoEmailProvider.isConfigured()).thenReturn(true);
        donation.setDonorEmail(null);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                emailService.resendDonationReceiptEmail(donation, receipt)
        );

        assertTrue(ex.getMessage().contains("No donor email address provided"));
    }

    @Test
    void testResendDonationReceiptEmail_ProviderException_ThrowsException() throws Exception {
        when(brevoEmailProvider.isConfigured()).thenReturn(true);
        when(pdfReceiptService.generateReceiptPdf(any(), any())).thenReturn("%PDF-dummy".getBytes());
        doThrow(new RuntimeException("Brevo API 401 Unauthorized")).when(brevoEmailProvider)
                .sendDonorReceipt(any(), any(), anyString(), anyString(), anyString(), anyString(), any(), anyBoolean());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                emailService.resendDonationReceiptEmail(donation, receipt)
        );

        assertTrue(ex.getMessage().contains("Failed to resend receipt email"));
    }

    @Test
    void testSendAdminTestEmail_Success() throws Exception {
        when(brevoEmailProvider.isConfigured()).thenReturn(true);

        assertDoesNotThrow(() -> emailService.sendAdminTestEmail());

        verify(brevoEmailProvider, times(1)).sendTestEmail(
                eq("Donation.App Production Email Test"),
                contains("Donation.App Email Delivery Test"),
                contains("Donation.App Email Delivery Test"),
                eq("admin@donation.app")
        );
    }

    @Test
    void testSendAdminTestEmail_Unconfigured_ThrowsIllegalStateException() {
        when(brevoEmailProvider.isConfigured()).thenReturn(false);
        when(resendEmailProvider.isConfigured()).thenReturn(false);
        when(smtpEmailProvider.isConfigured()).thenReturn(false);

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                emailService.sendAdminTestEmail()
        );

        assertTrue(ex.getMessage().contains("Production email configuration is incomplete"));
    }

    @Test
    void testSendAdminDonationNotificationEmail_Success() throws Exception {
        when(brevoEmailProvider.isConfigured()).thenReturn(true);

        assertDoesNotThrow(() -> emailService.sendAdminDonationNotificationEmail(donation, receipt));

        verify(brevoEmailProvider, times(1)).sendAdminNotification(
                eq(donation), eq(receipt), eq("admin@donation.app"),
                contains("New Contribution"), contains("Donation.App Committee Admin Notification")
        );
    }

    @Test
    void testSendDonationReceiptEmail_DoesNotRollbackOnProviderError() throws Exception {
        when(brevoEmailProvider.isConfigured()).thenReturn(true);
        when(pdfReceiptService.generateReceiptPdf(any(), any())).thenReturn("%PDF-dummy".getBytes());
        doThrow(new RuntimeException("API Connection Failed")).when(brevoEmailProvider)
                .sendDonorReceipt(any(), any(), anyString(), anyString(), anyString(), anyString(), any(), anyBoolean());

        // Should log error without throwing exception (safe for core transaction)
        assertDoesNotThrow(() -> emailService.sendDonationReceiptEmail(donation, receipt));
    }

    @Test
    void testSendDonationReceiptEmail_UsesDynamicDonorEmailFromDonationEntity() throws Exception {
        when(brevoEmailProvider.isConfigured()).thenReturn(true);
        when(pdfReceiptService.generateReceiptPdf(any(), any())).thenReturn("%PDF-bytes".getBytes());
        donation.setDonorEmail("dynamic.devotee.99@example.org");

        assertDoesNotThrow(() -> emailService.sendDonationReceiptEmail(donation, receipt));

        verify(brevoEmailProvider, times(1)).sendDonorReceipt(
                eq(donation), eq(receipt), eq("dynamic.devotee.99@example.org"),
                anyString(), anyString(), anyString(), eq("%PDF-bytes".getBytes()), eq(false)
        );
    }

    @Test
    void testSendDonationReceiptEmail_InvalidEmailFormat_SkippedSafely() throws Exception {
        when(brevoEmailProvider.isConfigured()).thenReturn(true);
        donation.setDonorEmail("invalid-email-address");

        assertDoesNotThrow(() -> emailService.sendDonationReceiptEmail(donation, receipt));

        verify(brevoEmailProvider, never()).sendDonorReceipt(any(), any(), any(), any(), any(), any(), any(), anyBoolean());
    }

    @Test
    void testSendDonationReceiptEmail_Brevo401_DoesNotFallbackToResend() throws Exception {
        when(brevoEmailProvider.isConfigured()).thenReturn(true);
        when(pdfReceiptService.generateReceiptPdf(any(), any())).thenReturn("%PDF-bytes".getBytes());
        donation.setDonorEmail("donor.brevo@example.com");

        doThrow(new RuntimeException("Brevo authentication failed. Check BREVO_API_KEY in Render."))
                .when(brevoEmailProvider)
                .sendDonorReceipt(any(), any(), anyString(), anyString(), anyString(), anyString(), any(), anyBoolean());

        assertDoesNotThrow(() -> emailService.sendDonationReceiptEmail(donation, receipt));

        // Brevo fails with 401 -> must NOT call Resend or SMTP
        verify(brevoEmailProvider, times(1)).sendDonorReceipt(any(), any(), eq("donor.brevo@example.com"), any(), any(), any(), any(), eq(false));
        verify(resendEmailProvider, never()).sendDonorReceipt(any(), any(), any(), any(), any(), any(), any(), anyBoolean());
        verify(smtpEmailProvider, never()).sendDonorReceipt(any(), any(), any(), any(), any(), any(), any(), anyBoolean());
    }

    @Test
    void testSendDonationReceiptEmail_Resend403FallbackToSmtp() throws Exception {
        // This test verifies the legacy fallback when Resend is the active provider.
        // When Brevo is active this code path is not reached.
        when(brevoEmailProvider.isConfigured()).thenReturn(false);
        when(resendEmailProvider.isConfigured()).thenReturn(true);
        when(smtpEmailProvider.isConfigured()).thenReturn(true);
        when(pdfReceiptService.generateReceiptPdf(any(), any())).thenReturn("%PDF-bytes".getBytes());
        donation.setDonorEmail("donor.fallback@example.com");

        doThrow(new RuntimeException("Resend API failed with status 403: domain restriction"))
                .when(resendEmailProvider)
                .sendDonorReceipt(any(), any(), anyString(), anyString(), anyString(), anyString(), any(), anyBoolean());

        assertDoesNotThrow(() -> emailService.sendDonationReceiptEmail(donation, receipt));

        // Resend fails with 403 -> falls back to SMTP provider successfully
        verify(resendEmailProvider, times(1)).sendDonorReceipt(any(), any(), eq("donor.fallback@example.com"), any(), any(), any(), any(), eq(false));
        verify(smtpEmailProvider, times(1)).sendDonorReceipt(any(), any(), eq("donor.fallback@example.com"), any(), any(), any(), any(), eq(false));
    }
}

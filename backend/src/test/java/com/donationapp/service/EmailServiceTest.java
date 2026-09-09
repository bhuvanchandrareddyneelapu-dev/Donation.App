package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Festival;
import com.donationapp.entity.Receipt;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private PdfReceiptService pdfReceiptService;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    private Donation donation;
    private Receipt receipt;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(emailService, "fromEmail", "notifications@donation.app");
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
    void testResendDonationReceiptEmail_Success() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(pdfReceiptService.generateReceiptPdf(any(), any())).thenReturn("%PDF-dummy".getBytes());

        assertDoesNotThrow(() -> emailService.resendDonationReceiptEmail(donation, receipt));

        verify(mailSender, times(1)).send(any(MimeMessage.class));
        verify(pdfReceiptService, times(1)).generateReceiptPdf(donation, receipt);
    }

    @Test
    void testResendDonationReceiptEmail_MissingDonorEmail_ThrowsException() {
        donation.setDonorEmail(null);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                emailService.resendDonationReceiptEmail(donation, receipt)
        );

        assertTrue(ex.getMessage().contains("No donor email address provided"));
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    void testResendDonationReceiptEmail_SmtpException_ThrowsException() {
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(pdfReceiptService.generateReceiptPdf(any(), any())).thenReturn("%PDF-dummy".getBytes());
        doThrow(new MailSendException("SMTP server connection refused")).when(mailSender).send(any(MimeMessage.class));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                emailService.resendDonationReceiptEmail(donation, receipt)
        );

        assertTrue(ex.getMessage().contains("Failed to send receipt email via SMTP"));
    }
}

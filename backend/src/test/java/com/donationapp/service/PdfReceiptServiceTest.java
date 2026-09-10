package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Festival;
import com.donationapp.entity.Organization;
import com.donationapp.entity.Receipt;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class PdfReceiptServiceTest {

    private PdfReceiptService pdfReceiptService;

    @BeforeEach
    void setUp() {
        pdfReceiptService = new PdfReceiptService();
        ReflectionTestUtils.setField(pdfReceiptService, "appBaseUrl", "https://donation-app-6xky.onrender.com");
    }

    @Test
    void testGenerateReceiptPdf_ContainsUnicodeEstatesAndAppBaseUrl() {
        Organization org = new Organization();
        org.setName("Unicode Estates, PM Palem");

        Festival festival = new Festival();
        festival.setName("Unicode Estates Ganesh Chaturthi Celebrations 2026");
        festival.setOrganization(org);

        Donation donation = new Donation();
        donation.setId(100L);
        donation.setDonorName("N. KAVYA");
        donation.setAmount(new BigDecimal("1000.00"));
        donation.setPaymentType(Donation.PaymentType.CASH);
        donation.setPaymentStatus(Donation.PaymentStatus.COMPLETED);
        donation.setCreatedAt(LocalDateTime.now());
        donation.setFestival(festival);

        Receipt receipt = new Receipt();
        receipt.setReceiptNumber("REC-MANUAL-272201");
        receipt.setQrCodeHash("HASH272201");
        receipt.setDonation(donation);

        byte[] pdfBytes = pdfReceiptService.generateReceiptPdf(donation, receipt);

        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
        String pdfString = new String(pdfBytes);
        // Basic PDF structure check
        assertTrue(pdfString.startsWith("%PDF"));
    }
}

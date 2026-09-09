package com.donationapp.controller;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import com.donationapp.repository.DonationRepository;
import com.donationapp.repository.ReceiptRepository;
import com.donationapp.service.PdfReceiptService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ReceiptControllerTest {

    @Mock
    private ReceiptRepository receiptRepository;

    @Mock
    private DonationRepository donationRepository;

    @Mock
    private PdfReceiptService pdfReceiptService;

    @InjectMocks
    private ReceiptController receiptController;

    private Donation donation;
    private Receipt receipt;

    @BeforeEach
    void setUp() {
        donation = new Donation();
        donation.setId(42L);
        donation.setDonorName("Test Donor");
        donation.setAmount(new BigDecimal("1000.00"));

        receipt = new Receipt();
        receipt.setId(10L);
        receipt.setReceiptNumber("REC-TEST-42001");
        receipt.setQrCodeHash("HASH42001");
        receipt.setDonation(donation);
    }

    @Test
    void testDownloadReceiptPdf_ByReceiptNumber_Returns200AndPdfContentType() {
        when(receiptRepository.findByReceiptNumber("REC-TEST-42001")).thenReturn(Optional.of(receipt));
        byte[] dummyPdf = "%PDF-1.4 mock receipt pdf bytes".getBytes();
        when(pdfReceiptService.generateReceiptPdf(any(), any())).thenReturn(dummyPdf);

        ResponseEntity<byte[]> response = receiptController.downloadReceiptPdf("REC-TEST-42001");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(MediaType.APPLICATION_PDF, response.getHeaders().getContentType());
        assertTrue(response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION).contains("Receipt_REC-TEST-42001.pdf"));
        assertNotNull(response.getBody());
        assertTrue(response.getBody().length > 0);
    }

    @Test
    void testDownloadReceiptPdf_ByDonationId_Returns200() {
        when(receiptRepository.findByReceiptNumber("42")).thenReturn(Optional.empty());
        when(receiptRepository.findByQrCodeHash("42")).thenReturn(Optional.empty());
        when(receiptRepository.findByDonationId(42L)).thenReturn(Optional.of(receipt));
        byte[] dummyPdf = "%PDF-1.4 mock receipt pdf bytes".getBytes();
        when(pdfReceiptService.generateReceiptPdf(any(), any())).thenReturn(dummyPdf);

        ResponseEntity<byte[]> response = receiptController.downloadReceiptPdf("42");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(MediaType.APPLICATION_PDF, response.getHeaders().getContentType());
        assertTrue(response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION).contains("Receipt_REC-TEST-42001.pdf"));
    }

    @Test
    void testDownloadReceiptPdf_NotFound_Returns404() {
        when(receiptRepository.findByReceiptNumber("NONEXISTENT")).thenReturn(Optional.empty());
        when(receiptRepository.findByQrCodeHash("NONEXISTENT")).thenReturn(Optional.empty());

        ResponseEntity<byte[]> response = receiptController.downloadReceiptPdf("NONEXISTENT");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}

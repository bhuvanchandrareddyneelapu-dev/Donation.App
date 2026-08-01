package com.donationapp.controller;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import com.donationapp.repository.DonationRepository;
import com.donationapp.repository.ReceiptRepository;
import com.donationapp.service.PdfReceiptService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/receipts")
public class ReceiptController {

    private final ReceiptRepository receiptRepository;
    private final DonationRepository donationRepository;
    private final PdfReceiptService pdfReceiptService;

    public ReceiptController(ReceiptRepository receiptRepository, DonationRepository donationRepository,
                             PdfReceiptService pdfReceiptService) {
        this.receiptRepository = receiptRepository;
        this.donationRepository = donationRepository;
        this.pdfReceiptService = pdfReceiptService;
    }

    @GetMapping("/verify/{hash}")
    public ResponseEntity<?> verifyReceiptByHash(@PathVariable String hash) {
        Receipt receipt = receiptRepository.findByQrCodeHash(hash)
                .orElseGet(() -> receiptRepository.findByReceiptNumber(hash).orElse(null));

        if (receipt == null) {
            return ResponseEntity.notFound().build();
        }

        Donation donation = receipt.getDonation();
        Map<String, Object> details = new HashMap<>();
        details.put("receiptNumber", receipt.getReceiptNumber());
        details.put("qrCodeHash", receipt.getQrCodeHash());
        details.put("festivalName", donation.getFestival().getName());
        details.put("donorName", donation.isAnonymous() ? "Anonymous Donor" : donation.getDonorName());
        details.put("amount", donation.getAmount());
        details.put("paymentType", donation.getPaymentType());
        details.put("paymentStatus", donation.getPaymentStatus());
        details.put("generatedAt", receipt.getGeneratedAt());
        details.put("verified", true);

        return ResponseEntity.ok(details);
    }

    @GetMapping("/{receiptNumber}/pdf")
    public ResponseEntity<byte[]> downloadReceiptPdf(@PathVariable String receiptNumber) {
        Receipt receipt = receiptRepository.findByReceiptNumber(receiptNumber)
                .orElseThrow(() -> new RuntimeException("Receipt not found: " + receiptNumber));

        Donation donation = receipt.getDonation();
        byte[] pdfBytes = pdfReceiptService.generateReceiptPdf(donation, receipt);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + receiptNumber + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}

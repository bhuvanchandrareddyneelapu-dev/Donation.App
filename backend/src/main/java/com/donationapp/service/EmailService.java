package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final PdfReceiptService pdfReceiptService;

    @Value("${donationapp.email.from:notifications@donation.app}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender, PdfReceiptService pdfReceiptService) {
        this.mailSender = mailSender;
        this.pdfReceiptService = pdfReceiptService;
    }

    public void sendDonationReceiptEmail(Donation donation, Receipt receipt) {
        try {
            String recipientEmail = getRecipientEmail(donation);
            if (recipientEmail == null || recipientEmail.isBlank()) {
                logger.info("Skipping email notification for donation ID {}: No donor email address provided", donation.getId());
                return;
            }

            String donorName = donation.isAnonymous() ? "Valued Devotee" : donation.getDonorName();
            String festivalName = donation.getFestival() != null ? donation.getFestival().getName() : "Festival Event";
            String receiptNo = receipt != null ? receipt.getReceiptNumber() : "N/A";
            String formattedDate = donation.getCreatedAt() != null
                    ? donation.getCreatedAt().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy hh:mm a"))
                    : "N/A";
            String verificationUrl = receipt != null && receipt.getQrCodeHash() != null
                    ? "https://donation.app/verify/" + receipt.getQrCodeHash()
                    : "https://donation.app/verify";

            String subject = "Official Donation Receipt: " + receiptNo + " - " + festivalName;

            String body = String.format(
                    "Dear %s,\n\n" +
                    "Thank you for your generous contribution of ₹%.2f towards %s.\n\n" +
                    "Your contribution supports festival arrangements, community meals (Mahaprasadam), and social welfare initiatives.\n\n" +
                    "--- DONATION SUMMARY ---\n" +
                    "Donor Name: %s\n" +
                    "Festival Event: %s\n" +
                    "Donation Amount: ₹%.2f\n" +
                    "Payment Reference: %s\n" +
                    "Donation Date: %s\n" +
                    "Receipt Number: %s\n" +
                    "Receipt Verification Link: %s\n\n" +
                    "Your official PDF receipt is attached to this email.\n\n" +
                    "May Lord Ganesha / Goddess Durga bless you and your family with health, peace, and prosperity.\n\n" +
                    "Warm regards,\n" +
                    "%s Executive Committee\n" +
                    "Donation.App Digital Platform",
                    donorName,
                    donation.getAmount(),
                    festivalName,
                    donorName,
                    festivalName,
                    donation.getAmount(),
                    donation.getTransactionId() != null ? donation.getTransactionId() : "N/A",
                    formattedDate,
                    receiptNo,
                    verificationUrl,
                    festivalName
            );

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(recipientEmail);
            helper.setSubject(subject);
            helper.setText(body);

            // Attach PDF receipt if generated reliably
            if (receipt != null) {
                try {
                    byte[] pdfBytes = pdfReceiptService.generateReceiptPdf(donation, receipt);
                    if (pdfBytes != null && pdfBytes.length > 0) {
                        helper.addAttachment("Receipt_" + receiptNo + ".pdf", new ByteArrayResource(pdfBytes));
                    }
                } catch (Exception pdfEx) {
                    logger.warn("Could not attach PDF receipt for receipt {}: {}", receiptNo, pdfEx.getMessage());
                }
            }

            mailSender.send(message);
            logger.info("Successfully sent donation receipt email to {} for receipt {}", recipientEmail, receiptNo);

        } catch (Exception e) {
            // Requirement 10: Email failure must NOT roll back successful payment/donation
            logger.error("Failed to send donation receipt email for donation ID {}: {}", donation.getId(), e.getMessage());
        }
    }

    private String getRecipientEmail(Donation donation) {
        if (donation.getDonor() != null && donation.getDonor().getEmail() != null && !donation.getDonor().getEmail().isBlank()) {
            return donation.getDonor().getEmail();
        }
        return null;
    }
}

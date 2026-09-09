package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import jakarta.annotation.PostConstruct;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final PdfReceiptService pdfReceiptService;

    @Value("${spring.mail.host:}")
    private String smtpHost;

    @Value("${spring.mail.port:587}")
    private int smtpPort;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    @Value("${spring.mail.password:}")
    private String smtpPassword;

    @Value("${spring.mail.properties.mail.smtp.auth:true}")
    private boolean smtpAuth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable:true}")
    private boolean startTls;

    @Value("${donationapp.email.from:${spring.mail.username:}}")
    private String fromEmail;

    @Value("${donationapp.email.admin-email:${spring.mail.username:}}")
    private String adminEmail;

    @Value("${donationapp.app-base-url:https://donation-app-frontend-150r.onrender.com}")
    private String appBaseUrl;

    public EmailService(JavaMailSender mailSender, PdfReceiptService pdfReceiptService) {
        this.mailSender = mailSender;
        this.pdfReceiptService = pdfReceiptService;
    }

    @PostConstruct
    public void initDiagnostics() {
        if (isConfigured()) {
            logger.info("[EmailConfig] Production SMTP email configuration initialized: provider=smtp, host={}, port={}, username={}, from={}, adminRecipient={}, starttls={}, auth={}",
                    smtpHost, smtpPort, maskEmail(smtpUsername), maskEmail(fromEmail), maskEmail(adminEmail), startTls, smtpAuth);
        } else {
            logger.warn("[EmailConfig] Production SMTP email configuration is INCOMPLETE or UNCONFIGURED. Missing host, username, password, or recipient addresses. Host={}, Port={}, Username={}, From={}, Admin={}",
                    smtpHost, smtpPort, maskEmail(smtpUsername), maskEmail(fromEmail), maskEmail(adminEmail));
        }
    }

    public boolean isConfigured() {
        return smtpHost != null && !smtpHost.isBlank()
                && smtpUsername != null && !smtpUsername.isBlank()
                && smtpPassword != null && !smtpPassword.isBlank()
                && fromEmail != null && !fromEmail.isBlank()
                && adminEmail != null && !adminEmail.isBlank();
    }

    public Map<String, Object> getSmtpStatusMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("configured", isConfigured());
        map.put("smtpHost", (smtpHost != null && !smtpHost.isBlank()) ? smtpHost : "unconfigured");
        map.put("smtpPort", smtpPort);
        map.put("smtpAuth", smtpAuth);
        map.put("startTls", startTls);
        map.put("fromConfigured", fromEmail != null && !fromEmail.isBlank());
        map.put("adminRecipientConfigured", adminEmail != null && !adminEmail.isBlank());
        map.put("fromEmail", maskEmail(fromEmail));
        map.put("adminEmail", maskEmail(adminEmail));
        return map;
    }

    public void sendDonationReceiptEmail(Donation donation, Receipt receipt) {
        if (!isConfigured()) {
            logger.info("Skipping automated donor receipt email for donation ID {}: SMTP email configuration is unconfigured", donation.getId());
            return;
        }
        try {
            sendDonationReceiptEmailInternal(donation, receipt, false);
        } catch (Exception e) {
            logger.error("Failed to send donor receipt email for donation ID {}: {}", donation.getId(), e.getMessage());
        }
    }

    public void resendDonationReceiptEmail(Donation donation, Receipt receipt) {
        logger.info("[ResendEmail] Resend receipt email requested for donation ID {}", donation.getId());
        if (!isConfigured()) {
            throw new IllegalStateException("SMTP email configuration is incomplete on server. Please set SPRING_MAIL_HOST, SPRING_MAIL_USERNAME, SPRING_MAIL_PASSWORD, MAIL_FROM, and DONATION_ADMIN_EMAIL.");
        }
        try {
            sendDonationReceiptEmailInternal(donation, receipt, true);
        } catch (RuntimeException re) {
            throw re;
        } catch (Exception e) {
            throw new RuntimeException("Failed to resend receipt email: " + e.getMessage(), e);
        }
    }

    public void sendAdminTestEmail() {
        if (!isConfigured()) {
            throw new IllegalStateException("SMTP email configuration is incomplete on server. Required environment variables: SPRING_MAIL_HOST, SPRING_MAIL_USERNAME, SPRING_MAIL_PASSWORD, MAIL_FROM, DONATION_ADMIN_EMAIL.");
        }

        try {
            String subject = "Donation.App Production Email Test";
            String formattedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy hh:mm:ss a"));
            String baseUrl = (appBaseUrl != null ? appBaseUrl : "https://donation-app-frontend-150r.onrender.com").replaceAll("/+$", "");

            String plainText = String.format(
                    "Donation.App Email Delivery Test\n\n" +
                    "This is a real production SMTP delivery test.\n\n" +
                    "Environment: production\n" +
                    "Application: Donation.App\n" +
                    "Organization: Unicode Estates, PM Palem\n\n" +
                    "If you received this email, SMTP delivery is working correctly.\n\n" +
                    "Timestamp: %s\n" +
                    "Application Base URL: %s\n" +
                    "Sender: %s\n",
                    formattedDate,
                    baseUrl,
                    maskEmail(fromEmail)
            );

            String htmlText = String.format(
                    "<!DOCTYPE html><html><head><style>" +
                    "body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px; }" +
                    ".card { max-width: 550px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }" +
                    ".header { color: #f97316; font-size: 20px; font-weight: bold; text-align: center; border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 16px; }" +
                    ".badge { display: inline-block; padding: 4px 12px; background: rgba(16, 185, 129, 0.2); color: #10b981; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 16px; }" +
                    ".info { background: #0f172a; border-radius: 10px; padding: 14px; font-size: 13px; color: #cbd5e1; border: 1px solid #334155; line-height: 1.6; }" +
                    "</style></head><body>" +
                    "<div class='card'>" +
                    "<div class='header'>Donation.App Email Delivery Test</div>" +
                    "<div style='text-align:center;'><span class='badge'>✓ Production SMTP Test</span></div>" +
                    "<p>This is a real production SMTP delivery test.</p>" +
                    "<div class='info'>" +
                    "<strong>Environment:</strong> production<br>" +
                    "<strong>Application:</strong> Donation.App<br>" +
                    "<strong>Organization:</strong> Unicode Estates, PM Palem<br>" +
                    "<strong>Timestamp:</strong> %s<br>" +
                    "<strong>Base URL:</strong> %s<br>" +
                    "<strong>Sender:</strong> %s" +
                    "</div>" +
                    "<p style='text-align:center; color: #10b981; font-weight: bold; margin-top: 20px;'>If you received this email, SMTP delivery is working correctly.</p>" +
                    "</div></body></html>",
                    formattedDate,
                    baseUrl,
                    maskEmail(fromEmail)
            );

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject(subject);
            helper.setText(plainText, htmlText);

            logger.info("[AdminTestEmail] Attempting SMTP test email send to {}", maskEmail(adminEmail));
            mailSender.send(message);
            logger.info("[AdminTestEmail] SMTP test email send SUCCEEDED to {}", maskEmail(adminEmail));

        } catch (Exception e) {
            logger.error("[AdminTestEmail] SMTP test email send FAILED to {}: {}", maskEmail(adminEmail), e.getMessage());
            throw new RuntimeException("Failed to send test email: " + e.getMessage(), e);
        }
    }

    public void sendAdminDonationNotificationEmail(Donation donation, Receipt receipt) {
        if (!isConfigured()) {
            logger.info("Skipping admin notification email for donation ID {}: SMTP email configuration is unconfigured", donation.getId());
            return;
        }

        try {
            String donorName = donation.isAnonymous() ? "Anonymous Donor" : donation.getDonorName();
            String festivalName = donation.getFestival() != null ? donation.getFestival().getName() : "Festival Event";
            String receiptNo = receipt != null ? receipt.getReceiptNumber() : "N/A";
            String formattedDate = donation.getCreatedAt() != null
                    ? donation.getCreatedAt().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy hh:mm a"))
                    : "N/A";

            String subject = String.format("[Donation.App Notification] New Contribution: ₹%.2f (%s) - Receipt #%s",
                    donation.getAmount(), donation.getPaymentType(), receiptNo);

            String body = String.format(
                    "Donation.App Committee Admin Notification\n\n" +
                    "A new donation contribution has been successfully recorded:\n\n" +
                    "Receipt Number: %s\n" +
                    "Donor Name: %s\n" +
                    "Amount: ₹%.2f\n" +
                    "Payment Method: %s\n" +
                    "Transaction Reference: %s\n" +
                    "Festival Event: %s\n" +
                    "Recorded At: %s\n" +
                    "Donation ID: %d\n\n" +
                    "Verified by Donation.App Platform Architecture.",
                    receiptNo,
                    donorName,
                    donation.getAmount(),
                    donation.getPaymentType(),
                    donation.getTransactionId() != null ? donation.getTransactionId() : "N/A",
                    festivalName,
                    formattedDate,
                    donation.getId()
            );

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject(subject);
            helper.setText(body);

            mailSender.send(message);
            logger.info("Successfully sent admin notification email to {} for donation ID {}", maskEmail(adminEmail), donation.getId());

        } catch (Exception e) {
            logger.error("Failed to send admin notification email for donation ID {}: {}", donation.getId(), e.getMessage());
        }
    }

    private void sendDonationReceiptEmailInternal(Donation donation, Receipt receipt, boolean isResend) throws Exception {
        String recipientEmail = getRecipientEmail(donation);
        if (recipientEmail == null || recipientEmail.isBlank()) {
            String msg = "No donor email address provided for donation ID: " + donation.getId();
            logger.error("[ResendEmail] Failed: {}", msg);
            if (isResend) {
                throw new IllegalArgumentException(msg);
            }
            logger.info("Skipping donor email notification for donation ID {}: {}", donation.getId(), msg);
            return;
        }

        logger.info("[ResendEmail] Recipient email found: {}", maskEmail(recipientEmail));

        String donorName = donation.isAnonymous() ? "Valued Devotee" : donation.getDonorName();
        String festivalName = donation.getFestival() != null ? donation.getFestival().getName() : "Unicode Estates Ganesh Chaturthi Celebrations 2026";
        String receiptNo = receipt != null ? receipt.getReceiptNumber() : "N/A";
        String formattedDate = donation.getCreatedAt() != null
                ? donation.getCreatedAt().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy hh:mm a"))
                : "N/A";

        String baseUrl = (appBaseUrl != null ? appBaseUrl : "https://donation-app-frontend-150r.onrender.com").replaceAll("/+$", "");
        String qrHash = (receipt != null && receipt.getQrCodeHash() != null) ? receipt.getQrCodeHash() : receiptNo;
        String verificationUrl = baseUrl + "/verify/" + qrHash;

        String subject = "Thank You for Your Contribution – Unicode Estates Ganesh Chaturthi 2026";

        String plainText = String.format(
                "Dear %s,\n\n" +
                "Thank you for your generous contribution to the Unicode Estates Ganesh Chaturthi Celebrations 2026.\n\n" +
                "Contribution Details:\n" +
                "- Donor Name: %s\n" +
                "- Amount: ₹%.2f\n" +
                "- Payment Method: %s\n" +
                "- Receipt Number: %s\n" +
                "- Date & Time: %s\n" +
                "- Transaction / Reference ID: %s\n\n" +
                "Your receipt can be verified online anytime.\n" +
                "Receipt Verification Link: %s\n\n" +
                "Your official PDF receipt is attached to this email.\n\n" +
                "May Lord Ganesha bless you and your family with health, peace, and prosperity.\n" +
                "Ganpati Bappa Morya! 🙏\n\n" +
                "Warm regards,\n" +
                "Unicode Estates Executive Committee\n" +
                "Unicode Estates, PM Palem, Visakhapatnam\n" +
                "Donation.App Digital Platform",
                donorName,
                donorName,
                donation.getAmount(),
                donation.getPaymentType(),
                receiptNo,
                formattedDate,
                donation.getTransactionId() != null ? donation.getTransactionId() : "N/A",
                verificationUrl
        );

        String htmlText = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head><style>" +
                "body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }" +
                ".container { max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }" +
                ".header { text-align: center; border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px; }" +
                ".header h2 { color: #f97316; margin: 0; font-size: 22px; }" +
                ".subHeader { color: #94a3b8; font-size: 13px; margin-top: 4px; font-weight: 600; }" +
                ".badge { display: inline-block; padding: 4px 12px; background: rgba(249, 115, 22, 0.15); color: #fb923c; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-top: 8px; }" +
                ".details { background: #0f172a; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #334155; }" +
                ".row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e293b; font-size: 14px; }" +
                ".row:last-child { border-bottom: none; }" +
                ".label { color: #94a3b8; font-weight: 600; }" +
                ".value { color: #f8fafc; font-weight: bold; text-align: right; }" +
                ".highlight { color: #10b981; font-size: 18px; }" +
                ".button { display: block; width: fit-content; margin: 24px auto 12px auto; padding: 12px 24px; background: #f97316; color: #ffffff !important; text-decoration: none; font-weight: bold; border-radius: 10px; text-align: center; font-size: 14px; }" +
                ".footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #334155; padding-top: 16px; }" +
                "</style></head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h2>Donation.App</h2>" +
                "<div class='subHeader'>Unicode Estates, PM Palem</div>" +
                "<span class='badge'>Official Donation Confirmation</span>" +
                "</div>" +
                "<p>Dear <strong>%s</strong>,</p>" +
                "<p>Thank you for your generous contribution to the <strong>Unicode Estates Ganesh Chaturthi Celebrations 2026</strong>. Your contribution supports festival arrangements, Mahaprasadam, and community welfare initiatives.</p>" +
                "<div class='details'>" +
                "<div class='row'><span class='label'>Donor Name</span><span class='value'>%s</span></div>" +
                "<div class='row'><span class='label'>Contribution Amount</span><span class='value highlight'>₹%.2f</span></div>" +
                "<div class='row'><span class='label'>Payment Method</span><span class='value'>%s</span></div>" +
                "<div class='row'><span class='label'>Receipt Number</span><span class='value' style='color:#f97316;'>%s</span></div>" +
                "<div class='row'><span class='label'>Contribution Date</span><span class='value'>%s</span></div>" +
                "<div class='row'><span class='label'>Transaction Reference</span><span class='value'>%s</span></div>" +
                "</div>" +
                "<p style='text-align:center; font-size:13px; color:#cbd5e1;'>Your receipt can be verified online anytime.</p>" +
                "<a href='%s' class='button'>Verify Receipt</a>" +
                "<p style='text-align:center; color:#fb923c; font-weight:bold; margin-top:20px;'>May Lord Ganesha bless you and your family with health, peace, and prosperity.<br>Ganpati Bappa Morya! 🙏</p>" +
                "<div class='footer'>" +
                "<p>Warm regards,<br><strong>Unicode Estates Executive Committee</strong><br>Unicode Estates, PM Palem, Visakhapatnam<br>Donation.App Digital Platform</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>",
                donorName,
                donorName,
                donation.getAmount(),
                donation.getPaymentType(),
                receiptNo,
                formattedDate,
                donation.getTransactionId() != null ? donation.getTransactionId() : "N/A",
                verificationUrl
        );

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(recipientEmail);
        helper.setSubject(subject);
        helper.setText(plainText, htmlText);

        // Attach PDF receipt
        if (receipt != null) {
            try {
                byte[] pdfBytes = pdfReceiptService.generateReceiptPdf(donation, receipt);
                if (pdfBytes != null && pdfBytes.length > 0) {
                    helper.addAttachment("Receipt_" + receiptNo + ".pdf", new ByteArrayResource(pdfBytes));
                } else if (isResend) {
                    throw new RuntimeException("PDF receipt bytes empty for receipt: " + receiptNo);
                }
            } catch (Exception pdfEx) {
                logger.error("Failed to generate PDF attachment for receipt {}: {}", receiptNo, pdfEx.getMessage());
                if (isResend) {
                    throw new RuntimeException("Failed to attach PDF receipt: " + pdfEx.getMessage(), pdfEx);
                }
            }
        }

        try {
            logger.info("[ResendEmail] Attempting SMTP email send to {} for receipt #{}", maskEmail(recipientEmail), receiptNo);
            mailSender.send(message);
            logger.info("[ResendEmail] SMTP email send SUCCEEDED to {} for receipt #{}", maskEmail(recipientEmail), receiptNo);
        } catch (Exception smtpEx) {
            logger.error("[ResendEmail] SMTP email send FAILED for donation ID {}: {}", donation.getId(), smtpEx.getMessage());
            if (isResend) {
                throw new RuntimeException("Failed to send receipt email via SMTP: " + smtpEx.getMessage(), smtpEx);
            }
        }
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        int atIndex = email.indexOf("@");
        if (atIndex <= 1) return "*@*" + email.substring(atIndex);
        return email.substring(0, 1) + "***" + email.substring(atIndex - 1);
    }

    private String getRecipientEmail(Donation donation) {
        if (donation.getDonorEmail() != null && !donation.getDonorEmail().isBlank()) {
            return donation.getDonorEmail();
        }
        if (donation.getDonor() != null && donation.getDonor().getEmail() != null && !donation.getDonor().getEmail().isBlank()) {
            return donation.getDonor().getEmail();
        }
        return null;
    }
}

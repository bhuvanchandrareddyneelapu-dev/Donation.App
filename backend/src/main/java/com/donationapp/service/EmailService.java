package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import com.donationapp.service.email.EmailProvider;
import com.donationapp.service.email.ResendEmailProvider;
import com.donationapp.service.email.SmtpEmailProvider;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final ResendEmailProvider resendEmailProvider;
    private final SmtpEmailProvider smtpEmailProvider;
    private final PdfReceiptService pdfReceiptService;

    @Value("${donationapp.email.from:${spring.mail.username:}}")
    private String fromEmail;

    @Value("${donationapp.email.admin-email:${spring.mail.username:}}")
    private String adminEmail;

    @Value("${donationapp.app-base-url:https://donation-app-frontend-150r.onrender.com}")
    private String appBaseUrl;

    public EmailService(ResendEmailProvider resendEmailProvider,
                        SmtpEmailProvider smtpEmailProvider,
                        PdfReceiptService pdfReceiptService) {
        this.resendEmailProvider = resendEmailProvider;
        this.smtpEmailProvider = smtpEmailProvider;
        this.pdfReceiptService = pdfReceiptService;
    }

    @PostConstruct
    public void initDiagnostics() {
        EmailProvider provider = getActiveProvider();
        if (provider != null && provider.isConfigured()) {
            logger.info("[EmailConfig] Production email service initialized: provider={}, transport={}, from={}, adminRecipient={}",
                    provider.getProviderName(), provider.getTransportType(), maskEmail(fromEmail), maskEmail(adminEmail));
        } else {
            logger.warn("[EmailConfig] Production email service is UNCONFIGURED. Missing RESEND_API_KEY or SMTP credentials. From={}, Admin={}",
                    maskEmail(fromEmail), maskEmail(adminEmail));
        }
    }

    public EmailProvider getActiveProvider() {
        if (resendEmailProvider != null && resendEmailProvider.isConfigured()) {
            return resendEmailProvider;
        }
        if (smtpEmailProvider != null && smtpEmailProvider.isConfigured()) {
            return smtpEmailProvider;
        }
        return resendEmailProvider; // Default fallback to resend for status reporting if neither is fully set up
    }

    public boolean isConfigured() {
        EmailProvider provider = getActiveProvider();
        return provider != null && provider.isConfigured();
    }

    public Map<String, Object> getEmailStatusMap() {
        EmailProvider provider = getActiveProvider();
        if (provider != null) {
            Map<String, Object> map = new HashMap<>(provider.getStatusMap());
            map.put("configured", isConfigured());
            return map;
        }
        Map<String, Object> map = new HashMap<>();
        map.put("configured", false);
        map.put("provider", "unconfigured");
        map.put("transport", "none");
        map.put("fromEmail", maskEmail(fromEmail));
        map.put("adminEmail", maskEmail(adminEmail));
        return map;
    }

    public Map<String, Object> getSmtpStatusMap() {
        return getEmailStatusMap();
    }

    public void sendDonationReceiptEmail(Donation donation, Receipt receipt) {
        if (!isConfigured()) {
            logger.info("Skipping automated donor receipt email for donation ID {}: email service is unconfigured", donation.getId());
            return;
        }
        try {
            sendDonationReceiptEmailInternal(donation, receipt, false);
        } catch (Exception e) {
            EmailProvider provider = getActiveProvider();
            String recipientEmail = getRecipientEmail(donation);
            logger.error("EMAIL_SEND_FAILED donationId={} recipient={} provider={} error={}",
                    donation.getId(), maskEmail(recipientEmail), provider != null ? provider.getProviderName() : "unknown", e.getMessage());
        }
    }

    public void resendDonationReceiptEmail(Donation donation, Receipt receipt) {
        logger.info("[ResendEmail] Resend receipt email requested for donation ID {}", donation.getId());
        if (!isConfigured()) {
            throw new IllegalStateException("Production email configuration is incomplete on server. Required environment variables: RESEND_API_KEY (or SMTP host/user/pass), MAIL_FROM, and DONATION_ADMIN_EMAIL.");
        }
        try {
            sendDonationReceiptEmailInternal(donation, receipt, true);
        } catch (IllegalArgumentException iae) {
            throw iae;
        } catch (Exception e) {
            throw new RuntimeException("Failed to resend receipt email: " + e.getMessage(), e);
        }
    }

    public void sendAdminTestEmail() {
        if (!isConfigured()) {
            throw new IllegalStateException("Production email configuration is incomplete on server. Required environment variables: RESEND_API_KEY (or SMTP host/user/pass), MAIL_FROM, DONATION_ADMIN_EMAIL.");
        }

        try {
            String subject = "Donation.App Production Email Test";
            String formattedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy hh:mm:ss a"));
            String baseUrl = (appBaseUrl != null ? appBaseUrl : "https://donation-app-frontend-150r.onrender.com").replaceAll("/+$", "");
            EmailProvider provider = getActiveProvider();
            String pName = (provider != null && provider.getProviderName() != null) ? provider.getProviderName() : "resend";
            String pTransport = (provider != null && provider.getTransportType() != null) ? provider.getTransportType() : "https";

            String plainText = String.format(
                    "Donation.App Email Delivery Test\n\n" +
                    "This is a real production email delivery test.\n\n" +
                    "Environment: production\n" +
                    "Application: Donation.App\n" +
                    "Organization: Unicode Estates, PM Palem\n" +
                    "Provider: %s (%s)\n\n" +
                    "If you received this email, email delivery is working correctly.\n\n" +
                    "Timestamp: %s\n" +
                    "Application Base URL: %s\n" +
                    "Sender: %s\n",
                    pName.toUpperCase(),
                    pTransport.toUpperCase(),
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
                    "<div style='text-align:center;'><span class='badge'>✓ Production Delivery Test (%s)</span></div>" +
                    "<p>This is a real production email delivery test.</p>" +
                    "<div class='info'>" +
                    "<strong>Environment:</strong> production<br>" +
                    "<strong>Application:</strong> Donation.App<br>" +
                    "<strong>Organization:</strong> Unicode Estates, PM Palem<br>" +
                    "<strong>Provider:</strong> %s (%s)<br>" +
                    "<strong>Timestamp:</strong> %s<br>" +
                    "<strong>Base URL:</strong> %s<br>" +
                    "<strong>Sender:</strong> %s" +
                    "</div>" +
                    "<p style='text-align:center; color: #10b981; font-weight: bold; margin-top: 20px;'>If you received this email, email delivery is working correctly.</p>" +
                    "</div></body></html>",
                    pName.toUpperCase(),
                    pName,
                    pTransport,
                    formattedDate,
                    baseUrl,
                    maskEmail(fromEmail)
            );

            logger.info("[AdminTestEmail] Attempting test email via provider {} to {}", provider != null ? provider.getProviderName() : "unknown", maskEmail(adminEmail));
            provider.sendTestEmail(subject, plainText, htmlText, adminEmail);
            logger.info("[AdminTestEmail] Test email SUCCEEDED to {}", maskEmail(adminEmail));

        } catch (Exception e) {
            logger.error("[AdminTestEmail] Test email FAILED to {}: {}", maskEmail(adminEmail), e.getMessage());
            throw new RuntimeException("Failed to send test email: " + e.getMessage(), e);
        }
    }

    public void sendAdminDonationNotificationEmail(Donation donation, Receipt receipt) {
        if (!isConfigured()) {
            logger.info("Skipping admin notification email for donation ID {}: email service is unconfigured", donation.getId());
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

            EmailProvider provider = getActiveProvider();
            provider.sendAdminNotification(donation, receipt, adminEmail, subject, body);
            logger.info("Successfully sent admin notification email to {} for donation ID {}", maskEmail(adminEmail), donation.getId());

        } catch (Exception e) {
            EmailProvider provider = getActiveProvider();
            logger.error("EMAIL_SEND_FAILED donationId={} recipient={} provider={} error={}",
                    donation.getId(), maskEmail(adminEmail), provider != null ? provider.getProviderName() : "unknown", e.getMessage());
        }
    }

    private void sendDonationReceiptEmailInternal(Donation donation, Receipt receipt, boolean isResend) throws Exception {
        String recipientEmail = getRecipientEmail(donation);
        if (recipientEmail == null || recipientEmail.isBlank()) {
            String msg = "No donor email address provided for donation ID: " + donation.getId();
            logger.error("[EmailDispatch] Failed: {}", msg);
            if (isResend) {
                throw new IllegalArgumentException(msg);
            }
            logger.info("Skipping donor email notification for donation ID {}: {}", donation.getId(), msg);
            return;
        }

        if (!isValidEmail(recipientEmail)) {
            String msg = "Invalid donor email address format for donation ID " + donation.getId() + ": " + maskEmail(recipientEmail);
            logger.warn("[EmailValidation] {}", msg);
            if (isResend) {
                throw new IllegalArgumentException("Invalid donor email address format.");
            }
            return;
        }

        logger.info("[EmailDispatch] Recipient email found for donation ID {}: {}", donation.getId(), maskEmail(recipientEmail));

        String donorName = donation.isAnonymous() ? "Valued Devotee" : donation.getDonorName();
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

        byte[] pdfBytes = null;
        if (receipt != null) {
            try {
                pdfBytes = pdfReceiptService.generateReceiptPdf(donation, receipt);
                if ((pdfBytes == null || pdfBytes.length == 0) && isResend) {
                    throw new RuntimeException("PDF receipt bytes empty for receipt: " + receiptNo);
                }
            } catch (Exception pdfEx) {
                logger.error("Failed to generate PDF attachment for receipt {}: {}", receiptNo, pdfEx.getMessage());
                if (isResend) {
                    throw new RuntimeException("Failed to attach PDF receipt: " + pdfEx.getMessage(), pdfEx);
                }
            }
        }

        EmailProvider provider = getActiveProvider();
        logger.info("[EmailDispatch] Sending receipt email via provider {} to {} for receipt #{}",
                provider != null ? provider.getProviderName() : "unknown", maskEmail(recipientEmail), receiptNo);

        try {
            provider.sendDonorReceipt(donation, receipt, recipientEmail, subject, plainText, htmlText, pdfBytes, isResend);
            logger.info("[EmailDispatch] Receipt email SUCCEEDED via provider {} to {} for receipt #{}",
                    provider != null ? provider.getProviderName() : "unknown", maskEmail(recipientEmail), receiptNo);
        } catch (Exception e) {
            if (provider == resendEmailProvider && smtpEmailProvider != null && smtpEmailProvider.isConfigured()
                    && e.getMessage() != null && e.getMessage().contains("403")) {
                logger.warn("[EmailFallback] Resend domain restriction encountered for recipient {}. Falling back to SMTP provider...", maskEmail(recipientEmail));
                smtpEmailProvider.sendDonorReceipt(donation, receipt, recipientEmail, subject, plainText, htmlText, pdfBytes, isResend);
                logger.info("[EmailFallback] Receipt email SUCCEEDED via SMTP fallback to {} for receipt #{}", maskEmail(recipientEmail), receiptNo);
            } else {
                throw e;
            }
        }
    }

    public boolean isValidEmail(String email) {
        if (email == null || email.isBlank()) return false;
        String trimmed = email.trim();
        int atIndex = trimmed.indexOf('@');
        if (atIndex <= 0 || atIndex != trimmed.lastIndexOf('@')) return false;
        String domain = trimmed.substring(atIndex + 1);
        return domain.contains(".") && !domain.startsWith(".") && !domain.endsWith(".");
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        int atIndex = email.indexOf("@");
        if (atIndex <= 1) return "*@*" + email.substring(atIndex);
        return email.substring(0, 1) + "***" + email.substring(atIndex - 1);
    }

    private String getRecipientEmail(Donation donation) {
        if (donation.getDonorEmail() != null && !donation.getDonorEmail().isBlank()) {
            return donation.getDonorEmail().trim();
        }
        if (donation.getDonor() != null && donation.getDonor().getEmail() != null && !donation.getDonor().getEmail().isBlank()) {
            return donation.getDonor().getEmail().trim();
        }
        return null;
    }
}

package com.donationapp.service.email;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Brevo (formerly Sendinblue) Transactional Email Provider.
 *
 * Uses the Brevo REST API over HTTPS (port 443) — compatible with Render Free Web Services
 * (which blocks outbound SMTP ports 25, 465, 587).
 *
 * Endpoint: POST https://api.brevo.com/v3/smtp/email
 * Auth: api-key header (value from BREVO_API_KEY environment variable)
 *
 * No SMTP. No Brevo SDK. No additional Maven dependencies — uses Spring's RestTemplate.
 */
@Component
public class BrevoEmailProvider implements EmailProvider {

    private static final Logger logger = LoggerFactory.getLogger(BrevoEmailProvider.class);
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
    private static final String SENDER_NAME = "Unicode Estates";

    private final RestTemplate restTemplate;

    @Value("${brevo.api-key:${BREVO_API_KEY:}}")
    private String apiKey;

    @Value("${donationapp.email.from:${MAIL_FROM:}}")
    private String fromEmail;

    @Value("${donationapp.email.admin-email:${DONATION_ADMIN_EMAIL:}}")
    private String adminEmail;

    public BrevoEmailProvider() {
        this.restTemplate = new RestTemplate();
    }

    /** Constructor for test injection with a mocked RestTemplate. */
    public BrevoEmailProvider(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public String getProviderName() {
        return "brevo";
    }

    @Override
    public String getTransportType() {
        return "https";
    }

    @Override
    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank()
                && fromEmail != null && !fromEmail.isBlank()
                && adminEmail != null && !adminEmail.isBlank();
    }

    @Override
    public Map<String, Object> getStatusMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("configured", isConfigured());
        map.put("provider", getProviderName());
        map.put("transport", getTransportType());
        map.put("apiConfigured", apiKey != null && !apiKey.isBlank());
        map.put("fromConfigured", fromEmail != null && !fromEmail.isBlank());
        map.put("adminRecipientConfigured", adminEmail != null && !adminEmail.isBlank());
        map.put("fromEmail", maskEmail(fromEmail));
        map.put("adminEmail", maskEmail(adminEmail));
        return map;
    }

    @Override
    public void sendDonorReceipt(Donation donation, Receipt receipt, String recipientEmail,
                                 String subject, String plainText, String htmlText,
                                 byte[] pdfBytes, boolean isResend) throws Exception {
        if (!isConfigured()) {
            throw new IllegalStateException(
                    "Brevo HTTPS email configuration is incomplete. " +
                    "Missing BREVO_API_KEY, MAIL_FROM, or DONATION_ADMIN_EMAIL.");
        }

        Map<String, Object> payload = buildBasePayload(recipientEmail, subject, htmlText);

        // Attach PDF receipt if available
        if (pdfBytes != null && pdfBytes.length > 0) {
            String receiptNo = (receipt != null && receipt.getReceiptNumber() != null)
                    ? receipt.getReceiptNumber() : "RECEIPT";
            Map<String, Object> attachment = new HashMap<>();
            attachment.put("name", "Receipt_" + receiptNo + ".pdf");
            attachment.put("content", Base64.getEncoder().encodeToString(pdfBytes));
            payload.put("attachment", List.of(attachment));
        }

        logger.info("[BrevoAPI] Attempting donor receipt email via HTTPS API to {}",
                maskEmail(recipientEmail));
        executeBrevoApiCall(payload);
    }

    @Override
    public void sendAdminNotification(Donation donation, Receipt receipt,
                                      String adminEmailRecipient, String subject,
                                      String body) throws Exception {
        if (!isConfigured()) {
            throw new IllegalStateException(
                    "Brevo HTTPS email configuration is incomplete. " +
                    "Missing BREVO_API_KEY, MAIL_FROM, or DONATION_ADMIN_EMAIL.");
        }

        // Build HTML version of admin notification for better inbox display
        String htmlBody = buildAdminNotificationHtml(body);
        Map<String, Object> payload = buildBasePayload(adminEmailRecipient, subject, htmlBody);

        logger.info("[BrevoAPI] Attempting admin notification email via HTTPS API to {}",
                maskEmail(adminEmailRecipient));
        executeBrevoApiCall(payload);
    }

    @Override
    public void sendTestEmail(String subject, String plainText, String htmlText,
                              String adminEmailRecipient) throws Exception {
        if (!isConfigured()) {
            throw new IllegalStateException(
                    "Brevo HTTPS email configuration is incomplete. " +
                    "Required environment variables: BREVO_API_KEY, MAIL_FROM, DONATION_ADMIN_EMAIL.");
        }

        Map<String, Object> payload = buildBasePayload(adminEmailRecipient, subject, htmlText);

        logger.info("[BrevoAPI] Attempting admin test email via HTTPS API to {}",
                maskEmail(adminEmailRecipient));
        executeBrevoApiCall(payload);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Builds the common Brevo request payload.
     * Brevo uses "sender" object + "to" array + "subject" + "htmlContent".
     */
    private Map<String, Object> buildBasePayload(String recipientEmail, String subject,
                                                  String htmlContent) {
        Map<String, Object> payload = new HashMap<>();

        // sender object
        Map<String, String> sender = new HashMap<>();
        sender.put("name", SENDER_NAME);
        sender.put("email", fromEmail.trim());
        payload.put("sender", sender);

        // to array
        Map<String, String> toEntry = new HashMap<>();
        toEntry.put("email", recipientEmail.trim());
        payload.put("to", List.of(toEntry));

        payload.put("subject", subject);
        payload.put("htmlContent", htmlContent);

        return payload;
    }

    /**
     * Executes the Brevo API call.
     * Auth header is "api-key": value — NOT Bearer token (Brevo uses its own scheme).
     * Never logs the actual api-key value.
     */
    private void executeBrevoApiCall(Map<String, Object> payload) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey.trim());  // Brevo auth — not Bearer

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response =
                    restTemplate.postForEntity(BREVO_API_URL, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("[BrevoAPI] Email accepted by Brevo API: HTTP {}",
                        response.getStatusCode().value());
            } else {
                throw new RuntimeException(
                        "Brevo API rejected request with HTTP status "
                        + response.getStatusCode().value() + ": " + response.getBody());
            }
        } catch (HttpStatusCodeException hsce) {
            String errBody = hsce.getResponseBodyAsString();
            logger.error("[BrevoAPI] HTTP error from Brevo API: Status {} - {}",
                    hsce.getStatusCode().value(), errBody);
            throw new RuntimeException(
                    "Brevo API failed with status " + hsce.getStatusCode().value()
                    + ": " + errBody, hsce);
        } catch (RuntimeException re) {
            throw re;
        } catch (Exception e) {
            logger.error("[BrevoAPI] Failed to call Brevo HTTPS API: {}", e.getMessage());
            throw new RuntimeException("Failed to call Brevo HTTPS API: " + e.getMessage(), e);
        }
    }

    /** Wraps plain-text admin notification body in minimal HTML for cleaner inbox display. */
    private String buildAdminNotificationHtml(String body) {
        if (body == null) return "<p></p>";
        String escaped = body
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\n", "<br>");
        return "<!DOCTYPE html><html><body style=\"font-family:'Segoe UI',Arial,sans-serif;"
                + "background:#0f172a;color:#f8fafc;padding:20px;\">"
                + "<div style=\"max-width:600px;margin:0 auto;background:#1e293b;"
                + "border-radius:12px;border:1px solid #334155;padding:24px;\">"
                + "<h3 style=\"color:#f97316;border-bottom:1px solid #334155;"
                + "padding-bottom:10px;\">Donation.App Committee Admin Notification</h3>"
                + "<pre style=\"white-space:pre-wrap;font-family:inherit;"
                + "color:#cbd5e1;line-height:1.6;font-size:13px;\">"
                + escaped + "</pre></div></body></html>";
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        int atIndex = email.indexOf("@");
        if (atIndex <= 1) return "*@*" + email.substring(atIndex);
        return email.substring(0, 1) + "***" + email.substring(atIndex - 1);
    }
}

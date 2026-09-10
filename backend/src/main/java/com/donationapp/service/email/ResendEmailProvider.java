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

@Component
public class ResendEmailProvider implements EmailProvider {

    private static final Logger logger = LoggerFactory.getLogger(ResendEmailProvider.class);
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    private final RestTemplate restTemplate;

    @Value("${donationapp.email.resend-api-key:${RESEND_API_KEY:}}")
    private String apiKey;

    @Value("${donationapp.email.from:${MAIL_FROM:}}")
    private String fromEmail;

    @Value("${donationapp.email.admin-email:${DONATION_ADMIN_EMAIL:}}")
    private String adminEmail;

    public ResendEmailProvider() {
        this.restTemplate = new RestTemplate();
    }

    public ResendEmailProvider(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public String getProviderName() {
        return "resend";
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
    public void sendDonorReceipt(Donation donation, Receipt receipt, String recipientEmail, String subject, String plainText, String htmlText, byte[] pdfBytes, boolean isResend) throws Exception {
        if (!isConfigured()) {
            throw new IllegalStateException("Resend HTTPS email configuration is incomplete. Missing RESEND_API_KEY, MAIL_FROM, or DONATION_ADMIN_EMAIL.");
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("from", formatFromHeader(fromEmail));
        payload.put("to", List.of(recipientEmail));
        if (adminEmail != null && !adminEmail.isBlank()) {
            payload.put("reply_to", adminEmail.trim());
        }
        payload.put("subject", subject);
        payload.put("html", htmlText);
        payload.put("text", plainText);

        if (pdfBytes != null && pdfBytes.length > 0) {
            String receiptNo = (receipt != null && receipt.getReceiptNumber() != null) ? receipt.getReceiptNumber() : "RECEIPT";
            Map<String, Object> attachment = new HashMap<>();
            attachment.put("filename", "Receipt_" + receiptNo + ".pdf");
            attachment.put("content", Base64.getEncoder().encodeToString(pdfBytes));
            payload.put("attachments", List.of(attachment));
        }

        logger.info("[ResendAPI] Attempting donor receipt email via HTTPS API to {}", maskEmail(recipientEmail));
        executeResendApiCall(payload);
    }

    @Override
    public void sendAdminNotification(Donation donation, Receipt receipt, String adminEmailRecipient, String subject, String body) throws Exception {
        if (!isConfigured()) {
            throw new IllegalStateException("Resend HTTPS email configuration is incomplete. Missing RESEND_API_KEY, MAIL_FROM, or DONATION_ADMIN_EMAIL.");
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("from", formatFromHeader(fromEmail));
        payload.put("to", List.of(adminEmailRecipient));
        payload.put("subject", subject);
        payload.put("text", body);

        logger.info("[ResendAPI] Attempting admin notification email via HTTPS API to {}", maskEmail(adminEmailRecipient));
        executeResendApiCall(payload);
    }

    @Override
    public void sendTestEmail(String subject, String plainText, String htmlText, String adminEmailRecipient) throws Exception {
        if (!isConfigured()) {
            throw new IllegalStateException("Resend HTTPS email configuration is incomplete. Required environment variables: RESEND_API_KEY, MAIL_FROM, DONATION_ADMIN_EMAIL.");
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("from", formatFromHeader(fromEmail));
        payload.put("to", List.of(adminEmailRecipient));
        payload.put("subject", subject);
        payload.put("html", htmlText);
        payload.put("text", plainText);

        logger.info("[ResendAPI] Attempting admin test email via HTTPS API to {}", maskEmail(adminEmailRecipient));
        executeResendApiCall(payload);
    }

    private void executeResendApiCall(Map<String, Object> payload) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey.trim());

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(RESEND_API_URL, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("[ResendAPI] Email accepted by Resend API: Status HTTP {}", response.getStatusCode().value());
            } else {
                throw new RuntimeException("Resend API rejected request with HTTP status " + response.getStatusCode().value() + ": " + response.getBody());
            }
        } catch (HttpStatusCodeException hsce) {
            String errBody = hsce.getResponseBodyAsString();
            logger.error("[ResendAPI] HTTP error from Resend API: Status {} - {}", hsce.getStatusCode().value(), errBody);
            throw new RuntimeException("Resend API failed with status " + hsce.getStatusCode().value() + ": " + errBody, hsce);
        } catch (Exception e) {
            logger.error("[ResendAPI] Failed to call Resend HTTPS API: {}", e.getMessage());
            throw new RuntimeException("Failed to call Resend HTTPS API: " + e.getMessage(), e);
        }
    }

    private String formatFromHeader(String from) {
        if (from == null || from.isBlank()) return "Unicode Estates <donations@unicodeestates.in>";
        if (from.contains("<") && from.contains(">")) return from;
        return "Unicode Estates <" + from.trim() + ">";
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        int atIndex = email.indexOf("@");
        if (atIndex <= 1) return "*@*" + email.substring(atIndex);
        return email.substring(0, 1) + "***" + email.substring(atIndex - 1);
    }
}

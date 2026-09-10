package com.donationapp.service.email;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class SmtpEmailProvider implements EmailProvider {

    private static final Logger logger = LoggerFactory.getLogger(SmtpEmailProvider.class);

    private final JavaMailSender mailSender;

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

    public SmtpEmailProvider(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public String getProviderName() {
        return "smtp";
    }

    @Override
    public String getTransportType() {
        return "smtp";
    }

    @Override
    public boolean isConfigured() {
        return smtpHost != null && !smtpHost.isBlank()
                && smtpUsername != null && !smtpUsername.isBlank()
                && smtpPassword != null && !smtpPassword.isBlank()
                && fromEmail != null && !fromEmail.isBlank()
                && adminEmail != null && !adminEmail.isBlank();
    }

    @Override
    public Map<String, Object> getStatusMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("configured", isConfigured());
        map.put("provider", getProviderName());
        map.put("transport", getTransportType());
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

    @Override
    public void sendDonorReceipt(Donation donation, Receipt receipt, String recipientEmail, String subject, String plainText, String htmlText, byte[] pdfBytes, boolean isResend) throws Exception {
        if (!isConfigured()) {
            throw new IllegalStateException("SMTP email configuration is incomplete. Missing SPRING_MAIL_HOST, SPRING_MAIL_USERNAME, or SPRING_MAIL_PASSWORD.");
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(recipientEmail);
        helper.setSubject(subject);
        helper.setText(plainText, htmlText);

        if (pdfBytes != null && pdfBytes.length > 0) {
            String receiptNo = (receipt != null && receipt.getReceiptNumber() != null) ? receipt.getReceiptNumber() : "RECEIPT";
            helper.addAttachment("Receipt_" + receiptNo + ".pdf", new ByteArrayResource(pdfBytes));
        }

        logger.info("[SmtpProvider] Attempting SMTP donor receipt email to {}", maskEmail(recipientEmail));
        mailSender.send(message);
        logger.info("[SmtpProvider] SMTP donor receipt email SUCCEEDED to {}", maskEmail(recipientEmail));
    }

    @Override
    public void sendAdminNotification(Donation donation, Receipt receipt, String adminEmailRecipient, String subject, String body) throws Exception {
        if (!isConfigured()) {
            throw new IllegalStateException("SMTP email configuration is incomplete.");
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(adminEmailRecipient);
        helper.setSubject(subject);
        helper.setText(body);

        logger.info("[SmtpProvider] Attempting SMTP admin notification to {}", maskEmail(adminEmailRecipient));
        mailSender.send(message);
        logger.info("[SmtpProvider] SMTP admin notification SUCCEEDED to {}", maskEmail(adminEmailRecipient));
    }

    @Override
    public void sendTestEmail(String subject, String plainText, String htmlText, String adminEmailRecipient) throws Exception {
        if (!isConfigured()) {
            throw new IllegalStateException("SMTP email configuration is incomplete.");
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(adminEmailRecipient);
        helper.setSubject(subject);
        helper.setText(plainText, htmlText);

        logger.info("[SmtpProvider] Attempting SMTP test email to {}", maskEmail(adminEmailRecipient));
        mailSender.send(message);
        logger.info("[SmtpProvider] SMTP test email SUCCEEDED to {}", maskEmail(adminEmailRecipient));
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        int atIndex = email.indexOf("@");
        if (atIndex <= 1) return "*@*" + email.substring(atIndex);
        return email.substring(0, 1) + "***" + email.substring(atIndex - 1);
    }
}

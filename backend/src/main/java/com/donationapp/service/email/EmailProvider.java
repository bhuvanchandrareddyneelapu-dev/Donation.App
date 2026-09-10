package com.donationapp.service.email;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;

import java.util.Map;

public interface EmailProvider {
    String getProviderName();
    String getTransportType();
    boolean isConfigured();
    Map<String, Object> getStatusMap();

    void sendDonorReceipt(Donation donation, Receipt receipt, String recipientEmail, String subject, String plainText, String htmlText, byte[] pdfBytes, boolean isResend) throws Exception;
    void sendAdminNotification(Donation donation, Receipt receipt, String adminEmail, String subject, String body) throws Exception;
    void sendTestEmail(String subject, String plainText, String htmlText, String adminEmail) throws Exception;
}

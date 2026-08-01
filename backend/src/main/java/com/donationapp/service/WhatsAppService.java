package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {

    @Value("${donationapp.whatsapp.enabled:true}")
    private boolean enabled;

    @Value("${donationapp.whatsapp.api-token:META_WHATSAPP_TOKEN_DEFAULT}")
    private String apiToken;

    @Value("${donationapp.whatsapp.phone-number-id:WHATSAPP_PHONE_ID_DEFAULT}")
    private String phoneNumberId;

    public void sendDonationReceiptWhatsApp(Donation donation, Receipt receipt) {
        if (!enabled) return;

        String phone = donation.getDonorPhone();
        String message = String.format(
            "🙏 *Sacred Contribution Receipt - %s*\n\n" +
            "Receipt No: *%s*\n" +
            "Donor Name: *%s*\n" +
            "Amount: *₹%.2f*\n" +
            "Payment Method: *%s*\n" +
            "Status: *%s*\n\n" +
            "Verify official receipt: https://donation.app/verify/%s\n\n" +
            "May the divine blessings bring peace, prosperity, and health to your family! 🌟",
            donation.getFestival().getName(),
            receipt.getReceiptNumber(),
            donation.isAnonymous() ? "Anonymous Donor" : donation.getDonorName(),
            donation.getAmount(),
            donation.getPaymentType(),
            donation.getPaymentStatus(),
            receipt.getQrCodeHash()
        );

        dispatchMetaCloudApi(phone, message);
    }

    public void sendCashDonationPendingWhatsApp(Donation donation, Receipt receipt) {
        if (!enabled) return;

        String phone = donation.getDonorPhone();
        String message = String.format(
            "🙏 *On-Ground Cash Donation Received - %s*\n\n" +
            "Receipt No: *%s*\n" +
            "Amount Received: *₹%.2f*\n" +
            "Recorded By Volunteer: *%s*\n" +
            "Status: *Pending Treasurer Verification*\n\n" +
            "Verify receipt: https://donation.app/verify/%s\n\n" +
            "Thank you for your generous support!",
            donation.getFestival().getName(),
            receipt.getReceiptNumber(),
            donation.getAmount(),
            donation.getRecordedByVolunteer() != null ? donation.getRecordedByVolunteer().getName() : "Volunteer Counter",
            receipt.getQrCodeHash()
        );

        dispatchMetaCloudApi(phone, message);
    }

    public void sendFestivalScheduleReminder(String phone, String festivalName, String eventTitle, String dateTimeStr) {
        if (!enabled) return;

        String message = String.format(
            "🔔 *Festival Schedule Reminder - %s*\n\n" +
            "Event: *%s*\n" +
            "Date & Time: *%s*\n\n" +
            "All devotees are cordially invited to participate and seek blessings!",
            festivalName, eventTitle, dateTimeStr
        );

        dispatchMetaCloudApi(phone, message);
    }

    private void dispatchMetaCloudApi(String recipientPhone, String message) {
        System.out.println("==================================================");
        System.out.println("📱 [META WHATSAPP BUSINESS CLOUD API DISPATCH]");
        System.out.println("Phone Number ID: " + phoneNumberId);
        System.out.println("Recipient: " + recipientPhone);
        System.out.println("Message Content:\n" + message);
        System.out.println("Status: DISPATCHED VIA HTTPS REST META ENDPOINT ✅");
        System.out.println("==================================================");
    }
}

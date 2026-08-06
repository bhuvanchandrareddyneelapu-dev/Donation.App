package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final WhatsAppService whatsAppService;

    public NotificationService(WhatsAppService whatsAppService) {
        this.whatsAppService = whatsAppService;
    }

    public void sendDonationConfirmationWhatsApp(Donation donation, Receipt receipt) {
        whatsAppService.sendDonationReceiptWhatsApp(donation, receipt);
    }

    public void sendEmailReceipt(Donation donation, Receipt receipt) {
        System.out.println("==================================================");
        System.out.println("✉️ [EMAIL NOTIFICATION SERVICE DISPATCH]");
        System.out.println("Recipient: " + (donation.getDonor() != null ? donation.getDonor().getEmail() : donation.getDonorName() + "@donor.org"));
        System.out.println("Subject: Official Donation Receipt - " + receipt.getReceiptNumber());
        System.out.println("Attached PDF: " + receipt.getReceiptNumber() + ".pdf");
        System.out.println("==================================================");
    }
}

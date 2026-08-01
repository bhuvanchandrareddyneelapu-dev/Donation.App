package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendDonationConfirmationWhatsApp(Donation donation, Receipt receipt) {
        String message = String.format(
            "🙏 *Thank You for Your Sacred Contribution to %s!*\n\n" +
            "Receipt No: *%s*\n" +
            "Donor Name: *%s*\n" +
            "Amount: *₹%.2f*\n" +
            "Payment Method: *%s*\n" +
            "Verification Status: *%s*\n\n" +
            "View & download your official receipt: https://donation.app/verify/%s\n\n" +
            "May the divine blessings bring joy, health, and prosperity to your family! 🌟",
            donation.getFestival().getName(),
            receipt.getReceiptNumber(),
            donation.isAnonymous() ? "Anonymous Donor" : donation.getDonorName(),
            donation.getAmount(),
            donation.getPaymentType(),
            donation.getPaymentStatus(),
            receipt.getQrCodeHash()
        );

        System.out.println("==================================================");
        System.out.println("📱 [WHATSAPP BUSINESS API AUTOMATION DISPATCH]");
        System.out.println("Recipient Phone: " + donation.getDonorPhone());
        System.out.println("Payload:\n" + message);
        System.out.println("==================================================");
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

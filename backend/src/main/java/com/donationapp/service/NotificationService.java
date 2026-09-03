package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final EmailService emailService;

    public NotificationService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void sendDonationConfirmation(Donation donation, Receipt receipt) {
        emailService.sendDonationReceiptEmail(donation, receipt);
    }

    public void sendDonationConfirmationWhatsApp(Donation donation, Receipt receipt) {
        emailService.sendDonationReceiptEmail(donation, receipt);
    }

    public void sendEmailReceipt(Donation donation, Receipt receipt) {
        emailService.sendDonationReceiptEmail(donation, receipt);
    }
}

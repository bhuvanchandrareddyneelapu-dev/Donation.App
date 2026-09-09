package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final EmailService emailService;

    public NotificationService(EmailService emailService) {
        this.emailService = emailService;
    }

    public void sendDonationConfirmation(Donation donation, Receipt receipt) {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    try {
                        emailService.sendDonationReceiptEmail(donation, receipt);
                    } catch (Exception e) {
                        logger.error("Failed to send donation receipt email after commit for donation ID {}: {}",
                                donation.getId(), e.getMessage(), e);
                    }
                }
            });
        } else {
            emailService.sendDonationReceiptEmail(donation, receipt);
        }
    }

    public void sendDonationConfirmationWhatsApp(Donation donation, Receipt receipt) {
        sendDonationConfirmation(donation, receipt);
    }

    public void sendEmailReceipt(Donation donation, Receipt receipt) {
        sendDonationConfirmation(donation, receipt);
    }
}


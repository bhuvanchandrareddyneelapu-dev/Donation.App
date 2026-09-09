package com.donationapp.service;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.transaction.support.TransactionSynchronizationUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTransactionTest {

    @Mock
    private EmailService emailService;

    @InjectMocks
    private NotificationService notificationService;

    private Donation donation;
    private Receipt receipt;

    @BeforeEach
    void setUp() {
        donation = new Donation();
        donation.setId(100L);
        donation.setDonorEmail("donor@example.com");

        receipt = new Receipt();
        receipt.setReceiptNumber("REC-100");
    }

    @AfterEach
    void tearDown() {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.clearSynchronization();
        }
    }

    @Test
    void testSendDonationConfirmation_NoActiveTransaction_SendsImmediately() {
        notificationService.sendDonationConfirmation(donation, receipt);
        verify(emailService, times(1)).sendDonationReceiptEmail(donation, receipt);
        verify(emailService, times(1)).sendAdminDonationNotificationEmail(donation, receipt);
    }

    @Test
    void testSendDonationConfirmation_WithActiveTransaction_DefersUntilAfterCommit() {
        TransactionSynchronizationManager.initSynchronization();
        TransactionSynchronizationManager.setActualTransactionActive(true);

        notificationService.sendDonationConfirmation(donation, receipt);

        // Email should NOT be sent yet before transaction commit
        verify(emailService, never()).sendDonationReceiptEmail(any(), any());
        verify(emailService, never()).sendAdminDonationNotificationEmail(any(), any());

        // Simulate Spring's transaction commit
        List<TransactionSynchronization> synchronizations = TransactionSynchronizationManager.getSynchronizations();
        assertFalse(synchronizations.isEmpty(), "Expected a TransactionSynchronization to be registered");

        for (TransactionSynchronization sync : synchronizations) {
            sync.afterCommit();
        }

        // Both donor and admin emails SHOULD be sent after commit
        verify(emailService, times(1)).sendDonationReceiptEmail(donation, receipt);
        verify(emailService, times(1)).sendAdminDonationNotificationEmail(donation, receipt);
    }

    @Test
    void testSendDonationConfirmation_WithActiveTransaction_RollbackDoesNotSendEmail() {
        TransactionSynchronizationManager.initSynchronization();
        TransactionSynchronizationManager.setActualTransactionActive(true);

        notificationService.sendDonationConfirmation(donation, receipt);

        // Simulate transaction rollback (afterCommit is NOT called, clear synchronization)
        TransactionSynchronizationManager.clearSynchronization();

        // Email must NEVER be sent on rollback
        verify(emailService, never()).sendDonationReceiptEmail(any(), any());
        verify(emailService, never()).sendAdminDonationNotificationEmail(any(), any());
    }

    @Test
    void testSendDonationConfirmation_DonorEmailException_DoesNotBlockAdminEmail() {
        doThrow(new RuntimeException("SMTP connection error")).when(emailService).sendDonationReceiptEmail(any(), any());

        notificationService.sendDonationConfirmation(donation, receipt);

        // Donor email threw exception, but admin email should STILL be attempted
        verify(emailService, times(1)).sendDonationReceiptEmail(donation, receipt);
        verify(emailService, times(1)).sendAdminDonationNotificationEmail(donation, receipt);
    }
}

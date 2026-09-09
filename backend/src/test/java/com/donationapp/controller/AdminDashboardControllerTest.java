package com.donationapp.controller;

import com.donationapp.repository.AuditLogRepository;
import com.donationapp.repository.DonationRepository;
import com.donationapp.repository.FestivalRepository;
import com.donationapp.service.DonationService;
import com.donationapp.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdminDashboardControllerTest {

    @Mock
    private DonationService donationService;

    @Mock
    private DonationRepository donationRepository;

    @Mock
    private FestivalRepository festivalRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AdminDashboardController adminDashboardController;

    @Test
    void testGetEmailStatus_Returns200AndStatusMap() {
        Map<String, Object> statusMap = Map.of("configured", true, "smtpHost", "smtp.gmail.com");
        when(emailService.getSmtpStatusMap()).thenReturn(statusMap);

        ResponseEntity<?> response = adminDashboardController.getEmailStatus();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(statusMap, response.getBody());
    }

    @Test
    void testSendTestEmail_Success_Returns200() {
        doNothing().when(emailService).sendAdminTestEmail();

        ResponseEntity<?> response = adminDashboardController.sendTestEmail();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(emailService, times(1)).sendAdminTestEmail();
        verifyNoInteractions(donationRepository); // Ensures NO donation created or modified by email test
    }

    @Test
    void testSendTestEmail_Unconfigured_ThrowsException() {
        doThrow(new IllegalStateException("SMTP unconfigured")).when(emailService).sendAdminTestEmail();

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                adminDashboardController.sendTestEmail()
        );

        assertEquals("SMTP unconfigured", ex.getMessage());
        verifyNoInteractions(donationRepository); // Ensures NO donation created or modified by email test
    }
}

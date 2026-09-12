package com.donationapp.controller;

import com.donationapp.dto.req.FestivalNotificationRequest;
import com.donationapp.dto.resp.FestivalNotificationResponse;
import com.donationapp.entity.enums.NotificationPriority;
import com.donationapp.entity.enums.NotificationType;
import com.donationapp.service.FestivalNotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class FestivalNotificationControllerTest {

    @Mock
    private FestivalNotificationService notificationService;

    @InjectMocks
    private FestivalNotificationController controller;

    private FestivalNotificationResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleResponse = new FestivalNotificationResponse();
        sampleResponse.setId(1L);
        sampleResponse.setFestivalId(1L);
        sampleResponse.setTitle("Nimajjanam Update");
        sampleResponse.setMessage("Departure scheduled at 7:30 PM");
        sampleResponse.setNotificationType(NotificationType.NIMAJJANAM_UPDATE);
        sampleResponse.setPriority(NotificationPriority.CRITICAL);
        sampleResponse.setEnabled(true);
    }

    @Test
    void testGetActiveNotifications_ReturnsPublicList() {
        when(notificationService.getActiveNotifications(1L)).thenReturn(Arrays.asList(sampleResponse));

        ResponseEntity<List<FestivalNotificationResponse>> response = controller.getActiveNotifications(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Nimajjanam Update", response.getBody().get(0).getTitle());
    }

    @Test
    void testCreateNotification_ReturnsCreatedStatus() {
        FestivalNotificationRequest req = new FestivalNotificationRequest();
        req.setFestivalId(1L);
        req.setTitle("Nimajjanam Update");
        req.setMessage("Departure scheduled at 7:30 PM");
        req.setNotificationType(NotificationType.NIMAJJANAM_UPDATE);

        when(notificationService.createNotification(any(), any())).thenReturn(sampleResponse);

        ResponseEntity<FestivalNotificationResponse> response = controller.createNotification(req, null);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Nimajjanam Update", response.getBody().getTitle());
    }
}

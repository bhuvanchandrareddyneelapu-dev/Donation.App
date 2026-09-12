package com.donationapp.controller;

import com.donationapp.dto.req.PushSubscribeRequest;
import com.donationapp.dto.resp.PushStatusResponse;
import com.donationapp.entity.FestivalNotification;
import com.donationapp.entity.PushSubscription;
import com.donationapp.repository.FestivalNotificationRepository;
import com.donationapp.service.PushSubscriptionService;
import com.donationapp.service.WebPushService;
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

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class PushNotificationControllerTest {

    @Mock
    private PushSubscriptionService pushSubscriptionService;

    @Mock
    private WebPushService webPushService;

    @Mock
    private FestivalNotificationRepository notificationRepository;

    @InjectMocks
    private PushNotificationController controller;

    @BeforeEach
    void setUp() {
        when(webPushService.getPublicKey()).thenReturn("BEl62iUYgUivxIkv69yViEuiBIa");
    }

    @Test
    void testGetVapidPublicKey_ReturnsPublicKey() {
        ResponseEntity<Map<String, String>> response = controller.getVapidPublicKey();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("BEl62iUYgUivxIkv69yViEuiBIa", response.getBody().get("publicKey"));
    }

    @Test
    void testSubscribe_ReturnsSuccessResponse() {
        PushSubscribeRequest req = new PushSubscribeRequest();
        req.setEndpoint("https://fcm.googleapis.com/test");
        PushSubscribeRequest.PushKeys keys = new PushSubscribeRequest.PushKeys();
        keys.setP256dh("key1");
        keys.setAuth("key2");
        req.setKeys(keys);

        PushSubscription mockSub = new PushSubscription();
        mockSub.setId(100L);
        when(pushSubscriptionService.subscribe(any(), any())).thenReturn(mockSub);

        ResponseEntity<Map<String, Object>> response = controller.subscribe(req, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(true, response.getBody().get("success"));
        assertEquals(true, response.getBody().get("subscribed"));
    }

    @Test
    void testGetStatus_ReturnsPushStatus() {
        when(pushSubscriptionService.isSubscribed("https://fcm.googleapis.com/test")).thenReturn(true);

        ResponseEntity<PushStatusResponse> response = controller.getStatus("https://fcm.googleapis.com/test", "granted");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSubscribed());
        assertEquals("granted", response.getBody().getPermission());
    }
}

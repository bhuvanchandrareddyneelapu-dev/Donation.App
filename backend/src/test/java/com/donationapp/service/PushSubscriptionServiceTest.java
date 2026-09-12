package com.donationapp.service;

import com.donationapp.dto.req.PushSubscribeRequest;
import com.donationapp.entity.Festival;
import com.donationapp.entity.FestivalNotification;
import com.donationapp.entity.PushSubscription;
import com.donationapp.entity.enums.NotificationPriority;
import com.donationapp.entity.enums.NotificationType;
import com.donationapp.repository.FestivalRepository;
import com.donationapp.repository.PushSubscriptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class PushSubscriptionServiceTest {

    @Mock
    private PushSubscriptionRepository subscriptionRepository;

    @Mock
    private FestivalRepository festivalRepository;

    @Mock
    private WebPushService webPushService;

    @InjectMocks
    private PushSubscriptionService pushSubscriptionService;

    private Festival festival;

    @BeforeEach
    void setUp() {
        festival = new Festival();
        festival.setId(1L);
        festival.setName("Unicode Estates Ganesh Chaturthi 2026");
    }

    @Test
    void testSubscribe_CreatesNewSubscription() {
        PushSubscribeRequest req = new PushSubscribeRequest();
        req.setEndpoint("https://fcm.googleapis.com/fcm/send/test-endpoint-123");
        PushSubscribeRequest.PushKeys keys = new PushSubscribeRequest.PushKeys();
        keys.setP256dh("test-p256dh-key");
        keys.setAuth("test-auth-key");
        req.setKeys(keys);
        req.setFestivalId(1L);

        when(subscriptionRepository.findByEndpoint(eq("https://fcm.googleapis.com/fcm/send/test-endpoint-123")))
                .thenReturn(Optional.empty());
        when(festivalRepository.findById(1L)).thenReturn(Optional.of(festival));
        when(subscriptionRepository.save(any(PushSubscription.class))).thenAnswer(inv -> {
            PushSubscription sub = inv.getArgument(0);
            sub.setId(501L);
            return sub;
        });

        PushSubscription saved = pushSubscriptionService.subscribe(req, null);

        assertNotNull(saved);
        assertEquals(501L, saved.getId());
        assertEquals("https://fcm.googleapis.com/fcm/send/test-endpoint-123", saved.getEndpoint());
        assertTrue(saved.isEnabled());
    }

    @Test
    void testUnsubscribe_DisablesSubscription() {
        PushSubscription existing = new PushSubscription();
        existing.setId(501L);
        existing.setEndpoint("https://fcm.googleapis.com/fcm/send/test-endpoint-123");
        existing.setEnabled(true);

        when(subscriptionRepository.findByEndpoint(eq("https://fcm.googleapis.com/fcm/send/test-endpoint-123")))
                .thenReturn(Optional.of(existing));

        pushSubscriptionService.unsubscribe("https://fcm.googleapis.com/fcm/send/test-endpoint-123");

        assertFalse(existing.isEnabled());
        verify(subscriptionRepository, times(1)).save(existing);
    }

    @Test
    void testBroadcastPushNotification_DeliversToActiveSubscribers() {
        FestivalNotification notification = new FestivalNotification();
        notification.setId(10L);
        notification.setFestival(festival);
        notification.setTitle("Nimajjanam Timing Update");
        notification.setMessage("Nimajjanam delayed to 7:30 PM.");
        notification.setNotificationType(NotificationType.NIMAJJANAM_UPDATE);
        notification.setPriority(NotificationPriority.CRITICAL);
        notification.setEnabled(true);
        notification.setSendPush(true);

        PushSubscription sub1 = new PushSubscription();
        sub1.setId(1L);
        sub1.setEndpoint("https://fcm.googleapis.com/endpoint1");

        PushSubscription sub2 = new PushSubscription();
        sub2.setId(2L);
        sub2.setEndpoint("https://fcm.googleapis.com/endpoint2");

        when(subscriptionRepository.findByFestivalIdAndEnabledTrue(1L)).thenReturn(Arrays.asList(sub1, sub2));
        when(webPushService.sendPushNotification(any(), any(), any(), any(), eq(1L))).thenReturn(true);

        int deliveredCount = pushSubscriptionService.broadcastPushNotification(notification);

        assertEquals(2, deliveredCount);
        verify(webPushService, times(2)).sendPushNotification(any(), eq("Nimajjanam Timing Update"), any(), any(), eq(1L));
    }
}

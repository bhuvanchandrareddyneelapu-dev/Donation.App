package com.donationapp.service;

import com.donationapp.dto.req.PushSubscribeRequest;
import com.donationapp.entity.Festival;
import com.donationapp.entity.FestivalNotification;
import com.donationapp.entity.PushSubscription;
import com.donationapp.entity.User;
import com.donationapp.repository.FestivalRepository;
import com.donationapp.repository.PushSubscriptionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PushSubscriptionService {

    private static final Logger log = LoggerFactory.getLogger(PushSubscriptionService.class);

    private final PushSubscriptionRepository subscriptionRepository;
    private final FestivalRepository festivalRepository;
    private final WebPushService webPushService;

    public PushSubscriptionService(PushSubscriptionRepository subscriptionRepository,
                                   FestivalRepository festivalRepository,
                                   WebPushService webPushService) {
        this.subscriptionRepository = subscriptionRepository;
        this.festivalRepository = festivalRepository;
        this.webPushService = webPushService;
    }

    public PushSubscription subscribe(PushSubscribeRequest request, User currentUser) {
        if (request.getEndpoint() == null || request.getEndpoint().isBlank() ||
            request.getKeys() == null || request.getKeys().getP256dh() == null || request.getKeys().getAuth() == null) {
            throw new IllegalArgumentException("Invalid push subscription payload");
        }

        Long festivalId = request.getFestivalId() != null ? request.getFestivalId() : 1L;
        Festival festival = festivalRepository.findById(festivalId)
                .orElseGet(() -> festivalRepository.findAll().stream().findFirst().orElse(null));

        Optional<PushSubscription> existingOpt = subscriptionRepository.findByEndpoint(request.getEndpoint().trim());
        PushSubscription subscription = existingOpt.orElseGet(PushSubscription::new);

        subscription.setEndpoint(request.getEndpoint().trim());
        subscription.setP256dhKey(request.getKeys().getP256dh().trim());
        subscription.setAuthKey(request.getKeys().getAuth().trim());
        subscription.setFestival(festival);
        if (currentUser != null) {
            subscription.setUser(currentUser);
        }
        subscription.setEnabled(true);
        subscription.setFailureCount(0);
        subscription.setUpdatedAt(LocalDateTime.now());

        PushSubscription saved = subscriptionRepository.save(subscription);
        log.info("[PushSubscription] Subscribed endpoint successfully (ID: {})", saved.getId());
        return saved;
    }

    public void unsubscribe(String endpoint) {
        if (endpoint == null || endpoint.isBlank()) return;
        subscriptionRepository.findByEndpoint(endpoint.trim()).ifPresent(sub -> {
            sub.setEnabled(false);
            sub.setUpdatedAt(LocalDateTime.now());
            subscriptionRepository.save(sub);
            log.info("[PushSubscription] Unsubscribed endpoint (ID: {})", sub.getId());
        });
    }

    @Transactional(readOnly = true)
    public boolean isSubscribed(String endpoint) {
        if (endpoint == null || endpoint.isBlank()) return false;
        return subscriptionRepository.findByEndpoint(endpoint.trim())
                .map(PushSubscription::isEnabled)
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public long getSubscriberCount(Long festivalId) {
        return subscriptionRepository.countByFestivalIdAndEnabledTrue(festivalId);
    }

    public int broadcastPushNotification(FestivalNotification notification) {
        if (notification == null || !notification.isEnabled() || !notification.isSendPush()) {
            return 0;
        }

        Long festivalId = notification.getFestival() != null ? notification.getFestival().getId() : 1L;
        List<PushSubscription> activeSubs = subscriptionRepository.findByFestivalIdAndEnabledTrue(festivalId);

        if (activeSubs.isEmpty()) {
            log.info("[PushBroadcast] No active push subscriptions found for festival ID {}", festivalId);
            return 0;
        }

        int successCount = 0;
        for (PushSubscription sub : activeSubs) {
            boolean sent = webPushService.sendPushNotification(
                    sub,
                    notification.getTitle(),
                    notification.getMessage(),
                    notification.getActionUrl(),
                    festivalId
            );
            if (sent) {
                successCount++;
            }
            subscriptionRepository.save(sub);
        }

        log.info("[PushBroadcast] Delivered push notification ID {} ('{}') to {}/{} active subscribers.",
                notification.getId(), notification.getTitle(), successCount, activeSubs.size());

        return successCount;
    }
}

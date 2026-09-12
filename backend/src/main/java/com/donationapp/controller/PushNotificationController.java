package com.donationapp.controller;

import com.donationapp.dto.req.PushSubscribeRequest;
import com.donationapp.dto.resp.PushStatusResponse;
import com.donationapp.entity.FestivalNotification;
import com.donationapp.entity.PushSubscription;
import com.donationapp.entity.User;
import com.donationapp.repository.FestivalNotificationRepository;
import com.donationapp.security.UserPrincipal;
import com.donationapp.service.PushSubscriptionService;
import com.donationapp.service.WebPushService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class PushNotificationController {

    private final PushSubscriptionService pushSubscriptionService;
    private final WebPushService webPushService;
    private final FestivalNotificationRepository notificationRepository;
    private final com.donationapp.repository.UserRepository userRepository;

    public PushNotificationController(PushSubscriptionService pushSubscriptionService,
                                      WebPushService webPushService,
                                      FestivalNotificationRepository notificationRepository,
                                      com.donationapp.repository.UserRepository userRepository) {
        this.pushSubscriptionService = pushSubscriptionService;
        this.webPushService = webPushService;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // PUBLIC PUSH SUBSCRIPTION ENDPOINTS
    // ==========================================

    @GetMapping("/api/v1/notifications/push/vapid-public-key")
    public ResponseEntity<Map<String, String>> getVapidPublicKey() {
        Map<String, String> res = new LinkedHashMap<>();
        res.put("publicKey", webPushService.getPublicKey());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/api/v1/notifications/push/subscribe")
    public ResponseEntity<Map<String, Object>> subscribe(
            @Valid @RequestBody PushSubscribeRequest request,
            Authentication authentication) {

        User currentUser = null;
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
            currentUser = userRepository.findById(principal.getId()).orElse(null);
        }

        PushSubscription subscription = pushSubscriptionService.subscribe(request, currentUser);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("subscribed", true);
        res.put("subscriptionId", subscription.getId());
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/api/v1/notifications/push/unsubscribe")
    public ResponseEntity<Map<String, Object>> unsubscribe(@RequestParam String endpoint) {
        pushSubscriptionService.unsubscribe(endpoint);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("subscribed", false);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/v1/notifications/push/status")
    public ResponseEntity<PushStatusResponse> getStatus(
            @RequestParam(required = false) String endpoint,
            @RequestParam(required = false, defaultValue = "default") String permission) {
        
        boolean subscribed = pushSubscriptionService.isSubscribed(endpoint);
        String publicKey = webPushService.getPublicKey();

        PushStatusResponse response = new PushStatusResponse(true, permission, subscribed, publicKey);
        return ResponseEntity.ok(response);
    }

    // ==========================================
    // ADMIN PUSH BROADCAST & METRICS
    // ==========================================

    @GetMapping("/api/v1/admin/notifications/push/subscribers-count")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN', 'HEAD', 'SUPERVISOR')")
    public ResponseEntity<Map<String, Object>> getSubscribersCount(@RequestParam(defaultValue = "1") Long festivalId) {
        long count = pushSubscriptionService.getSubscriberCount(festivalId);
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("festivalId", festivalId);
        res.put("activeSubscribers", count);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/api/v1/admin/notifications/{id}/push")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN', 'HEAD', 'SUPERVISOR')")
    public ResponseEntity<Map<String, Object>> triggerManualPush(@PathVariable Long id) {
        FestivalNotification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with id: " + id));

        notification.setSendPush(true);
        notification.setPushSent(false); // Reset to force re-broadcast

        int delivered = pushSubscriptionService.broadcastPushNotification(notification);

        notification.setPushSent(true);
        notification.setPushSentAt(java.time.LocalDateTime.now());
        notificationRepository.save(notification);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("deliveredCount", delivered);
        res.put("notificationId", id);
        return ResponseEntity.ok(res);
    }
}

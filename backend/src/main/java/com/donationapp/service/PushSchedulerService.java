package com.donationapp.service;

import com.donationapp.entity.FestivalNotification;
import com.donationapp.repository.FestivalNotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;

@Service
@EnableScheduling
@Transactional
public class PushSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(PushSchedulerService.class);
    private static final ZoneId ASIA_KOLKATA = ZoneId.of("Asia/Kolkata");

    private final FestivalNotificationRepository notificationRepository;
    private final PushSubscriptionService pushSubscriptionService;

    public PushSchedulerService(FestivalNotificationRepository notificationRepository,
                                PushSubscriptionService pushSubscriptionService) {
        this.notificationRepository = notificationRepository;
        this.pushSubscriptionService = pushSubscriptionService;
    }

    /**
     * Periodic background task running every 30 seconds.
     * Evaluates unsent notifications whose schedule time or event date/time has arrived and dispatches WebPush.
     * Prevents duplicate pushes by marking pushSent = true.
     */
    @Scheduled(fixedDelay = 30000)
    public void processScheduledPushNotifications() {
        LocalDateTime now = LocalDateTime.now(ASIA_KOLKATA);
        LocalDate today = now.toLocalDate();
        LocalTime currentTime = now.toLocalTime();

        List<FestivalNotification> allEnabled = notificationRepository.findAll().stream()
                .filter(n -> n.isEnabled() && n.isSendPush() && !n.isPushSent())
                .toList();

        if (allEnabled.isEmpty()) {
            return;
        }

        for (FestivalNotification notification : allEnabled) {
            boolean shouldSend = false;

            // 1. Critical / Immediate notification
            if (notification.getPriority() == com.donationapp.entity.enums.NotificationPriority.CRITICAL) {
                shouldSend = true;
            }
            // 2. Scheduled Start Window
            else if (notification.getScheduledStart() != null && !now.isBefore(notification.getScheduledStart())) {
                shouldSend = true;
            }
            // 3. Event Date & Time (within 2 hours of event time)
            else if (notification.getEventDate() != null && notification.getEventDate().equals(today)) {
                if (notification.getEventTime() != null) {
                    LocalTime eventTime = notification.getEventTime();
                    // Send if within 120 minutes before event time up to 30 minutes after start
                    if (!currentTime.isBefore(eventTime.minusMinutes(120)) && !currentTime.isAfter(eventTime.plusMinutes(30))) {
                        shouldSend = true;
                    }
                } else {
                    shouldSend = true;
                }
            }

            if (shouldSend) {
                log.info("[PushScheduler] Dispatching scheduled WebPush for notification ID {} ('{}')",
                        notification.getId(), notification.getTitle());
                int delivered = pushSubscriptionService.broadcastPushNotification(notification);

                notification.setPushSent(true);
                notification.setPushSentAt(now);
                notificationRepository.save(notification);
            }
        }
    }
}

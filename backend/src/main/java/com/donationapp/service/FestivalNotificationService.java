package com.donationapp.service;

import com.donationapp.dto.req.FestivalNotificationRequest;
import com.donationapp.dto.resp.FestivalNotificationResponse;
import com.donationapp.entity.Festival;
import com.donationapp.entity.FestivalNotification;
import com.donationapp.entity.FestivalSchedule;
import com.donationapp.entity.enums.NotificationPriority;
import com.donationapp.entity.enums.NotificationType;
import com.donationapp.entity.enums.RepeatMode;
import com.donationapp.repository.FestivalNotificationRepository;
import com.donationapp.repository.FestivalRepository;
import com.donationapp.repository.FestivalScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class FestivalNotificationService {

    public static final ZoneId ASIA_KOLKATA = ZoneId.of("Asia/Kolkata");

    private final FestivalNotificationRepository notificationRepository;
    private final FestivalRepository festivalRepository;
    private final FestivalScheduleRepository scheduleRepository;

    public FestivalNotificationService(FestivalNotificationRepository notificationRepository,
                                       FestivalRepository festivalRepository,
                                       FestivalScheduleRepository scheduleRepository) {
        this.notificationRepository = notificationRepository;
        this.festivalRepository = festivalRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public LocalDateTime getCurrentTime() {
        return LocalDateTime.now(ASIA_KOLKATA);
    }

    public LocalDate getCurrentDate() {
        return LocalDate.now(ASIA_KOLKATA);
    }

    @Transactional(readOnly = true)
    public List<FestivalNotificationResponse> getActiveNotifications(Long festivalId) {
        LocalDateTime now = getCurrentTime();
        LocalDate today = getCurrentDate();

        List<FestivalNotification> dbNotifications = notificationRepository.findActiveInWindow(festivalId, now);

        List<FestivalNotificationResponse> responses = dbNotifications.stream()
                .map(FestivalNotificationResponse::fromEntity)
                .collect(Collectors.toList());

        // 1. Synthesize Festival Countdown if festival exists
        festivalRepository.findById(festivalId).ifPresent(festival -> {
            FestivalNotificationResponse countdownNotif = generateCountdownNotification(festival, today, now);
            if (countdownNotif != null) {
                // Ensure no duplicate countdown if DB already has an active explicit countdown notification
                boolean hasExplicitCountdown = responses.stream()
                        .anyMatch(n -> n.getNotificationType() == NotificationType.FESTIVAL_COUNTDOWN);
                if (!hasExplicitCountdown) {
                    responses.add(countdownNotif);
                }
            }
        });

        // 2. Synthesize Event Reminders from FestivalSchedule (2h before, 30m before, at start)
        List<FestivalSchedule> schedules = scheduleRepository.findByFestivalIdOrderByDateTimeAsc(festivalId);
        for (FestivalSchedule event : schedules) {
            FestivalNotificationResponse eventNotif = generateScheduleNotification(event, now);
            if (eventNotif != null) {
                boolean hasDuplicate = responses.stream().anyMatch(r -> 
                    r.getTitle() != null && r.getTitle().toLowerCase().contains(event.getEventTitle().toLowerCase()));
                if (!hasDuplicate) {
                    responses.add(eventNotif);
                }
            }
        }

        // Sort by priority rank (CRITICAL -> HIGH -> NORMAL -> LOW) and then updatedAt descending
        responses.sort((a, b) -> {
            int priorityCompare = Integer.compare(
                    a.getPriority() != null ? a.getPriority().getRank() : 2,
                    b.getPriority() != null ? b.getPriority().getRank() : 2
            );
            if (priorityCompare != 0) return priorityCompare;
            if (a.getUpdatedAt() != null && b.getUpdatedAt() != null) {
                return b.getUpdatedAt().compareTo(a.getUpdatedAt());
            }
            return 0;
        });

        return responses;
    }

    @Transactional(readOnly = true)
    public List<FestivalNotificationResponse> getTodayNotifications(Long festivalId) {
        LocalDate today = getCurrentDate();
        LocalDateTime now = getCurrentTime();

        List<FestivalNotificationResponse> active = getActiveNotifications(festivalId);

        List<FestivalNotification> todayDb = notificationRepository.findByFestivalIdAndEventDate(festivalId, today);
        Set<Long> activeIds = active.stream().map(FestivalNotificationResponse::getId).filter(Objects::nonNull).collect(Collectors.toSet());

        for (FestivalNotification fn : todayDb) {
            if (!activeIds.contains(fn.getId())) {
                active.add(FestivalNotificationResponse.fromEntity(fn));
            }
        }

        return active;
    }

    @Transactional(readOnly = true)
    public List<FestivalNotificationResponse> getUpcomingNotifications(Long festivalId) {
        LocalDate today = getCurrentDate();
        LocalDateTime now = getCurrentTime();

        List<FestivalNotification> upcomingDb = notificationRepository.findUpcoming(festivalId, today, now);

        return upcomingDb.stream()
                .map(FestivalNotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Admin CRUD Methods
    @Transactional(readOnly = true)
    public List<FestivalNotificationResponse> getAllNotificationsForAdmin(Long festivalId) {
        return notificationRepository.findByFestivalIdOrderByCreatedAtDesc(festivalId).stream()
                .map(FestivalNotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public FestivalNotificationResponse createNotification(FestivalNotificationRequest request, String createdBy) {
        Festival festival = festivalRepository.findById(request.getFestivalId())
                .orElseThrow(() -> new IllegalArgumentException("Festival not found with id: " + request.getFestivalId()));

        FestivalNotification notification = new FestivalNotification();
        notification.setFestival(festival);
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setNotificationType(request.getNotificationType());
        notification.setPriority(request.getPriority() != null ? request.getPriority() : NotificationPriority.NORMAL);
        notification.setScheduledStart(request.getScheduledStart());
        notification.setScheduledEnd(request.getScheduledEnd());
        notification.setEventDate(request.getEventDate());
        notification.setEventTime(request.getEventTime());
        notification.setEnabled(request.getEnabled() != null ? request.getEnabled() : true);
        notification.setDismissible(request.getDismissible() != null ? request.getDismissible() : true);
        notification.setRepeatMode(request.getRepeatMode() != null ? request.getRepeatMode() : RepeatMode.ONCE_PER_SESSION);
        notification.setDisplayDurationSeconds(request.getDisplayDurationSeconds() != null ? request.getDisplayDurationSeconds() : 10);
        notification.setActionLabel(request.getActionLabel());
        notification.setActionUrl(request.getActionUrl());
        notification.setCreatedBy(createdBy != null ? createdBy : "ADMIN");

        FestivalNotification saved = notificationRepository.save(notification);
        return FestivalNotificationResponse.fromEntity(saved);
    }

    public FestivalNotificationResponse updateNotification(Long id, FestivalNotificationRequest request) {
        FestivalNotification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with id: " + id));

        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setNotificationType(request.getNotificationType());
        if (request.getPriority() != null) notification.setPriority(request.getPriority());
        notification.setScheduledStart(request.getScheduledStart());
        notification.setScheduledEnd(request.getScheduledEnd());
        notification.setEventDate(request.getEventDate());
        notification.setEventTime(request.getEventTime());
        if (request.getEnabled() != null) notification.setEnabled(request.getEnabled());
        if (request.getDismissible() != null) notification.setDismissible(request.getDismissible());
        if (request.getRepeatMode() != null) notification.setRepeatMode(request.getRepeatMode());
        if (request.getDisplayDurationSeconds() != null) notification.setDisplayDurationSeconds(request.getDisplayDurationSeconds());
        notification.setActionLabel(request.getActionLabel());
        notification.setActionUrl(request.getActionUrl());
        notification.setUpdatedAt(LocalDateTime.now());

        FestivalNotification updated = notificationRepository.save(notification);
        return FestivalNotificationResponse.fromEntity(updated);
    }

    public FestivalNotificationResponse updateStatus(Long id, Boolean enabled, NotificationPriority priority) {
        FestivalNotification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with id: " + id));

        if (enabled != null) notification.setEnabled(enabled);
        if (priority != null) notification.setPriority(priority);
        notification.setUpdatedAt(LocalDateTime.now());

        FestivalNotification updated = notificationRepository.save(notification);
        return FestivalNotificationResponse.fromEntity(updated);
    }

    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new IllegalArgumentException("Notification not found with id: " + id);
        }
        notificationRepository.deleteById(id);
    }

    // Helper Methods
    public FestivalNotificationResponse generateCountdownNotification(Festival festival, LocalDate today, LocalDateTime now) {
        if (festival.getInstallationDate() == null) return null;

        LocalDate installDate = festival.getInstallationDate();
        LocalDate immerseDate = festival.getImmersionDate() != null ? festival.getImmersionDate() : installDate.plusDays(10);

        long daysUntil = ChronoUnit.DAYS.between(today, installDate);

        String title;
        String message;
        String countdownText;
        NotificationPriority priority = NotificationPriority.HIGH;

        if (daysUntil > 1) {
            title = festival.getName() + " Countdown";
            message = "🪔 " + festival.getName() + " is just " + daysUntil + " days away! Get ready for celebrations at " + festival.getVenue() + ".";
            countdownText = daysUntil + " DAYS TO GO";
        } else if (daysUntil == 1) {
            title = festival.getName() + " is Tomorrow!";
            message = "🎉 " + festival.getName() + " begins tomorrow! We look forward to seeing all residents near the mandap.";
            countdownText = "TOMORROW";
        } else if (daysUntil == 0) {
            title = festival.getName() + " is Today!";
            message = "🙏 " + festival.getName() + " celebrations begin today! Welcome Bappa to Unicode Estates.";
            countdownText = "TODAY";
            priority = NotificationPriority.CRITICAL;
        } else if (!today.isAfter(immerseDate)) {
            title = "🚩 " + festival.getName() + " in Progress";
            message = "🌺 Celebrations are currently happening at " + festival.getVenue() + "! Join us for daily Puja, Prasad, and Cultural events.";
            countdownText = "CELEBRATION ONGOING";
            priority = NotificationPriority.NORMAL;
        } else {
            return null; // Festival has concluded
        }

        FestivalNotificationResponse response = new FestivalNotificationResponse();
        response.setId(999901L); // Synthetic ID
        response.setFestivalId(festival.getId());
        response.setTitle(title);
        response.setMessage(message);
        response.setNotificationType(NotificationType.FESTIVAL_COUNTDOWN);
        response.setPriority(priority);
        response.setEnabled(true);
        response.setDismissible(true);
        response.setRepeatMode(RepeatMode.ONCE_PER_DAY);
        response.setDisplayDurationSeconds(10);
        response.setActionLabel("View Festival Info");
        response.setActionUrl("/donate");
        response.setCountdownText(countdownText);
        response.setCreatedAt(now);
        response.setUpdatedAt(now);
        return response;
    }

    public FestivalNotificationResponse generateScheduleNotification(FestivalSchedule event, LocalDateTime now) {
        if (event.getDateTime() == null) return null;

        LocalDateTime eventTime = event.getDateTime();
        long minutesUntil = ChronoUnit.MINUTES.between(now, eventTime);

        // Window: Event starts between 2 hours ahead and 30 minutes past start
        if (minutesUntil > 120 || minutesUntil < -30) {
            return null;
        }

        NotificationType type = determineTypeFromTitle(event.getEventTitle());
        String title;
        String message;
        NotificationPriority priority = NotificationPriority.NORMAL;

        if (minutesUntil > 30) {
            title = "⏰ " + event.getEventTitle() + " Today";
            message = "🌸 " + event.getEventTitle() + " starts at " + formatTime(eventTime.toLocalTime()) + " today at " + event.getLocation() + ". All residents are welcome!";
        } else if (minutesUntil > 0) {
            title = "🎶 " + event.getEventTitle() + " Starting Soon";
            message = "🌸 " + event.getEventTitle() + " begins in " + minutesUntil + " minutes. Please gather near " + event.getLocation() + ".";
            priority = NotificationPriority.HIGH;
        } else {
            title = "🎉 " + event.getEventTitle() + " Has Started";
            message = "🌸 " + event.getEventTitle() + " has started! Please join us now at " + event.getLocation() + ".";
            priority = NotificationPriority.HIGH;
        }

        FestivalNotificationResponse response = new FestivalNotificationResponse();
        response.setId(990000L + event.getId());
        response.setFestivalId(event.getFestival() != null ? event.getFestival().getId() : 1L);
        response.setTitle(title);
        response.setMessage(message);
        response.setNotificationType(type);
        response.setPriority(priority);
        response.setEventDate(eventTime.toLocalDate());
        response.setEventTime(eventTime.toLocalTime());
        response.setEnabled(true);
        response.setDismissible(true);
        response.setRepeatMode(RepeatMode.ONCE_PER_SESSION);
        response.setDisplayDurationSeconds(10);
        response.setActionLabel("View Schedule");
        response.setActionUrl("/donate");
        response.setTimeToEventMinutes(minutesUntil);
        response.setCreatedAt(now);
        response.setUpdatedAt(now);
        return response;
    }

    private NotificationType determineTypeFromTitle(String title) {
        if (title == null) return NotificationType.EVENT_REMINDER;
        String lower = title.toLowerCase();
        if (lower.contains("puja") || lower.contains("pooja") || lower.contains("aarti") || lower.contains("sthapana")) return NotificationType.PUJA_REMINDER;
        if (lower.contains("decoration") || lower.contains("mandap")) return NotificationType.DECORATION;
        if (lower.contains("dance")) return NotificationType.DANCE_PROGRAM;
        if (lower.contains("music") || lower.contains("orchestra") || lower.contains("bhajan")) return NotificationType.MUSIC_PROGRAM;
        if (lower.contains("cultural")) return NotificationType.CULTURAL_PROGRAM;
        if (lower.contains("prasad") || lower.contains("annadhanam") || lower.contains("lunch") || lower.contains("dinner")) return NotificationType.PRASAD;
        if (lower.contains("nimajjanam") || lower.contains("immersion") || lower.contains("visarjan")) return NotificationType.NIMAJJANAM_UPDATE;
        return NotificationType.EVENT_REMINDER;
    }

    private String formatTime(LocalTime time) {
        int hour = time.getHour();
        int minute = time.getMinute();
        String ampm = hour >= 12 ? "PM" : "AM";
        int displayHour = hour % 12 == 0 ? 12 : hour % 12;
        return String.format("%d:%02d %s", displayHour, minute, ampm);
    }
}

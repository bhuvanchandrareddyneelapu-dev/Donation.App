package com.donationapp.dto.resp;

import com.donationapp.entity.FestivalNotification;
import com.donationapp.entity.enums.NotificationPriority;
import com.donationapp.entity.enums.NotificationType;
import com.donationapp.entity.enums.RepeatMode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class FestivalNotificationResponse {

    private Long id;
    private Long festivalId;
    private String title;
    private String message;
    private NotificationType notificationType;
    private NotificationPriority priority;
    private LocalDateTime scheduledStart;
    private LocalDateTime scheduledEnd;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private boolean enabled;
    private boolean dismissible;
    private RepeatMode repeatMode;
    private Integer displayDurationSeconds;
    private String actionLabel;
    private String actionUrl;
    private boolean sendPush;
    private boolean pushSent;
    private LocalDateTime pushSentAt;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Additional computed properties for smart popup
    private String countdownText;
    private Long timeToEventMinutes;

    public FestivalNotificationResponse() {}

    public static FestivalNotificationResponse fromEntity(FestivalNotification entity) {
        FestivalNotificationResponse dto = new FestivalNotificationResponse();
        dto.setId(entity.getId());
        dto.setFestivalId(entity.getFestival() != null ? entity.getFestival().getId() : null);
        dto.setTitle(entity.getTitle());
        dto.setMessage(entity.getMessage());
        dto.setNotificationType(entity.getNotificationType());
        dto.setPriority(entity.getPriority());
        dto.setScheduledStart(entity.getScheduledStart());
        dto.setScheduledEnd(entity.getScheduledEnd());
        dto.setEventDate(entity.getEventDate());
        dto.setEventTime(entity.getEventTime());
        dto.setEnabled(entity.isEnabled());
        dto.setDismissible(entity.isDismissible());
        dto.setRepeatMode(entity.getRepeatMode());
        dto.setDisplayDurationSeconds(entity.getDisplayDurationSeconds());
        dto.setActionLabel(entity.getActionLabel());
        dto.setActionUrl(entity.getActionUrl());
        dto.setSendPush(entity.isSendPush());
        dto.setPushSent(entity.isPushSent());
        dto.setPushSentAt(entity.getPushSentAt());
        dto.setCreatedBy(entity.getCreatedBy());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFestivalId() { return festivalId; }
    public void setFestivalId(Long festivalId) { this.festivalId = festivalId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getNotificationType() { return notificationType; }
    public void setNotificationType(NotificationType notificationType) { this.notificationType = notificationType; }

    public NotificationPriority getPriority() { return priority; }
    public void setPriority(NotificationPriority priority) { this.priority = priority; }

    public LocalDateTime getScheduledStart() { return scheduledStart; }
    public void setScheduledStart(LocalDateTime scheduledStart) { this.scheduledStart = scheduledStart; }

    public LocalDateTime getScheduledEnd() { return scheduledEnd; }
    public void setScheduledEnd(LocalDateTime scheduledEnd) { this.scheduledEnd = scheduledEnd; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public LocalTime getEventTime() { return eventTime; }
    public void setEventTime(LocalTime eventTime) { this.eventTime = eventTime; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public boolean isDismissible() { return dismissible; }
    public void setDismissible(boolean dismissible) { this.dismissible = dismissible; }

    public RepeatMode getRepeatMode() { return repeatMode; }
    public void setRepeatMode(RepeatMode repeatMode) { this.repeatMode = repeatMode; }

    public Integer getDisplayDurationSeconds() { return displayDurationSeconds; }
    public void setDisplayDurationSeconds(Integer displayDurationSeconds) { this.displayDurationSeconds = displayDurationSeconds; }

    public String getActionLabel() { return actionLabel; }
    public void setActionLabel(String actionLabel) { this.actionLabel = actionLabel; }

    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

    public boolean isSendPush() { return sendPush; }
    public void setSendPush(boolean sendPush) { this.sendPush = sendPush; }

    public boolean isPushSent() { return pushSent; }
    public void setPushSent(boolean pushSent) { this.pushSent = pushSent; }

    public LocalDateTime getPushSentAt() { return pushSentAt; }
    public void setPushSentAt(LocalDateTime pushSentAt) { this.pushSentAt = pushSentAt; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getCountdownText() { return countdownText; }
    public void setCountdownText(String countdownText) { this.countdownText = countdownText; }

    public Long getTimeToEventMinutes() { return timeToEventMinutes; }
    public void setTimeToEventMinutes(Long timeToEventMinutes) { this.timeToEventMinutes = timeToEventMinutes; }
}

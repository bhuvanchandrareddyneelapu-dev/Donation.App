package com.donationapp.dto.req;

import com.donationapp.entity.enums.NotificationPriority;
import com.donationapp.entity.enums.NotificationType;
import com.donationapp.entity.enums.RepeatMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class FestivalNotificationRequest {

    @NotNull(message = "festivalId is required")
    private Long festivalId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotNull(message = "notificationType is required")
    private NotificationType notificationType;

    private NotificationPriority priority = NotificationPriority.NORMAL;

    private LocalDateTime scheduledStart;
    private LocalDateTime scheduledEnd;

    private LocalDate eventDate;
    private LocalTime eventTime;

    private Boolean enabled = true;
    private Boolean dismissible = true;

    private RepeatMode repeatMode = RepeatMode.ONCE_PER_SESSION;
    private Integer displayDurationSeconds = 10;

    private String actionLabel;
    private String actionUrl;
    private Boolean sendPush = true;

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

    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }

    public Boolean getDismissible() { return dismissible; }
    public void setDismissible(Boolean dismissible) { this.dismissible = dismissible; }

    public RepeatMode getRepeatMode() { return repeatMode; }
    public void setRepeatMode(RepeatMode repeatMode) { this.repeatMode = repeatMode; }

    public Integer getDisplayDurationSeconds() { return displayDurationSeconds; }
    public void setDisplayDurationSeconds(Integer displayDurationSeconds) { this.displayDurationSeconds = displayDurationSeconds; }

    public String getActionLabel() { return actionLabel; }
    public void setActionLabel(String actionLabel) { this.actionLabel = actionLabel; }

    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

    public Boolean getSendPush() { return sendPush; }
    public void setSendPush(Boolean sendPush) { this.sendPush = sendPush; }
}

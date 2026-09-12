package com.donationapp.controller;

import com.donationapp.dto.req.FestivalNotificationRequest;
import com.donationapp.dto.resp.FestivalNotificationResponse;
import com.donationapp.entity.enums.NotificationPriority;
import com.donationapp.service.FestivalNotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FestivalNotificationController {

    private final FestivalNotificationService notificationService;

    public FestivalNotificationController(FestivalNotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // ==========================================
    // PUBLIC ENDPOINTS
    // ==========================================

    @GetMapping("/api/v1/notifications/active")
    public ResponseEntity<List<FestivalNotificationResponse>> getActiveNotifications(
            @RequestParam(defaultValue = "1") Long festivalId) {
        return ResponseEntity.ok(notificationService.getActiveNotifications(festivalId));
    }

    @GetMapping("/api/v1/notifications/today")
    public ResponseEntity<List<FestivalNotificationResponse>> getTodayNotifications(
            @RequestParam(defaultValue = "1") Long festivalId) {
        return ResponseEntity.ok(notificationService.getTodayNotifications(festivalId));
    }

    @GetMapping("/api/v1/notifications/upcoming")
    public ResponseEntity<List<FestivalNotificationResponse>> getUpcomingNotifications(
            @RequestParam(defaultValue = "1") Long festivalId) {
        return ResponseEntity.ok(notificationService.getUpcomingNotifications(festivalId));
    }

    // ==========================================
    // ADMIN ENDPOINTS (Secured)
    // ==========================================

    @GetMapping("/api/v1/admin/notifications")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN')")
    public ResponseEntity<List<FestivalNotificationResponse>> getAllNotificationsForAdmin(
            @RequestParam(defaultValue = "1") Long festivalId) {
        return ResponseEntity.ok(notificationService.getAllNotificationsForAdmin(festivalId));
    }

    @PostMapping("/api/v1/admin/notifications")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN')")
    public ResponseEntity<FestivalNotificationResponse> createNotification(
            @Valid @RequestBody FestivalNotificationRequest request,
            Authentication authentication) {
        String createdBy = authentication != null ? authentication.getName() : "ADMIN";
        FestivalNotificationResponse created = notificationService.createNotification(request, createdBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/api/v1/admin/notifications/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN')")
    public ResponseEntity<FestivalNotificationResponse> updateNotification(
            @PathVariable Long id,
            @Valid @RequestBody FestivalNotificationRequest request) {
        FestivalNotificationResponse updated = notificationService.updateNotification(id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/api/v1/admin/notifications/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN')")
    public ResponseEntity<FestivalNotificationResponse> updateNotificationStatus(
            @PathVariable Long id,
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(required = false) NotificationPriority priority) {
        FestivalNotificationResponse updated = notificationService.updateStatus(id, enabled, priority);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/api/v1/admin/notifications/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN')")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}

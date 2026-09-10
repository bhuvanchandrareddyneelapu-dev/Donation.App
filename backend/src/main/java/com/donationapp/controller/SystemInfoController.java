package com.donationapp.controller;

import com.donationapp.service.EmailService;
import com.donationapp.service.RazorpayService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * SystemInfoController — provides safe, non-sensitive system information endpoints.
 *
 * GET /api/v1/system/version   — PUBLIC. Returns application version, git commit, and timestamp.
 *                                Use to detect stale Render deployments.
 *
 * GET /api/v1/admin/system/diagnostics — SUPER_ADMIN only. Returns safe runtime status of
 *                                        all subsystems (DB, JWT, Brevo, Razorpay).
 *                                        NEVER returns secret values.
 */
@RestController
public class SystemInfoController {

    private final EmailService emailService;
    private final RazorpayService razorpayService;
    private final JdbcTemplate jdbcTemplate;

    @Value("${donationapp.app-base-url:https://donation-app-6xky.onrender.com}")
    private String appBaseUrl;

    @Value("${donationapp.jwt.secret:}")
    private String jwtSecret;

    // Render injects RENDER_GIT_COMMIT as an env var during deployment
    @Value("${RENDER_GIT_COMMIT:local-dev}")
    private String gitCommit;

    @Value("${RENDER_SERVICE_NAME:donation-app-backend}")
    private String renderServiceName;

    public SystemInfoController(EmailService emailService,
                                RazorpayService razorpayService,
                                JdbcTemplate jdbcTemplate) {
        this.emailService = emailService;
        this.razorpayService = razorpayService;
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * PUBLIC endpoint — safe to call without authentication.
     * Allows frontend and operations team to detect stale Render deployments by
     * comparing the gitCommit field against the latest push.
     */
    @GetMapping("/api/v1/system/version")
    public ResponseEntity<?> getVersion() {
        Map<String, Object> version = new LinkedHashMap<>();
        version.put("application", "Donation.App");
        version.put("environment", "production");
        version.put("service", renderServiceName);
        version.put("gitCommit", gitCommit);
        version.put("buildVersion", "1.0.0");
        version.put("backendUrl", appBaseUrl);
        version.put("timestamp", Instant.now().atZone(ZoneOffset.UTC)
                .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        return ResponseEntity.ok(version);
    }

    /**
     * SUPER_ADMIN only diagnostics endpoint.
     * Returns safe status strings for all subsystems — NEVER returns secret values.
     */
    @GetMapping("/api/v1/admin/system/diagnostics")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> getSystemDiagnostics() {
        Map<String, Object> diagnostics = new LinkedHashMap<>();

        // Backend status
        diagnostics.put("backend", "UP");
        diagnostics.put("gitCommit", gitCommit);
        diagnostics.put("environment", "production");
        diagnostics.put("service", renderServiceName);
        diagnostics.put("timestamp", Instant.now().atZone(ZoneOffset.UTC)
                .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));

        // Database connectivity
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            diagnostics.put("database", "UP");
        } catch (Exception e) {
            diagnostics.put("database", "DOWN");
        }

        // JWT configuration
        boolean jwtConfigured = jwtSecret != null && !jwtSecret.isBlank() && jwtSecret.length() >= 32;
        diagnostics.put("jwt", jwtConfigured ? "CONFIGURED" : "MISSING");

        // Brevo (email) status — safe status map only, no key values
        try {
            Map<String, Object> emailStatus = emailService.getSmtpStatusMap();
            String emailProvider = emailStatus.getOrDefault("provider", "unknown").toString().toUpperCase();
            boolean emailConfigured = Boolean.TRUE.equals(emailStatus.get("configured"));
            String emailConnectivity = emailStatus.getOrDefault("connectivity", "UNVERIFIED").toString();
            diagnostics.put("emailProvider", emailProvider);
            diagnostics.put("brevo", emailConfigured ? "CONFIGURED" : "UNCONFIGURED");
            diagnostics.put("emailConnectivity", emailConnectivity);
        } catch (Exception e) {
            diagnostics.put("emailProvider", "ERROR");
            diagnostics.put("brevo", "ERROR");
        }

        // Razorpay configuration — key ID is safe to show (it's a public identifier)
        String razorpayKeyId = razorpayService.getRazorpayKeyId();
        boolean razorpayConfigured = razorpayKeyId != null && !razorpayKeyId.isBlank();
        diagnostics.put("razorpay", razorpayConfigured ? "CONFIGURED" : "UNCONFIGURED");
        if (razorpayConfigured) {
            // Only show the first 8 chars of the key ID (e.g. "rzp_live") — safe public info
            String safeKeyId = razorpayKeyId.length() > 8
                    ? razorpayKeyId.substring(0, 8) + "..."
                    : razorpayKeyId;
            diagnostics.put("razorpayKeyIdPrefix", safeKeyId);
        }

        // App base URL
        diagnostics.put("appBaseUrl", appBaseUrl);

        return ResponseEntity.ok(diagnostics);
    }
}

package com.donationapp.controller;

import com.donationapp.service.EmailService;
import com.donationapp.service.RazorpayService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * SystemInfoControllerTest — verifies:
 * 1. /api/v1/system/version returns safe public info (no secrets)
 * 2. /api/v1/admin/system/diagnostics returns correct safe status map
 * 3. Razorpay key secret is NEVER returned in any response
 * 4. BREVO_API_KEY is NEVER returned in any response
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class SystemInfoControllerTest {

    @Mock
    private EmailService emailService;

    @Mock
    private RazorpayService razorpayService;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private SystemInfoController systemInfoController;

    private void setupController(String gitCommit, String razorpayKeyId, boolean brevoConfigured) {
        ReflectionTestUtils.setField(systemInfoController, "appBaseUrl", "https://donation-app-6xky.onrender.com");
        ReflectionTestUtils.setField(systemInfoController, "jwtSecret", "test-secret-that-is-at-least-32-chars-long-yes");
        ReflectionTestUtils.setField(systemInfoController, "gitCommit", gitCommit);
        ReflectionTestUtils.setField(systemInfoController, "renderServiceName", "donation-app-backend");

        when(razorpayService.getRazorpayKeyId()).thenReturn(razorpayKeyId);
        when(emailService.getSmtpStatusMap()).thenReturn(
            Map.of("configured", brevoConfigured, "provider", "brevo", "connectivity", "UNVERIFIED")
        );
        when(jdbcTemplate.queryForObject(eq("SELECT 1"), eq(Integer.class))).thenReturn(1);
    }

    @Test
    void testGetVersion_ReturnsPublicInfoWithoutSecrets() {
        setupController("abc123def456", "rzp_live_xyz", true);

        ResponseEntity<?> response = systemInfoController.getVersion();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("Donation.App", body.get("application"));
        assertEquals("abc123def456", body.get("gitCommit"));
        assertEquals("production", body.get("environment"));

        // CRITICAL: version endpoint must NEVER expose any secret
        assertFalse(body.containsKey("jwtSecret"), "JWT secret must NOT appear in version response");
        assertFalse(body.containsKey("razorpayKeySecret"), "Razorpay key secret must NOT appear in version response");
        assertFalse(body.containsKey("brevoApiKey"), "Brevo API key must NOT appear in version response");
        assertFalse(body.containsKey("apiKey"), "API key must NOT appear in version response");
    }

    @Test
    void testGetSystemDiagnostics_WhenBrevoAndRazorpayConfigured_ShowsConfigured() {
        setupController("abc123def456", "rzp_live_xyz123456", true);

        ResponseEntity<?> response = systemInfoController.getSystemDiagnostics();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();

        assertEquals("UP", body.get("backend"));
        assertEquals("UP", body.get("database"));
        assertEquals("CONFIGURED", body.get("brevo"));
        assertEquals("CONFIGURED", body.get("razorpay"));
        assertEquals("CONFIGURED", body.get("jwt"));

        // Razorpay key ID prefix is OK (safe public info) — but secret must NOT be present
        assertFalse(body.containsKey("razorpayKeySecret"), "Razorpay key secret must NOT appear in diagnostics");
        assertFalse(body.containsKey("brevoApiKey"), "Brevo API key must NOT appear in diagnostics");
        assertFalse(body.containsKey("jwtSecret"), "JWT secret must NOT appear in diagnostics");

        // Key prefix shows only first 8 chars e.g. "rzp_live"
        String prefix = (String) body.get("razorpayKeyIdPrefix");
        assertNotNull(prefix);
        assertTrue(prefix.endsWith("..."), "Key ID prefix must be truncated with ...");
        assertTrue(prefix.length() <= 12, "Key ID prefix must show only first 8 chars + ...");
    }

    @Test
    void testGetSystemDiagnostics_WhenRazorpayUnconfigured_ShowsUnconfigured() {
        setupController("abc123", "", false);

        ResponseEntity<?> response = systemInfoController.getSystemDiagnostics();
        assertEquals(HttpStatus.OK, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("UNCONFIGURED", body.get("razorpay"));
        assertEquals("UNCONFIGURED", body.get("brevo"));
        assertFalse(body.containsKey("razorpayKeyIdPrefix"), "No key prefix when unconfigured");
    }

    @Test
    void testGetSystemDiagnostics_DatabaseDown_ShowsDOWN() {
        ReflectionTestUtils.setField(systemInfoController, "appBaseUrl", "https://donation-app-6xky.onrender.com");
        ReflectionTestUtils.setField(systemInfoController, "jwtSecret", "some-valid-jwt-secret-at-least-32-chars-ok");
        ReflectionTestUtils.setField(systemInfoController, "gitCommit", "abc123");
        ReflectionTestUtils.setField(systemInfoController, "renderServiceName", "donation-app-backend");

        when(razorpayService.getRazorpayKeyId()).thenReturn("rzp_live_xyz");
        when(emailService.getSmtpStatusMap()).thenReturn(Map.of("configured", true, "provider", "brevo", "connectivity", "UNVERIFIED"));
        when(jdbcTemplate.queryForObject(eq("SELECT 1"), eq(Integer.class)))
                .thenThrow(new RuntimeException("DB connection refused"));

        ResponseEntity<?> response = systemInfoController.getSystemDiagnostics();
        assertEquals(HttpStatus.OK, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("DOWN", body.get("database"), "Should report DOWN when DB is unreachable");
    }

    @Test
    void testGetVersion_StaleDeploymentDetectable() {
        // This test verifies that gitCommit field allows detection of stale Render deployments
        setupController("local-dev", "rzp_test_abc", false);

        ResponseEntity<?> response = systemInfoController.getVersion();
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();

        // When RENDER_GIT_COMMIT is "local-dev", it means the env var was not set by Render
        // — this is a signal of a potential stale/local deployment
        assertEquals("local-dev", body.get("gitCommit"),
                "git commit field must be present and reflect the RENDER_GIT_COMMIT env var");
    }
}

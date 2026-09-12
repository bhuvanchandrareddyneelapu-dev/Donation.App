package com.donationapp.controller;

import com.donationapp.dto.req.*;
import com.donationapp.security.UserPrincipal;
import com.donationapp.service.SuperAdminSecurityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class SuperAdminSecurityController {

    private final SuperAdminSecurityService securityService;

    public SuperAdminSecurityController(SuperAdminSecurityService securityService) {
        this.securityService = securityService;
    }

    // ==========================================
    // PUBLIC FORGOT PASSWORD ENDPOINTS
    // ==========================================

    @PostMapping("/api/v1/admin/auth/forgot-password/request-otp")
    public ResponseEntity<Map<String, Object>> requestForgotPasswordOtp(@Valid @RequestBody ForgotPasswordRequest req) {
        return ResponseEntity.ok(securityService.requestForgotPasswordOtp(req));
    }

    @PostMapping("/api/v1/admin/auth/forgot-password/reset")
    public ResponseEntity<Map<String, Object>> resetPasswordWithOtp(@Valid @RequestBody ForgotPasswordResetRequest req) {
        return ResponseEntity.ok(securityService.resetPasswordWithOtp(req));
    }

    // ==========================================
    // PROTECTED SUPER ADMIN SECURITY ENDPOINTS
    // ==========================================

    @PostMapping("/api/v1/superadmin/security/request-change-password-otp")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> requestChangePasswordOtp(Authentication auth) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(securityService.requestChangePasswordOtp(principal.getId()));
    }

    @PostMapping("/api/v1/superadmin/security/change-password")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> changePasswordWithOtp(
            @Valid @RequestBody ChangePasswordWithOtpRequest req,
            Authentication auth) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(securityService.changePasswordWithOtp(principal.getId(), req));
    }

    @PostMapping("/api/v1/superadmin/security/request-phone-change-otp")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> requestPhoneChangeOtp(
            @RequestBody Map<String, String> body,
            Authentication auth) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        String currentPassword = body.getOrDefault("currentPassword", "");
        return ResponseEntity.ok(securityService.requestCurrentPhoneOtp(principal.getId(), currentPassword));
    }

    @PostMapping("/api/v1/superadmin/security/phone/verify-current-otp")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> verifyCurrentPhoneOtp(
            @RequestBody Map<String, String> body,
            Authentication auth) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        String otp = body.getOrDefault("otp", "");
        return ResponseEntity.ok(securityService.verifyCurrentPhoneOtp(principal.getId(), otp));
    }

    @PostMapping("/api/v1/superadmin/security/phone/request-new-otp")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> requestNewPhoneOtp(
            @RequestBody Map<String, String> body,
            Authentication auth) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        String newPhone = body.getOrDefault("newPhone", "");
        return ResponseEntity.ok(securityService.requestNewPhoneOtp(principal.getId(), newPhone));
    }

    @PostMapping(path = {"/api/v1/superadmin/security/update-phone", "/api/v1/superadmin/security/phone/verify-new-otp"})
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> updateRecoveryPhone(
            @RequestBody Map<String, String> body,
            Authentication auth) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        String otp = body.getOrDefault("otp", "");
        String newPhone = body.getOrDefault("newPhone", "");
        return ResponseEntity.ok(securityService.verifyNewPhoneOtpAndUpdate(principal.getId(), otp, newPhone));
    }
}

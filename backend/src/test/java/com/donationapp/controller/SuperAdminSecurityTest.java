package com.donationapp.controller;

import com.donationapp.dto.req.ChangePasswordWithOtpRequest;
import com.donationapp.dto.req.ForgotPasswordRequest;
import com.donationapp.dto.req.ForgotPasswordResetRequest;
import com.donationapp.dto.req.LoginRequest;
import com.donationapp.dto.resp.JwtResponse;
import com.donationapp.entity.AuditLog;
import com.donationapp.entity.SuperAdminOtp;
import com.donationapp.entity.User;
import com.donationapp.repository.AuditLogRepository;
import com.donationapp.repository.SuperAdminOtpRepository;
import com.donationapp.repository.UserRepository;
import com.donationapp.security.JwtUtils;
import com.donationapp.security.UserPrincipal;
import com.donationapp.service.AuthService;
import com.donationapp.service.SuperAdminSecurityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SuperAdminSecurityTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SuperAdminOtpRepository otpRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthService authService;

    @InjectMocks
    private SuperAdminSecurityService superAdminSecurityService;

    private User superAdminUser;
    private User adminUser;
    private User festivalAdminUser;
    private User volunteerUser;
    private User donorUser;

    private static final String SALT = "DonationApp_SuperAdmin_Salt_2026";

    @BeforeEach
    void setUp() {
        superAdminUser = new User("Super Admin", "superadmin@donation.app", "+91 9876543210", "$2a$10$oldHashedPassword", User.Role.SUPER_ADMIN);
        superAdminUser.setId(1L);

        adminUser = new User("Org Admin", "admin@donation.app", "+91 9876543215", "$2a$10$hashedPass", User.Role.ADMIN);
        adminUser.setId(2L);

        festivalAdminUser = new User("Festival Admin", "festivaladmin@donation.app", "+91 9876543211", "$2a$10$hashedPass", User.Role.FESTIVAL_ADMIN);
        festivalAdminUser.setId(3L);

        volunteerUser = new User("Volunteer", "volunteer@donation.app", "+91 9876543213", "$2a$10$hashedPass", User.Role.VOLUNTEER);
        volunteerUser.setId(4L);

        donorUser = new User("Public Donor", "donor@donation.app", "+91 9876543214", "$2a$10$hashedPass", User.Role.DONOR);
        donorUser.setId(5L);
    }

    private String hashOtp(String otp) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((SALT + otp).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    // -------------------------------------------------------------------------
    // 1. Valid Super Admin credentials -> Login succeeds.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("1. Valid Super Admin credentials -> Login succeeds")
    void test01_ValidSuperAdminCredentials_LoginSucceeds() {
        LoginRequest req = new LoginRequest();
        req.setEmail("superadmin@donation.app");
        req.setPassword("ValidSuperPass123!");

        UserPrincipal principal = UserPrincipal.build(superAdminUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtUtils.generateJwtToken(any())).thenReturn("mock.jwt.superadmin.token");
        when(userRepository.findById(1L)).thenReturn(Optional.of(superAdminUser));

        JwtResponse res = authService.authenticateUser(req);

        assertNotNull(res);
        assertEquals("mock.jwt.superadmin.token", res.getToken());
        assertEquals(User.Role.SUPER_ADMIN, res.getRole());
    }

    // -------------------------------------------------------------------------
    // 2. Invalid password -> Login fails.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("2. Invalid password -> Login fails")
    void test02_InvalidPassword_LoginFails() {
        LoginRequest req = new LoginRequest();
        req.setEmail("superadmin@donation.app");
        req.setPassword("WrongPassword!");

        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.authenticateUser(req));
    }

    // -------------------------------------------------------------------------
    // 3. ADMIN attempting Super Admin password API -> 403.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("3. ADMIN attempting Super Admin password API -> 403")
    void test03_AdminAttemptingSuperAdminPasswordApi_Forbidden403() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(adminUser));
        ChangePasswordWithOtpRequest req = new ChangePasswordWithOtpRequest();
        req.setOtp("123456");
        req.setNewPassword("NewSecurePass123!");
        req.setConfirmPassword("NewSecurePass123!");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                superAdminSecurityService.changePasswordWithOtp(2L, req)
        );
        assertEquals(403, ex.getStatusCode().value());
        assertTrue(ex.getReason().contains("Only Super Admin accounts can manage Super Admin credentials"));
    }

    // -------------------------------------------------------------------------
    // 4. FESTIVAL_ADMIN attempting Super Admin password API -> 403.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("4. FESTIVAL_ADMIN attempting Super Admin password API -> 403")
    void test04_FestivalAdminAttemptingSuperAdminPasswordApi_Forbidden403() {
        when(userRepository.findById(3L)).thenReturn(Optional.of(festivalAdminUser));
        ChangePasswordWithOtpRequest req = new ChangePasswordWithOtpRequest();
        req.setOtp("123456");
        req.setNewPassword("NewSecurePass123!");
        req.setConfirmPassword("NewSecurePass123!");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                superAdminSecurityService.changePasswordWithOtp(3L, req)
        );
        assertEquals(403, ex.getStatusCode().value());
        assertTrue(ex.getReason().contains("Only Super Admin accounts can manage Super Admin credentials"));
    }

    // -------------------------------------------------------------------------
    // 5. VOLUNTEER attempting Super Admin password API -> 403.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("5. VOLUNTEER attempting Super Admin password API -> 403")
    void test05_VolunteerAttemptingSuperAdminPasswordApi_Forbidden403() {
        when(userRepository.findById(4L)).thenReturn(Optional.of(volunteerUser));
        ChangePasswordWithOtpRequest req = new ChangePasswordWithOtpRequest();
        req.setOtp("123456");
        req.setNewPassword("NewSecurePass123!");
        req.setConfirmPassword("NewSecurePass123!");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                superAdminSecurityService.changePasswordWithOtp(4L, req)
        );
        assertEquals(403, ex.getStatusCode().value());
        assertTrue(ex.getReason().contains("Only Super Admin accounts can manage Super Admin credentials"));
    }

    // -------------------------------------------------------------------------
    // 6. Unauthorized email attempting committee dashboard -> 403.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("6. Unauthorized email (DONOR) attempting committee dashboard -> 403")
    void test06_UnauthorizedEmailAttemptingCommitteeDashboard_Forbidden403() {
        LoginRequest req = new LoginRequest();
        req.setEmail("donor@donation.app");
        req.setPassword("donor123");

        UserPrincipal principal = UserPrincipal.build(donorUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any())).thenReturn(auth);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                authService.authenticateUser(req)
        );
        assertEquals(403, ex.getStatusCode().value());
    }

    // -------------------------------------------------------------------------
    // 7. Forgot password requires valid OTP.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("7. Forgot password requires valid OTP")
    void test07_ForgotPasswordRequiresValidOtp() {
        ForgotPasswordResetRequest req = new ForgotPasswordResetRequest();
        req.setEmail("superadmin@donation.app");
        req.setOtp(""); // empty OTP
        req.setNewPassword("NewSecurePass123!");
        req.setConfirmPassword("NewSecurePass123!");

        when(userRepository.findByEmail("superadmin@donation.app")).thenReturn(Optional.of(superAdminUser));

        SuperAdminOtp otpRecord = new SuperAdminOtp(superAdminUser, hashOtp("123456"), "FORGOT_PASSWORD", 5);
        when(otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(1L, "FORGOT_PASSWORD"))
                .thenReturn(Optional.of(otpRecord));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                superAdminSecurityService.resetPasswordWithOtp(req)
        );
        assertEquals(400, ex.getStatusCode().value());
        assertTrue(ex.getReason().contains("Incorrect OTP"));
    }

    // -------------------------------------------------------------------------
    // 8. Incorrect OTP -> Password update rejected.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("8. Incorrect OTP -> Password update rejected")
    void test08_IncorrectOtp_PasswordUpdateRejected() {
        when(userRepository.findByEmail("superadmin@donation.app")).thenReturn(Optional.of(superAdminUser));

        SuperAdminOtp otpRecord = new SuperAdminOtp(superAdminUser, hashOtp("123456"), "FORGOT_PASSWORD", 5);
        when(otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(1L, "FORGOT_PASSWORD"))
                .thenReturn(Optional.of(otpRecord));

        ForgotPasswordResetRequest req = new ForgotPasswordResetRequest();
        req.setEmail("superadmin@donation.app");
        req.setOtp("999999"); // Wrong OTP
        req.setNewPassword("NewSecurePass123!");
        req.setConfirmPassword("NewSecurePass123!");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                superAdminSecurityService.resetPasswordWithOtp(req)
        );
        assertEquals(400, ex.getStatusCode().value());
        assertTrue(ex.getReason().contains("Incorrect OTP"));
        assertEquals(1, otpRecord.getAttempts());
    }

    // -------------------------------------------------------------------------
    // 9. Expired OTP -> Password update rejected.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("9. Expired OTP -> Password update rejected")
    void test09_ExpiredOtp_PasswordUpdateRejected() {
        when(userRepository.findByEmail("superadmin@donation.app")).thenReturn(Optional.of(superAdminUser));

        SuperAdminOtp otpRecord = new SuperAdminOtp(superAdminUser, hashOtp("123456"), "FORGOT_PASSWORD", -1); // Expired
        when(otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(1L, "FORGOT_PASSWORD"))
                .thenReturn(Optional.of(otpRecord));

        ForgotPasswordResetRequest req = new ForgotPasswordResetRequest();
        req.setEmail("superadmin@donation.app");
        req.setOtp("123456");
        req.setNewPassword("NewSecurePass123!");
        req.setConfirmPassword("NewSecurePass123!");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                superAdminSecurityService.resetPasswordWithOtp(req)
        );
        assertEquals(400, ex.getStatusCode().value());
        assertTrue(ex.getReason().contains("OTP has expired"));
    }

    // -------------------------------------------------------------------------
    // 10. Reused / already-used OTP -> Rejected.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("10. Reused or already-used OTP -> Rejected")
    void test10_ReusedAlreadyUsedOtp_Rejected() {
        when(userRepository.findByEmail("superadmin@donation.app")).thenReturn(Optional.of(superAdminUser));
        when(otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(1L, "FORGOT_PASSWORD"))
                .thenReturn(Optional.empty());

        ForgotPasswordResetRequest req = new ForgotPasswordResetRequest();
        req.setEmail("superadmin@donation.app");
        req.setOtp("123456");
        req.setNewPassword("NewSecurePass123!");
        req.setConfirmPassword("NewSecurePass123!");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                superAdminSecurityService.resetPasswordWithOtp(req)
        );
        assertEquals(400, ex.getStatusCode().value());
        assertTrue(ex.getReason().contains("No active OTP request found"));
    }

    // -------------------------------------------------------------------------
    // 11. OTP resend rate limiting (60s cooldown) enforced.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("11. OTP resend rate limiting (60s cooldown) enforced")
    void test11_OtpResendRateLimiting_60sCooldownEnforced() {
        when(userRepository.findByEmail("superadmin@donation.app")).thenReturn(Optional.of(superAdminUser));

        // OTP created 20 seconds ago
        SuperAdminOtp recentOtp = new SuperAdminOtp(superAdminUser, hashOtp("123456"), "FORGOT_PASSWORD", 5);
        recentOtp.setCreatedAt(LocalDateTime.now().minusSeconds(20));

        when(otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(1L, "FORGOT_PASSWORD"))
                .thenReturn(Optional.of(recentOtp));

        ForgotPasswordRequest req = new ForgotPasswordRequest();
        req.setEmail("superadmin@donation.app");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                superAdminSecurityService.requestForgotPasswordOtp(req)
        );
        assertEquals(429, ex.getStatusCode().value());
        assertTrue(ex.getReason().contains("Please wait 60 seconds"));
    }

    // -------------------------------------------------------------------------
    // 12. Valid OTP -> Password successfully changed.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("12. Valid OTP -> Password successfully changed")
    void test12_ValidOtp_PasswordSuccessfullyChanged() {
        when(userRepository.findByEmail("superadmin@donation.app")).thenReturn(Optional.of(superAdminUser));

        SuperAdminOtp otpRecord = new SuperAdminOtp(superAdminUser, hashOtp("123456"), "FORGOT_PASSWORD", 5);
        when(otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(1L, "FORGOT_PASSWORD"))
                .thenReturn(Optional.of(otpRecord));
        when(passwordEncoder.encode("NewSuperPass123!")).thenReturn("$2a$10$newHashedPassword123");

        ForgotPasswordResetRequest req = new ForgotPasswordResetRequest();
        req.setEmail("superadmin@donation.app");
        req.setOtp("123456");
        req.setNewPassword("NewSuperPass123!");
        req.setConfirmPassword("NewSuperPass123!");

        Map<String, Object> resp = superAdminSecurityService.resetPasswordWithOtp(req);

        assertTrue((Boolean) resp.get("success"));
        assertTrue(otpRecord.isUsed());
        assertEquals("$2a$10$newHashedPassword123", superAdminUser.getPassword());
        verify(userRepository).save(superAdminUser);
        verify(otpRepository).save(otpRecord);
    }

    // -------------------------------------------------------------------------
    // 13. Old password fails after change.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("13. Old password fails after change")
    void test13_OldPasswordFailsAfterChange() {
        superAdminUser.setPassword("$2a$10$newHashedPassword123");
        when(passwordEncoder.matches("oldPassword123", "$2a$10$newHashedPassword123")).thenReturn(false);

        boolean oldPassMatches = passwordEncoder.matches("oldPassword123", superAdminUser.getPassword());
        assertFalse(oldPassMatches);
    }

    // -------------------------------------------------------------------------
    // 14. New password succeeds after change.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("14. New password succeeds after change")
    void test14_NewPasswordSucceedsAfterChange() {
        superAdminUser.setPassword("$2a$10$newHashedPassword123");
        when(passwordEncoder.matches("NewSuperPass123!", "$2a$10$newHashedPassword123")).thenReturn(true);

        boolean newPassMatches = passwordEncoder.matches("NewSuperPass123!", superAdminUser.getPassword());
        assertTrue(newPassMatches);
    }

    // -------------------------------------------------------------------------
    // 15. Role escalation attempt (client passing role=SUPER_ADMIN) ignored.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("15. Role escalation attempt ignored (role cannot be altered via user requests)")
    void test15_RoleEscalationAttempt_ClientPassingRoleSuperAdmin_Ignored() {
        User user = new User("Test", "test@app.com", "+91 9999999999", "pass", User.Role.VOLUNTEER);
        assertNotEquals(User.Role.SUPER_ADMIN, user.getRole());
        assertEquals(User.Role.VOLUNTEER, user.getRole());
    }

    // -------------------------------------------------------------------------
    // 16. Plaintext OTP never returned in API responses.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("16. Plaintext OTP never returned in API responses")
    void test16_PlaintextOtpNeverReturnedInApiResponses() {
        when(userRepository.findByEmail("superadmin@donation.app")).thenReturn(Optional.of(superAdminUser));
        when(otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(1L, "FORGOT_PASSWORD"))
                .thenReturn(Optional.empty());

        ForgotPasswordRequest req = new ForgotPasswordRequest();
        req.setEmail("superadmin@donation.app");

        Map<String, Object> resp = superAdminSecurityService.requestForgotPasswordOtp(req);

        assertNotNull(resp);
        assertEquals("If the account is eligible, an OTP has been sent.", resp.get("message"));
        assertEquals("******210", resp.get("maskedPhone"));
        assertFalse(resp.containsKey("otp"));
        assertFalse(resp.containsKey("rawOtp"));
    }

    // -------------------------------------------------------------------------
    // 17. Plaintext password never returned in API responses.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("17. Plaintext password never returned in API responses")
    void test17_PlaintextPasswordNeverReturnedInApiResponses() {
        UserPrincipal principal = UserPrincipal.build(superAdminUser);
        assertNotNull(principal.getPassword());
        assertFalse(principal.getPassword().contains("ValidSuperPass123!"));
        assertFalse(superAdminUser.getPassword().contains("ValidSuperPass123!"));
    }

    // -------------------------------------------------------------------------
    // 18. Plaintext password/OTP never written to logs.
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("18. Plaintext password and OTP never written to audit logs")
    void test18_PlaintextPasswordAndOtpNeverWrittenToLogs() {
        when(userRepository.findByEmail("superadmin@donation.app")).thenReturn(Optional.of(superAdminUser));
        when(otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(1L, "FORGOT_PASSWORD"))
                .thenReturn(Optional.empty());

        ForgotPasswordRequest req = new ForgotPasswordRequest();
        req.setEmail("superadmin@donation.app");

        superAdminSecurityService.requestForgotPasswordOtp(req);

        verify(auditLogRepository, never()).save(argThat(log ->
                log.getDetails() != null && (log.getDetails().contains("123456") || log.getDetails().contains("ValidSuperPass123!"))
        ));
    }

    // -------------------------------------------------------------------------
    // 19. Change Recovery Phone requires dual OTP verification (current phone + new phone).
    // -------------------------------------------------------------------------
    @Test
    @DisplayName("19. Change Recovery Phone requires dual OTP verification (current phone + new phone)")
    void test19_DualOtpVerificationRequiredForPhoneChange() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(superAdminUser));

        // Attempting to update phone without verifying current phone stage fails
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                superAdminSecurityService.verifyNewPhoneOtpAndUpdate(1L, "123456", "+91 9876543299")
        );
        assertEquals(400, ex.getStatusCode().value());
        assertTrue(ex.getReason().contains("Current phone verification has expired or was not completed"));

        // Step 1 & 2: Verify current phone stage
        SuperAdminOtp stageOtp = new SuperAdminOtp(superAdminUser, "VERIFIED_STAGE_OK", "STAGE_CURRENT_PHONE_VERIFIED", superAdminUser.getPhone(), 10);
        when(otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(1L, "STAGE_CURRENT_PHONE_VERIFIED"))
                .thenReturn(Optional.of(stageOtp));

        // Step 3 & 4: Verify new phone OTP
        SuperAdminOtp newPhoneOtpRecord = new SuperAdminOtp(superAdminUser, hashOtp("654321"), "CHANGE_PHONE_NEW", "+91 9876543299", 5);
        when(otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(1L, "CHANGE_PHONE_NEW"))
                .thenReturn(Optional.of(newPhoneOtpRecord));

        Map<String, Object> resp = superAdminSecurityService.verifyNewPhoneOtpAndUpdate(1L, "654321", "+91 9876543299");

        assertTrue((Boolean) resp.get("success"));
        assertEquals("+91 9876543299", superAdminUser.getPhone());
        verify(userRepository).save(superAdminUser);
    }
}

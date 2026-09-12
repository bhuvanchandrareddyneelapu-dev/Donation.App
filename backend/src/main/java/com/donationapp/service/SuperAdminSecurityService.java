package com.donationapp.service;

import com.donationapp.dto.req.*;
import com.donationapp.entity.AuditLog;
import com.donationapp.entity.SuperAdminOtp;
import com.donationapp.entity.User;
import com.donationapp.repository.AuditLogRepository;
import com.donationapp.repository.SuperAdminOtpRepository;
import com.donationapp.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class SuperAdminSecurityService {

    private final UserRepository userRepository;
    private final SuperAdminOtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogRepository auditLogRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    private static final String SALT = "DonationApp_SuperAdmin_Salt_2026";
    private static final int OTP_VALIDITY_MINUTES = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    public SuperAdminSecurityService(UserRepository userRepository,
                                    SuperAdminOtpRepository otpRepository,
                                    PasswordEncoder passwordEncoder,
                                    AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogRepository = auditLogRepository;
    }

    // ==========================================
    // OTP GENERATION & SECURITY HELPERS
    // ==========================================

    public String generateSecureOtp() {
        int num = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(num);
    }

    public String hashOtp(String otp) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((SALT + otp).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Cryptographic SHA-256 algorithm unavailable", e);
        }
    }

    public String maskPhoneNumber(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return "Password recovery is not configured. Please contact the system administrator.";
        }
        String clean = phone.trim();
        if (clean.length() <= 4) {
            return "****";
        }
        String last3 = clean.substring(clean.length() - 3);
        return "******" + last3;
    }

    private void checkResendCooldown(User user, String purpose) {
        Optional<SuperAdminOtp> latest = otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(user.getId(), purpose);
        if (latest.isPresent()) {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime createdAt = latest.get().getCreatedAt();
            if (createdAt.plusSeconds(RESEND_COOLDOWN_SECONDS).isAfter(now)) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Please wait 60 seconds before requesting a new OTP.");
            }
        }
    }

    // ==========================================
    // IN-APP CHANGE PASSWORD FLOW
    // ==========================================

    @Transactional
    public Map<String, Object> requestChangePasswordOtp(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != User.Role.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only Super Admin accounts can manage Super Admin credentials.");
        }

        if (user.getPhone() == null || user.getPhone().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password recovery is not configured. Please contact the system administrator.");
        }

        checkResendCooldown(user, "CHANGE_PASSWORD");

        // Invalidate older unused OTPs
        otpRepository.invalidatePreviousOtps(user.getId(), "CHANGE_PASSWORD");

        String rawOtp = generateSecureOtp();
        String otpHash = hashOtp(rawOtp);

        SuperAdminOtp otpEntity = new SuperAdminOtp(user, otpHash, "CHANGE_PASSWORD", OTP_VALIDITY_MINUTES);
        otpRepository.save(otpEntity);

        // System output without raw OTP in production logs
        System.out.println("📱 [SMS GATEWAY DISPATCH] OTP dispatched to Super Admin registered phone " + maskPhoneNumber(user.getPhone()));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "OTP sent to registered phone (" + maskPhoneNumber(user.getPhone()) + ").");
        response.put("maskedPhone", maskPhoneNumber(user.getPhone()));
        return response;
    }

    @Transactional
    public Map<String, Object> changePasswordWithOtp(Long userId, ChangePasswordWithOtpRequest req) {
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password and confirmation password do not match.");
        }

        if (req.getNewPassword().length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters long.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != User.Role.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only Super Admin accounts can manage Super Admin credentials.");
        }

        SuperAdminOtp otpEntity = otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(user.getId(), "CHANGE_PASSWORD")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No active OTP request found. Please request a new OTP."));

        if (!otpEntity.isValid()) {
            if (otpEntity.isExpired()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP has expired. Please request a new OTP.");
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP limit exceeded or invalid. Please request a new OTP.");
        }

        String inputHash = hashOtp(req.getOtp());
        if (!otpEntity.getOtpHash().equals(inputHash)) {
            otpEntity.incrementAttempts();
            otpRepository.save(otpEntity);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Incorrect OTP. Please check and try again.");
        }

        // OTP verified -> update BCrypt password hash
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        // Mark OTP as used
        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);

        // Audit Log
        AuditLog audit = new AuditLog(user.getEmail(), "SUPER_ADMIN", "SUPER_ADMIN_PASSWORD_CHANGE", "User", String.valueOf(user.getId()), "Super Admin password changed successfully via OTP verification");
        auditLogRepository.save(audit);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Super Admin password updated successfully. Please use your new password for future logins.");
        return response;
    }

    // ==========================================
    // FORGOT PASSWORD FLOW (PUBLIC PORTAL)
    // ==========================================

    @Transactional
    public Map<String, Object> requestForgotPasswordOtp(ForgotPasswordRequest req) {
        String email = req.getEmail().trim();
        Optional<User> userOpt = userRepository.findByEmail(email);

        Map<String, Object> genericResponse = new LinkedHashMap<>();
        genericResponse.put("success", true);
        genericResponse.put("message", "If the account is eligible, an OTP has been sent.");

        if (userOpt.isEmpty() || userOpt.get().getRole() != User.Role.SUPER_ADMIN) {
            // Generic anti-enumeration response for non-superadmin or non-existent emails
            return genericResponse;
        }

        User user = userOpt.get();
        if (user.getPhone() == null || user.getPhone().trim().isEmpty()) {
            return genericResponse;
        }

        checkResendCooldown(user, "FORGOT_PASSWORD");

        // Invalidate prior unused OTPs
        otpRepository.invalidatePreviousOtps(user.getId(), "FORGOT_PASSWORD");

        String rawOtp = generateSecureOtp();
        String otpHash = hashOtp(rawOtp);

        SuperAdminOtp otpEntity = new SuperAdminOtp(user, otpHash, "FORGOT_PASSWORD", OTP_VALIDITY_MINUTES);
        otpRepository.save(otpEntity);

        System.out.println("📱 [SMS GATEWAY DISPATCH] Forgot-Password OTP dispatched to registered phone " + maskPhoneNumber(user.getPhone()));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "If the account is eligible, an OTP has been sent.");
        response.put("maskedPhone", maskPhoneNumber(user.getPhone()));
        return response;
    }

    @Transactional
    public Map<String, Object> resetPasswordWithOtp(ForgotPasswordResetRequest req) {
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password and confirmation password do not match.");
        }

        if (req.getNewPassword().length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters long.");
        }

        User user = userRepository.findByEmail(req.getEmail().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid password reset request."));

        if (user.getRole() != User.Role.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid password reset request.");
        }

        SuperAdminOtp otpEntity = otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(user.getId(), "FORGOT_PASSWORD")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No active OTP request found or OTP already used."));

        if (!otpEntity.isValid()) {
            if (otpEntity.isExpired()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP has expired. Please request a new OTP.");
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP limit exceeded or invalid. Please request a new OTP.");
        }

        String inputHash = hashOtp(req.getOtp());
        if (!otpEntity.getOtpHash().equals(inputHash)) {
            otpEntity.incrementAttempts();
            otpRepository.save(otpEntity);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Incorrect OTP. Please check and try again.");
        }

        // Update password with BCrypt hash
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        // Mark OTP as used
        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);

        // Audit Log
        AuditLog audit = new AuditLog(user.getEmail(), "SUPER_ADMIN", "SUPER_ADMIN_FORGOT_PASSWORD_RESET", "User", String.valueOf(user.getId()), "Super Admin password reset successfully via public forgot-password OTP flow");
        auditLogRepository.save(audit);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Super Admin password reset successfully. Please log in with your new password.");
        return response;
    }

    // ==========================================
    // RECOVERY PHONE MANAGEMENT
    // ==========================================

    // ==========================================
    // RECOVERY PHONE MANAGEMENT (2-STEP VERIFICATION)
    // ==========================================

    @Transactional
    public Map<String, Object> requestPhoneChangeOtp(Long userId, String currentPassword) {
        return requestCurrentPhoneOtp(userId, currentPassword);
    }

    @Transactional
    public Map<String, Object> requestCurrentPhoneOtp(Long userId, String currentPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != User.Role.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only Super Admin accounts can modify recovery credentials.");
        }

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Incorrect current password.");
        }

        checkResendCooldown(user, "CHANGE_PHONE_CURRENT");

        otpRepository.invalidatePreviousOtps(user.getId(), "CHANGE_PHONE_CURRENT");

        String rawOtp = generateSecureOtp();
        String otpHash = hashOtp(rawOtp);

        SuperAdminOtp otpEntity = new SuperAdminOtp(user, otpHash, "CHANGE_PHONE_CURRENT", user.getPhone(), OTP_VALIDITY_MINUTES);
        otpRepository.save(otpEntity);

        System.out.println("📱 [SMS GATEWAY DISPATCH] Step 1 OTP sent to current recovery phone " + maskPhoneNumber(user.getPhone()));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "OTP sent to current registered phone (" + maskPhoneNumber(user.getPhone()) + ").");
        response.put("maskedPhone", maskPhoneNumber(user.getPhone()));
        return response;
    }

    @Transactional
    public Map<String, Object> verifyCurrentPhoneOtp(Long userId, String otp) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != User.Role.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only Super Admin accounts can modify recovery credentials.");
        }

        SuperAdminOtp otpEntity = otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(user.getId(), "CHANGE_PHONE_CURRENT")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No active OTP request found for current phone verification."));

        if (!otpEntity.isValid()) {
            if (otpEntity.isExpired()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP has expired. Please request a new OTP.");
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP limit exceeded or invalid. Please request a new OTP.");
        }

        String inputHash = hashOtp(otp);
        if (!otpEntity.getOtpHash().equals(inputHash)) {
            otpEntity.incrementAttempts();
            otpRepository.save(otpEntity);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Incorrect OTP. Please check and try again.");
        }

        // Current phone OTP verified
        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);

        // Invalidate prior stage tokens and create new stage token
        otpRepository.invalidatePreviousOtps(user.getId(), "STAGE_CURRENT_PHONE_VERIFIED");
        SuperAdminOtp stageOtp = new SuperAdminOtp(user, "VERIFIED_STAGE_OK", "STAGE_CURRENT_PHONE_VERIFIED", user.getPhone(), 10);
        otpRepository.save(stageOtp);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Current phone verified successfully. Please enter your new recovery phone number.");
        return response;
    }

    @Transactional
    public Map<String, Object> requestNewPhoneOtp(Long userId, String newPhone) {
        if (newPhone == null || newPhone.trim().isEmpty() || newPhone.trim().length() < 10) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please provide a valid 10-digit phone number.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != User.Role.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only Super Admin accounts can modify recovery credentials.");
        }

        // Ensure Step 2 (current phone verification) was completed within last 10 minutes
        Optional<SuperAdminOtp> stage = otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(user.getId(), "STAGE_CURRENT_PHONE_VERIFIED");
        if (stage.isEmpty() || stage.get().isExpired()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current phone verification has expired or was not completed. Please verify current phone first.");
        }

        checkResendCooldown(user, "CHANGE_PHONE_NEW");

        otpRepository.invalidatePreviousOtps(user.getId(), "CHANGE_PHONE_NEW");

        String rawOtp = generateSecureOtp();
        String otpHash = hashOtp(rawOtp);

        SuperAdminOtp otpEntity = new SuperAdminOtp(user, otpHash, "CHANGE_PHONE_NEW", newPhone.trim(), OTP_VALIDITY_MINUTES);
        otpRepository.save(otpEntity);

        System.out.println("📱 [SMS GATEWAY DISPATCH] Step 2 OTP sent to NEW phone " + maskPhoneNumber(newPhone.trim()));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "OTP sent to new recovery phone (" + maskPhoneNumber(newPhone.trim()) + ").");
        response.put("maskedPhone", maskPhoneNumber(newPhone.trim()));
        return response;
    }

    @Transactional
    public Map<String, Object> updateRecoveryPhone(Long userId, String otp, String newPhone) {
        return verifyNewPhoneOtpAndUpdate(userId, otp, newPhone);
    }

    @Transactional
    public Map<String, Object> verifyNewPhoneOtpAndUpdate(Long userId, String otp, String newPhone) {
        if (newPhone == null || newPhone.trim().isEmpty() || newPhone.trim().length() < 10) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please provide a valid 10-digit phone number.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() != User.Role.SUPER_ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only Super Admin accounts can modify recovery credentials.");
        }

        // Ensure Step 2 current phone stage is valid
        SuperAdminOtp stage = otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(user.getId(), "STAGE_CURRENT_PHONE_VERIFIED")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current phone verification has expired or was not completed. Please verify current phone first."));

        if (stage.isExpired()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current phone verification has expired. Please restart process.");
        }

        SuperAdminOtp otpEntity = otpRepository.findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(user.getId(), "CHANGE_PHONE_NEW")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No active OTP request found for new phone verification."));

        if (!otpEntity.isValid()) {
            if (otpEntity.isExpired()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP has expired. Please request a new OTP.");
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP limit exceeded or invalid. Please request a new OTP.");
        }

        String inputHash = hashOtp(otp);
        if (!otpEntity.getOtpHash().equals(inputHash)) {
            otpEntity.incrementAttempts();
            otpRepository.save(otpEntity);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Incorrect OTP. Please check and try again.");
        }

        // BOTH OTPS VERIFIED SUCCESSFULLY -> update phone number in PostgreSQL
        String oldPhone = user.getPhone();
        user.setPhone(newPhone.trim());
        userRepository.save(user);

        // Mark OTPs as used
        otpEntity.setUsed(true);
        otpRepository.save(otpEntity);

        stage.setUsed(true);
        otpRepository.save(stage);

        AuditLog audit = new AuditLog(user.getEmail(), "SUPER_ADMIN", "SUPER_ADMIN_PHONE_UPDATE", "User", String.valueOf(user.getId()), "Recovery phone updated from " + maskPhoneNumber(oldPhone) + " to " + maskPhoneNumber(newPhone.trim()) + " after dual OTP verification");
        auditLogRepository.save(audit);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Recovery phone updated successfully to " + maskPhoneNumber(newPhone.trim()) + ".");
        return response;
    }
}

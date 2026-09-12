package com.donationapp.dto.req;

import jakarta.validation.constraints.NotBlank;

public class ChangePhoneRequest {
    private String currentPassword;
    private String newPhone;
    private String otp;

    public String getCurrentPassword() { return currentPassword; }
    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }

    public String getNewPhone() { return newPhone; }
    public void setNewPhone(String newPhone) { this.newPhone = newPhone; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}

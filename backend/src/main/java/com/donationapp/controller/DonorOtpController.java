package com.donationapp.controller;

import com.donationapp.dto.resp.DonationResponse;
import com.donationapp.service.DonorOtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/donor")
public class DonorOtpController {

    private final DonorOtpService donorOtpService;

    public DonorOtpController(DonorOtpService donorOtpService) {
        this.donorOtpService = donorOtpService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtp(@RequestParam String phone) {
        return ResponseEntity.ok(donorOtpService.sendOtp(phone));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<List<DonationResponse>> verifyOtpAndGetHistory(
            @RequestParam String phone,
            @RequestParam String otp) {
        return ResponseEntity.ok(donorOtpService.verifyOtpAndGetHistory(phone, otp));
    }
}

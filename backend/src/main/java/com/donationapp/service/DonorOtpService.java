package com.donationapp.service;

import com.donationapp.dto.resp.DonationResponse;
import com.donationapp.entity.Donation;
import com.donationapp.entity.Receipt;
import com.donationapp.repository.DonationRepository;
import com.donationapp.repository.ReceiptRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class DonorOtpService {

    private final DonationRepository donationRepository;
    private final ReceiptRepository receiptRepository;
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();

    public DonorOtpService(DonationRepository donationRepository, ReceiptRepository receiptRepository) {
        this.donationRepository = donationRepository;
        this.receiptRepository = receiptRepository;
    }

    public Map<String, Object> sendOtp(String phone) {
        String cleanPhone = phone.replaceAll("[^0-9]", "");
        String generatedOtp = "1234"; // Fixed OTP for test mode / SMS gateway abstraction
        otpCache.put(cleanPhone, generatedOtp);

        System.out.println("📱 [DONOR OTP SERVICE] Generated OTP for " + cleanPhone + ": " + generatedOtp);

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("phone", phone);
        resp.put("message", "OTP sent to " + phone + ". (Demo OTP: 1234)");
        return resp;
    }

    public List<DonationResponse> verifyOtpAndGetHistory(String phone, String otp) {
        String cleanPhone = phone.replaceAll("[^0-9]", "");
        String cachedOtp = otpCache.get(cleanPhone);

        if (cachedOtp == null || !cachedOtp.equals(otp)) {
            // Default 1234 fallback for dev test ease
            if (!"1234".equals(otp)) {
                throw new RuntimeException("Invalid or expired OTP. Please try again.");
            }
        }

        List<Donation> donations = donationRepository.findByDonorPhoneContainingOrDonorNameContainingOrTransactionIdContaining(cleanPhone, cleanPhone, cleanPhone);

        return donations.stream().map(d -> {
            Receipt r = receiptRepository.findByDonationId(d.getId()).orElse(null);
            DonationResponse resp = new DonationResponse();
            resp.setId(d.getId());
            resp.setFestivalId(d.getFestival().getId());
            resp.setFestivalName(d.getFestival().getName());
            resp.setDonorName(d.isAnonymous() ? "Anonymous Donor" : d.getDonorName());
            resp.setDonorPhone(d.getDonorPhone());
            resp.setDonorAddress(d.getDonorAddress());
            resp.setAmount(d.getAmount());
            resp.setPaymentType(d.getPaymentType());
            resp.setPaymentStatus(d.getPaymentStatus());
            resp.setTransactionId(d.getTransactionId());
            if (r != null) {
                resp.setReceiptNumber(r.getReceiptNumber());
                resp.setQrCodeHash(r.getQrCodeHash());
            }
            resp.setAnonymous(d.isAnonymous());
            resp.setCreatedAt(d.getCreatedAt());
            return resp;
        }).collect(Collectors.toList());
    }
}

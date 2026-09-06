package com.donationapp.dto.resp;

import java.math.BigDecimal;

public class RazorpayQrResponse {

    private String qrId;
    private String imageUrl;
    private String paymentUrl;
    private BigDecimal amount;
    private Long expiresAt;
    private String status;
    private boolean enabled = true;
    private boolean isTestMode = false;
    private String message;

    public RazorpayQrResponse() {}

    public RazorpayQrResponse(String qrId, String imageUrl, String paymentUrl, BigDecimal amount, Long expiresAt, String status, boolean isTestMode) {
        this.qrId = qrId;
        this.imageUrl = imageUrl;
        this.paymentUrl = paymentUrl;
        this.amount = amount;
        this.expiresAt = expiresAt;
        this.status = status;
        this.enabled = true;
        this.isTestMode = isTestMode;
    }

    public static RazorpayQrResponse unavailable(String message, boolean isTestMode) {
        RazorpayQrResponse res = new RazorpayQrResponse();
        res.setEnabled(false);
        res.setMessage(message);
        res.setTestMode(isTestMode);
        return res;
    }

    public String getQrId() { return qrId; }
    public void setQrId(String qrId) { this.qrId = qrId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getPaymentUrl() { return paymentUrl; }
    public void setPaymentUrl(String paymentUrl) { this.paymentUrl = paymentUrl; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Long getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Long expiresAt) { this.expiresAt = expiresAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public boolean isTestMode() { return isTestMode; }
    public void setTestMode(boolean testMode) { isTestMode = testMode; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

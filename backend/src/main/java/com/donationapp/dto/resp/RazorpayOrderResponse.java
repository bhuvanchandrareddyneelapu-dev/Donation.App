package com.donationapp.dto.resp;

public class RazorpayOrderResponse {

    private String orderId;
    private Long amount;
    private String currency;
    private String receipt;
    private String status;
    private String keyId;

    public RazorpayOrderResponse() {}

    public RazorpayOrderResponse(String orderId, Long amount, String currency, String receipt, String status, String keyId) {
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.receipt = receipt;
        this.status = status;
        this.keyId = keyId;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public Long getAmount() { return amount; }
    public void setAmount(Long amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getReceipt() { return receipt; }
    public void setReceipt(String receipt) { this.receipt = receipt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getKeyId() { return keyId; }
    public void setKeyId(String keyId) { this.keyId = keyId; }
}

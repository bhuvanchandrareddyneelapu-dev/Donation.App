package com.donationapp.dto.req;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class RazorpayOrderRequest {

    @NotNull(message = "Festival ID is required")
    private Long festivalId;

    @NotNull(message = "Donation amount is required")
    @DecimalMin(value = "1000.0", message = "Minimum contribution is ₹1,000.")
    private BigDecimal amount;

    private String currency = "INR";
    private String donorName;
    private String donorPhone;

    public Long getFestivalId() { return festivalId; }
    public void setFestivalId(Long festivalId) { this.festivalId = festivalId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }
}

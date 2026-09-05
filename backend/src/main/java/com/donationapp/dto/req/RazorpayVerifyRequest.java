package com.donationapp.dto.req;

import com.donationapp.entity.Festival;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class RazorpayVerifyRequest {

    @NotBlank(message = "razorpay_order_id is required")
    private String razorpay_order_id;

    @NotBlank(message = "razorpay_payment_id is required")
    private String razorpay_payment_id;

    @NotBlank(message = "razorpay_signature is required")
    private String razorpay_signature;

    @NotNull(message = "Festival ID is required")
    private Long festivalId;

    private Long donorId;

    @NotBlank(message = "Donor name is required")
    private String donorName;

    @NotBlank(message = "Donor phone is required")
    private String donorPhone;

    private String donorAddress;
    private String donorEmail;

    @NotNull(message = "Donation amount is required")
    @DecimalMin(value = "1.0", message = "Minimum donation amount is ₹1")
    private BigDecimal amount;

    private Festival.FestivalType purpose;

    private boolean isAnonymous = false;
    private String remarks;

    public String getRazorpay_order_id() { return razorpay_order_id; }
    public void setRazorpay_order_id(String razorpay_order_id) { this.razorpay_order_id = razorpay_order_id; }

    public String getRazorpay_payment_id() { return razorpay_payment_id; }
    public void setRazorpay_payment_id(String razorpay_payment_id) { this.razorpay_payment_id = razorpay_payment_id; }

    public String getRazorpay_signature() { return razorpay_signature; }
    public void setRazorpay_signature(String razorpay_signature) { this.razorpay_signature = razorpay_signature; }

    public Long getFestivalId() { return festivalId; }
    public void setFestivalId(Long festivalId) { this.festivalId = festivalId; }

    public Long getDonorId() { return donorId; }
    public void setDonorId(Long donorId) { this.donorId = donorId; }

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }

    public String getDonorAddress() { return donorAddress; }
    public void setDonorAddress(String donorAddress) { this.donorAddress = donorAddress; }

    public String getDonorEmail() { return donorEmail; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Festival.FestivalType getPurpose() { return purpose; }
    public void setPurpose(Festival.FestivalType purpose) { this.purpose = purpose; }

    public boolean isAnonymous() { return isAnonymous; }
    public void setAnonymous(boolean anonymous) { isAnonymous = anonymous; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}

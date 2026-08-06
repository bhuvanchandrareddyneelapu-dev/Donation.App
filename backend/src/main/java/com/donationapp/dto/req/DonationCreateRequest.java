package com.donationapp.dto.req;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Festival;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class DonationCreateRequest {
    @NotNull
    private Long festivalId;

    private Long donorId;

    @NotBlank
    private String donorName;

    @NotBlank
    private String donorPhone;

    private String donorAddress;

    @NotNull
    @DecimalMin(value = "1.0", message = "Minimum donation amount is ₹1")
    private BigDecimal amount;

    private Festival.FestivalType purpose = Festival.FestivalType.GANESH_CHATURTHI;

    @NotNull
    private Donation.PaymentType paymentType = Donation.PaymentType.ONLINE;

    private boolean isAnonymous = false;
    private String remarks;

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

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Festival.FestivalType getPurpose() { return purpose; }
    public void setPurpose(Festival.FestivalType purpose) { this.purpose = purpose; }

    public Donation.PaymentType getPaymentType() { return paymentType; }
    public void setPaymentType(Donation.PaymentType paymentType) { this.paymentType = paymentType; }

    public boolean isAnonymous() { return isAnonymous; }
    public void setAnonymous(boolean anonymous) { isAnonymous = anonymous; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}

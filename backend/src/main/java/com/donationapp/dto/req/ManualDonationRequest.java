package com.donationapp.dto.req;

import com.donationapp.entity.Donation;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ManualDonationRequest {

    @NotNull(message = "Festival ID is required")
    private Long festivalId = 1L;

    @NotBlank(message = "Donor name is required")
    private String donorName;

    private String donorPhone;
    private String donorEmail;
    private String donorAddress;
    private String gotram;
    private String familyDetails;

    @NotNull(message = "Donation amount is required")
    @DecimalMin(value = "1.00", message = "Amount must be at least ₹1")
    private BigDecimal amount;

    private Donation.PaymentType paymentType = Donation.PaymentType.CASH;
    private String remarks;
    private boolean publicVisibility = true;
    private boolean isAnonymous = false;

    public ManualDonationRequest() {}

    public Long getFestivalId() { return festivalId; }
    public void setFestivalId(Long festivalId) { this.festivalId = festivalId; }

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }
    public void setPhone(String phone) { if (this.donorPhone == null || this.donorPhone.isEmpty()) this.donorPhone = phone; }

    public String getDonorEmail() { return donorEmail; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }
    public void setEmail(String email) { if (this.donorEmail == null || this.donorEmail.isEmpty()) this.donorEmail = email; }

    public String getDonorAddress() { return donorAddress; }
    public void setDonorAddress(String donorAddress) { this.donorAddress = donorAddress; }
    public void setAddress(String address) { if (this.donorAddress == null || this.donorAddress.isEmpty()) this.donorAddress = address; }

    public String getGotram() { return gotram; }
    public void setGotram(String gotram) { this.gotram = gotram; }

    public String getFamilyDetails() { return familyDetails; }
    public void setFamilyDetails(String familyDetails) { this.familyDetails = familyDetails; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Donation.PaymentType getPaymentType() { return paymentType; }
    public void setPaymentType(Donation.PaymentType paymentType) { this.paymentType = paymentType; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public void setNotes(String notes) { if (this.remarks == null || this.remarks.isEmpty()) this.remarks = notes; }

    public boolean isPublicVisibility() { return publicVisibility; }
    public void setPublicVisibility(boolean publicVisibility) { this.publicVisibility = publicVisibility; }

    public boolean isAnonymous() { return isAnonymous; }
    public void setAnonymous(boolean anonymous) { this.isAnonymous = anonymous; }
    public void setIsAnonymous(boolean isAnonymous) { this.isAnonymous = isAnonymous; }
}

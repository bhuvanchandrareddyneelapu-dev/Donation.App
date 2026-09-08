package com.donationapp.dto.req;

import com.donationapp.entity.Donation;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class DonationUpdateRequest {

    private String donorName;
    private String donorPhone;
    private String donorEmail;
    private String donorAddress;
    private String gotram;
    private String familyDetails;

    @DecimalMin(value = "1.00", message = "Amount must be at least ₹1")
    private BigDecimal amount;

    private Donation.PaymentType paymentType;
    private String remarks;
    private Boolean publicVisibility;
    private Boolean isAnonymous;

    @NotBlank(message = "Reason for modification is required")
    private String editReason;

    public DonationUpdateRequest() {}

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }

    public String getDonorEmail() { return donorEmail; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }

    public String getDonorAddress() { return donorAddress; }
    public void setDonorAddress(String donorAddress) { this.donorAddress = donorAddress; }

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

    public Boolean getPublicVisibility() { return publicVisibility; }
    public void setPublicVisibility(Boolean publicVisibility) { this.publicVisibility = publicVisibility; }

    public Boolean getIsAnonymous() { return isAnonymous; }
    public void setIsAnonymous(Boolean anonymous) { isAnonymous = anonymous; }

    public String getEditReason() { return editReason; }
    public void setEditReason(String editReason) { this.editReason = editReason; }
}

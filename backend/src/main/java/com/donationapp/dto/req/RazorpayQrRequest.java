package com.donationapp.dto.req;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class RazorpayQrRequest {

    @NotNull(message = "Festival ID is required")
    private Long festivalId;

    @NotNull(message = "Donation amount is required")
    private BigDecimal amount;

    private String donorName;
    private String donorPhone;
    private String donorEmail;
    private String gotram;
    private String familyDetails;
    private Boolean publicVisibility;
    private Boolean isAnonymous;
    private String remarks;

    public Long getFestivalId() { return festivalId; }
    public void setFestivalId(Long festivalId) { this.festivalId = festivalId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }

    public String getDonorEmail() { return donorEmail; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }

    public String getGotram() { return gotram; }
    public void setGotram(String gotram) { this.gotram = gotram; }

    public String getFamilyDetails() { return familyDetails; }
    public void setFamilyDetails(String familyDetails) { this.familyDetails = familyDetails; }

    public Boolean getPublicVisibility() { return publicVisibility; }
    public void setPublicVisibility(Boolean publicVisibility) { this.publicVisibility = publicVisibility; }

    public Boolean getIsAnonymous() { return isAnonymous; }
    public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}

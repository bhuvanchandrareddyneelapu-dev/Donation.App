package com.donationapp.dto.req;

import com.donationapp.entity.Donation;

public class CashVerifyRequest {
    private Long donationId;
    private Long treasurerId;
    private Donation.PaymentStatus status; // VERIFIED, DEPOSITED, COMPLETED
    private String depositReference;
    private String remarks;

    public Long getDonationId() { return donationId; }
    public void setDonationId(Long donationId) { this.donationId = donationId; }

    public Long getTreasurerId() { return treasurerId; }
    public void setTreasurerId(Long treasurerId) { this.treasurerId = treasurerId; }

    public Donation.PaymentStatus getStatus() { return status; }
    public void setStatus(Donation.PaymentStatus status) { this.status = status; }

    public String getDepositReference() { return depositReference; }
    public void setDepositReference(String depositReference) { this.depositReference = depositReference; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}

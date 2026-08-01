package com.donationapp.dto.resp;

import com.donationapp.entity.Donation;
import com.donationapp.entity.Festival;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DonationResponse {
    private Long id;
    private Long festivalId;
    private String festivalName;
    private String donorName;
    private String donorPhone;
    private String donorAddress;
    private BigDecimal amount;
    private Festival.PurposeCategory purpose;
    private Donation.PaymentType paymentType;
    private Donation.PaymentStatus paymentStatus;
    private String transactionId;
    private String receiptNumber;
    private String qrCodeHash;
    private boolean isAnonymous;
    private String volunteerName;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFestivalId() { return festivalId; }
    public void setFestivalId(Long festivalId) { this.festivalId = festivalId; }

    public String getFestivalName() { return festivalName; }
    public void setFestivalName(String festivalName) { this.festivalName = festivalName; }

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }

    public String getDonorAddress() { return donorAddress; }
    public void setDonorAddress(String donorAddress) { this.donorAddress = donorAddress; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Festival.PurposeCategory getPurpose() { return purpose; }
    public void setPurpose(Festival.PurposeCategory purpose) { this.purpose = purpose; }

    public Donation.PaymentType getPaymentType() { return paymentType; }
    public void setPaymentType(Donation.PaymentType paymentType) { this.paymentType = paymentType; }

    public Donation.PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(Donation.PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }

    public String getQrCodeHash() { return qrCodeHash; }
    public void setQrCodeHash(String qrCodeHash) { this.qrCodeHash = qrCodeHash; }

    public boolean isAnonymous() { return isAnonymous; }
    public void setAnonymous(boolean anonymous) { isAnonymous = anonymous; }

    public String getVolunteerName() { return volunteerName; }
    public void setVolunteerName(String volunteerName) { this.volunteerName = volunteerName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

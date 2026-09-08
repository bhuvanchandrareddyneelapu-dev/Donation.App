package com.donationapp.dto.resp;

import java.math.BigDecimal;

public class CollectionSummaryResponse {
    private Long festivalId;
    private BigDecimal collectedAmount;
    private BigDecimal targetAmount;
    private BigDecimal remainingAmount;
    private Double percentage;
    private Long totalDonationsCount;

    public CollectionSummaryResponse() {}

    public CollectionSummaryResponse(Long festivalId, BigDecimal collectedAmount, BigDecimal targetAmount, BigDecimal remainingAmount, Double percentage, Long totalDonationsCount) {
        this.festivalId = festivalId;
        this.collectedAmount = collectedAmount;
        this.targetAmount = targetAmount;
        this.remainingAmount = remainingAmount;
        this.percentage = percentage;
        this.totalDonationsCount = totalDonationsCount;
    }

    public Long getFestivalId() { return festivalId; }
    public void setFestivalId(Long festivalId) { this.festivalId = festivalId; }

    public BigDecimal getCollectedAmount() { return collectedAmount; }
    public void setCollectedAmount(BigDecimal collectedAmount) { this.collectedAmount = collectedAmount; }

    public BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }

    public BigDecimal getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }

    public Long getTotalDonationsCount() { return totalDonationsCount; }
    public void setTotalDonationsCount(Long totalDonationsCount) { this.totalDonationsCount = totalDonationsCount; }
}

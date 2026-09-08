package com.donationapp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_audit_log")
public class DonationAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "donation_id", nullable = false)
    private Long donationId;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(name = "old_amount", precision = 12, scale = 2)
    private BigDecimal oldAmount;

    @Column(name = "new_amount", precision = 12, scale = 2)
    private BigDecimal newAmount;

    @Column(length = 500)
    private String reason;

    @Column(name = "performed_by", nullable = false)
    private String performedBy;

    @Column(name = "performed_at", nullable = false)
    private LocalDateTime performedAt;

    public DonationAuditLog() {
        this.performedAt = LocalDateTime.now();
    }

    public DonationAuditLog(Long donationId, String action, BigDecimal oldAmount, BigDecimal newAmount, String reason, String performedBy) {
        this.donationId = donationId;
        this.action = action;
        this.oldAmount = oldAmount;
        this.newAmount = newAmount;
        this.reason = reason;
        this.performedBy = performedBy;
        this.performedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDonationId() { return donationId; }
    public void setDonationId(Long donationId) { this.donationId = donationId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public BigDecimal getOldAmount() { return oldAmount; }
    public void setOldAmount(BigDecimal oldAmount) { this.oldAmount = oldAmount; }

    public BigDecimal getNewAmount() { return newAmount; }
    public void setNewAmount(BigDecimal newAmount) { this.newAmount = newAmount; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public LocalDateTime getPerformedAt() { return performedAt; }
    public void setPerformedAt(LocalDateTime performedAt) { this.performedAt = performedAt; }
}

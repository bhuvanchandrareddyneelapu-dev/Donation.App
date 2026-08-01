package com.donationapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cash_donation_logs")
public class CashDonationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_id", nullable = false)
    private User volunteer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by_treasurer_id")
    private User verifiedByTreasurer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Donation.PaymentStatus status;

    private String depositReference;
    private LocalDateTime verificationDate;
    private String remarks;
    private boolean offlineSynced = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public CashDonationLog() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Donation getDonation() { return donation; }
    public void setDonation(Donation donation) { this.donation = donation; }

    public User getVolunteer() { return volunteer; }
    public void setVolunteer(User volunteer) { this.volunteer = volunteer; }

    public User getVerifiedByTreasurer() { return verifiedByTreasurer; }
    public void setVerifiedByTreasurer(User verifiedByTreasurer) { this.verifiedByTreasurer = verifiedByTreasurer; }

    public Donation.PaymentStatus getStatus() { return status; }
    public void setStatus(Donation.PaymentStatus status) { this.status = status; }

    public String getDepositReference() { return depositReference; }
    public void setDepositReference(String depositReference) { this.depositReference = depositReference; }

    public LocalDateTime getVerificationDate() { return verificationDate; }
    public void setVerificationDate(LocalDateTime verificationDate) { this.verificationDate = verificationDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public boolean isOfflineSynced() { return offlineSynced; }
    public void setOfflineSynced(boolean offlineSynced) { this.offlineSynced = offlineSynced; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

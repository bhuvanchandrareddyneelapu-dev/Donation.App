package com.donationapp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "festivals")
public class Festival {

    public enum FestivalType {
        GANESH_CHATURTHI,
        DASARA
    }

    public String getReceiptPrefix() {
        if (festivalType == FestivalType.DASARA) {
            return "DAS";
        } else if (festivalType == FestivalType.GANESH_CHATURTHI) {
            return "GAN";
        }
        return "DON";
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FestivalType festivalType;

    private String bannerUrl;
    private String idolImageUrl;

    @Column(length = 2000)
    private String description;

    private String venue;
    private String organizer;

    @Column(nullable = false)
    private BigDecimal targetAmount;

    @Column(nullable = false)
    private BigDecimal currentCollection = BigDecimal.ZERO;

    private LocalDate installationDate;
    private LocalDate immersionDate;

    private String qrCodeUrl;
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Festival() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public FestivalType getFestivalType() { return festivalType; }
    public void setFestivalType(FestivalType festivalType) { this.festivalType = festivalType; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public String getIdolImageUrl() { return idolImageUrl; }
    public void setIdolImageUrl(String idolImageUrl) { this.idolImageUrl = idolImageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }

    public BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }

    public BigDecimal getCurrentCollection() { return currentCollection; }
    public void setCurrentCollection(BigDecimal currentCollection) { this.currentCollection = currentCollection; }

    public LocalDate getInstallationDate() { return installationDate; }
    public void setInstallationDate(LocalDate installationDate) { this.installationDate = installationDate; }

    public LocalDate getImmersionDate() { return immersionDate; }
    public void setImmersionDate(LocalDate immersionDate) { this.immersionDate = immersionDate; }

    public String getQrCodeUrl() { return qrCodeUrl; }
    public void setQrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

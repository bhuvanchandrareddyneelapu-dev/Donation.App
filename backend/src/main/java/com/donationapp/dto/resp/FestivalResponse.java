package com.donationapp.dto.resp;

import com.donationapp.entity.Festival;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class FestivalResponse {
    private Long id;
    private Long organizationId;
    private String name;
    private Festival.FestivalType festivalType;
    private String bannerUrl;
    private String idolImageUrl;
    private String description;
    private String venue;
    private String organizer;
    private BigDecimal targetAmount;
    private BigDecimal currentCollection;
    private LocalDate installationDate;
    private LocalDate immersionDate;
    private String qrCodeUrl;
    private String configJson;
    private boolean active;
    private LocalDateTime createdAt;

    public FestivalResponse() {}

    public FestivalResponse(Festival festival) {
        if (festival != null) {
            this.id = festival.getId();
            if (festival.getOrganization() != null) {
                this.organizationId = festival.getOrganization().getId();
            }
            this.name = festival.getName();
            this.festivalType = festival.getFestivalType();
            this.bannerUrl = festival.getBannerUrl();
            this.idolImageUrl = festival.getIdolImageUrl();
            this.description = festival.getDescription();
            this.venue = festival.getVenue();
            this.organizer = festival.getOrganizer();
            this.targetAmount = festival.getTargetAmount();
            this.currentCollection = festival.getCurrentCollection();
            this.installationDate = festival.getInstallationDate();
            this.immersionDate = festival.getImmersionDate();
            this.qrCodeUrl = festival.getQrCodeUrl();
            this.configJson = festival.getConfigJson();
            this.active = festival.isActive();
            this.createdAt = festival.getCreatedAt();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Festival.FestivalType getFestivalType() { return festivalType; }
    public void setFestivalType(Festival.FestivalType festivalType) { this.festivalType = festivalType; }

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

    public String getConfigJson() { return configJson; }
    public void setConfigJson(String configJson) { this.configJson = configJson; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

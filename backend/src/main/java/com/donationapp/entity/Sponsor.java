package com.donationapp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "sponsors")
public class Sponsor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "festival_id", nullable = false)
    private Festival festival;

    @Column(nullable = false)
    private String name;

    private String logoUrl;
    private String tier; // PLATINUM, GOLD, SILVER, ASSOCIATE
    private BigDecimal contributionAmount;

    public Sponsor() {}

    public Sponsor(Festival festival, String name, String logoUrl, String tier, BigDecimal contributionAmount) {
        this.festival = festival;
        this.name = name;
        this.logoUrl = logoUrl;
        this.tier = tier;
        this.contributionAmount = contributionAmount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Festival getFestival() { return festival; }
    public void setFestival(Festival festival) { this.festival = festival; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public BigDecimal getContributionAmount() { return contributionAmount; }
    public void setContributionAmount(BigDecimal contributionAmount) { this.contributionAmount = contributionAmount; }
}

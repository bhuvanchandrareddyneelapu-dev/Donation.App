package com.donationapp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "volunteers")
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "festival_id", nullable = false)
    private Festival festival;

    private String assignedArea;

    @Column(nullable = false, unique = true)
    private String qrBadgeCode;

    private BigDecimal dailyTarget;

    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Volunteer() {
        this.createdAt = LocalDateTime.now();
    }

    public Volunteer(User user, Festival festival, String assignedArea, String qrBadgeCode) {
        this.user = user;
        this.festival = festival;
        this.assignedArea = assignedArea;
        this.qrBadgeCode = qrBadgeCode;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Festival getFestival() { return festival; }
    public void setFestival(Festival festival) { this.festival = festival; }

    public String getAssignedArea() { return assignedArea; }
    public void setAssignedArea(String assignedArea) { this.assignedArea = assignedArea; }

    public String getQrBadgeCode() { return qrBadgeCode; }
    public void setQrBadgeCode(String qrBadgeCode) { this.qrBadgeCode = qrBadgeCode; }

    public BigDecimal getDailyTarget() { return dailyTarget; }
    public void setDailyTarget(BigDecimal dailyTarget) { this.dailyTarget = dailyTarget; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

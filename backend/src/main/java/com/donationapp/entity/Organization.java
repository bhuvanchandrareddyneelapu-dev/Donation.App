package com.donationapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String orgType; // FESTIVAL_COMMITTEE, TEMPLE_TRUST, NGO, ORPHANAGE, EDUCATIONAL_TRUST, COMMUNITY_ORG

    private String registrationNo;

    private String logoUrl;

    private String contactEmail;

    private String phone;

    private String address;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Organization() {
        this.createdAt = LocalDateTime.now();
    }

    public Organization(String name, String orgType, String registrationNo, String contactEmail, String phone, String address) {
        this.name = name;
        this.orgType = orgType;
        this.registrationNo = registrationNo;
        this.contactEmail = contactEmail;
        this.phone = phone;
        this.address = address;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getOrgType() { return orgType; }
    public void setOrgType(String orgType) { this.orgType = orgType; }

    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

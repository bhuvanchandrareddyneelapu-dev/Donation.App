package com.donationapp.repository;

import com.donationapp.entity.DonationAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationAuditLogRepository extends JpaRepository<DonationAuditLog, Long> {
    List<DonationAuditLog> findByDonationIdOrderByIdDesc(Long donationId);
    List<DonationAuditLog> findAllByOrderByIdDesc();
}

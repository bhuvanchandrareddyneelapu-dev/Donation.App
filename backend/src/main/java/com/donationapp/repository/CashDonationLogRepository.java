package com.donationapp.repository;

import com.donationapp.entity.CashDonationLog;
import com.donationapp.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CashDonationLogRepository extends JpaRepository<CashDonationLog, Long> {
    Optional<CashDonationLog> findByDonationId(Long donationId);
    List<CashDonationLog> findByVolunteerId(Long volunteerId);
    List<CashDonationLog> findByStatus(Donation.PaymentStatus status);
}

package com.donationapp.repository;

import com.donationapp.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByFestivalId(Long festivalId);
    List<Donation> findByDonorId(Long donorId);
    List<Donation> findByPaymentStatus(Donation.PaymentStatus status);
    List<Donation> findByPaymentType(Donation.PaymentType paymentType);
    
    @Query("SELECT SUM(d.amount) FROM Donation d WHERE d.festival.id = :festivalId AND d.paymentStatus = 'COMPLETED'")
    BigDecimal sumTotalCollectionByFestivalId(@Param("festivalId") Long festivalId);

    @Query("SELECT SUM(d.amount) FROM Donation d WHERE d.paymentStatus = 'COMPLETED'")
    BigDecimal sumTotalCollectionAll();

    @Query("SELECT COUNT(DISTINCT d.donorPhone) FROM Donation d WHERE d.paymentStatus = 'COMPLETED'")
    Long countTotalUniqueDonors();

    List<Donation> findByDonorPhoneContainingOrDonorNameContainingOrTransactionIdContaining(String phone, String name, String txId);
}

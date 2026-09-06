package com.donationapp.repository;

import com.donationapp.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByFestivalId(Long festivalId);
    List<Donation> findByDonorId(Long donorId);
    List<Donation> findByPaymentStatus(Donation.PaymentStatus status);
    List<Donation> findByPaymentType(Donation.PaymentType paymentType);
    Optional<Donation> findByRazorpayOrderId(String razorpayOrderId);
    Optional<Donation> findByRazorpayPaymentId(String razorpayPaymentId);
    Optional<Donation> findByTransactionId(String transactionId);
    
    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.festival.id = :festivalId AND d.paymentStatus = 'COMPLETED' AND (d.isReversed IS NULL OR d.isReversed = false)")
    BigDecimal sumTotalCollectionByFestivalId(@Param("festivalId") Long festivalId);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.festival.id = :festivalId AND d.paymentStatus = 'COMPLETED' AND d.paymentType = 'ONLINE' AND (d.isReversed IS NULL OR d.isReversed = false)")
    BigDecimal calculateTotalOnlineCollection(@Param("festivalId") Long festivalId);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.festival.id = :festivalId AND d.paymentStatus = 'COMPLETED' AND d.paymentType = 'CASH' AND (d.isReversed IS NULL OR d.isReversed = false)")
    BigDecimal calculateTotalCashCollection(@Param("festivalId") Long festivalId);

    @Query("SELECT COUNT(d) FROM Donation d WHERE d.festival.id = :festivalId AND d.paymentStatus = 'COMPLETED' AND (d.isReversed IS NULL OR d.isReversed = false)")
    Long countValidDonationsByFestivalId(@Param("festivalId") Long festivalId);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.paymentStatus = 'COMPLETED' AND (d.isReversed IS NULL OR d.isReversed = false)")
    BigDecimal sumTotalCollectionAll();

    @Query("SELECT COUNT(DISTINCT d.donorPhone) FROM Donation d WHERE d.paymentStatus = 'COMPLETED' AND (d.isReversed IS NULL OR d.isReversed = false)")
    Long countTotalUniqueDonors();

    List<Donation> findByFestivalIdAndIsReversedFalseOrderByIdDesc(Long festivalId);

    List<Donation> findByFestivalIdAndPublicVisibilityTrueAndIsReversedFalseOrderByIdDesc(Long festivalId);

    List<Donation> findByDonorPhoneContainingOrDonorNameContainingOrTransactionIdContaining(String phone, String name, String txId);
}

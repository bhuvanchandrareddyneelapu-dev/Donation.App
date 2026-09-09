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
    
    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.festival.id = :festivalId AND (d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.COMPLETED OR d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.VERIFIED) AND (d.isReversed IS NULL OR d.isReversed = false) AND (d.isTest IS NULL OR d.isTest = false)")
    BigDecimal sumTotalCollectionByFestivalId(@Param("festivalId") Long festivalId);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.festival.id = :festivalId AND (d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.COMPLETED OR d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.VERIFIED) AND d.paymentType = com.donationapp.entity.Donation.PaymentType.ONLINE AND (d.isReversed IS NULL OR d.isReversed = false) AND (d.isTest IS NULL OR d.isTest = false)")
    BigDecimal calculateTotalOnlineCollection(@Param("festivalId") Long festivalId);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.festival.id = :festivalId AND (d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.COMPLETED OR d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.VERIFIED) AND d.paymentType = com.donationapp.entity.Donation.PaymentType.CASH AND (d.isReversed IS NULL OR d.isReversed = false) AND (d.isTest IS NULL OR d.isTest = false)")
    BigDecimal calculateTotalCashCollection(@Param("festivalId") Long festivalId);

    @Query("SELECT COUNT(d) FROM Donation d WHERE d.festival.id = :festivalId AND (d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.COMPLETED OR d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.VERIFIED) AND (d.isReversed IS NULL OR d.isReversed = false) AND (d.isTest IS NULL OR d.isTest = false)")
    Long countValidDonationsByFestivalId(@Param("festivalId") Long festivalId);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.festival.id = :festivalId AND (d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.COMPLETED OR d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.VERIFIED) AND (d.isReversed IS NULL OR d.isReversed = false) AND d.isTest = true")
    BigDecimal sumTestCollectionByFestivalId(@Param("festivalId") Long festivalId);

    @Query("SELECT COUNT(d) FROM Donation d WHERE d.festival.id = :festivalId AND (d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.COMPLETED OR d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.VERIFIED) AND (d.isReversed IS NULL OR d.isReversed = false) AND d.isTest = true")
    Long countTestDonationsByFestivalId(@Param("festivalId") Long festivalId);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE (d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.COMPLETED OR d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.VERIFIED) AND (d.isReversed IS NULL OR d.isReversed = false) AND (d.isTest IS NULL OR d.isTest = false)")
    BigDecimal sumTotalCollectionAll();

    @Query("SELECT COUNT(DISTINCT d.donorPhone) FROM Donation d WHERE (d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.COMPLETED OR d.paymentStatus = com.donationapp.entity.Donation.PaymentStatus.VERIFIED) AND (d.isReversed IS NULL OR d.isReversed = false) AND (d.isTest IS NULL OR d.isTest = false)")
    Long countTotalUniqueDonors();

    List<Donation> findByFestivalIdAndIsReversedFalseOrderByIdDesc(Long festivalId);

    List<Donation> findByFestivalIdAndPublicVisibilityTrueAndIsReversedFalseAndIsTestFalseOrderByIdDesc(Long festivalId);

    List<Donation> findByFestivalIdAndIsTestTrueOrderByIdDesc(Long festivalId);

    List<Donation> findByDonorPhoneContainingOrDonorNameContainingOrTransactionIdContaining(String phone, String name, String txId);
}

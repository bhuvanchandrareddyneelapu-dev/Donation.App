package com.donationapp.repository;

import com.donationapp.entity.SuperAdminOtp;
import com.donationapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SuperAdminOtpRepository extends JpaRepository<SuperAdminOtp, Long> {

    Optional<SuperAdminOtp> findTopByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(Long userId, String purpose);

    @Modifying
    @Query("UPDATE SuperAdminOtp o SET o.used = true WHERE o.user.id = :userId AND o.purpose = :purpose AND o.used = false")
    void invalidatePreviousOtps(@Param("userId") Long userId, @Param("purpose") String purpose);
}

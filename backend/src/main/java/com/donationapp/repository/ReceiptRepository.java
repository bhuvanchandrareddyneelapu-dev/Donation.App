package com.donationapp.repository;

import com.donationapp.entity.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    Optional<Receipt> findByReceiptNumber(String receiptNumber);
    Optional<Receipt> findByQrCodeHash(String qrCodeHash);
    Optional<Receipt> findByDonationId(Long donationId);
}

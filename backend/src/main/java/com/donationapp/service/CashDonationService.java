package com.donationapp.service;

import com.donationapp.dto.req.CashVerifyRequest;
import com.donationapp.entity.CashDonationLog;
import com.donationapp.entity.Donation;
import com.donationapp.entity.Festival;
import com.donationapp.entity.User;
import com.donationapp.repository.CashDonationLogRepository;
import com.donationapp.repository.DonationRepository;
import com.donationapp.repository.FestivalRepository;
import com.donationapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CashDonationService {

    private final CashDonationLogRepository cashDonationLogRepository;
    private final DonationRepository donationRepository;
    private final FestivalRepository festivalRepository;
    private final UserRepository userRepository;

    public CashDonationService(CashDonationLogRepository cashDonationLogRepository, DonationRepository donationRepository,
                              FestivalRepository festivalRepository, UserRepository userRepository) {
        this.cashDonationLogRepository = cashDonationLogRepository;
        this.donationRepository = donationRepository;
        this.festivalRepository = festivalRepository;
        this.userRepository = userRepository;
    }

    public List<CashDonationLog> getPendingCashDonations() {
        return cashDonationLogRepository.findByStatus(Donation.PaymentStatus.PENDING);
    }

    @Transactional
    public CashDonationLog verifyAndApproveCashDonation(CashVerifyRequest req) {
        CashDonationLog log = cashDonationLogRepository.findByDonationId(req.getDonationId())
                .orElseThrow(() -> new RuntimeException("Cash donation log not found for donation ID: " + req.getDonationId()));

        Donation donation = log.getDonation();
        User treasurer = userRepository.findById(req.getTreasurerId()).orElse(null);

        log.setVerifiedByTreasurer(treasurer);
        log.setStatus(req.getStatus());
        log.setDepositReference(req.getDepositReference());
        log.setVerificationDate(LocalDateTime.now());
        log.setRemarks(req.getRemarks());

        donation.setPaymentStatus(req.getStatus());
        donationRepository.save(donation);

        // If verified & completed, add to festival current collection
        if (req.getStatus() == Donation.PaymentStatus.VERIFIED || req.getStatus() == Donation.PaymentStatus.COMPLETED) {
            Festival festival = donation.getFestival();
            festival.setCurrentCollection(festival.getCurrentCollection().add(donation.getAmount()));
            festivalRepository.save(festival);
        }

        return cashDonationLogRepository.save(log);
    }
}

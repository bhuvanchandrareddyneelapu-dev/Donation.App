package com.donationapp.service;

import com.donationapp.dto.resp.CollectionSummaryResponse;
import com.donationapp.entity.Festival;
import com.donationapp.repository.DonationRepository;
import com.donationapp.repository.FestivalRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
public class FestivalService {

    private final FestivalRepository festivalRepository;
    private final DonationRepository donationRepository;

    public FestivalService(FestivalRepository festivalRepository, DonationRepository donationRepository) {
        this.festivalRepository = festivalRepository;
        this.donationRepository = donationRepository;
    }

    public List<Festival> getAllFestivals() {
        return festivalRepository.findByActiveTrue();
    }

    public List<Festival> getFestivalsByFestivalType(Festival.FestivalType festivalType) {
        return festivalRepository.findByFestivalType(festivalType);
    }

    public Optional<Festival> getFestivalById(Long id) {
        return festivalRepository.findById(id);
    }

    public CollectionSummaryResponse getCollectionSummary(Long festivalId) {
        BigDecimal collected = donationRepository.sumTotalCollectionByFestivalId(festivalId);
        if (collected == null) {
            collected = BigDecimal.ZERO;
        }

        // Dynamic Target Rule: target = collected * 1.25 (rounded to nearest whole rupee)
        BigDecimal target;
        if (collected.compareTo(BigDecimal.ZERO) == 0) {
            target = BigDecimal.ZERO;
        } else {
            target = collected.multiply(new BigDecimal("1.25")).setScale(0, RoundingMode.CEILING);
        }

        BigDecimal remaining = target.subtract(collected);
        if (remaining.compareTo(BigDecimal.ZERO) < 0) {
            remaining = BigDecimal.ZERO;
        }

        Double percentage = 0.0;
        if (target.compareTo(BigDecimal.ZERO) > 0) {
            percentage = collected.divide(target, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
            percentage = BigDecimal.valueOf(percentage).setScale(2, RoundingMode.HALF_UP).doubleValue();
        }

        Long count = donationRepository.countValidDonationsByFestivalId(festivalId);
        if (count == null) count = 0L;

        return new CollectionSummaryResponse(festivalId, collected, target, remaining, percentage, count);
    }

    public Festival createFestival(Festival festival) {
        festival.setQrCodeUrl("https://donation.app/qr/festival/" + System.currentTimeMillis());
        return festivalRepository.save(festival);
    }

    public Festival updateFestival(Long id, Festival updatedDetails) {
        return festivalRepository.findById(id).map(festival -> {
            if (updatedDetails.getName() != null) festival.setName(updatedDetails.getName());
            if (updatedDetails.getFestivalType() != null) festival.setFestivalType(updatedDetails.getFestivalType());
            if (updatedDetails.getBannerUrl() != null) festival.setBannerUrl(updatedDetails.getBannerUrl());
            if (updatedDetails.getIdolImageUrl() != null) festival.setIdolImageUrl(updatedDetails.getIdolImageUrl());
            if (updatedDetails.getDescription() != null) festival.setDescription(updatedDetails.getDescription());
            if (updatedDetails.getVenue() != null) festival.setVenue(updatedDetails.getVenue());
            if (updatedDetails.getOrganizer() != null) festival.setOrganizer(updatedDetails.getOrganizer());
            if (updatedDetails.getTargetAmount() != null) festival.setTargetAmount(updatedDetails.getTargetAmount());
            if (updatedDetails.getInstallationDate() != null) festival.setInstallationDate(updatedDetails.getInstallationDate());
            if (updatedDetails.getImmersionDate() != null) festival.setImmersionDate(updatedDetails.getImmersionDate());
            if (updatedDetails.getConfigJson() != null) festival.setConfigJson(updatedDetails.getConfigJson());
            return festivalRepository.save(festival);
        }).orElseThrow(() -> new RuntimeException("Festival not found with id: " + id));
    }
}


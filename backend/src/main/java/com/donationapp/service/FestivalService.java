package com.donationapp.service;

import com.donationapp.entity.Festival;
import com.donationapp.repository.FestivalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FestivalService {

    private final FestivalRepository festivalRepository;

    public FestivalService(FestivalRepository festivalRepository) {
        this.festivalRepository = festivalRepository;
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

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

    public List<Festival> getFestivalsByCategory(Festival.PurposeCategory category) {
        return festivalRepository.findByCategory(category);
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
            festival.setName(updatedDetails.getName());
            festival.setCategory(updatedDetails.getCategory());
            festival.setFestivalType(updatedDetails.getFestivalType());
            festival.setBannerUrl(updatedDetails.getBannerUrl());
            festival.setIdolImageUrl(updatedDetails.getIdolImageUrl());
            festival.setDescription(updatedDetails.getDescription());
            festival.setVenue(updatedDetails.getVenue());
            festival.setOrganizer(updatedDetails.getOrganizer());
            festival.setTargetAmount(updatedDetails.getTargetAmount());
            festival.setInstallationDate(updatedDetails.getInstallationDate());
            festival.setImmersionDate(updatedDetails.getImmersionDate());
            return festivalRepository.save(festival);
        }).orElseThrow(() -> new RuntimeException("Festival not found with id: " + id));
    }
}

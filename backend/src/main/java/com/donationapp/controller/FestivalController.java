package com.donationapp.controller;

import com.donationapp.dto.resp.CollectionSummaryResponse;
import com.donationapp.entity.Festival;
import com.donationapp.service.FestivalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/festivals")
public class FestivalController {

    private final FestivalService festivalService;

    public FestivalController(FestivalService festivalService) {
        this.festivalService = festivalService;
    }

    @GetMapping
    public ResponseEntity<List<Festival>> getAllFestivals() {
        return ResponseEntity.ok(festivalService.getAllFestivals());
    }

    @GetMapping({"/category/{festivalType}", "/type/{festivalType}"})
    public ResponseEntity<List<Festival>> getFestivalsByFestivalType(@PathVariable Festival.FestivalType festivalType) {
        return ResponseEntity.ok(festivalService.getFestivalsByFestivalType(festivalType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Festival> getFestivalById(@PathVariable Long id) {
        return festivalService.getFestivalById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/collection-summary")
    public ResponseEntity<CollectionSummaryResponse> getCollectionSummary(@PathVariable Long id) {
        return ResponseEntity.ok(festivalService.getCollectionSummary(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Festival> createFestival(@RequestBody Festival festival) {
        return ResponseEntity.ok(festivalService.createFestival(festival));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Festival> updateFestival(@PathVariable Long id, @RequestBody Festival festival) {
        return ResponseEntity.ok(festivalService.updateFestival(id, festival));
    }
}


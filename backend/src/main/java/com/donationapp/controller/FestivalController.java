package com.donationapp.controller;

import com.donationapp.dto.resp.CollectionSummaryResponse;
import com.donationapp.dto.resp.FestivalResponse;
import com.donationapp.entity.Festival;
import com.donationapp.service.FestivalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/festivals")
public class FestivalController {

    private final FestivalService festivalService;

    public FestivalController(FestivalService festivalService) {
        this.festivalService = festivalService;
    }

    @GetMapping
    public ResponseEntity<List<FestivalResponse>> getAllFestivals() {
        List<FestivalResponse> festivals = festivalService.getAllFestivals()
                .stream()
                .map(FestivalResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(festivals);
    }

    @GetMapping({"/category/{festivalType}", "/type/{festivalType}"})
    public ResponseEntity<List<FestivalResponse>> getFestivalsByFestivalType(@PathVariable Festival.FestivalType festivalType) {
        List<FestivalResponse> festivals = festivalService.getFestivalsByFestivalType(festivalType)
                .stream()
                .map(FestivalResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(festivals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FestivalResponse> getFestivalById(@PathVariable Long id) {
        return festivalService.getFestivalById(id)
                .map(f -> ResponseEntity.ok(new FestivalResponse(f)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/collection-summary")
    public ResponseEntity<CollectionSummaryResponse> getCollectionSummary(@PathVariable Long id) {
        return ResponseEntity.ok(festivalService.getCollectionSummary(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<FestivalResponse> createFestival(@RequestBody Festival festival) {
        return ResponseEntity.ok(new FestivalResponse(festivalService.createFestival(festival)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN')")
    public ResponseEntity<FestivalResponse> updateFestival(@PathVariable Long id, @RequestBody Festival festival) {
        return ResponseEntity.ok(new FestivalResponse(festivalService.updateFestival(id, festival)));
    }
}

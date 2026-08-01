package com.donationapp.repository;

import com.donationapp.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    Optional<Volunteer> findByUserId(Long userId);
    Optional<Volunteer> findByQrBadgeCode(String qrBadgeCode);
    List<Volunteer> findByFestivalId(Long festivalId);
}

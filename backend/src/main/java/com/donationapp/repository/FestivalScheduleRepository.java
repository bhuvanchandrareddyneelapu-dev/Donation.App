package com.donationapp.repository;

import com.donationapp.entity.FestivalSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FestivalScheduleRepository extends JpaRepository<FestivalSchedule, Long> {
    List<FestivalSchedule> findByFestivalIdOrderByDateTimeAsc(Long festivalId);
}

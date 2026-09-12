package com.donationapp.repository;

import com.donationapp.entity.FestivalNotification;
import com.donationapp.entity.enums.NotificationPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FestivalNotificationRepository extends JpaRepository<FestivalNotification, Long> {

    List<FestivalNotification> findByFestivalIdOrderByCreatedAtDesc(Long festivalId);

    List<FestivalNotification> findByFestivalIdAndEnabledTrue(Long festivalId);

    @Query("SELECT n FROM FestivalNotification n WHERE n.festival.id = :festivalId AND n.enabled = true " +
           "AND (n.scheduledStart IS NULL OR n.scheduledStart <= :now) " +
           "AND (n.scheduledEnd IS NULL OR n.scheduledEnd >= :now) " +
           "ORDER BY n.updatedAt DESC")
    List<FestivalNotification> findActiveInWindow(@Param("festivalId") Long festivalId, @Param("now") LocalDateTime now);

    @Query("SELECT n FROM FestivalNotification n WHERE n.festival.id = :festivalId AND n.enabled = true " +
           "AND n.eventDate = :targetDate " +
           "ORDER BY n.eventTime ASC")
    List<FestivalNotification> findByFestivalIdAndEventDate(@Param("festivalId") Long festivalId, @Param("targetDate") LocalDate targetDate);

    @Query("SELECT n FROM FestivalNotification n WHERE n.festival.id = :festivalId AND n.enabled = true " +
           "AND (n.eventDate >= :fromDate OR n.scheduledStart >= :fromDateTime) " +
           "ORDER BY n.eventDate ASC, n.eventTime ASC")
    List<FestivalNotification> findUpcoming(@Param("festivalId") Long festivalId, 
                                            @Param("fromDate") LocalDate fromDate, 
                                            @Param("fromDateTime") LocalDateTime fromDateTime);
}

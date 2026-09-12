package com.donationapp.repository;

import com.donationapp.entity.PushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {

    Optional<PushSubscription> findByEndpoint(String endpoint);

    List<PushSubscription> findByFestivalIdAndEnabledTrue(Long festivalId);

    List<PushSubscription> findByEnabledTrue();

    long countByFestivalIdAndEnabledTrue(Long festivalId);

    void deleteByEndpoint(String endpoint);
}

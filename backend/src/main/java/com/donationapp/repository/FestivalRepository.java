package com.donationapp.repository;

import com.donationapp.entity.Festival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FestivalRepository extends JpaRepository<Festival, Long> {
    List<Festival> findByCategory(Festival.PurposeCategory category);
    List<Festival> findByActiveTrue();
    List<Festival> findByOrganizationId(Long organizationId);
}

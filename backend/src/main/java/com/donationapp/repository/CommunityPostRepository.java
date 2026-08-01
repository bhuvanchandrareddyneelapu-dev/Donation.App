package com.donationapp.repository;

import com.donationapp.entity.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {
    List<CommunityPost> findByFestivalIdOrderByCreatedAtDesc(Long festivalId);
    List<CommunityPost> findAllByOrderByCreatedAtDesc();
}

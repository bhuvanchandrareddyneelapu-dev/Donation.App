package com.donationapp.controller;

import com.donationapp.entity.CommunityPost;
import com.donationapp.entity.PostComment;
import com.donationapp.service.CommunityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/community")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/posts")
    public ResponseEntity<List<CommunityPost>> getAllPosts() {
        return ResponseEntity.ok(communityService.getAllPosts());
    }

    @GetMapping("/festival/{festivalId}/posts")
    public ResponseEntity<List<CommunityPost>> getPostsByFestival(@PathVariable Long festivalId) {
        return ResponseEntity.ok(communityService.getPostsByFestival(festivalId));
    }

    @PostMapping("/posts")
    public ResponseEntity<CommunityPost> createPost(@RequestBody CommunityPost post) {
        return ResponseEntity.ok(communityService.createPost(post));
    }

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<CommunityPost> likePost(@PathVariable Long postId) {
        return ResponseEntity.ok(communityService.likePost(postId));
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<PostComment>> getPostComments(@PathVariable Long postId) {
        return ResponseEntity.ok(communityService.getPostComments(postId));
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<PostComment> addComment(
            @PathVariable Long postId,
            @RequestParam Long authorId,
            @RequestParam String commentText) {
        return ResponseEntity.ok(communityService.addComment(postId, authorId, commentText));
    }
}

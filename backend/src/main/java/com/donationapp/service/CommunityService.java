package com.donationapp.service;

import com.donationapp.entity.CommunityPost;
import com.donationapp.entity.PostComment;
import com.donationapp.entity.User;
import com.donationapp.repository.CommunityPostRepository;
import com.donationapp.repository.PostCommentRepository;
import com.donationapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommunityService {

    private final CommunityPostRepository postRepository;
    private final PostCommentRepository commentRepository;
    private final UserRepository userRepository;

    public CommunityService(CommunityPostRepository postRepository, PostCommentRepository commentRepository,
                            UserRepository userRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    public List<CommunityPost> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<CommunityPost> getPostsByFestival(Long festivalId) {
        return postRepository.findByFestivalIdOrderByCreatedAtDesc(festivalId);
    }

    public CommunityPost createPost(CommunityPost post) {
        return postRepository.save(post);
    }

    @Transactional
    public CommunityPost likePost(Long postId) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikesCount(post.getLikesCount() + 1);
        return postRepository.save(post);
    }

    @Transactional
    public PostComment addComment(Long postId, Long authorId, String commentText) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PostComment comment = new PostComment(post, author, commentText);
        post.setCommentsCount(post.getCommentsCount() + 1);
        postRepository.save(post);

        return commentRepository.save(comment);
    }

    public List<PostComment> getPostComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }
}

package com.donationapp.service;

import com.donationapp.dto.req.LoginRequest;
import com.donationapp.dto.req.RegisterRequest;
import com.donationapp.dto.resp.JwtResponse;
import com.donationapp.entity.User;
import com.donationapp.repository.UserRepository;
import com.donationapp.security.JwtUtils;
import com.donationapp.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();

        // Enforce committee RBAC: only authorized committee roles can access committee portal
        User.Role role = userDetails.getRole();
        boolean isCommitteeRole = role == User.Role.SUPER_ADMIN || role == User.Role.ADMIN || 
                                  role == User.Role.FESTIVAL_ADMIN || role == User.Role.VOLUNTEER ||
                                  role == User.Role.TREASURER || role == User.Role.HEAD || role == User.Role.SUPERVISOR;

        if (!isCommitteeRole) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "You are not authorized to access the committee dashboard.");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getUsername(),
                userRepository.findById(userDetails.getId()).map(User::getPhone).orElse(""),
                role
        );
    }

    public User registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Ignore client-supplied roles for public registration; force DONOR role
        User user = new User(
                signUpRequest.getName(),
                signUpRequest.getEmail(),
                signUpRequest.getPhone(),
                encoder.encode(signUpRequest.getPassword()),
                User.Role.DONOR
        );

        return userRepository.save(user);
    }
}

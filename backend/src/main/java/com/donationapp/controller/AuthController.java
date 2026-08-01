package com.donationapp.controller;

import com.donationapp.dto.req.LoginRequest;
import com.donationapp.dto.req.RegisterRequest;
import com.donationapp.dto.resp.JwtResponse;
import com.donationapp.entity.User;
import com.donationapp.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        User registeredUser = authService.registerUser(signUpRequest);
        return ResponseEntity.ok(registeredUser);
    }
}

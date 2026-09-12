package com.donationapp.controller;

import com.donationapp.dto.req.LoginRequest;
import com.donationapp.dto.resp.JwtResponse;
import com.donationapp.entity.User;
import com.donationapp.repository.UserRepository;
import com.donationapp.security.JwtUtils;
import com.donationapp.security.UserPrincipal;
import com.donationapp.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SecurityRbacTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthService authService;

    private User superAdminUser;
    private User adminUser;
    private User festivalAdminUser;
    private User volunteerUser;
    private User donorUser;

    @BeforeEach
    void setUp() {
        superAdminUser = new User("Super Admin", "superadmin@donation.app", "+91 9876543210", "encodedPass", User.Role.SUPER_ADMIN);
        superAdminUser.setId(1L);

        adminUser = new User("Org Admin", "admin@donation.app", "+91 9876543215", "encodedPass", User.Role.ADMIN);
        adminUser.setId(2L);

        festivalAdminUser = new User("Festival Admin", "festivaladmin@donation.app", "+91 9876543211", "encodedPass", User.Role.FESTIVAL_ADMIN);
        festivalAdminUser.setId(3L);

        volunteerUser = new User("Volunteer", "volunteer@donation.app", "+91 9876543213", "encodedPass", User.Role.VOLUNTEER);
        volunteerUser.setId(4L);

        donorUser = new User("Public Donor", "donor@donation.app", "+91 9876543214", "encodedPass", User.Role.DONOR);
        donorUser.setId(5L);
    }

    @Test
    void testSuperAdminLogin_Authorized() {
        LoginRequest req = new LoginRequest();
        req.setEmail("superadmin@donation.app");
        req.setPassword("admin123");

        UserPrincipal principal = UserPrincipal.build(superAdminUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtUtils.generateJwtToken(any())).thenReturn("mock.jwt.token");
        when(userRepository.findById(1L)).thenReturn(Optional.of(superAdminUser));

        JwtResponse res = authService.authenticateUser(req);

        assertNotNull(res);
        assertEquals("mock.jwt.token", res.getToken());
        assertEquals(User.Role.SUPER_ADMIN, res.getRole());
    }

    @Test
    void testAdminLogin_Authorized() {
        LoginRequest req = new LoginRequest();
        req.setEmail("admin@donation.app");
        req.setPassword("admin123");

        UserPrincipal principal = UserPrincipal.build(adminUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtUtils.generateJwtToken(any())).thenReturn("mock.jwt.token");
        when(userRepository.findById(2L)).thenReturn(Optional.of(adminUser));

        JwtResponse res = authService.authenticateUser(req);

        assertNotNull(res);
        assertEquals(User.Role.ADMIN, res.getRole());
    }

    @Test
    void testFestivalAdminLogin_Authorized() {
        LoginRequest req = new LoginRequest();
        req.setEmail("festivaladmin@donation.app");
        req.setPassword("admin123");

        UserPrincipal principal = UserPrincipal.build(festivalAdminUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtUtils.generateJwtToken(any())).thenReturn("mock.jwt.token");
        when(userRepository.findById(3L)).thenReturn(Optional.of(festivalAdminUser));

        JwtResponse res = authService.authenticateUser(req);

        assertNotNull(res);
        assertEquals(User.Role.FESTIVAL_ADMIN, res.getRole());
    }

    @Test
    void testVolunteerLogin_Authorized() {
        LoginRequest req = new LoginRequest();
        req.setEmail("volunteer@donation.app");
        req.setPassword("volunteer123");

        UserPrincipal principal = UserPrincipal.build(volunteerUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtUtils.generateJwtToken(any())).thenReturn("mock.jwt.token");
        when(userRepository.findById(4L)).thenReturn(Optional.of(volunteerUser));

        JwtResponse res = authService.authenticateUser(req);

        assertNotNull(res);
        assertEquals(User.Role.VOLUNTEER, res.getRole());
    }

    @Test
    void testDonorAttemptCommitteeLogin_Forbidden403() {
        LoginRequest req = new LoginRequest();
        req.setEmail("donor@donation.app");
        req.setPassword("donor123");

        UserPrincipal principal = UserPrincipal.build(donorUser);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any())).thenReturn(auth);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                authService.authenticateUser(req)
        );

        assertEquals(403, ex.getStatusCode().value());
        assertTrue(ex.getReason().contains("You are not authorized to access the committee dashboard"));
    }
}

package com.donationapp.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, Integer> requestCounts = new ConcurrentHashMap<>();
    private final Map<String, Long> lastResetTime = new ConcurrentHashMap<>();

    private static final int MAX_REQUESTS_PER_MINUTE = 60;
    private static final long ONE_MINUTE_MS = 60000L;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String clientIp = request.getRemoteAddr();
        long currentTime = System.currentTimeMillis();

        lastResetTime.putIfAbsent(clientIp, currentTime);
        requestCounts.putIfAbsent(clientIp, 0);

        if (currentTime - lastResetTime.get(clientIp) > ONE_MINUTE_MS) {
            lastResetTime.put(clientIp, currentTime);
            requestCounts.put(clientIp, 0);
        }

        int count = requestCounts.get(clientIp) + 1;
        requestCounts.put(clientIp, count);

        if (count > MAX_REQUESTS_PER_MINUTE) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too Many Requests\", \"message\": \"Rate limit exceeded. Maximum 60 requests per minute allowed.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}

package com.oas.auctionservice.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtFilter) throws Exception {

        http
            // 1. Disable CSRF (standard for JWT-based REST APIs)
            .csrf(csrf -> csrf.disable())

            // 2. Set session management to stateless (no Cookies)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 3. Define granular authorization rules
            .authorizeHttpRequests(auth -> auth
                // Allow actuator/health checks without a token
                .requestMatchers(new AntPathRequestMatcher("/actuator/**")).permitAll()

                // POST/PUT/CLOSE (Modifying): Restricted to SELLER or ADMIN roles
                // Check these FIRST before GET to ensure proper role checking
                .requestMatchers(HttpMethod.POST, "/api/auctions", "/api/auctions/**").hasAnyRole("SELLER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/auctions", "/api/auctions/**").hasAnyRole("SELLER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/auctions/**/close").hasAnyRole("SELLER", "ADMIN")

                // GET (Viewing): Allow for any logged-in user (BUYER, SELLER, or ADMIN)
                // Match both /api/auctions and /api/auctions/**
                .requestMatchers(HttpMethod.GET, "/api/auctions", "/api/auctions/**").authenticated()

                // Ensure all other requests are secured
                .anyRequest().authenticated()
            )

            // 4. Debugging: Add a custom handler to see why a 403 is happening in the logs
            .exceptionHandling(exception -> exception
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    System.err.println("FORBIDDEN ERROR: User lacks required role. Path: " + request.getRequestURI());
                    response.setStatus(403);
                    response.getWriter().write("Access Denied: You do not have the required role (SELLER or ADMIN).");
                })
            )

            // 5. Add our custom JWT Filter before the standard one
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
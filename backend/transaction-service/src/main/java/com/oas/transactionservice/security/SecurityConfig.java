package com.oas.transactionservice.security;

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

                // All transaction endpoints require authentication
                .requestMatchers(HttpMethod.GET, "/api/transactions/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/transactions/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/transactions/**").authenticated()

                // Ensure all other requests are secured
                .anyRequest().authenticated()
            )

            // 4. Add our custom JWT Filter before the standard one
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}

package com.oas.auctionservice.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = jwtUtil.validateToken(token);
            
            // DEBUG: Print all claims to your IDE console to see the real structure
            System.out.println("DEBUG - JWT Claims: " + claims);

            String email = claims.getSubject();
            
            // Extract role(s) flexibly
            Object roleObject = claims.get("role") != null ? claims.get("role") : claims.get("roles");
            List<String> roles = new ArrayList<>();

            if (roleObject instanceof String) {
                roles.add((String) roleObject);
            } else if (roleObject instanceof Collection) {
                roles.addAll(((Collection<?>) roleObject).stream().map(Object::toString).collect(Collectors.toList()));
            }

            if (email != null) {
                // Always set authentication to ensure it's fresh for each request
                List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(r -> {
                            // Normalize role: convert to uppercase and ensure ROLE_ prefix
                            String normalized = r.toUpperCase().trim();
                            return normalized.startsWith("ROLE_") ? normalized : "ROLE_" + normalized;
                        })
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                System.out.println("DEBUG - Final Authorities: " + authorities);
                System.out.println("DEBUG - Request Method: " + request.getMethod());
                System.out.println("DEBUG - Request Path: " + request.getRequestURI());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(email, null, authorities);

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            System.err.println("JWT Error: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
package com.oas.userservice.service.impl;

import com.oas.userservice.model.User;
import com.oas.userservice.repository.UserRepository;
import com.oas.userservice.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ================= REGISTER (PUBLIC → BUYER) =================
    @Override
    public User createUser(User user) {

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        String email = user.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalStateException(
                    "User already exists with email: " + email);
        }

        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("BUYER");
        user.setActive(true);
        user.setCreatedAt(Instant.now());

        return userRepository.save(user);
    }

    // ================= ADMIN CREATE USER =================
    @Override
    public User createUserWithRole(User user) {

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        String email = user.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalStateException("User already exists");
        }

        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActive(true);
        user.setCreatedAt(Instant.now());

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("BUYER");
        }

        return userRepository.save(user);
    }

    // ================= LOGIN =================
    @Override
    public Optional<User> authenticate(String email, String rawPassword) {

        if (email == null || rawPassword == null || rawPassword.isBlank()) {
            return Optional.empty();
        }

        return userRepository
                .findByEmail(email.trim().toLowerCase())
                .filter(User::isActive)
                .filter(user ->
                        passwordEncoder.matches(rawPassword, user.getPassword()));
    }

    // ================= FETCH =================
    @Override
    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalStateException("User not found"));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository
                .findByEmail(email.trim().toLowerCase())
                .orElseThrow(() ->
                        new IllegalStateException("User not found"));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ================= UPDATE =================
    @Override
    public User updateUser(String userId, User updatedUser) {

        User existingUser = getUserById(userId);

        // Email update with uniqueness check
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().isBlank()) {
            String email = updatedUser.getEmail().trim().toLowerCase();

            userRepository.findByEmail(email)
                    .ifPresent(user -> {
                        if (!user.getId().equals(userId)) {
                            throw new IllegalStateException("Email already in use");
                        }
                    });

            existingUser.setEmail(email);
        }

        // Name update
        if (updatedUser.getName() != null) {
            existingUser.setName(updatedUser.getName());
        }

        // Mobile number update
        if (updatedUser.getMobileNumber() != null) {
            existingUser.setMobileNumber(updatedUser.getMobileNumber());
        }

        // Address update
        if (updatedUser.getAddress() != null) {
            existingUser.setAddress(updatedUser.getAddress());
        }

        // Profile photo URL update
        if (updatedUser.getProfilePhotoUrl() != null) {
            existingUser.setProfilePhotoUrl(updatedUser.getProfilePhotoUrl());
        }

        // ⚠️ Role change should normally be ADMIN-only
        if (updatedUser.getRole() != null && !updatedUser.getRole().isBlank()) {
            existingUser.setRole(updatedUser.getRole());
        }

        // Password update (if provided, encode it)
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        // Note: id, createdAt, and active are not updated through this method
        // Add handling for any additional fields you've added to User model here

        return userRepository.save(existingUser);
    }

    // ================= DEACTIVATE =================
    @Override
    public void deactivateUser(String userId) {
        User user = getUserById(userId);
        user.setActive(false);
        userRepository.save(user);
    }
}

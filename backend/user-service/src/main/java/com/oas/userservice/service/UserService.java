package com.oas.userservice.service;

import com.oas.userservice.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    // PUBLIC REGISTRATION → BUYER
    User createUser(User user);

    // ADMIN CREATES SELLER / ADMIN
    User createUserWithRole(User user);

    // LOGIN AUTHENTICATION
    Optional<User> authenticate(String email, String rawPassword);


    User getUserById(String userId);

    User getUserByEmail(String email);

    List<User> getAllUsers();

    User updateUser(String userId, User user);

    void deactivateUser(String userId);
}

package com.oas.userservice.controller;

import com.oas.userservice.model.User;
import com.oas.userservice.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")   // ✅ PLURAL
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/admin/create")
    public User createUserByAdmin(@RequestBody User user) {
        return userService.createUserWithRole(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id,
                           @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deactivateUser(@PathVariable String id) {
        userService.deactivateUser(id);
    }
}

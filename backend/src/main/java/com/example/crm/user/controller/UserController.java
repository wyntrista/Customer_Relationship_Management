package com.example.crm.user.controller;

import com.example.crm.auth.dto.MessageResponse;
import com.example.crm.auth.security.service.UserDetailsImpl;
import com.example.crm.user.dto.UpdateProfileRequest;
import com.example.crm.user.dto.UserDTO;
import com.example.crm.user.model.User;
import com.example.crm.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private final UserService userService;
    private final PasswordEncoder encoder;

    @Autowired
    public UserController(UserService userService, PasswordEncoder encoder) {
        this.userService = userService;
        this.encoder = encoder;
    }

    /**
     * Get all assignable users (excluding admin)
     */
    @GetMapping("/assignable")
    public ResponseEntity<List<UserDTO>> getAssignableUsers() {
        List<UserDTO> users = userService.getAssignableUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Update user profile
     */
    @PutMapping("/profile")
    public ResponseEntity<MessageResponse> updateProfile(@RequestBody UpdateProfileRequest request,
                                                         Authentication authentication) {
        try {
            UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
            Long userId = userPrincipal.getId();

            User updatedUser = userService.updateProfile(userId, request);

            if (updatedUser != null) {
                return ResponseEntity.ok(new MessageResponse("Profile updated successfully"));
            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found"));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new MessageResponse("Error: Failed to update profile"));
        }
    }
}


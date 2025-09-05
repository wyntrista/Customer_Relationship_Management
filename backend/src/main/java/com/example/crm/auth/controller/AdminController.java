package com.example.crm.auth.controller;

import com.example.crm.user.model.User;
import com.example.crm.user.model.Role;
import com.example.crm.user.model.ERole;
import com.example.crm.user.repository.UserRepository;
import com.example.crm.user.repository.RoleRepository;
import com.example.crm.user.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = users.stream()
            .map(user -> new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPermissionLevel(),
                user.isEnabled(),
                user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toList())
            ))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(userDTOs);
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(request.getUsername(), request.getEmail(), 
                           passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEnabled(true);

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.valueOf(request.getRole()))
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
        user.setRoles(roles);

        switch (request.getRole()) {
            case "ROLE_ADMIN":
                user.setPermissionLevel(8);
                break;
            case "ROLE_MARKETING":
                user.setPermissionLevel(4);
                break;
            case "ROLE_SALES":
                user.setPermissionLevel(2);
                break;
            case "ROLE_TELESALES":
                user.setPermissionLevel(1);
                break;
            case "ROLE_USER":
            default:
                user.setPermissionLevel(0);
                break;
        }

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User created successfully!"));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSystemStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByEnabledTrue();
        
        AdminStats stats = new AdminStats();
        stats.setTotalUsers(totalUsers);
        stats.setActiveUsers(activeUsers);
        stats.setNewUsersThisMonth(12L);
        stats.setTotalCustomers(89L); 
        stats.setTotalLeads(234L); 
        stats.setTotalOpportunities(45L);
        
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/users/{userId}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
        
        return ResponseEntity.ok(new MessageResponse(
            "User status updated to " + (user.isEnabled() ? "enabled" : "disabled")));
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("User not found"));
        }
        
        userRepository.deleteById(userId);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }

    @PutMapping("/users/{userId}/permission")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserPermission(@PathVariable Long userId, @RequestBody UpdatePermissionRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        

        user.getRoles().clear();
        
        Role role = roleRepository.findByName(ERole.valueOf(request.getRole()))
            .orElseThrow(() -> new RuntimeException("Role not found"));
        user.getRoles().add(role);
        

        switch (request.getRole()) {
            case "ROLE_ADMIN":
                user.setPermissionLevel(8);
                break;
            case "ROLE_MARKETING":
                user.setPermissionLevel(4);
                break;
            case "ROLE_SALES":
                user.setPermissionLevel(2);
                break;
            case "ROLE_TELESALES":
                user.setPermissionLevel(1);
                break;
            case "ROLE_USER":
            default:
                user.setPermissionLevel(0);
                break;
        }
        
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User permission updated successfully"));
    }

    public static class AdminStats {
        private long totalUsers;
        private long activeUsers;
        private long newUsersThisMonth;
        private long totalCustomers;
        private long totalLeads;
        private long totalOpportunities;

        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        
        public long getActiveUsers() { return activeUsers; }
        public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
        
        public long getNewUsersThisMonth() { return newUsersThisMonth; }
        public void setNewUsersThisMonth(long newUsersThisMonth) { this.newUsersThisMonth = newUsersThisMonth; }
        
        public long getTotalCustomers() { return totalCustomers; }
        public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }
        
        public long getTotalLeads() { return totalLeads; }
        public void setTotalLeads(long totalLeads) { this.totalLeads = totalLeads; }
        
        public long getTotalOpportunities() { return totalOpportunities; }
        public void setTotalOpportunities(long totalOpportunities) { this.totalOpportunities = totalOpportunities; }
    }

    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class UpdatePermissionRequest {
        private String role;

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class CreateUserRequest {
        private String username;
        private String email;
        private String password;
        private String fullName;
        private String role;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}

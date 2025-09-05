package com.example.crm.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.example.crm.user.model.ERole;
import com.example.crm.user.model.Role;
import com.example.crm.user.model.User;
import com.example.crm.user.repository.RoleRepository;
import com.example.crm.user.repository.UserRepository;
import com.example.crm.auth.dto.JwtResponse;
import com.example.crm.auth.dto.LoginRequest;
import com.example.crm.auth.dto.MessageResponse;
import com.example.crm.auth.dto.SignupRequest;
import com.example.crm.auth.dto.ForgotPasswordRequest;
import com.example.crm.auth.dto.ResetPasswordRequest;
import com.example.crm.auth.dto.ChangePasswordRequest;
import com.example.crm.auth.dto.VerifyCodeRequest;
import com.example.crm.auth.dto.ResetPasswordWithCodeRequest;
import com.example.crm.auth.model.PasswordResetToken;
import com.example.crm.auth.model.VerificationCode;
import com.example.crm.auth.repository.PasswordResetTokenRepository;
import com.example.crm.auth.repository.VerificationCodeRepository;
import com.example.crm.auth.service.EmailService;
import com.example.crm.auth.security.jwt.JwtUtils;
import com.example.crm.auth.security.service.UserDetailsImpl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles,
                user.getPermissionLevel()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        user.setRole(ERole.ROLE_USER);

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
            
            if (!userOptional.isPresent()) {
                return ResponseEntity.ok(new MessageResponse("If your email exists, you will receive a verification code."));
            }

            String verificationCode = String.format("%04d", (int) (Math.random() * 10000));
            
            List<VerificationCode> existingCodes = verificationCodeRepository.findByEmailAndType(request.getEmail(), "PASSWORD_RESET");
            if (!existingCodes.isEmpty()) {
                verificationCodeRepository.deleteAll(existingCodes);
            }
            
            VerificationCode code = new VerificationCode(verificationCode, request.getEmail());
            verificationCodeRepository.save(code);
            
            emailService.sendVerificationCode(request.getEmail(), verificationCode);
            
            return ResponseEntity.ok(new MessageResponse("If your email exists, you will receive a verification code."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeRequest request) {
        try {
            Optional<VerificationCode> codeOptional = verificationCodeRepository
                    .findByEmailAndCodeAndType(request.getEmail(), request.getCode(), "PASSWORD_RESET");
            
            if (!codeOptional.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid verification code."));
            }

            VerificationCode verificationCode = codeOptional.get();
            
            if (!verificationCode.isValid()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Verification code has expired."));
            }
            
            return ResponseEntity.ok(new MessageResponse("Verification code is valid. You can now reset your password."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password-with-code")
    @Transactional
    public ResponseEntity<?> resetPasswordWithCode(@RequestBody ResetPasswordWithCodeRequest request) {
        try {
            Optional<VerificationCode> codeOptional = verificationCodeRepository
                    .findByEmailAndCodeAndType(request.getEmail(), request.getCode(), "PASSWORD_RESET");
            
            if (!codeOptional.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid verification code."));
            }

            VerificationCode verificationCode = codeOptional.get();
            
            if (!verificationCode.isValid()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Verification code has expired."));
            }

            Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: User not found."));
            }

            User user = userOptional.get();
            
            // Update password
            user.setPassword(encoder.encode(request.getNewPassword()));
            userRepository.save(user);
            
            // Mark verification code as used
            verificationCode.setUsed(true);
            verificationCodeRepository.save(verificationCode);
            
            // Send confirmation email
            emailService.sendPasswordChangeConfirmation(user.getEmail());
            
            return ResponseEntity.ok(new MessageResponse("Password has been reset successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    // Test endpoint to get latest verification code (for development only)
    @GetMapping("/test/latest-code/{email}")
    public ResponseEntity<?> getLatestCode(@PathVariable String email) {
        try {
            // Get all codes for this email (for testing)
            List<VerificationCode> codes = verificationCodeRepository.findAll().stream()
                    .filter(code -> code.getEmail().equals(email) && code.getType().equals("PASSWORD_RESET"))
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .collect(Collectors.toList());
                    
            if (!codes.isEmpty()) {
                VerificationCode latestCode = codes.get(0);
                return ResponseEntity.ok(new MessageResponse("Latest code for " + email + ": " + latestCode.getCode() + 
                    " (expires: " + latestCode.getExpiresAt() + ", used: " + latestCode.isUsed() + ")"));
            }
            
            return ResponseEntity.ok(new MessageResponse("No verification codes found for " + email));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(request.getToken());
            
            if (!tokenOptional.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid or expired reset token."));
            }

            PasswordResetToken resetToken = tokenOptional.get();
            
            if (!resetToken.isValid()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid or expired reset token."));
            }

            // Update user's password
            User user = resetToken.getUser();
            user.setPassword(encoder.encode(request.getNewPassword()));
            userRepository.save(user);
            
            // Mark token as used
            resetToken.setUsed(true);
            tokenRepository.save(resetToken);
            
            // Send confirmation email
            emailService.sendPasswordChangeConfirmation(user.getEmail());
            
            return ResponseEntity.ok(new MessageResponse("Password has been reset successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        try {
            Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);
            
            if (!tokenOptional.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid reset token."));
            }

            PasswordResetToken resetToken = tokenOptional.get();
            
            if (!resetToken.isValid()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Expired reset token."));
            }

            return ResponseEntity.ok(new MessageResponse("Token is valid."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request,
                                          Authentication authentication) {
        try {
            String username = authentication.getName();
            Optional<User> userOptional = userRepository.findByUsername(username);
            
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: User not found."));
            }

            User user = userOptional.get();
            
            // Verify current password
            if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Current password is incorrect."));
            }

            // Update password
            user.setPassword(encoder.encode(request.getNewPassword()));
            userRepository.save(user);

            // Send confirmation email
            emailService.sendPasswordChangeConfirmation(user.getEmail());

            return ResponseEntity.ok(new MessageResponse("Password has been changed successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    // Test endpoint to check if authentication works
    @GetMapping("/test")
    public ResponseEntity<?> testAuth(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            return ResponseEntity.ok(new MessageResponse("Authentication successful! User: " + userDetails.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Authentication failed: " + e.getMessage()));
        }
    }
}

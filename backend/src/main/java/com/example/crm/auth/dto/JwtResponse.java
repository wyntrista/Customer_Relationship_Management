package com.example.crm.auth.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private String accessToken;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
    private int permissionLevel;

    public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles, int permissionLevel) {
        this.token = accessToken;
        this.accessToken = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.permissionLevel = permissionLevel;
    }
}

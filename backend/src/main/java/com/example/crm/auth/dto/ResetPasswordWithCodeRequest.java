package com.example.crm.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordWithCodeRequest {
    private String email;
    private String code;
    private String newPassword;
    
    public ResetPasswordWithCodeRequest() {}
    
    public ResetPasswordWithCodeRequest(String email, String code, String newPassword) {
        this.email = email;
        this.code = code;
        this.newPassword = newPassword;
    }
}

package com.example.crm.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyCodeRequest {
    private String email;
    private String code;
    
    public VerifyCodeRequest() {}
    
    public VerifyCodeRequest(String email, String code) {
        this.email = email;
        this.code = code;
    }
}

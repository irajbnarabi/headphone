package ir.headphone.rest.controller.user.dto;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String principal;
    private String credential;
}
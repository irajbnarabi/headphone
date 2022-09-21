package ir.headphone.rest.controller.user.dto;

import lombok.Data;

@Data
public class VerifyRequest {
    private String principal;
    private String code;
    private String token;
}
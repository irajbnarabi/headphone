package ir.headphone.rest.controller.user.dto;

import lombok.Data;

@Data
public class UpdateCredentialRequest {
    private String credential;
    private String name;
}
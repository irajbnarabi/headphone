package ir.headphone.rest.controller.user.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    private String email;
    private String mobile;
    private String credential;

    public UpdateProfileRequest() {
    }
}

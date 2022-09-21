package ir.headphone.users.model;

import lombok.Data;

@Data
public class RegistrationRequest {
    private String ticket;
    private String name;
    private String mobile;
    private String email;
    private String password;
}
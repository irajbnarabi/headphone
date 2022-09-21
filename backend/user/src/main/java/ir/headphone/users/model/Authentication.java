package ir.headphone.users.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Authentication {
    private String name;
    private String accessToken;
    private String refreshToken;
}

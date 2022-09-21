package ir.headphone.users.model;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RegistrationTicket {
    private String ticket;
    private String mobile;
    private String email;
}

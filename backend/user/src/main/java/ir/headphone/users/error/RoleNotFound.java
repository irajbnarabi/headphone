package ir.headphone.users.error;

import ir.headphone.spi.error.NotFound;

public class RoleNotFound extends NotFound {
    public RoleNotFound() {
        super("role is not found");
    }
}

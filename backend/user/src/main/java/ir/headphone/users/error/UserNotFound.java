package ir.headphone.users.error;

import ir.headphone.spi.error.NotFound;

public class UserNotFound extends NotFound {
    public UserNotFound() {
        super("user is not found");
    }
}

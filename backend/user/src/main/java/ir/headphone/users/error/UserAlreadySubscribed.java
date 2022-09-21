package ir.headphone.users.error;

import ir.headphone.spi.error.ServiceException;

public class UserAlreadySubscribed extends ServiceException {
    public UserAlreadySubscribed() {
        super(400);
    }
}

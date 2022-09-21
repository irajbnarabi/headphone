package ir.headphone.social.error;

import ir.headphone.spi.error.ServiceException;

public class InvalidRate extends ServiceException {
    public InvalidRate() {
        super(400);
    }
}

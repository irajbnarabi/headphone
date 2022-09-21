package ir.headphone.rest.error;

import ir.headphone.spi.error.ServiceException;

public class SubscriptionRequired extends ServiceException {

    public SubscriptionRequired() {
        super(402);
    }
}

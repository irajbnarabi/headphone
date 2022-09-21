package ir.headphone.users.error;

import ir.headphone.spi.error.NotFound;

public class SubscriptionNotFound extends NotFound {
    public SubscriptionNotFound(String id) {
        super("subscription is not found, id: " + id);
    }
}

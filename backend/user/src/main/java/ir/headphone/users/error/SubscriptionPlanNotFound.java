package ir.headphone.users.error;

import ir.headphone.spi.error.NotFound;

public class SubscriptionPlanNotFound extends NotFound {
    public SubscriptionPlanNotFound(String id) {
        super("subscription plan is not found, id: " + id);
    }
}

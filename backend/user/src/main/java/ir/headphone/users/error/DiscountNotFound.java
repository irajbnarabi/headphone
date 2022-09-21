package ir.headphone.users.error;

import ir.headphone.spi.error.NotFound;

public class DiscountNotFound extends NotFound {
    public DiscountNotFound(String id) {
        super("discount is not found, id: " + id);
    }
}

package ir.headphone.users.error;

import ir.headphone.spi.error.NotFound;

public class RuleNotFound extends NotFound {
    public RuleNotFound() {
        super("rule is not found");
    }
}

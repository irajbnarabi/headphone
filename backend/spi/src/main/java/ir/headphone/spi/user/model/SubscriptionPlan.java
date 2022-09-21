package ir.headphone.spi.user.model;

import ir.headphone.spi.model.Entity;

import java.math.BigDecimal;

public interface SubscriptionPlan extends Entity {
    String getName();

    String getDescription();

    SubscriptionType getType();

    Integer getDuration();

    SubscriptionTimeUnit getTimeUnit();

    BigDecimal getPrice();

    Float getVat();

    Boolean getEnabled();

    enum SubscriptionType {
        SUBSCRIPTION, TICKET
    }

    enum SubscriptionTimeUnit {
        HOUR, DAY
    }
}

package ir.headphone.spi.user.model;

import ir.headphone.spi.model.Entity;

import java.math.BigDecimal;

public interface Subscription extends Entity {
    String getUserId();

    String getName();

    String getPlanId();

    String getPlanName();

    SubscriptionPlan.SubscriptionType getType();

    String getProgramId();

    Integer getDuration();

    SubscriptionPlan.SubscriptionTimeUnit getTimeUnit();

    String getDiscountVoucher();

    BigDecimal getDiscount();

    BigDecimal getPrice();

    BigDecimal getPaidAmount();

    Long getPaidDate();

    Boolean getConfirmed();

    BigDecimal getVat();

    Float getVatPercent();

    Discount.DiscountType getDiscountType();
}

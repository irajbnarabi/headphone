package ir.headphone.spi.user.model;

public interface CalculatedPrice {
    Long getPrice();

    Long getDiscount();

    Long getMaximumDiscount();

    Integer getDiscountPercent();

    Long getVat();

    Float getVatPercent();

    Long getToPay();

    Integer getDuration();

    SubscriptionPlan.SubscriptionTimeUnit getTimeUnit();

    Discount.DiscountType getDiscountType();
}

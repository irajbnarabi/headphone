package ir.headphone.spi.user.model;

import ir.headphone.spi.model.Entity;

import java.math.BigDecimal;
import java.util.List;

public interface Discount extends Entity {
    String getVoucher();

    List<String> getTargetPlans();

    Integer getDiscountPercent();

    BigDecimal getMaximum();

    Long getValidUntil();

    DiscountType getDiscountType();

    UsageType getUsageType();

    Boolean getEnabled();

    enum DiscountType {
        ONE_TIME, REGULAR;
    }

    enum UsageType {
        ONCE_PER_USER, MULTIPLE_PER_USER
    }
}

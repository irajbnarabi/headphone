package ir.headphone.users.model;

import ir.headphone.spi.user.model.CalculatedPrice;
import ir.headphone.spi.user.model.Discount;
import ir.headphone.spi.user.model.SubscriptionPlan;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CalculatedPriceDto implements CalculatedPrice {
    private Long price;
    private Long discount;
    private Long maximumDiscount;
    private Integer discountPercent;
    private Long vat;
    private Float vatPercent;
    private Long toPay;
    private Integer duration;
    private SubscriptionPlan.SubscriptionTimeUnit timeUnit;
    private Discount.DiscountType discountType;
}
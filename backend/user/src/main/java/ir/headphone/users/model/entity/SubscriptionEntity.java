package ir.headphone.users.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.user.model.Discount;
import ir.headphone.spi.user.model.Subscription;
import ir.headphone.spi.user.model.SubscriptionPlan;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "subscriptions")
public class SubscriptionEntity extends AbstractEntity implements Subscription {
    @Indexed
    private String userId;
    private String name;
    @Indexed
    private String planId;
    private String planName;
    private SubscriptionPlan.SubscriptionType type;
    @Indexed(sparse = true)
    private String programId;
    @Indexed
    private Integer duration;
    @Indexed
    private SubscriptionPlan.SubscriptionTimeUnit timeUnit;
    private String discountVoucher;
    private BigDecimal discount;
    private BigDecimal price;
    private BigDecimal paidAmount;
    private Long paidDate;
    private Boolean confirmed;
    private Float vatPercent;
    private BigDecimal vat;
    private Discount.DiscountType discountType;
}

package ir.headphone.users.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.user.model.Discount;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@Document(collection = "discounts")
@NoArgsConstructor
@AllArgsConstructor
public class DiscountEntity extends AbstractEntity implements Discount {
    @Indexed(unique = true)
    private String voucher;
    @Indexed
    private Integer discountPercent;
    private List<String> targetPlans;
    private BigDecimal maximum;
    private Long validUntil;
    @Indexed
    private Discount.DiscountType discountType;
    @Indexed
    private Discount.UsageType usageType;
    private Boolean enabled;

    public DiscountEntity(Discount discount) {
        super(discount);
        this.voucher = discount.getVoucher();
        this.discountPercent = discount.getDiscountPercent();
        this.targetPlans = discount.getTargetPlans();
        this.maximum = discount.getMaximum();
        this.validUntil = discount.getValidUntil();
        this.discountType = discount.getDiscountType();
        this.usageType = discount.getUsageType();
        this.enabled = discount.getEnabled();
    }
}

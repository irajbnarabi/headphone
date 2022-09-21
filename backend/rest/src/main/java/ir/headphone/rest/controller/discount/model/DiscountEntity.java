package ir.headphone.rest.controller.discount.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ir.headphone.spi.user.model.Discount;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscountEntity implements Discount {
    private String id;
    @JsonIgnore
    private Long createdAt;
    @JsonIgnore
    private Long updatedAt;
    private String voucher;
    private Integer discountPercent;
    private List<String> targetPlans;
    private BigDecimal maximum;
    private Long validUntil;
    private DiscountType discountType;
    private UsageType usageType;
    private Boolean enabled;

    public DiscountEntity(Discount discount) {
        this.id = discount.getId();
        this.createdAt = discount.getCreatedAt();
        this.updatedAt = discount.getUpdatedAt();
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

package ir.headphone.rest.controller.discount.model;

import ir.headphone.spi.user.model.Discount;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscountDto {
    private String id;
    private String voucher;
    private Integer discountPercent;
    private BigDecimal maximum;

    public DiscountDto(Discount discount) {
        this.id = discount.getId();
        this.voucher = discount.getVoucher();
        this.discountPercent = discount.getDiscountPercent();
        this.maximum = discount.getMaximum();
    }
}

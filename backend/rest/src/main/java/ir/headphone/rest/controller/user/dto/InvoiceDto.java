package ir.headphone.rest.controller.user.dto;

import ir.headphone.spi.user.model.SubscriptionPlan;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDto {
    private String id;
    private String name;
    private String programId;
    private String programImage;
    private Integer duration;
    private String type;
    private Boolean confirmed;
    private String message;
    private Long date;
    private Long paidDate;
    private BigDecimal price;
    private BigDecimal discount;
    private BigDecimal paid;
    private String discountVoucher;
    private BigDecimal vat;
    private Float vatPercent;
    private SubscriptionPlan.SubscriptionTimeUnit timeUnit;
}

package ir.headphone.rest.controller.analytics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HotDiscount {
    private String voucher;
    private Integer count;
}

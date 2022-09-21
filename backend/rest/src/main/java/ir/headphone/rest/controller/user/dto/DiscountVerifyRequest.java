package ir.headphone.rest.controller.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscountVerifyRequest {
    private String planId;
    private String discount;
}

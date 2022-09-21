package ir.headphone.rest.controller.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionRequestDto {
    private String planId;
    private Integer ipgId;
    private String programId;
    private String discount;
}

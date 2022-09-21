package ir.headphone.rest.controller.analytics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HotPlan {
    private String id;
    private String name;
    private Integer count;
}

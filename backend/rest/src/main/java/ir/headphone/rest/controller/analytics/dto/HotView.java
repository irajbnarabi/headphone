package ir.headphone.rest.controller.analytics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HotView {
    private String id;
    private String title;
    private Long count;
}

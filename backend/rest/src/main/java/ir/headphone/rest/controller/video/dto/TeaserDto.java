package ir.headphone.rest.controller.video.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeaserDto {
    private String path;
    private String type;
}

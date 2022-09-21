package ir.headphone.rest.controller.video.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LinkDto {
    private String title;
    private String link;
    private Map<String, List<TagDto>> tags;
}

package ir.headphone.rest.controller.video.dto;

import ir.headphone.rest.controller.home.Carousel;
import ir.headphone.spi.video.model.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
public class TagDto {
    private String id;
    private String tagDefinitionId;
    private String tagDefinitionName;
    private String value;
    private Map<String, Object> fields;
    private Map<String, Object> bindings;
    private List<Object> items;
    private List<Carousel> carousels;

    public TagDto() {
    }

    public TagDto(Tag tag, String tagDefinitionName) {
        this.id = tag.getId();
        this.tagDefinitionId = tag.getTagDefinitionId();
        this.tagDefinitionName = tagDefinitionName;
        this.value = tag.getValue();
        this.fields = tag.getFields();
    }
}

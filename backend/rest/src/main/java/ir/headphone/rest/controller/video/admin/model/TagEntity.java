package ir.headphone.rest.controller.video.admin.model;

import ir.headphone.rest.controller.video.dto.TagDto;
import ir.headphone.spi.video.model.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class TagEntity implements Tag {
    private String id;
    private Long createdAt;
    private Long updatedAt;
    private String tagDefinitionId;
    private String value;
    private Map<String, Object> fields;

    public TagEntity() {
    }

    public TagEntity(Tag tag) {
        this.id = tag.getId();
        this.createdAt = tag.getCreatedAt();
        this.updatedAt = tag.getUpdatedAt();
        this.tagDefinitionId = tag.getTagDefinitionId();
        this.value = tag.getValue();
        this.fields = tag.getFields();
    }

    public TagEntity(TagDto dto) {
        this.id = dto.getId();
        this.tagDefinitionId = dto.getTagDefinitionId();
        this.fields = dto.getFields();
        this.value = dto.getValue();
    }
}

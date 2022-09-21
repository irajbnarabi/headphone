package ir.headphone.rest.controller.video.admin.model;

import ir.headphone.rest.controller.video.dto.TagDefinitionDto;
import ir.headphone.spi.video.model.Field;
import ir.headphone.spi.video.model.TagDefinition;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class TagDefinitionEntity implements TagDefinition {
    private String id;
    private Long createdAt;
    private Long updatedAt;
    private String name;
    private String description;
    private Set<Field> fields;
    private Set<Field> bindings;

    public TagDefinitionEntity() {
    }

    public TagDefinitionEntity(TagDefinition tagDefinition) {
        this.id = tagDefinition.getId();
        this.createdAt = tagDefinition.getCreatedAt();
        this.updatedAt = tagDefinition.getUpdatedAt();
        this.name = tagDefinition.getName();
        this.description = tagDefinition.getDescription();
        this.fields = tagDefinition.getFields();
        this.bindings = tagDefinition.getBindings();
    }

    public TagDefinitionEntity(TagDefinitionDto dto) {
        this.id = dto.getId();
        this.name = dto.getName();
        this.description = dto.getDescription();
        this.fields = dto.getFields();
        this.bindings = dto.getBindings();
    }
}

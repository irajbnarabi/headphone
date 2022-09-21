package ir.headphone.rest.controller.video.dto;

import ir.headphone.spi.video.model.Field;
import ir.headphone.spi.video.model.TagDefinition;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
public class TagDefinitionDto {
    private String id;
    private String name;
    private String description;
    private Set<Field> fields;
    private Set<Field> bindings;

    public TagDefinitionDto() {
    }

    public TagDefinitionDto(TagDefinition tagDefinition) {
        this.id = tagDefinition.getId();
        this.name = tagDefinition.getName();
        this.description = tagDefinition.getDescription();
        this.fields = tagDefinition.getFields();
        this.bindings = tagDefinition.getBindings();
    }
}

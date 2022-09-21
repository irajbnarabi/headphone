package ir.headphone.videos.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.video.model.Field;
import ir.headphone.spi.video.model.TagDefinition;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Document(collection = "tag_definitions")
@Data
@SuperBuilder
@AllArgsConstructor
public class TagDefinitionEntity extends AbstractEntity implements TagDefinition {
    @Indexed(unique = true)
    private String name;
    private String description;
    private Set<Field> fields;
    private Set<Field> bindings;

    public TagDefinitionEntity() {
    }

    public TagDefinitionEntity(TagDefinition tagDefinition) {
        super(tagDefinition);
        this.name = tagDefinition.getName();
        this.description = tagDefinition.getDescription();
        this.fields = tagDefinition.getFields();
        this.bindings = tagDefinition.getBindings();
    }

}

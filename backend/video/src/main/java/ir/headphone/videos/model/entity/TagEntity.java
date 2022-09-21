package ir.headphone.videos.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.video.model.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@EqualsAndHashCode(callSuper = true)
@Document(collection = "tags")
@Data
@Builder
@AllArgsConstructor
public class TagEntity extends AbstractEntity implements Tag {
    @Indexed
    private String tagDefinitionId;
    private String value;
    private Map<String, Object> fields;

    public TagEntity() {
    }

    public TagEntity(Tag tag) {
        super(tag);
        this.tagDefinitionId = tag.getTagDefinitionId();
        this.value = tag.getValue();
        this.fields = tag.getFields();
    }
}

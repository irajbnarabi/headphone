package ir.headphone.videos.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.video.model.TagBinding;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@EqualsAndHashCode(callSuper = true)
@Document(collection = "tag_bindings")
@Data
@SuperBuilder
public class TagBindingEntity extends AbstractEntity implements TagBinding {
    @Indexed
    private String tagId;
    @Indexed
    private String entityId;
    @Indexed
    private String entityType;
    private Map<String, Object> bindings;

    public TagBindingEntity() {
    }

    public TagBindingEntity(TagBinding tagBinding) {
        super(tagBinding);
        this.tagId = tagBinding.getTagId();
        this.entityId = tagBinding.getEntityId();
        this.entityType = tagBinding.getEntityType();
        this.bindings = tagBinding.getBindings();
    }
}

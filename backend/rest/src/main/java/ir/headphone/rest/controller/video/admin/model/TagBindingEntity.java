package ir.headphone.rest.controller.video.admin.model;

import ir.headphone.spi.video.model.TagBinding;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
public class TagBindingEntity implements TagBinding {
    private String id;
    private Long createdAt;
    private Long updatedAt;
    private String tagId;
    private String entityId;
    private String entityType;
    private Map<String, Object> bindings;

    public TagBindingEntity() {
    }


    public TagBindingEntity(TagBinding tagBinding) {
        this.id = tagBinding.getId();
        this.createdAt = tagBinding.getCreatedAt();
        this.updatedAt = tagBinding.getUpdatedAt();
        this.tagId = tagBinding.getTagId();
        this.entityId = tagBinding.getEntityId();
        this.entityType = tagBinding.getEntityType();
        this.bindings = tagBinding.getBindings();
    }
}

package ir.headphone.spi.video.service;

import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.video.model.Tag;
import ir.headphone.spi.video.model.TagBinding;
import ir.headphone.spi.video.model.TagDefinition;

import java.util.Collection;

public interface TagService {
    TagDefinition getTagDefinition(String id);

    TagDefinition getTagDefinitionByName(String name);

    TagDefinition createTagDefinition(TagDefinition tagDefinition);

    TagDefinition updateTagDefinition(TagDefinition tagDefinition);

    Collection<? extends TagDefinition> getTagDefinitions(PageSize pageSize);

    Long getTagDefinitionsCount();

    void deleteTagDefinition(String id);

    Tag getTag(String id);

    Tag getTag(String tagDefinitionId, String value);

    Tag createTag(Tag tag);

    Tag updateTag(Tag tag);

    Collection<? extends Tag> getTags(PageSize pageSize);

    Long getTagsCount();

    Collection<? extends Tag> getTagsByDefinition(String tagDefinitionId, PageSize pageSize);

    Collection<? extends Tag> getTagsByPrefix(String tagDefinitionId, String prefix, PageSize pageSize);

    Long getTagsByDefinitionCount(String tagDefinitionId);

    Collection<? extends Tag> getTagsByEntityId(String entityId, PageSize pageSize);

    Collection<? extends TagBinding> getTagBindingsByEntityId(String entityId, PageSize pageSize);

    Collection<String> getEntitiesByTagIdAndEntityType(String tagId, String entityType, PageSize pageSize);

    void deleteTag(String id);

    TagBinding getTagBinding(String id);

    TagBinding createTagBinding(TagBinding tagBinding);

    void deleteTagBinding(String id);

    void deleteTagBindingByEntityId(String entityId);

    void deleteTagBindingByEntityIdAndTagId(String entityId, String tagId);

    TagBinding getTagBindingByEntityIdAndTagId(String entityId, String tagId);
}

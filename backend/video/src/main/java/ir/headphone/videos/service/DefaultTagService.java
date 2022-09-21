package ir.headphone.videos.service;

import ir.headphone.spi.error.NotFound;
import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.video.model.Field;
import ir.headphone.spi.video.model.Tag;
import ir.headphone.spi.video.model.TagBinding;
import ir.headphone.spi.video.model.TagDefinition;
import ir.headphone.spi.video.service.TagService;
import ir.headphone.videos.error.DuplicatedUniqueField;
import ir.headphone.videos.error.TagBindingNotFound;
import ir.headphone.videos.error.TagDefinitionNotFound;
import ir.headphone.videos.error.TagNotFound;
import ir.headphone.videos.model.entity.TagBindingEntity;
import ir.headphone.videos.model.entity.TagDefinitionEntity;
import ir.headphone.videos.model.entity.TagEntity;
import ir.headphone.videos.repository.TagBindingRepository;
import ir.headphone.videos.repository.TagDefinitionRepository;
import ir.headphone.videos.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

public class DefaultTagService implements TagService {
    private final TagRepository tagRepository;
    private final TagDefinitionRepository tagDefinitionRepository;
    private final TagBindingRepository tagBindingRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public DefaultTagService(TagRepository tagRepository, TagDefinitionRepository tagDefinitionRepository,
                             TagBindingRepository tagBindingRepository) {
        this.tagRepository = tagRepository;
        this.tagDefinitionRepository = tagDefinitionRepository;
        this.tagBindingRepository = tagBindingRepository;
    }

    public TagBindingRepository getTagBindingRepository() {
        return tagBindingRepository;
    }

    @Override
    public TagDefinition getTagDefinition(String id) {
        Optional<TagDefinitionEntity> tagDefinitionEntity = tagDefinitionRepository.findById(id);
        if (!tagDefinitionEntity.isPresent()) {
            throw new TagDefinitionNotFound(id);
        }
        return tagDefinitionEntity.get();
    }

    @Override
    public TagDefinition getTagDefinitionByName(String name) {
        TagDefinitionEntity tagDefinitionEntity = tagDefinitionRepository.getByName(name);
        if (tagDefinitionEntity == null) {
            throw new TagDefinitionNotFound(name);
        }
        return tagDefinitionEntity;
    }

    @Override
    public TagDefinition createTagDefinition(TagDefinition tagDefinition) {
        TagDefinitionEntity existed = tagDefinitionRepository.getByName(tagDefinition.getName());
        if (existed != null) {
            return existed;
        }
        return tagDefinitionRepository.save(new TagDefinitionEntity(tagDefinition));
    }

    @Override
    public TagDefinition updateTagDefinition(TagDefinition tagDefinition) {
        return tagDefinitionRepository.save(new TagDefinitionEntity(tagDefinition));
    }

    @Override
    public Collection<? extends TagDefinition> getTagDefinitions(PageSize pageSize) {
        Page<TagDefinitionEntity> definitions = tagDefinitionRepository.findAll(
                PageRequest.of(pageSize.getPage(), pageSize.getSize()));
        return definitions.toList();
    }

    @Override
    public Long getTagDefinitionsCount() {
        return tagDefinitionRepository.count();
    }

    @Override
    public void deleteTagDefinition(String id) {
//        TagDefinitionEntity tagDefinition = new TagDefinitionEntity(getTagDefinition(id));
//        Collection<TagEntity> tags = tagRepository.getAllTags(tagDefinition.getId(), null);
//        for (TagEntity tag : tags) {
//            deleteTag(tag.getId());
//        }
//        tagDefinitionRepository.delete(tagDefinition);
    }

    @Override
    public Tag getTag(String id) {
        Optional<TagEntity> tagEntity = tagRepository.findById(id);
        if (!tagEntity.isPresent()) {
            throw new TagNotFound(id);
        }
        return tagEntity.get();
    }

    @Override
    public Tag getTag(String tagDefinitionId, String value) {
        TagEntity tagEntity = tagRepository.findByTagDefinitionIdAndValue(tagDefinitionId, value);
        if (tagEntity == null) {
            throw new TagNotFound(tagDefinitionId, value);
        }
        return tagEntity;
    }

    @Override
    public Tag createTag(Tag tag) {
        TagEntity existed = tagRepository.findByTagDefinitionIdAndValue(tag.getTagDefinitionId(), tag.getValue());
        if (existed != null) {
            return existed;
        }
        TagDefinition definition = getTagDefinition(tag.getTagDefinitionId());
        if (definition != null && definition.getFields() != null) {
            for (Field field : definition.getFields()) {
                if (field.getType().equals(Field.FieldType.UNIQUE)) {
                    TagEntity current = tagRepository.findByTagDefinitionIdAndUniqueField(tag.getTagDefinitionId(), field.getName(), String.valueOf(tag.getFields().get(field.getName())), null);
                    if (current != null) {
                        throw new DuplicatedUniqueField();
                    }
                }
            }
        }
        TagEntity entity = new TagEntity(tag);
        entity = tagRepository.save(entity);
        eventPublisher.publishEvent("updateTag|" + entity.getId());
        return entity;
    }

    @Override
    public Tag updateTag(Tag tag) {
        TagDefinition definition = getTagDefinition(tag.getTagDefinitionId());
        if (definition != null && definition.getFields() != null) {
            for (Field field : definition.getFields()) {
                if (field.getType().equals(Field.FieldType.UNIQUE)) {
                    Tag existed = tagRepository.findByTagDefinitionIdAndUniqueField(tag.getTagDefinitionId(), field.getName(), String.valueOf(tag.getFields().get(field.getName())), tag.getId());
                    if (existed != null) {
                        throw new DuplicatedUniqueField();
                    }
                }
            }
        }
        TagEntity entity = new TagEntity(tag);
        entity = tagRepository.save(entity);
        eventPublisher.publishEvent("updateTag|" + entity.getId());
        return entity;
    }

    @Override
    public Collection<? extends Tag> getTags(PageSize pageSize) {
        if (pageSize == null) {
            List<Tag> result = new ArrayList<>();
            Iterable<TagEntity> tags = tagRepository.findAll();
            for (TagEntity tag : tags) {
                result.add(tag);
            }
            return result;
        }
        Page<TagEntity> tags = tagRepository.findAll(
                PageRequest.of(pageSize.getPage(), pageSize.getSize(), Sort.by(Sort.Order.desc("updatedAt"))));
        return tags.toList();
    }

    @Override
    public Long getTagsCount() {
        return tagRepository.count();
    }

    @Override
    public Collection<? extends Tag> getTagsByDefinition(String tagDefinitionName, PageSize pageSize) {
        TagDefinitionEntity definition = tagDefinitionRepository.getByName(tagDefinitionName);
        if (definition != null) {
            return tagRepository.getAllTags(
                    definition.getId(), PageRequest.of(pageSize.getPage(), pageSize.getSize()));
        }
        return Collections.emptyList();
    }

    @Override
    public Collection<? extends Tag> getTagsByPrefix(String tagDefinitionId, String prefix, PageSize pageSize) {
        return tagRepository.getTagsByPrefix(tagDefinitionId, prefix, PageRequest.of(pageSize.getPage(), pageSize.getSize()));
    }

    @Override
    public Long getTagsByDefinitionCount(String tagDefinitionId) {
        return tagRepository.getAllTagsCount(tagDefinitionId);
    }

    @Override
    public Collection<? extends Tag> getTagsByEntityId(String entityId, PageSize pageSize) {
        Collection<TagBindingEntity> bindings = tagBindingRepository.getTagBindingsByEntityId(
                entityId, pageSize == null ? null : PageRequest.of(pageSize.getPage(), pageSize.getSize()));
        List<Tag> result = new ArrayList<>();
        for (TagBindingEntity binding : bindings) {
            try {
                result.add(new TagEntity(getTag(binding.getTagId())));
            } catch (Exception ignored) {
            }
        }
        return result;
    }

    @Override
    public Collection<? extends TagBinding> getTagBindingsByEntityId(String entityId, PageSize pageSize) {
        return tagBindingRepository.getTagBindingsByEntityId(
                entityId, pageSize == null ? null : PageRequest.of(pageSize.getPage(), pageSize.getSize()));
    }

    @Override
    public Collection<String> getEntitiesByTagIdAndEntityType(String tagId, String entityType, PageSize pageSize) {
        Collection<TagBindingEntity> bindings = tagBindingRepository.getTagBindingsByTagIdAndEntityType(
                tagId, entityType, PageRequest.of(pageSize.getPage(), pageSize.getSize()));
        List<String> result = new ArrayList<>();
        for (TagBindingEntity binding : bindings) {
            try {
                result.add(binding.getEntityId());
            } catch (Exception ignored) {
            }
        }
        return result;
    }

    @Override
    public void deleteTag(String id) {
        TagEntity tag = new TagEntity(getTag(id));
        Collection<TagBindingEntity> bindings = tagBindingRepository.getTagBindingsByTagId(tag.getId(), null);
        for (TagBindingEntity binding : bindings) {
            deleteTagBinding(binding.getId());
        }
        tagRepository.delete(tag);
        eventPublisher.publishEvent("deleteTag|" + id);
    }

    @Override
    public TagBinding getTagBinding(String id) {
        Optional<TagBindingEntity> tagBindingEntity = tagBindingRepository.findById(id);
        if (!tagBindingEntity.isPresent()) {
            throw new TagBindingNotFound(id);
        }
        return tagBindingEntity.get();
    }

    @Override
    public TagBinding createTagBinding(TagBinding tagBinding) {
//        TagBindingEntity exist = tagBindingRepository.getTagBindingsByEntityIdAndTagId(tagBinding.getEntityId(), tagBinding.getTagId());
//        if (exist != null) {
//            return exist;
//        }
        return tagBindingRepository.save(new TagBindingEntity(tagBinding));
    }

    @Override
    public void deleteTagBinding(String id) {
        TagBindingEntity tagBindingEntity = new TagBindingEntity(getTagBinding(id));
        tagBindingRepository.delete(tagBindingEntity);
    }

    @Override
    public void deleteTagBindingByEntityId(String entityId) {
        Collection<TagBindingEntity> bindings = tagBindingRepository.getTagBindingsByEntityId(entityId, null);
        for (TagBindingEntity binding : bindings) {
            deleteTagBinding(binding.getId());
        }

    }

    @Override
    public void deleteTagBindingByEntityIdAndTagId(String entityId, String tagId) {
        TagBindingEntity binding = tagBindingRepository.getTagBindingsByEntityIdAndTagId(entityId, tagId);
        if (binding == null) {
            throw new NotFound();
        }
        tagBindingRepository.delete(binding);
    }

    @Override
    public TagBinding getTagBindingByEntityIdAndTagId(String entityId, String tagId) {
        return tagBindingRepository.getTagBindingsByEntityIdAndTagId(entityId, tagId);
    }
}

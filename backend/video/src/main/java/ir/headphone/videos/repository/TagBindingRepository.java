package ir.headphone.videos.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.videos.model.entity.TagBindingEntity;
import org.springframework.data.domain.PageRequest;

import java.util.Collection;

public interface TagBindingRepository extends Repository<TagBindingEntity> {
    Collection<TagBindingEntity> getTagBindingsByEntityId(String entityId, PageRequest pageRequest);

    TagBindingEntity getTagBindingsByEntityIdAndTagId(String entityId, String tagId);

    Collection<TagBindingEntity> getTagBindingsByTagId(String tagId, PageRequest pageRequest);

    Collection<TagBindingEntity> getTagBindingsByTagIdAndEntityType(String tagId, String type, PageRequest pageRequest);
}

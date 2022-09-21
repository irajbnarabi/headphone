package ir.headphone.videos.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.videos.model.entity.TagDefinitionEntity;

public interface TagDefinitionRepository extends Repository<TagDefinitionEntity> {
    TagDefinitionEntity getByName(String name);
}

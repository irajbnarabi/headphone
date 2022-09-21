package ir.headphone.videos.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.videos.model.entity.TagEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.Collection;

@NoRepositoryBean
public interface TagRepository extends Repository<TagEntity> {
    Collection<TagEntity> getAllTags(String tagDefinitionId, PageRequest pageRequest);

    Collection<TagEntity> getTagsByPrefix(String tagDefinitionId, String prefix, PageRequest pageRequest);

    Long getAllTagsCount(String tagDefinitionId);

    TagEntity findByTagDefinitionIdAndValue(String tagDefinitionId, String value);

    TagEntity findByTagDefinitionIdAndUniqueField(String tagDefinitionId, String uniqueFileName, String uniqueFileValue, String tagId);
}

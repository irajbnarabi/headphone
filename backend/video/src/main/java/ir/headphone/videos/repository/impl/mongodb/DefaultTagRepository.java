package ir.headphone.videos.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.videos.model.entity.QTagEntity;
import ir.headphone.videos.model.entity.TagEntity;
import ir.headphone.videos.repository.TagRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.repository.support.SpringDataMongodbQuery;

import java.util.Collection;

public class DefaultTagRepository extends AbstractMongodbRepository<TagEntity> implements TagRepository {
    private final QTagEntity q = QTagEntity.tagEntity;

    public DefaultTagRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, TagEntity.class);
    }

    @Override
    protected int getIdLength() {
        return 5;
    }

    @Override
    public Collection<TagEntity> getAllTags(String tagDefinitionId, PageRequest pageRequest) {
        return dsl(pageRequest)
                .where(q.tagDefinitionId.eq(tagDefinitionId))
                .orderBy(q.updatedAt.desc())
                .fetch();
    }

    @Override
    public Collection<TagEntity> getTagsByPrefix(String tagDefinitionId, String prefix, PageRequest pageRequest) {
        SpringDataMongodbQuery<TagEntity> query = dsl(pageRequest);
        if (tagDefinitionId != null) {
            query.where(q.tagDefinitionId.eq(tagDefinitionId));
        }
        return query
                .where(q.value.startsWithIgnoreCase(prefix))
                .orderBy(q.updatedAt.desc())
                .fetch();
    }

    @Override
    public Long getAllTagsCount(String tagDefinitionId) {
        return dsl()
                .where(q.tagDefinitionId.eq(tagDefinitionId))
                .fetchCount();
    }

    @Override
    public TagEntity findByTagDefinitionIdAndValue(String tagDefinitionId, String value) {
        return dsl()
                .where(q.tagDefinitionId.eq(tagDefinitionId), q.value.eq(value))
                .fetchOne();
    }

    @Override
    public TagEntity findByTagDefinitionIdAndUniqueField(String tagDefinitionId, String uniqueFileName, String uniqueFileValue, String tagId) {
        SpringDataMongodbQuery<TagEntity> query = dsl();
        if (tagId != null) {
            query.where(q.id.ne(tagId));
        }
        return query
                .where(q.tagDefinitionId.eq(tagDefinitionId), q.fields.contains(uniqueFileName, uniqueFileValue))
                .fetchFirst();
    }
}

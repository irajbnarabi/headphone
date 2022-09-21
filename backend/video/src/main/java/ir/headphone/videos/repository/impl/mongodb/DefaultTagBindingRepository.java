package ir.headphone.videos.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.videos.model.entity.QTagBindingEntity;
import ir.headphone.videos.model.entity.TagBindingEntity;
import ir.headphone.videos.repository.TagBindingRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.MongoDatabaseFactory;

import java.util.Collection;

public class DefaultTagBindingRepository extends AbstractMongodbRepository<TagBindingEntity> implements TagBindingRepository {
    private static final QTagBindingEntity q = QTagBindingEntity.tagBindingEntity;

    public DefaultTagBindingRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, TagBindingEntity.class);
    }

    @Override
    public Collection<TagBindingEntity> getTagBindingsByEntityId(String entityId, PageRequest pageRequest) {
        return dsl(pageRequest)
                .where(q.entityId.eq(entityId))
                .orderBy(q.updatedAt.desc())
                .fetch();
    }

    @Override
    public TagBindingEntity getTagBindingsByEntityIdAndTagId(String entityId, String tagId) {
        return dsl()
                .where(q.entityId.eq(entityId), q.tagId.eq(tagId))
                .fetchOne();
    }

    @Override
    public Collection<TagBindingEntity> getTagBindingsByTagId(String tagId, PageRequest pageRequest) {
        return dsl(pageRequest)
                .where(q.tagId.eq(tagId))
                .orderBy(q.updatedAt.desc())
                .fetch();
    }

    @Override
    public Collection<TagBindingEntity> getTagBindingsByTagIdAndEntityType(String tagId, String entityType, PageRequest pageRequest) {
        return dsl(pageRequest)
                .where(q.tagId.eq(tagId), q.entityType.eq(entityType))
                .orderBy(q.updatedAt.desc())
                .fetch();
    }
}

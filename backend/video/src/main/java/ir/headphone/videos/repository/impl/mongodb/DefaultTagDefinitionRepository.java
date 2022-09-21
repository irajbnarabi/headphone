package ir.headphone.videos.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.videos.model.entity.QTagDefinitionEntity;
import ir.headphone.videos.model.entity.TagDefinitionEntity;
import ir.headphone.videos.repository.TagDefinitionRepository;
import org.springframework.data.mongodb.MongoDatabaseFactory;

public class DefaultTagDefinitionRepository extends AbstractMongodbRepository<TagDefinitionEntity> implements TagDefinitionRepository {
    private final QTagDefinitionEntity q = QTagDefinitionEntity.tagDefinitionEntity;

    public DefaultTagDefinitionRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, TagDefinitionEntity.class);
    }

    @Override
    public TagDefinitionEntity getByName(String name) {
        return dsl()
                .where(q.name.eq(name))
                .fetchOne();
    }
}

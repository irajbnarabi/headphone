package ir.headphone.kvstore.repository.impl;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.kvstore.model.entity.KeyValueEntity;
import ir.headphone.kvstore.model.entity.QKeyValueEntity;
import ir.headphone.kvstore.repository.KeyValueRepository;
import org.springframework.data.mongodb.MongoDatabaseFactory;

public class DefaultKeyValueRepository extends AbstractMongodbRepository<KeyValueEntity> implements KeyValueRepository {
    private static final QKeyValueEntity q = QKeyValueEntity.keyValueEntity;

    public DefaultKeyValueRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, KeyValueEntity.class);
    }

    @Override
    public KeyValueEntity getByKey(String key) {
        return dsl().where(q.key.eq(key)).fetchOne();
    }

    @Override
    protected int getIdLength() {
        return 10;
    }

}

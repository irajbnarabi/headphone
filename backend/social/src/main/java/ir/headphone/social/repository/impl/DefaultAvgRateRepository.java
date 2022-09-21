package ir.headphone.social.repository.impl;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.social.model.entity.AvgRateEntity;
import ir.headphone.social.model.entity.QAvgRateEntity;
import ir.headphone.social.repository.AvgRateRepository;
import org.springframework.data.mongodb.MongoDatabaseFactory;

public class DefaultAvgRateRepository extends AbstractMongodbRepository<AvgRateEntity> implements AvgRateRepository {
    private static final QAvgRateEntity q = QAvgRateEntity.avgRateEntity;

    public DefaultAvgRateRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, AvgRateEntity.class);
    }

    @Override
    protected int getIdLength() {
        return 10;
    }


    public AvgRateEntity getAvgRateByEntityId(String entityId) {
        return dsl()
                .where(q.entityId.eq(entityId))
                .fetchOne();
    }
}

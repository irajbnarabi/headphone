package ir.headphone.social.repository.impl;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.social.model.entity.QRateEntity;
import ir.headphone.social.model.entity.RateEntity;
import ir.headphone.social.repository.RateRepository;
import org.springframework.data.mongodb.MongoDatabaseFactory;

public class DefaultRateRepository extends AbstractMongodbRepository<RateEntity> implements RateRepository {
    private static final QRateEntity q = QRateEntity.rateEntity;

    public DefaultRateRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, RateEntity.class);
    }

    @Override
    protected int getIdLength() {
        return 10;
    }


    @Override
    public Long countByEntityId(String entityId) {
        return dsl()
                .where(q.entityId.eq(entityId))
                .fetchCount();
    }

    @Override
    public RateEntity getByUserIdAndEntityId(String userId, String entityId) {
        return dsl()
                .where(q.userId.eq(userId), q.entityId.eq(entityId))
                .fetchOne();
    }
}

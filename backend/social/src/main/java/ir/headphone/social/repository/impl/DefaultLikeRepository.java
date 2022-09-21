package ir.headphone.social.repository.impl;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.social.model.entity.LikeEntity;
import ir.headphone.social.model.entity.QLikeEntity;
import ir.headphone.social.repository.LikeRepository;
import org.springframework.data.mongodb.MongoDatabaseFactory;

public class DefaultLikeRepository extends AbstractMongodbRepository<LikeEntity> implements LikeRepository {
    private static final QLikeEntity q = QLikeEntity.likeEntity;

    public DefaultLikeRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, LikeEntity.class);
    }

    @Override
    protected int getIdLength() {
        return 10;
    }

    @Override
    public Long countByEntityIdAndDislike(String entityId, Boolean dislike) {
        return dsl()
                .where(q.entityId.eq(entityId), q.dislike.eq(dislike))
                .fetchCount();
    }

    @Override
    public LikeEntity getByUserIdAndEntityId(String userId, String entityId) {
        return dsl()
                .where(q.userId.eq(userId), q.entityId.eq(entityId))
                .fetchOne();
    }
}

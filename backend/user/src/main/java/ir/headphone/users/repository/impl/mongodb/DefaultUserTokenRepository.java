package ir.headphone.users.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.users.model.entity.QUserTokenEntity;
import ir.headphone.users.model.entity.UserTokenEntity;
import ir.headphone.users.repository.UserTokenRepository;
import org.springframework.data.mongodb.MongoDatabaseFactory;

import java.util.Collection;

public class DefaultUserTokenRepository extends AbstractMongodbRepository<UserTokenEntity> implements UserTokenRepository {
    private static final QUserTokenEntity q = QUserTokenEntity.userTokenEntity;

    public DefaultUserTokenRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, UserTokenEntity.class);
    }

    @Override
    public Collection<UserTokenEntity> findAllByUserIdOrderByUtilizedAtDesc(String userId) {
        return dsl()
                .where(q.userId.eq(userId))
                .orderBy(q.utilizedAt.desc())
                .fetch();
    }
}

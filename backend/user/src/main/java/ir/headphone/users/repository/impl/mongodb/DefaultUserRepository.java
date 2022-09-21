package ir.headphone.users.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.users.model.entity.QUserEntity;
import ir.headphone.users.model.entity.UserEntity;
import ir.headphone.users.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.MongoDatabaseFactory;

import java.util.List;

public class DefaultUserRepository extends AbstractMongodbRepository<UserEntity> implements UserRepository {
    private static final QUserEntity q = QUserEntity.userEntity;

    public DefaultUserRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, UserEntity.class);
    }

    @Override
    protected int getIdLength() {
        return 6;
    }

    @Override
    public UserEntity findByEmail(String email) {
        return dsl()
                .where(q.email.eq(email))
                .fetchOne();
    }

    @Override
    public List<UserEntity> findByEmailLike(String email, PageRequest pageRequest) {
        return dsl(pageRequest)
                .where(q.email.containsIgnoreCase(email))
                .fetch();
    }

    @Override
    public UserEntity findByMobile(String mobile) {
        return dsl()
                .where(q.mobile.eq(mobile))
                .fetchOne();
    }

    @Override
    public List<UserEntity> findByMobileLike(String mobile, PageRequest pageRequest) {
        return dsl(pageRequest)
                .where(q.mobile.containsIgnoreCase(mobile))
                .fetch();
    }
}

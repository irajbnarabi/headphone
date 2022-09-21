package ir.headphone.users.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.users.model.entity.CredentialEntity;
import ir.headphone.users.model.entity.QCredentialEntity;
import ir.headphone.users.repository.CredentialRepository;
import org.springframework.data.mongodb.MongoDatabaseFactory;

public class DefaultCredentialRepository extends AbstractMongodbRepository<CredentialEntity> implements CredentialRepository {
    private static final QCredentialEntity q = QCredentialEntity.credentialEntity;

    public DefaultCredentialRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, CredentialEntity.class);
    }

    @Override
    public CredentialEntity findByUserId(String userId) {
        return dsl()
                .where(q.userId.eq(userId))
                .fetchOne();
    }
}

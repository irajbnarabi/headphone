package ir.headphone.users.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.users.model.entity.QWalletEntity;
import ir.headphone.users.model.entity.WalletEntity;
import ir.headphone.users.repository.WalletRepository;
import org.springframework.data.mongodb.MongoDatabaseFactory;

public class DefaultWalletRepository extends AbstractMongodbRepository<WalletEntity> implements WalletRepository {
    private final QWalletEntity q = QWalletEntity.walletEntity;

    public DefaultWalletRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, WalletEntity.class);
    }

    @Override
    public WalletEntity findByUserId(String userId) {
        return dsl()
                .where(q.userId.eq(userId))
                .fetchOne();
    }
}

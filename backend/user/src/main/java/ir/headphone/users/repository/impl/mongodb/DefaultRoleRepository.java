package ir.headphone.users.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.users.model.entity.QRoleEntity;
import ir.headphone.users.model.entity.RoleEntity;
import ir.headphone.users.repository.RoleRepository;
import org.springframework.data.mongodb.MongoDatabaseFactory;

public class DefaultRoleRepository extends AbstractMongodbRepository<RoleEntity> implements RoleRepository {
    private final QRoleEntity q = QRoleEntity.roleEntity;

    public DefaultRoleRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, RoleEntity.class);
    }

    @Override
    protected int getIdLength() {
        return 4;
    }

    @Override
    public RoleEntity findByName(String name) {
        return dsl()
                .where(q.name.eq(name))
                .fetchOne();
    }
}

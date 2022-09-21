package ir.headphone.users.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.users.model.entity.RuleEntity;
import ir.headphone.users.repository.RuleRepository;
import org.springframework.data.mongodb.MongoDatabaseFactory;

public class DefaultRuleRepository extends AbstractMongodbRepository<RuleEntity> implements RuleRepository {

    public DefaultRuleRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, RuleEntity.class);
    }

    @Override
    protected int getIdLength() {
        return 4;
    }

}

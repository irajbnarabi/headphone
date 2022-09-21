package ir.headphone.users.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.spi.user.model.SubscriptionPlan;
import ir.headphone.users.model.entity.QSubscriptionPlanEntity;
import ir.headphone.users.model.entity.SubscriptionPlanEntity;
import ir.headphone.users.repository.SubscriptionPlanRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.repository.support.SpringDataMongodbQuery;

import java.util.List;

public class DefaultSubscriptionPlanRepository extends AbstractMongodbRepository<SubscriptionPlanEntity> implements SubscriptionPlanRepository {
    private static final QSubscriptionPlanEntity q = QSubscriptionPlanEntity.subscriptionPlanEntity;

    public DefaultSubscriptionPlanRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, SubscriptionPlanEntity.class);
    }

    @Override
    protected int getIdLength() {
        return 4;
    }

    @Override
    public List<SubscriptionPlanEntity> getAvailablePlans(String type, PageRequest pageRequest) {
        SpringDataMongodbQuery<SubscriptionPlanEntity> query = dsl(pageRequest)
                .where(q.enabled.eq(true));
        if (StringUtils.isNotBlank(type)) {
            query.where(q.type.eq(SubscriptionPlan.SubscriptionType.valueOf(type.toUpperCase())));
        }
        return query.fetch();
    }

    @Override
    public List<SubscriptionPlanEntity> getAllPlans(String type, String prefix, PageRequest pageRequest) {
        SpringDataMongodbQuery<SubscriptionPlanEntity> query = dsl(pageRequest);
        if (StringUtils.isNotBlank(type)) {
            query.where(q.type.eq(SubscriptionPlan.SubscriptionType.valueOf(type.toUpperCase())));
        }
        if (StringUtils.isNotBlank(prefix)) {
            query.where(q.name.startsWithIgnoreCase(prefix));
        }
        return query.fetch();
    }
}

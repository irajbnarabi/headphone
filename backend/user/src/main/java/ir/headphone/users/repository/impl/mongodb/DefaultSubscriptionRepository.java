package ir.headphone.users.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.spi.user.model.SubscriptionPlan;
import ir.headphone.users.model.entity.QSubscriptionEntity;
import ir.headphone.users.model.entity.SubscriptionEntity;
import ir.headphone.users.repository.SubscriptionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.repository.support.SpringDataMongodbQuery;

import java.util.List;

public class DefaultSubscriptionRepository extends AbstractMongodbRepository<SubscriptionEntity> implements SubscriptionRepository {
    private static final QSubscriptionEntity q = QSubscriptionEntity.subscriptionEntity;

    public DefaultSubscriptionRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, SubscriptionEntity.class);
    }

    @Override
    protected int getIdLength() {
        return 6;
    }

    @Override
    public List<SubscriptionEntity> getUserSubscriptions(String userId, PageRequest pageRequest) {
        return dsl(pageRequest)
                .where(q.userId.eq(userId))
                .orderBy(q.updatedAt.desc())
                .fetch();
    }

    @Override
    public List<SubscriptionEntity> getUserSubscriptions(String userId, String planId, String programId) {
        return dsl()
                .where(q.userId.eq(userId), q.planId.eq(planId), q.programId.eq(programId), q.confirmed.eq(true))
                .fetch();
    }

    @Override
    public List<SubscriptionEntity> getUserSubscriptions(String userId, SubscriptionPlan.SubscriptionType type, PageRequest pageRequest) {
        return dsl(pageRequest)
                .where(q.userId.eq(userId), q.type.eq(type), q.confirmed.eq(true))
                .orderBy(q.paidDate.asc())
                .fetch();
    }

    @Override
    public SubscriptionEntity findByDiscount(String discountVoucher) {
        return dsl()
                .where(q.discountVoucher.eq(discountVoucher), q.confirmed.eq(true))
                .fetchOne();
    }

    @Override
    public SubscriptionEntity findByDiscountAndUserId(String discountVoucher, String userId) {
        return dsl()
                .where(q.discountVoucher.eq(discountVoucher), q.userId.eq(userId), q.confirmed.eq(true))
                .fetchOne();

    }

    @Override
    public List<SubscriptionEntity> getSubscriptionEntities(Long from, Long to, SubscriptionPlan.SubscriptionType type,
                                                            PageRequest pageRequest) {
        SpringDataMongodbQuery<SubscriptionEntity> query = dsl(pageRequest)
                .where(q.confirmed.eq(true), q.paidDate.goe(from), q.paidDate.loe(to));
        if (type != null) {
            query.where(q.type.eq(type));
        }
        return query.fetch();

    }
}

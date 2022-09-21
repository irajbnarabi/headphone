package ir.headphone.users.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.spi.user.model.SubscriptionPlan;
import ir.headphone.users.model.entity.SubscriptionEntity;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface SubscriptionRepository extends Repository<SubscriptionEntity> {
    List<SubscriptionEntity> getUserSubscriptions(String userId, PageRequest pageRequest);

    List<SubscriptionEntity> getUserSubscriptions(String userId, String planId, String programId);

    List<SubscriptionEntity> getUserSubscriptions(String userId, SubscriptionPlan.SubscriptionType type, PageRequest pageRequest);

    SubscriptionEntity findByDiscount(String discountVoucher);

    SubscriptionEntity findByDiscountAndUserId(String discountVoucher, String userId);

    List<SubscriptionEntity> getSubscriptionEntities(Long from, Long to, SubscriptionPlan.SubscriptionType type, PageRequest pageRequest);
}

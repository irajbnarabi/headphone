package ir.headphone.users.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.users.model.entity.SubscriptionPlanEntity;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface SubscriptionPlanRepository extends Repository<SubscriptionPlanEntity> {
    List<SubscriptionPlanEntity> getAvailablePlans(String type, PageRequest pageRequest);

    List<SubscriptionPlanEntity> getAllPlans(String type, String prefix, PageRequest pageRequest);
}

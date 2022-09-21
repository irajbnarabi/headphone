package ir.headphone.spi.user.service;

import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.user.model.CalculatedPrice;
import ir.headphone.spi.user.model.Subscription;
import ir.headphone.spi.user.model.SubscriptionPlan;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Map;

public interface SubscriptionService {
    Subscription subscribe(String userId, String subscriptionPlanId, String discountVoucher, String programId);

    CalculatedPrice calculatePrice(String planId, String userId, String discountVoucher);

    Subscription approveSubscription(String subId, BigDecimal paidAmount);

    SubscriptionPlan getSubscriptionPlan(String id);

    Subscription getSubscription(String userId, String planId, String programId);

    Long getRemainedSubscriptionDays(String userId);

    Subscription getSubscription(String id);

    SubscriptionPlan createPlan(SubscriptionPlan plan);

    void deletePlan(String planId);

    Collection<? extends SubscriptionPlan> getAvailablePlans(String type, PageSize pageSize);

    Collection<? extends SubscriptionPlan> getAllPlans(String type, String prefix, PageSize pageSize);

    Collection<? extends Subscription> getUserSubscriptions(String userId, PageSize pageSize);

    Map<String, Integer> getHotPlans(Long from, Long to, SubscriptionPlan.SubscriptionType type);

    Map<String, Integer> getHotDiscounts(Long from, Long to);

    void registrationReminder();
}

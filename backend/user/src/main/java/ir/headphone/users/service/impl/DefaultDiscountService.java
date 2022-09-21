package ir.headphone.users.service.impl;

import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.user.model.Discount;
import ir.headphone.spi.user.service.DiscountService;
import ir.headphone.users.error.DiscountAlreadyUsed;
import ir.headphone.users.error.DiscountIsExpired;
import ir.headphone.users.error.DiscountIsNotForPlan;
import ir.headphone.users.error.DiscountNotFound;
import ir.headphone.users.error.InvalidInput;
import ir.headphone.users.model.entity.DiscountEntity;
import ir.headphone.users.model.entity.SubscriptionEntity;
import ir.headphone.users.repository.DiscountRepository;
import ir.headphone.users.repository.SubscriptionRepository;
import org.springframework.data.domain.PageRequest;

import java.util.Collection;
import java.util.Optional;

public class DefaultDiscountService implements DiscountService {
    private final DiscountRepository discountRepository;
    private final SubscriptionRepository subscriptionRepository;

    public DefaultDiscountService(DiscountRepository discountRepository,
                                  SubscriptionRepository subscriptionRepository) {
        this.discountRepository = discountRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @Override
    public Discount get(String id) {
        Optional<DiscountEntity> discount = discountRepository.findById(id);
        if (!discount.isPresent()) {
            throw new DiscountNotFound(id);
        }
        return discount.get();
    }

    @Override
    public Discount create(Discount discount) {
        if (discount.getDiscountPercent() > 100 || discount.getDiscountPercent() < 1) {
            throw new InvalidInput();
        }
        if (discount.getUsageType() == null || discount.getDiscountType() == null) {
            throw new InvalidInput();
        }
        return discountRepository.save(new DiscountEntity(discount));
    }

    @Override
    public void delete(String id) {
        discountRepository.deleteById(id);
    }

    @Override
    public Discount verify(String voucher, String planId, String userId) {
        Discount discount = discountRepository.findByVoucher(voucher);
        if (discount == null) {
            throw new DiscountNotFound(voucher);
        }
        if (discount.getDiscountType().equals(Discount.DiscountType.ONE_TIME)) {
            SubscriptionEntity used = subscriptionRepository.findByDiscount(voucher);
            if (used != null) {
                throw new DiscountAlreadyUsed(voucher);
            }
        }
        if (discount.getUsageType().equals(Discount.UsageType.ONCE_PER_USER)) {
            SubscriptionEntity used = subscriptionRepository.findByDiscountAndUserId(voucher, userId);
            if (used != null) {
                throw new DiscountAlreadyUsed(voucher);
            }
        }
        if (discount.getValidUntil() != null && discount.getValidUntil() < System.currentTimeMillis()) {
            throw new DiscountIsExpired(voucher);
        }
        if (discount.getTargetPlans() != null) {
            if (!discount.getTargetPlans().contains(planId)) {
                throw new DiscountIsNotForPlan(voucher, planId);
            }
        }
        return discount;
    }

    @Override
    public Collection<? extends Discount> getDiscounts(String voucher, PageSize pageSize) {
        return discountRepository.findAll(PageRequest.of(pageSize.getPage(), pageSize.getSize())).toList();
    }
}

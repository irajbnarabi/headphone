package ir.headphone.users.service.impl;

import ir.headphone.messaging.MailService;
import ir.headphone.messaging.SmsService;
import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.user.model.Discount;
import ir.headphone.spi.user.model.Subscription;
import ir.headphone.spi.user.model.SubscriptionPlan;
import ir.headphone.spi.user.model.User;
import ir.headphone.spi.user.service.AdminService;
import ir.headphone.spi.user.service.DiscountService;
import ir.headphone.spi.user.service.SubscriptionService;
import ir.headphone.spi.user.service.UserService;
import ir.headphone.users.error.SubscriptionNotFound;
import ir.headphone.users.error.SubscriptionPlanNotFound;
import ir.headphone.users.error.UserAlreadySubscribed;
import ir.headphone.users.model.CalculatedPriceDto;
import ir.headphone.users.model.entity.SubscriptionEntity;
import ir.headphone.users.model.entity.SubscriptionPlanEntity;
import ir.headphone.users.repository.DiscountRepository;
import ir.headphone.users.repository.SubscriptionPlanRepository;
import ir.headphone.users.repository.SubscriptionRepository;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class DefaultSubscriptionService implements SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final DiscountRepository discountRepository;
    private final DiscountService discountService;
    private final UserService userService;
    private final AdminService adminService;
    private final SmsService smsService;
    private final MailService mailService;

    public DefaultSubscriptionService(SubscriptionRepository subscriptionRepository,
                                      SubscriptionPlanRepository subscriptionPlanRepository,
                                      DiscountRepository discountRepository, DiscountService discountService,
                                      UserService userService, AdminService adminService,
                                      SmsService smsService, MailService mailService) {
        this.subscriptionRepository = subscriptionRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.discountRepository = discountRepository;
        this.discountService = discountService;
        this.userService = userService;
        this.adminService = adminService;
        this.smsService = smsService;
        this.mailService = mailService;
    }

    @Override
    public CalculatedPriceDto calculatePrice(String planId, String userId, String discountVoucher) {
        SubscriptionPlan plan = getSubscriptionPlan(planId);
        CalculatedPriceDto dto = new CalculatedPriceDto();
        dto.setPrice(plan.getPrice().longValue());
        dto.setToPay(dto.getPrice());
        try {
            if (StringUtils.isNotBlank(discountVoucher)) {
                Discount discountDto = discountService.verify(discountVoucher, plan.getId(), userId);
                dto.setDiscountPercent(discountDto.getDiscountPercent());
                dto.setDiscountType(discountDto.getDiscountType());
                if (discountDto.getMaximum() != null) {
                    dto.setDiscount(Math.min(discountDto.getMaximum().longValue(), (plan.getPrice().longValue() - (plan.getPrice().longValue() * discountDto.getDiscountPercent() / 100))));
                    dto.setMaximumDiscount(discountDto.getMaximum().longValue());
                } else {
                    dto.setDiscount(plan.getPrice().longValue() - (plan.getPrice().longValue() * discountDto.getDiscountPercent() / 100));
                }
                dto.setToPay(dto.getToPay() - dto.getDiscount());
            } else {
                dto.setDiscount(0L);
                dto.setDiscountPercent(0);
            }
        } catch (Exception ignored) {
            dto.setDiscount(0L);
            dto.setDiscountPercent(0);
        }

        dto.setVat((long) (plan.getVat() * Math.max(0, (plan.getPrice().longValue() - dto.getDiscount())) / 100));
        dto.setVatPercent(plan.getVat());

        if (dto.getVat() == null) {
            dto.setVat(0L);
        }
        dto.setToPay(dto.getPrice() + dto.getVat() - dto.getDiscount());
        dto.setDuration(plan.getDuration());
        dto.setTimeUnit(plan.getTimeUnit());
        return dto;
    }

    @Override
    public Subscription subscribe(String userId, String subscriptionPlanId, String discountVoucher, String programId) {
        Optional<SubscriptionPlanEntity> optionalPlan = subscriptionPlanRepository.findById(subscriptionPlanId);
        if (!optionalPlan.isPresent()) {
            throw new SubscriptionPlanNotFound(subscriptionPlanId);
        }
        SubscriptionPlanEntity plan = optionalPlan.get();
        if (plan.getType().equals(SubscriptionPlan.SubscriptionType.TICKET)
                && getSubscription(userId, plan.getId(), programId) != null) {
            throw new UserAlreadySubscribed();
        }

        CalculatedPriceDto calculatedPriceDto = calculatePrice(plan.getId(), userId, discountVoucher);

        SubscriptionEntity entity = SubscriptionEntity.builder()
                .name(plan.getName())
                .userId(userId)
                .duration(plan.getDuration())
                .confirmed(false)
                .type(plan.getType())
                .planId(plan.getId())
                .programId(programId)
                .planName(plan.getName())
                .timeUnit(plan.getTimeUnit())
                .price(BigDecimal.valueOf(calculatedPriceDto.getPrice()))
                .paidAmount(BigDecimal.valueOf(calculatedPriceDto.getToPay()))
                .discountVoucher(discountVoucher)
                .discount(BigDecimal.valueOf(calculatedPriceDto.getDiscount()))
                .vatPercent(calculatedPriceDto.getVatPercent())
                .vat(BigDecimal.valueOf(calculatedPriceDto.getVat()))
                .build();
        return subscriptionRepository.save(entity);
    }

    @Override
    public Subscription approveSubscription(String subId, BigDecimal paidAmount) {
        Optional<SubscriptionEntity> sub = subscriptionRepository.findById(subId);
        if (!sub.isPresent()) {
            throw new SubscriptionNotFound(subId);
        }
        SubscriptionEntity subscription = sub.get();
        subscription.setConfirmed(true);
        subscription.setPaidDate(System.currentTimeMillis());
        subscription.setPaidAmount(subscription.getPaidAmount());
        return subscriptionRepository.save(subscription);
    }

    @Override
    public SubscriptionPlan getSubscriptionPlan(String id) {
        Optional<SubscriptionPlanEntity> plan = subscriptionPlanRepository.findById(id);
        if (!plan.isPresent()) {
            throw new SubscriptionPlanNotFound(id);
        }
        return plan.get();
    }

    @Override
    public Subscription getSubscription(String userId, String planId, String programId) {
        List<SubscriptionEntity> subscriptions = subscriptionRepository.getUserSubscriptions(userId, planId, programId);
        if (subscriptions.size() == 0) {
            return null;
        }
        SubscriptionPlan plan = getSubscriptionPlan(planId);
        for (SubscriptionEntity subscription : subscriptions) {
            if (plan.getDuration() == null) {
                break;
            }
            int timeScale = 24;
            if (subscription.getTimeUnit() != null && subscription.getTimeUnit().equals(SubscriptionPlan.SubscriptionTimeUnit.HOUR)) {
                timeScale = 1;
            }
            if (DateUtils.addHours(new Date(subscription.getPaidDate()), plan.getDuration() * timeScale)
                    .after(new Date(System.currentTimeMillis()))) {
                return subscription;
            }
        }
        return null;
    }

    @Override
    public Long getRemainedSubscriptionDays(String userId) {
        List<SubscriptionEntity> subscriptions = subscriptionRepository.getUserSubscriptions(userId, SubscriptionPlan.SubscriptionType.SUBSCRIPTION, null);
        if (subscriptions.size() == 0) {
            return 0L;
        }
        Date date = new Date(subscriptions.get(0).getPaidDate());
        for (SubscriptionEntity subscription : subscriptions) {
            if (subscription.getDuration() == null || subscription.getPaidDate() == null) {
                continue;
            }
            int timeScale = 24;
            if (subscription.getTimeUnit() != null && subscription.getTimeUnit().equals(SubscriptionPlan.SubscriptionTimeUnit.HOUR)) {
                timeScale = 1;
            }
            if (date.after(new Date(subscription.getPaidDate()))) {
                date = DateUtils.addHours(date, subscription.getDuration() * timeScale);
            } else {
                date = DateUtils.addHours(new Date(subscription.getPaidDate()), subscription.getDuration() * timeScale);
            }
        }
        if (date.getTime() < System.currentTimeMillis()) {
            return 0L;
        }
        long l = (date.getTime() - System.currentTimeMillis()) / (1000 * 3600 * 24);
        return l + 1;
    }

    @Override
    public Subscription getSubscription(String id) {
        Optional<SubscriptionEntity> plan = subscriptionRepository.findById(id);
        if (!plan.isPresent()) {
            throw new SubscriptionNotFound(id);
        }
        return plan.get();
    }

    @Override
    public Collection<? extends SubscriptionPlan> getAvailablePlans(String type, PageSize pageSize) {
        return subscriptionPlanRepository.getAvailablePlans(type, PageRequest.of(pageSize.getPage(), pageSize.getSize()));
    }

    @Override
    public Collection<? extends SubscriptionPlan> getAllPlans(String type, String prefix, PageSize pageSize) {
        return subscriptionPlanRepository.getAllPlans(type, prefix, PageRequest.of(pageSize.getPage(), pageSize.getSize()));
    }

    @Override
    public Collection<? extends Subscription> getUserSubscriptions(String userId, PageSize pageSize) {
        return subscriptionRepository.getUserSubscriptions(userId, PageRequest.of(pageSize.getPage(), pageSize.getSize()));
    }

    @Override
    public SubscriptionPlan createPlan(SubscriptionPlan plan) {
        return subscriptionPlanRepository.save(new SubscriptionPlanEntity(plan));
    }

    @Override
    public void deletePlan(String planId) {
        subscriptionPlanRepository.deleteById(planId);
    }

    @Override
    public Map<String, Integer> getHotPlans(Long from, Long to, SubscriptionPlan.SubscriptionType type) {
        int page = 0, size = 1000;
        List<SubscriptionEntity> entities = subscriptionRepository.getSubscriptionEntities(from, to, type, PageRequest.of(page++, size));
        Map<String, Integer> plansCount = new HashMap<>();
        while (entities.size() > 0) {
            for (SubscriptionEntity entity : entities) {
                String mapKey = entity.getPlanId();
                if (mapKey == null) {
                    continue;
                }
                if (plansCount.containsKey(mapKey)) {
                    plansCount.put(mapKey, plansCount.get(mapKey) + 1);
                } else {
                    plansCount.put(mapKey, 1);
                }
            }
            entities = subscriptionRepository.getSubscriptionEntities(from, to, type, PageRequest.of(page++, size));
        }

        return plansCount;

    }

    @Override
    public Map<String, Integer> getHotDiscounts(Long from, Long to) {
        int page = 0, size = 1000;
        List<SubscriptionEntity> entities = subscriptionRepository.getSubscriptionEntities(from, to, null, PageRequest.of(page++, size));
        Map<String, Integer> plansCount = new HashMap<>();
        while (entities.size() > 0) {
            for (SubscriptionEntity entity : entities) {
                String mapKey = entity.getDiscountVoucher();
                if (mapKey == null) {
                    continue;
                }
                if (plansCount.containsKey(mapKey)) {
                    plansCount.put(mapKey, plansCount.get(mapKey) + 1);
                } else {
                    plansCount.put(mapKey, 1);
                }
            }
            entities = subscriptionRepository.getSubscriptionEntities(from, to, null, PageRequest.of(page++, size));
        }

        return plansCount;
    }


    @Override
    @Scheduled(cron = "0 0 12 * * *")
    public void registrationReminder() {
        int page = 0, size = 100;
        Collection<? extends User> users = adminService.getUsers(PageSize.of(page++, size));
        while (users.size() > 0) {
            List<String> bcc = new ArrayList<>();
            List<String> recipients = new ArrayList<>();
            for (User user : users) {
                Long remained = getRemainedSubscriptionDays(user.getId());
                if (remained == 3) {
                    if (StringUtils.isNotBlank(user.getMobile())) {
                        recipients.add(user.getMobile());
                    }
                    if (StringUtils.isNotBlank(user.getEmail())) {
                        bcc.add(user.getEmail());
                    }
                }
            }
            if (recipients.size() > 0) {
                smsService.send(recipients, "reminder-sms.ftl", Map.of());
            }
            if (bcc.size() > 0) {
                mailService.send("info@vod.ir", bcc, "Subscription Reminder",
                        "reminder-email.ftl", Map.of());
            }
            users = adminService.getUsers(PageSize.of(page++, size));
        }
    }
}

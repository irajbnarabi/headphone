package ir.headphone.rest.controller.subscription;

import ir.headphone.rest.controller.AbstractController;
import ir.headphone.rest.controller.user.dto.SubscriptionPlanDto;
import ir.headphone.spi.user.model.CalculatedPrice;
import ir.headphone.spi.user.model.SubscriptionPlan;
import ir.headphone.spi.user.service.DiscountService;
import ir.headphone.spi.user.service.SubscriptionService;
import ir.headphone.spi.user.service.UserService;
import ir.headphone.users.error.SubscriptionPlanNotFound;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class SubscriptionController extends AbstractController {
    private final SubscriptionService subscriptionService;
    private final UserService userService;
    private final DiscountService discountService;

    public SubscriptionController(SubscriptionService subscriptionService, UserService userService, DiscountService discountService) {
        this.subscriptionService = subscriptionService;
        this.userService = userService;
        this.discountService = discountService;
    }

    @GetMapping("/admin/subscriptions/plans")
    public List<SubscriptionPlanDto> getAll(@RequestParam(required = false) String type, @RequestParam(required = false) String prefix) {
        List<SubscriptionPlanDto> result = new ArrayList<>();
        subscriptionService.getAllPlans(type, prefix, context.pageSize()).forEach(s -> result.add(new SubscriptionPlanDto(s)));
        return result;
    }


    @GetMapping("/subscriptions/plans")
    public List<SubscriptionPlanDto> getAvailableAll(@RequestParam(required = false) String type) {
        List<SubscriptionPlanDto> result = new ArrayList<>();
        subscriptionService.getAvailablePlans(type, context.pageSize()).forEach(s -> {
            SubscriptionPlanDto plan = new SubscriptionPlanDto(s);
            plan.setEnabled(null);
            result.add(plan);
        });
        return result;
    }

    @GetMapping("/subscriptions/plans/{id}/calc")
    public CalculatedPrice calculate(@PathVariable String id, @RequestParam(required = false) String discount) {
        String userId = null;
        try {
            userId = userService.getUserId(context.userToken());
        } catch (Exception ignored) {
        }
        return subscriptionService.calculatePrice(id, userId, discount);
    }

    @GetMapping("/subscriptions/plans/{id}")
    public SubscriptionPlanDto get(@PathVariable String id) {
        SubscriptionPlan plan = subscriptionService.getSubscriptionPlan(id);
        if (!plan.getEnabled()) {
            throw new SubscriptionPlanNotFound(id);
        }
        return new SubscriptionPlanDto(plan);
    }

    @GetMapping("/admin/subscriptions/plans/{id}")
    public SubscriptionPlanDto getAdmin(@PathVariable String id) {
        return new SubscriptionPlanDto(subscriptionService.getSubscriptionPlan(id));
    }

    @DeleteMapping("/admin/subscriptions/plans/{id}")
    public void delete(@PathVariable String id) {
        get(id);
        subscriptionService.deletePlan(id);
    }

    @PutMapping("/admin/subscriptions/plans/{id}")
    public SubscriptionPlanDto update(@PathVariable String id, @RequestBody SubscriptionPlanDto dto) {
        get(id);
        dto.setId(id);
        return new SubscriptionPlanDto(subscriptionService.createPlan(dto));
    }

    @PostMapping("/admin/subscriptions/plans")
    public SubscriptionPlanDto createPlan(@RequestBody SubscriptionPlanDto dto) {
        dto.setId(null);
        return new SubscriptionPlanDto(subscriptionService.createPlan(dto));
    }

}

package ir.headphone.rest.controller.discount;

import ir.headphone.rest.controller.AbstractController;
import ir.headphone.rest.controller.discount.model.DiscountDto;
import ir.headphone.rest.controller.discount.model.DiscountEntity;
import ir.headphone.rest.controller.user.dto.DiscountVerifyRequest;
import ir.headphone.spi.user.model.Discount;
import ir.headphone.spi.user.service.DiscountService;
import ir.headphone.spi.user.service.UserService;
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
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class DiscountController extends AbstractController {
    private final DiscountService discountService;
    private final UserService userService;

    public DiscountController(DiscountService discountService, UserService userService) {
        this.discountService = discountService;
        this.userService = userService;
    }

    @GetMapping("/admin/discounts")
    public List<DiscountEntity> getAll(@RequestParam(defaultValue = "") String prefix) {
        List<DiscountEntity> result = new ArrayList<>();
        Collection<? extends Discount> discounts = discountService.getDiscounts(prefix, context.pageSize());
        discounts.forEach(d -> result.add(new DiscountEntity(d)));
        return result;
    }

    @PostMapping("/discounts/verify")
    public DiscountDto verify(@RequestBody DiscountVerifyRequest request) {
        return new DiscountDto(discountService.verify(request.getDiscount(), request.getPlanId(), userService.getUserId(context.userToken())));
    }

    @GetMapping("/admin/discounts/{id}")
    public DiscountEntity get(@PathVariable String id) {
        return new DiscountEntity(discountService.get(id));
    }

    @DeleteMapping("/admin/discounts/{id}")
    public void delete(@PathVariable String id) {
        discountService.delete(id);
    }

    @PutMapping("/admin/discounts/{id}")
    public DiscountEntity update(@PathVariable String id, @RequestBody DiscountEntity dto) {
        get(id);
        dto.setId(id);
        return new DiscountEntity(discountService.create(dto));
    }

    @PostMapping("/admin/discounts")
    public DiscountEntity create(@RequestBody DiscountEntity dto) {
        return new DiscountEntity(discountService.create(dto));
    }


}

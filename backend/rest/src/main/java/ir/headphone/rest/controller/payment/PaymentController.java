package ir.headphone.rest.controller.payment;

import ir.headphone.rest.controller.AbstractController;
import ir.headphone.spi.payment.model.Ipg;
import ir.headphone.spi.payment.service.PaymentService;
import ir.headphone.spi.user.model.Discount;
import ir.headphone.spi.user.model.Subscription;
import ir.headphone.spi.user.service.SubscriptionService;
import ir.headphone.spi.user.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class PaymentController extends AbstractController {
    private final PaymentService paymentService;
    private final SubscriptionService subscriptionService;
    private final UserService userService;
    @Value("${rest.backend}")
    private String backend;

    public PaymentController(PaymentService paymentService, SubscriptionService subscriptionService, UserService userService) {
        this.paymentService = paymentService;
        this.subscriptionService = subscriptionService;
        this.userService = userService;
    }

    @GetMapping("/payment/mock/{ipg}/{referId}")
    public void mock(@PathVariable String ipg, @PathVariable String referId,
                     @RequestParam(defaultValue = "") String origin,
                     HttpServletResponse response) throws IOException {
        //TODO verify payment
        response.sendRedirect(String.format("%s/api/v1/payment/callback/%s/%s?origin=%s", backend, ipg, referId, origin));
    }

    @GetMapping("/payment/redirect/{ipg}/{referId}")
    public void redirect(@PathVariable String ipg, @PathVariable String referId,
                         HttpServletRequest request, HttpServletResponse response) throws IOException {
        //TODO verify payment
        String origin = request.getHeader("Referer");
        response.sendRedirect(String.format("%s/api/v1/payment/mock/%s/%s?origin=%s", backend, ipg, referId, origin));
    }

    @GetMapping("/payment/callback/{ipg}/{referId}")
    public void callback(@PathVariable String ipg, @PathVariable String referId, @RequestParam(defaultValue = "") String origin,
                         HttpServletResponse response) throws IOException {
        //TODO verify payment
        if (ipg.equals("1")) {
            Subscription subscription = subscriptionService.getSubscription(referId);
            try {
                if (StringUtils.isNotBlank(subscription.getDiscountVoucher())) {
                    Discount.DiscountType discountType = subscription.getDiscountType();
                    String name = "unknown";
                    if (discountType != null) {
                        name = discountType.name();
                    }
                    saveEvent("discount", Map.of("voucher", subscription.getDiscountVoucher(), "type", name));
                }
                Map<String, Object> data = new HashMap<>();
                data.put("id", subscription.getPlanId());
                if (subscription.getType() != null) {
                    data.put("type", subscription.getType().name());
                }
                if (subscription.getProgramId() != null) {
                    data.put("programId", subscription.getProgramId());
                }
                saveEvent("subscribe", data);
            } catch (Exception ignored) {
            }
            subscriptionService.approveSubscription(referId, BigDecimal.ZERO);
        }
        try {
            origin = origin.substring(0, origin.indexOf("/", 8));
        } catch (Exception e) {
            origin = "https://vidosign.com";
        }
        response.sendRedirect(String.format("%s/invoice/%s", origin, referId));
    }

    @GetMapping("/payment/ipgs")
    public List<Ipg> getIpgs() {
        return paymentService.getIpgs();
    }
}

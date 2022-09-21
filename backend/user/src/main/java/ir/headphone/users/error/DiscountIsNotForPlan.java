package ir.headphone.users.error;

public class DiscountIsNotForPlan extends UserServiceException {
    public DiscountIsNotForPlan(String voucher, String planId) {
        super("discount `" + voucher + "` is not for plan: " + planId, 400);
    }
}

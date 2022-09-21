package ir.headphone.users.error;

public class DiscountIsExpired extends UserServiceException {
    public DiscountIsExpired(String voucher) {
        super("discount is expired, voucher: " + voucher, 400);
    }
}

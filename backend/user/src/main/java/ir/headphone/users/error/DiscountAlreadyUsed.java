package ir.headphone.users.error;

public class DiscountAlreadyUsed extends UserServiceException {
    public DiscountAlreadyUsed(String voucher) {
        super("discount already used, voucher: " + voucher, 400);
    }
}

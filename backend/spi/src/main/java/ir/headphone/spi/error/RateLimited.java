package ir.headphone.spi.error;

public class RateLimited extends ServiceException {
    public RateLimited() {
        super(403);
    }

    public RateLimited(String message) {
        super(message, 403);
    }
}

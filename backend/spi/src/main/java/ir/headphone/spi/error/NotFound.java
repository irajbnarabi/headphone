package ir.headphone.spi.error;

public class NotFound extends ServiceException {
    public NotFound() {
        super(404);
    }

    public NotFound(String message) {
        super(message, 404);
    }
}

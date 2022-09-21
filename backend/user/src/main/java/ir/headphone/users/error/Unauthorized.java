package ir.headphone.users.error;

public class Unauthorized extends UserServiceException {
    public Unauthorized() {
        super(401);
    }

    public Unauthorized(String message) {
        super(message, 401);
    }
}

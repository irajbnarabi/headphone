package ir.headphone.users.error;

public class AccessDenied extends UserServiceException {
    public AccessDenied() {
        super(403);
    }

    public AccessDenied(String message) {
        super(message, 403);
    }
}

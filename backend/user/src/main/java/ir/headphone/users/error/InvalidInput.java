package ir.headphone.users.error;

public class InvalidInput extends UserServiceException {
    public InvalidInput() {
        super(400);
    }

    public InvalidInput(String message) {
        super(message, 400);
    }
}

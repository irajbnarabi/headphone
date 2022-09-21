package ir.headphone.users.error;

public class EmailAlreadyExist extends UserServiceException {
    public EmailAlreadyExist() {
        super("email already exist", 400);
    }
}

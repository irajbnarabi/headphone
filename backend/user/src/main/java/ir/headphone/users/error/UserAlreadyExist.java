package ir.headphone.users.error;

public class UserAlreadyExist extends UserServiceException {
    public UserAlreadyExist() {
        super("user already exist", 400);
    }
}

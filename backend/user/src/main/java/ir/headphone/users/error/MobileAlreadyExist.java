package ir.headphone.users.error;

public class MobileAlreadyExist extends UserServiceException {
    public MobileAlreadyExist() {
        super("mobile already exist", 400);
    }
}

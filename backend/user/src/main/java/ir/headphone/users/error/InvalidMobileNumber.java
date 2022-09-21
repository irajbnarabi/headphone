package ir.headphone.users.error;

public class InvalidMobileNumber extends UserServiceException{
    public InvalidMobileNumber() {
        super(400);
    }
}

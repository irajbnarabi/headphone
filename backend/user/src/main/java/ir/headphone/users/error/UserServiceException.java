package ir.headphone.users.error;

import ir.headphone.spi.error.ServiceException;

public class UserServiceException extends ServiceException {
    public UserServiceException() {
        super();
    }

    public UserServiceException(int httpStatus) {
        super(httpStatus);
    }

    public UserServiceException(String message) {
        super(message);
    }

    public UserServiceException(String message, int httpStatus) {
        super(message, httpStatus);
    }

    @Override
    public int getHttpStatus() {
        return super.getHttpStatus();
    }

    @Override
    public void setHttpStatus(int httpStatus) {
        super.setHttpStatus(httpStatus);
    }
}

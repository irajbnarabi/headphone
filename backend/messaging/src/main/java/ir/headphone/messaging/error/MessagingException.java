package ir.headphone.messaging.error;

import ir.headphone.spi.error.ServiceException;

public class MessagingException extends ServiceException {
    public MessagingException() {
        super();
    }

    public MessagingException(int httpStatus) {
        super(httpStatus);
    }

    public MessagingException(String message) {
        super(message);
    }

    public MessagingException(String message, int httpStatus) {
        super(message, httpStatus);
    }
}

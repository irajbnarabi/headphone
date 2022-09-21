package ir.headphone.rest.error;

import ir.headphone.spi.error.ServiceException;

public class RestError extends ServiceException {
    public RestError(String message, Integer httpStatus) {
        super(message, httpStatus);
    }

}

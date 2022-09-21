package ir.headphone.analytics.error;

import ir.headphone.spi.error.ServiceException;

public class AnalyticsException extends ServiceException {
    public AnalyticsException(String message, int httpStatus) {
        super(message, httpStatus);
    }
}

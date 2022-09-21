package ir.headphone.search.error;

import ir.headphone.spi.error.ServiceException;

public class SearchException extends ServiceException {
    public SearchException(String message) {
        super(message);
    }
}

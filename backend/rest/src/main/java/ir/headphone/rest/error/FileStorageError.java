package ir.headphone.rest.error;

import ir.headphone.spi.error.ServiceException;

public class FileStorageError extends ServiceException {
    public FileStorageError(String message) {
        super(message);
    }

}

package ir.headphone.videos.error;

import ir.headphone.spi.error.ServiceException;

public class DuplicatedUniqueField extends ServiceException {
    public DuplicatedUniqueField() {
        super("unique field is already exist", 401);
    }
}

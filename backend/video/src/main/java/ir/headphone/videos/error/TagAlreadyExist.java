package ir.headphone.videos.error;

import ir.headphone.spi.error.ServiceException;

public class TagAlreadyExist extends ServiceException {
    public TagAlreadyExist() {
        super("tag already exist", 401);
    }
}

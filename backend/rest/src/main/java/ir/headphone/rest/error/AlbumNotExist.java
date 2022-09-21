package ir.headphone.rest.error;

import ir.headphone.spi.error.ServiceException;

public class AlbumNotExist extends ServiceException {
    public AlbumNotExist() {
        super(401);
    }
}

package ir.headphone.users.error;

import ir.headphone.spi.error.NotFound;

public class FavoriteNotFound extends NotFound {
    public FavoriteNotFound() {
        super("favorite is not found");
    }
}

package ir.headphone.spi.user.model;

import ir.headphone.spi.model.Entity;

public interface Favorite extends Entity {
    String getUserId();

    String getProgramId();

    String getType();
}

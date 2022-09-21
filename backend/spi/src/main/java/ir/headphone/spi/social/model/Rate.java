package ir.headphone.spi.social.model;

import ir.headphone.spi.model.Entity;

public interface Rate extends Entity {
    String getUserId();

    String getEntityId();

    Integer getRate();
}

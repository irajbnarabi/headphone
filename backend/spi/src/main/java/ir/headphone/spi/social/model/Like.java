package ir.headphone.spi.social.model;

import ir.headphone.spi.model.Entity;

public interface Like extends Entity {
    String getUserId();

    String getEntityId();

    Boolean getDislike();
}

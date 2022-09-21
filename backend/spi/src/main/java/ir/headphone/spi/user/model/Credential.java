package ir.headphone.spi.user.model;

import ir.headphone.spi.model.Entity;

public interface Credential extends Entity {
    String getUserId();

    String getCredential();
}

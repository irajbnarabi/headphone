package ir.headphone.spi.user.model;

import ir.headphone.spi.model.Entity;

public interface UserToken extends Entity {
    String getUserId();

    Long getUtilizedAt();

    String getDeviceName();

    String getOs();

    String getIp();
}

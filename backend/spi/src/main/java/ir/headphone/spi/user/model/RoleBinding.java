package ir.headphone.spi.user.model;

import ir.headphone.spi.model.Entity;

public interface RoleBinding extends Entity {
    String getRoleId();

    String getUserId();
}

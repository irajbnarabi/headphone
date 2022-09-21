package ir.headphone.spi.user.model;

import ir.headphone.spi.model.Entity;

public interface Rule extends Entity {
    String getName();

    String getPath();

    String getMethod();
}

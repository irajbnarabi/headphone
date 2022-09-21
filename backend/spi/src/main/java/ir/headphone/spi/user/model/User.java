package ir.headphone.spi.user.model;

import ir.headphone.spi.model.Entity;

import java.util.Set;

public interface User extends Entity {
    String getName();

    String getEmail();

    String getMobile();

    Set<String> getRoles();
}

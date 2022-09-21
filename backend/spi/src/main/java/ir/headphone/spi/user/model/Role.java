package ir.headphone.spi.user.model;

import ir.headphone.spi.model.Entity;

import java.util.Set;

public interface Role extends Entity {
    String getName();
    Set<String> getRules();
}

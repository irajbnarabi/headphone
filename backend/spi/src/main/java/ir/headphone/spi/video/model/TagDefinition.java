package ir.headphone.spi.video.model;

import ir.headphone.spi.model.Entity;

import java.util.Set;

public interface TagDefinition extends Entity {
    String getName();

    String getDescription();

    Set<Field> getFields();

    Set<Field> getBindings();
}

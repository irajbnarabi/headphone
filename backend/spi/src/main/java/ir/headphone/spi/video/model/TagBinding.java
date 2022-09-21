package ir.headphone.spi.video.model;

import ir.headphone.spi.model.Entity;

import java.util.Map;

public interface TagBinding extends Entity {
    String getTagId();

    String getEntityId();

    String getEntityType();

    Map<String, Object> getBindings();
}

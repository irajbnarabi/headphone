package ir.headphone.spi.video.model;

import ir.headphone.spi.model.Entity;

import java.util.Map;

public interface Tag extends Entity {
    String getTagDefinitionId();

    String getValue();

    Map<String, Object> getFields();
}

package ir.headphone.spi.video.model;

import ir.headphone.spi.model.Entity;

public interface Program extends Entity {
    String getTitle();

    String getDescription();

    String getImage();

    String getType();

    Boolean getEnabled();
}

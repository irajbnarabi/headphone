package ir.headphone.spi.video.model;

import ir.headphone.spi.model.Entity;

public interface VideoBinding extends Entity {
    String getVideoId();

    String getProgramId();

    Integer getSeasonNumber();

    Integer getEpisodeNumber();

    String getLink();
}

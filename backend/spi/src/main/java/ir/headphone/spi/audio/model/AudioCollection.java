package ir.headphone.spi.audio.model;

import ir.headphone.spi.model.Entity;

public interface AudioCollection extends Entity {

    String getTitle();

    String getDescription();

    String getImage();

    String getType();

    Boolean getEnabled();

//    List<Publisher> getPublishers();
//
//    List<Artist> getArtists();
//
//    List<Track> getTracks();
}

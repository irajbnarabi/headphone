package ir.headphone.audio.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.audio.model.AudioCollection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Document(collection = "audios")
@Data
@Builder
@AllArgsConstructor
public class AudioCollectionEntity extends AbstractEntity implements AudioCollection {

    @Indexed
    private String title;
    private String description;
    private String image;
    private String type;
    private Boolean enabled;

//    private List<Publisher> publishers;
//
//    private List<Artist> artists;
//
//    private List<Track> tracks;

    public AudioCollectionEntity() {
    }

    public AudioCollectionEntity(AudioCollection audioCollection) {
        super(audioCollection);
        this.title = audioCollection.getTitle();
        this.description = audioCollection.getDescription();
        this.image = audioCollection.getImage();
        this.type = audioCollection.getType();
        this.enabled = audioCollection.getEnabled();
//        this.publishers = audioCollection.getPublishers();
//        this.tracks = audioCollection.getTracks();
//        this.artists = audioCollection.getArtists();
    }
}

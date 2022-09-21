package ir.headphone.audio.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.audio.model.Artist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Document(collection = "artist")
@Data
@Builder
@AllArgsConstructor
public class ArtistEntity extends AbstractEntity implements Artist {
    @Indexed
    private String name;

    public ArtistEntity() {
    }

    public ArtistEntity(Artist artist) {
        super(artist);
        this.name = artist.getName();

    }
}

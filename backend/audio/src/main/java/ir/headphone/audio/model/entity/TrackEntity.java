package ir.headphone.audio.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.audio.model.Track;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Document(collection = "tracks")
@Data
@Builder
@AllArgsConstructor
public class TrackEntity extends AbstractEntity implements Track {

    @Indexed
    private String name;

    public TrackEntity() {
    }

    public TrackEntity(Track track) {
        super(track);
        this.name = track.getName();

    }
}

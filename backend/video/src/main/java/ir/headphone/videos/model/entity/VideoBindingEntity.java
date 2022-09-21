package ir.headphone.videos.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.video.model.VideoBinding;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Document(collection = "video_bindings")
@SuperBuilder
@AllArgsConstructor
@Data
public class VideoBindingEntity extends AbstractEntity implements VideoBinding {
    @Indexed
    private String programId;
    @Indexed(unique = true)
    private String videoId;
    private Integer episodeNumber;
    private Integer seasonNumber;
    private String link;

    public VideoBindingEntity() {
    }

    public VideoBindingEntity(VideoBinding videoBinding) {
        super(videoBinding);
        this.programId = videoBinding.getProgramId();
        this.videoId = videoBinding.getVideoId();
        this.episodeNumber = videoBinding.getEpisodeNumber();
        this.seasonNumber = videoBinding.getSeasonNumber();
        this.link = videoBinding.getLink();
    }
}

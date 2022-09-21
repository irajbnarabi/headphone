package ir.headphone.rest.controller.video.admin.model;

import ir.headphone.rest.controller.video.dto.AlbumDto;
import ir.headphone.spi.video.model.VideoBinding;
import lombok.Data;

@Data
public class VideoBindingEntity implements VideoBinding {
    private String id;
    private Long createdAt;
    private Long updatedAt;
    private String programId;
    private String videoId;
    private Integer episodeNumber;
    private Integer seasonNumber;
    private String link;

    public VideoBindingEntity(VideoBinding video) {
        this.id = video.getId();
        this.createdAt = video.getCreatedAt();
        this.updatedAt = video.getUpdatedAt();
        this.programId = video.getProgramId();
        this.videoId = video.getVideoId();
        this.episodeNumber = video.getEpisodeNumber();
        this.seasonNumber = video.getSeasonNumber();
        this.link = video.getLink();
    }

    public VideoBindingEntity(AlbumDto video) {
        this.id = video.getId();
        this.episodeNumber = video.getEpisodeNumber();
        this.seasonNumber = video.getSeasonNumber();
        this.link = video.getLink();
    }
}

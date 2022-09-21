package ir.headphone.rest.controller.video.dto;

import ir.headphone.spi.video.model.Program;
import ir.headphone.spi.video.model.VideoBinding;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AlbumDto {
    private String id;
    private String title;
    private Integer episodeNumber;
    private Integer seasonNumber;
    private String description;
    private String image;
    private String link;
    private Map<String, List<TagDto>> tags;
    private Boolean enabled;

    public AlbumDto() {
    }

    public AlbumDto(VideoBinding binding, Program program) {
        this.id = program.getId();
        this.title = program.getTitle();
        this.episodeNumber = binding.getEpisodeNumber();
        this.seasonNumber = binding.getSeasonNumber();
        this.description = program.getDescription();
        this.image = program.getImage();
        this.link = binding.getLink();
        this.enabled = program.getEnabled();
    }
}

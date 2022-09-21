package ir.headphone.rest.controller.video.dto;

import ir.headphone.rest.controller.home.Carousel;
import ir.headphone.spi.video.model.Program;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgramPageDto {
    protected Map<String, List<TagDto>> tags;
    private String id;
    private String title;
    private String description;
    private String image;
    private Map<Integer, List<AlbumDto>> seasons;
    private List<Carousel> carousels;
    private Boolean enabled;
    private String director;
    private Boolean isFavorite;
    private Long likeCount;
    private Boolean liked;
    private Boolean disliked;
    private Boolean userHasTicket;
    private Long ticketExpiry;
    private Float rate;
    private Integer userRate;
    private Long rateCount;
    private String likedPercent;

    public ProgramPageDto(Program program, String imagePath) {
        this.setId(program.getId());
        this.setTitle(program.getTitle());
        this.setDescription(program.getDescription());
        this.setImage(imagePath);
        this.setEnabled(program.getEnabled() != null && program.getEnabled());
    }

}

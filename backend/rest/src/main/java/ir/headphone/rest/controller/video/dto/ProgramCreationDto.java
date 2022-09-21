package ir.headphone.rest.controller.video.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class ProgramCreationDto {
    private String id;
    private String title;
    private String description;
    private String image;
    private Boolean enabled;
    private Integer productionYear;
    private List<String> genres;
    private String duration;
    private List<String> actors;
    private List<String> directors;


    public ProgramCreationDto() {
    }


}

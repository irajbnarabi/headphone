package ir.headphone.rest.controller.video.dto;

import ir.headphone.spi.video.model.Program;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ProgramDto {
    private String id;
    private String title;
    private String description;
    private String image;
    private Boolean enabled;

    public ProgramDto() {
    }

    public ProgramDto(Program program, String imagePath) {
        this.id = program.getId();
        this.title = program.getTitle();
        this.description = program.getDescription();
        this.image = imagePath;
        this.enabled = program.getEnabled() != null && program.getEnabled();
    }
}

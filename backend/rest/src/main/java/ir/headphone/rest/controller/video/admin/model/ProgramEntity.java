package ir.headphone.rest.controller.video.admin.model;

import ir.headphone.rest.controller.video.dto.ProgramDto;
import ir.headphone.rest.controller.video.dto.AlbumDto;
import ir.headphone.spi.video.model.Program;
import ir.headphone.spi.video.model.ProgramType;
import lombok.Data;

@Data
public class ProgramEntity implements Program {
    private String id;
    private Long createdAt;
    private Long updatedAt;
    private String title;
    private String description;
    private String image;
    private String type;
    private Boolean enabled;

    public ProgramEntity() {
    }

    public ProgramEntity(Program program) {
        this.id = program.getId();
        this.createdAt = program.getCreatedAt();
        this.updatedAt = program.getUpdatedAt();
        this.title = program.getTitle();
        this.description = program.getDescription();
        this.image = program.getImage();
        this.type = program.getType();
        this.enabled = program.getEnabled();
    }

    public ProgramEntity(ProgramDto program) {
        this.id = program.getId();
        this.title = program.getTitle();
        this.description = program.getDescription();
        this.image = program.getImage();
        this.enabled = program.getEnabled();
    }

    public ProgramEntity(AlbumDto AlbumDto) {
        this.id = AlbumDto.getId();
        this.title = AlbumDto.getTitle();
        this.description = AlbumDto.getDescription();
        this.image = AlbumDto.getImage();
        this.type = ProgramType.VIDEO.name();
        this.enabled = AlbumDto.getEnabled();
    }
}

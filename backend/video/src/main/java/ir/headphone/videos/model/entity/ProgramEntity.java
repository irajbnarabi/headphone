package ir.headphone.videos.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.video.model.Program;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Document(collection = "programs")
@Data
@Builder
@AllArgsConstructor
public class ProgramEntity extends AbstractEntity implements Program {
    @Indexed
    private String title;
    private String description;
    private String image;
    private String type;
    private Boolean enabled;

    public ProgramEntity() {
    }

    public ProgramEntity(Program program) {
        super(program);
        this.title = program.getTitle();
        this.description = program.getDescription();
        this.image = program.getImage();
        this.type = program.getType();
        this.enabled = program.getEnabled();
    }
}

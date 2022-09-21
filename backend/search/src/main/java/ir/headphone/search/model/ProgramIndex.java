package ir.headphone.search.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ir.headphone.spi.video.model.Program;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;

@Data
@Document(indexName = "program")
@AllArgsConstructor
public class ProgramIndex implements Program {
    private String id;
    private String title;
    private String description;
    private String image;
    private String type;
    @JsonIgnore
    private Long createdAt;
    @JsonIgnore
    private Long updatedAt;
    @JsonIgnore
    private Long indexedAt;
    private Boolean enabled;


    public ProgramIndex() {
    }

    public ProgramIndex(Program program) {
        this.id = program.getId();
        this.createdAt = program.getCreatedAt();
        this.updatedAt = program.getUpdatedAt();
        this.title = program.getTitle();
        this.description = program.getDescription();
        this.image = program.getImage();
        this.type = program.getType();
        this.enabled = program.getEnabled();
    }
}

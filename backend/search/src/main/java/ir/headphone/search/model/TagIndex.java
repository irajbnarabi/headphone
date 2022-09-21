package ir.headphone.search.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ir.headphone.spi.video.model.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Document;

import java.util.Map;

@Data
@Document(indexName = "tag")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TagIndex implements Tag {
    private String id;
    @JsonIgnore
    private Long createdAt;
    @JsonIgnore
    private Long updatedAt;
    @JsonIgnore
    private Long indexedAt;
    private String tagDefinitionId;
    private String tagDefinitionName;
    private String value;
    private Map<String, Object> fields;

    public TagIndex(Tag tag) {
        this.id = tag.getId();
        this.createdAt = tag.getCreatedAt();
        this.updatedAt = tag.getUpdatedAt();
        this.tagDefinitionId = tag.getTagDefinitionId();
        this.value = tag.getValue();
        this.fields = tag.getFields();
    }
}

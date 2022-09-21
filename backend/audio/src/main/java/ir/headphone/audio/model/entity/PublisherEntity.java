package ir.headphone.audio.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.audio.model.Publisher;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Document(collection = "publisher")
@Data
@Builder
@AllArgsConstructor
public class PublisherEntity extends AbstractEntity implements Publisher {

    @Indexed
    private String name;

    public PublisherEntity() {
    }

    public PublisherEntity(Publisher Publisher) {
        super(Publisher);
        this.name = Publisher.getName();

    }
}

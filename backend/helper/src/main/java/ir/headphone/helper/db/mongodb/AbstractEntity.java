package ir.headphone.helper.db.mongodb;

import ir.headphone.spi.model.Entity;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;

@Data
@SuperBuilder
public abstract class AbstractEntity implements Entity {
    @Id
    private String id;
    private Long createdAt;
    private Long updatedAt;

    public AbstractEntity() {
    }

    public AbstractEntity(Entity entity) {
        this.id = entity.getId();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
    }
}

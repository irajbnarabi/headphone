package ir.headphone.users.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.user.model.Favorite;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "favorites")
public class FavoriteEntity extends AbstractEntity implements Favorite {
    private String userId;
    private String programId;
    private String type;

    public FavoriteEntity(Favorite favorite) {
        super(favorite);
        this.userId = favorite.getUserId();
        this.programId = favorite.getProgramId();
        this.type = favorite.getType();
    }
}

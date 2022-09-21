package ir.headphone.users.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.user.model.UserToken;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@Document(collection = "tokens")
public class UserTokenEntity extends AbstractEntity implements UserToken {
    @Indexed
    private String userId;
    private Long utilizedAt;
    private String deviceName;
    private String os;
    private String ip;

    public UserTokenEntity() {
    }
}


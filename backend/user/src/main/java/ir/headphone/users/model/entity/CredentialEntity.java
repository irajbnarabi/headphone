package ir.headphone.users.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.user.model.Credential;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Data
@Document(collection = "credentials")
@SuperBuilder
public class CredentialEntity extends AbstractEntity implements Credential {
    @Indexed(unique = true)
    private String userId;
    private String credential;

    public CredentialEntity() {
    }

    public CredentialEntity(Credential credential) {
        super(credential);
        this.userId = credential.getUserId();
        this.credential = credential.getCredential();
    }

}


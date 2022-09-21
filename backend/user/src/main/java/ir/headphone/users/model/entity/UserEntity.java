package ir.headphone.users.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.user.model.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@Document(collection = "users")
public class UserEntity extends AbstractEntity implements User {
    private String name;
    @Indexed(sparse = true, unique = true)
    private String email;
    @Indexed(unique = true)
    private String mobile;
    private Set<String> roles;

    public UserEntity() {
    }

    public UserEntity(User user) {
        super(user);
        this.name = user.getName();
        this.email = user.getEmail();
        this.mobile = user.getMobile();
        this.roles = user.getRoles();
    }
}

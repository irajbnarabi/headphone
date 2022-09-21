package ir.headphone.users.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.user.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@SuperBuilder
@Document(collection = "roles")
public class RoleEntity extends AbstractEntity implements Role {
    @Indexed(unique = true)
    private String name;
    private Set<String> rules;

    public RoleEntity() {
    }

    public RoleEntity(Role role) {
        super(role);
        this.name = role.getName();
        this.rules = role.getRules();
    }
}

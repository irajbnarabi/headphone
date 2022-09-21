package ir.headphone.users.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.user.model.Rule;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@Document(collection = "rules")
public class RuleEntity extends AbstractEntity implements Rule {
    @Indexed(unique = true)
    private String name;
    @Indexed
    private String path;
    private String method;

    public RuleEntity() {
    }

    public RuleEntity(Rule rule) {
        super(rule);
        this.name = rule.getName();
        this.path = rule.getPath();
        this.method = rule.getMethod();
    }
}

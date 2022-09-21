package ir.headphone.users.model.entity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.user.model.SubscriptionPlan;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "subscription_plans")
public class SubscriptionPlanEntity extends AbstractEntity implements SubscriptionPlan {
    @Indexed(unique = true)
    private String name;
    private String description;
    @Indexed
    private SubscriptionType type;
    @Indexed
    private Integer duration;
    @Indexed
    private SubscriptionTimeUnit timeUnit;
    @Indexed
    private BigDecimal price;
    private Float vat;
    private Boolean enabled;

    public SubscriptionPlanEntity(SubscriptionPlan plan) {
        super(plan);
        this.name = plan.getName();
        this.description = plan.getDescription();
        this.type = plan.getType();
        this.duration = plan.getDuration();
        this.price = plan.getPrice();
        this.vat = plan.getVat();
        this.enabled = plan.getEnabled();
        this.timeUnit = plan.getTimeUnit();
    }
}

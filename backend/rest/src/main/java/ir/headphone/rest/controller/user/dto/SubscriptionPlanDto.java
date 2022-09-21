package ir.headphone.rest.controller.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ir.headphone.spi.user.model.SubscriptionPlan;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionPlanDto implements SubscriptionPlan {
    private String id;
    @JsonIgnore
    private Long createdAt;
    @JsonIgnore
    private Long updatedAt;
    private String name;
    private String description;
    private BigDecimal price;
    private Float vat;
    private Integer duration;
    private SubscriptionTimeUnit timeUnit;
    private SubscriptionPlan.SubscriptionType type;
    private Boolean enabled;

    public SubscriptionPlanDto(SubscriptionPlan plan) {
        this.id = plan.getId();
        this.createdAt = plan.getCreatedAt();
        this.updatedAt = plan.getUpdatedAt();
        this.name = plan.getName();
        this.description = plan.getDescription();
        this.price = plan.getPrice();
        this.vat = plan.getVat();
        this.duration = plan.getDuration();
        this.type = plan.getType();
        this.enabled = plan.getEnabled();
        this.timeUnit = plan.getTimeUnit();
    }
}

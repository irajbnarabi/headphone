package ir.headphone.rest.controller.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ir.headphone.spi.user.model.Rule;
import ir.headphone.users.model.entity.RuleEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RuleDto {
    private String id;
    private String name;
    private String path;
    private String method;

    public RuleDto(Rule rule) {
        this.id = rule.getId();
        this.name = rule.getName();
        this.path = rule.getPath();
        this.method = rule.getMethod();
    }

    @JsonIgnore
    public Rule getRule() {
        return RuleEntity.builder()
                .id(this.id)
                .name(this.name)
                .path(this.path)
                .method(this.method)
                .build();
    }
}

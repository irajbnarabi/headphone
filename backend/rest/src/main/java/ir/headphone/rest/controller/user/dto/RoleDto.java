package ir.headphone.rest.controller.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ir.headphone.spi.user.model.Role;
import ir.headphone.users.model.entity.RoleEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleDto {
    private String id;
    private String name;
    private Set<String> rules;

    public RoleDto(Role role) {
        this.id = role.getId();
        this.name = role.getName();
        this.rules = role.getRules();
    }

    @JsonIgnore
    public Role getRole(){
        return RoleEntity.builder()
                .id(this.id)
                .name(this.name)
                .rules(this.rules)
                .build();
    }
}

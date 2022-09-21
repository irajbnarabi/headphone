package ir.headphone.rest.controller.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ir.headphone.spi.user.model.User;
import ir.headphone.users.model.entity.UserEntity;
import lombok.Data;

import java.util.Set;

@Data
public class UserDto {
    private String id;
    private String name;
    private String email;
    private String mobile;
    private Set<String> roles;

    public UserDto() {
    }

    public UserDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.mobile = user.getMobile();
        this.roles = user.getRoles();
    }

    @JsonIgnore
    public User getUser() {
        return UserEntity.builder()
                .id(id)
                .name(name)
                .email(email)
                .mobile(mobile)
                .roles(roles)
                .build();
    }
}

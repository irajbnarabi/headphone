package ir.headphone.users.model;

import ir.headphone.spi.user.model.User;
import ir.headphone.spi.user.model.UserProfile;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DefaultUserProfile implements UserProfile {
    private String name;
    private String email;
    private String mobile;

    public DefaultUserProfile() {
    }

    public DefaultUserProfile(String name, String email, String mobile) {
        this.name = name;
        this.email = email;
        this.mobile = mobile;
    }

    public DefaultUserProfile(User user) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.mobile = user.getMobile();
    }
}

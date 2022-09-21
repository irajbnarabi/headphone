package ir.headphone.rest.controller.user.dto;

import ir.headphone.spi.user.model.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDto implements UserProfile {
    private String name;
    private String email;
    private String mobile;
    private Long remainedDays;

    private String newEmail;
    private String newMobile;
    private String emailUpdateToken;
    private String mobileUpdateToken;


    public UserProfileDto(String name, String email, String mobile) {
        this.name = name;
        this.email = email;
        this.mobile = mobile;
    }

    public UserProfileDto(UserProfile user) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.mobile = user.getMobile();
    }
}

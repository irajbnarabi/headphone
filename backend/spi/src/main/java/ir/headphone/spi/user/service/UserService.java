package ir.headphone.spi.user.service;

import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.user.model.Favorite;
import ir.headphone.spi.user.model.UserProfile;

import java.util.Collection;

public interface UserService {
    String register(String principal);

    String getResetPasswordToken(String principal);

    String authenticate(String principal, String credential);

    String getUserId(String token);

    String verify(String principal, String code, String token);

    String updateCredential(String token, String credential);

    UserProfile getProfile(String userId);

    String requestUpdateEmail(String userId, String email);

    String requestUpdateMobile(String userId, String mobile);

    String updatePrincipal(String userId, String token, String principal, String code);

    UserProfile updateProfile(String userId, UserProfile userProfile);

    void addToFavorites(String userId, String programId);

    void removeFromFavorites(String userId, String programId);

    Collection<? extends Favorite> getUserFavorites(String userId, String type, PageSize pageSize);

    Boolean isFavorite(String userId, String programId);
}

package ir.headphone.spi.user.service;


import ir.headphone.spi.user.model.UserToken;

import java.util.Collection;
import java.util.Map;

public interface TokenService {
    String getUserToken(String userId, String deviceName, String ip, String os);

    String verifyUserToken(String userToken);

    String generateToken(Map<String, String> data);

    Map<String, String> getTokenData(String token);

    Long getTokenCreationTime(String token);

    void deleteUserToken(String token);

    void deleteUserTokenById(String tokenId);

    void deleteAllOtherUserTokens(String token);

    Collection<? extends UserToken> getAllSessions(String userId);
}

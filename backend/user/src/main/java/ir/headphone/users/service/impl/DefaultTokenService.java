package ir.headphone.users.service.impl;

import ch.qos.logback.core.net.ssl.SecureRandomFactoryBean;
import ir.headphone.spi.user.model.User;
import ir.headphone.spi.user.model.UserToken;
import ir.headphone.spi.user.service.AdminService;
import ir.headphone.spi.user.service.ContextHolder;
import ir.headphone.spi.user.service.TokenService;
import ir.headphone.users.config.UserExternalConfig;
import ir.headphone.users.error.ExpiredToken;
import ir.headphone.users.error.InvalidToken;
import ir.headphone.users.error.Unauthorized;
import ir.headphone.users.error.UserServiceException;
import ir.headphone.users.model.Token;
import ir.headphone.users.model.entity.UserTokenEntity;
import ir.headphone.users.repository.UserTokenRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.SerializationUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.Base64Utils;

import java.io.Serializable;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DefaultTokenService implements TokenService, InitializingBean {
    private static final Charset CHARSET = StandardCharsets.UTF_8;
    private static final char[] HEX = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};
    private final UserTokenRepository userTokenRepository;
    private final AdminService adminService;
    private final UserExternalConfig config;
    private final ContextHolder contextHolder;
    private String serverSecret;
    private Integer serverInteger;
    private SecureRandom secureRandom;

    public DefaultTokenService(UserTokenRepository userTokenRepository, AdminService adminService, UserExternalConfig config, ContextHolder contextHolder) {
        this.userTokenRepository = userTokenRepository;
        this.adminService = adminService;
        this.config = config;
        this.contextHolder = contextHolder;
        setServerInteger(137);
        try {
            setSecureRandom(new SecureRandomFactoryBean().createSecureRandom());
        } catch (Exception e) {
            throw new UserServiceException();
        }
        setServerSecret("bc6a29e697c7a4fc57d61cda2a29493e");
    }

    private char[] encodeHex(byte[] bytes) {
        final int nBytes = bytes.length;
        char[] result = new char[2 * nBytes];

        int j = 0;
        for (byte aByte : bytes) {
            // Char for top 4 bits
            result[j++] = HEX[(0xF0 & aByte) >>> 4];
            // Bottom 4
            result[j++] = HEX[(0x0F & aByte)];
        }

        return result;
    }

    private byte[] decodeHex(CharSequence s) {
        int nChars = s.length();

        if (nChars % 2 != 0) {
            throw new IllegalArgumentException(
                    "Hex-encoded string must have an even number of characters");
        }

        byte[] result = new byte[nChars / 2];

        for (int i = 0; i < nChars; i += 2) {
            int msb = Character.digit(s.charAt(i), 16);
            int lsb = Character.digit(s.charAt(i + 1), 16);

            if (msb < 0 || lsb < 0) {
                throw new IllegalArgumentException(
                        "Detected a Non-hex character at " + (i + 1) + " or " + (i + 2) + " position");
            }
            result[i / 2] = (byte) ((msb << 4) | lsb);
        }
        return result;
    }

    /**
     * @return a pseduo random number (hex encoded)
     */
    private String generatePseudoRandomNumber() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return new String(encodeHex(randomBytes));
    }

    /**
     * Get the bytes of the String in UTF-8 encoded form.
     */
    private byte[] encodeUTF8(CharSequence string) {
        try {
            ByteBuffer bytes = CHARSET.newEncoder().encode(CharBuffer.wrap(string));
            byte[] bytesCopy = new byte[bytes.limit()];
            System.arraycopy(bytes.array(), 0, bytesCopy, 0, bytes.limit());

            return bytesCopy;
        } catch (CharacterCodingException e) {
            throw new IllegalArgumentException("Encoding failed", e);
        }
    }

    /**
     * Decode the bytes in UTF-8 form into a String.
     */
    private String decodeUTF8(byte[] bytes) {
        try {
            return CHARSET.newDecoder().decode(ByteBuffer.wrap(bytes)).toString();
        } catch (CharacterCodingException e) {
            throw new IllegalArgumentException("Decoding failed", e);
        }
    }


    private Token allocateToken(String extendedInformation) {
        Assert.notNull(extendedInformation,
                "Must provided non-null extendedInformation (but it can be empty)");
        long creationTime = new Date().getTime();
        String serverSecret = computeServerSecretApplicableAt(creationTime);
        String pseudoRandomNumber = generatePseudoRandomNumber();
        String content = creationTime + ":" + pseudoRandomNumber + ":"
                + extendedInformation;

        // Compute key
        String sha512Hex = DigestUtils.sha1Hex(content + ":" + serverSecret);
        String keyPayload = content + ":" + sha512Hex;
        String key = decodeUTF8(Base64.getEncoder().encode(encodeUTF8(keyPayload)));

        return new Token(key, creationTime, extendedInformation);
    }

    private Token verifyToken(String key) {
        if (key == null || "".equals(key)) {
            throw new Unauthorized("empty token");
        }
        String[] tokens = org.springframework.util.StringUtils.delimitedListToStringArray(
                decodeUTF8(Base64.getDecoder().decode(encodeUTF8(key))), ":");
        Assert.isTrue(tokens.length >= 4, () -> "Expected 4 or more tokens but found "
                + tokens.length);

        long creationTime;
        try {
            creationTime = Long.decode(tokens[0]);
        } catch (NumberFormatException nfe) {
            throw new Unauthorized();
        }

        String serverSecret = computeServerSecretApplicableAt(creationTime);
        String pseudoRandomNumber = tokens[1];

        // Permit extendedInfo to itself contain ":" characters
        StringBuilder extendedInfo = new StringBuilder();
        for (int i = 2; i < tokens.length - 1; i++) {
            if (i > 2) {
                extendedInfo.append(":");
            }
            extendedInfo.append(tokens[i]);
        }

        String sha1Hex = tokens[tokens.length - 1];

        // Verification
        String content = creationTime + ":" + pseudoRandomNumber + ":"
                + extendedInfo.toString();
        String expectedSha512Hex = DigestUtils.sha1Hex(content + ":" + serverSecret);
        Assert.isTrue(expectedSha512Hex.equals(sha1Hex), "Key verification failure");

        return new Token(key, creationTime, extendedInfo.toString());
    }

    private String computeServerSecretApplicableAt(long time) {
        return serverSecret + ":" + Long.valueOf(time % serverInteger).intValue();
    }

    /**
     * @param serverSecret the new secret, which can contain a ":" if desired (never being
     *                     sent to the client)
     */
    public void setServerSecret(String serverSecret) {
        this.serverSecret = serverSecret;
    }

    public void setSecureRandom(SecureRandom secureRandom) {
        this.secureRandom = secureRandom;
    }

    public void setServerInteger(Integer serverInteger) {
        this.serverInteger = serverInteger;
    }

    @Override
    public void afterPropertiesSet() {
        Assert.hasText(serverSecret, "Server secret required");
        Assert.notNull(serverInteger, "Server integer required");
        Assert.notNull(secureRandom, "SecureRandom instance required");
    }

    @Override
    public String getUserToken(String userId, String deviceName, String ip, String os) {
        List<UserTokenEntity> tokens = new ArrayList<>(userTokenRepository.findAllByUserIdOrderByUtilizedAtDesc(userId));
        if (tokens.size() >= config.getMaxParallelLogin()) {
            for (int i = config.getMaxParallelLogin() - 1; i < tokens.size(); i++) {
                if (i < 0) {
                    break;
                }
                userTokenRepository.delete(tokens.get(i));
            }
        }

        UserTokenEntity userToken = UserTokenEntity.builder()
                .userId(userId)
                .deviceName(deviceName)
                .ip(ip)
                .os(os)
                .utilizedAt(System.currentTimeMillis())
                .build();

        userToken = userTokenRepository.save(userToken);
        return getNewUserToken(userId, userToken.getId());
    }

    private String getNewUserToken(String userId, String tokenId) {
        Map<String, String> data = new HashMap<>();
        data.put("u", userId);
        data.put("t", tokenId);
        User user = adminService.getUserById(userId);
        data.put("rl", collectionToString(user.getRoles()));
        String token = generateToken(data);
        contextHolder.setNewUserToken(token);
        return token;
    }

    private String collectionToString(Collection<?> collection) {
        StringBuilder builder = new StringBuilder();
        if (collection != null) {
            int index = 0;
            for (Object o : collection) {
                builder.append(o.toString());
                index++;
                if (index < collection.size()) {
                    builder.append(",");
                }
            }
        }
        return builder.toString();
    }

    @Override
    public String verifyUserToken(String userToken) {
        Map<String, String> data = getTokenData(userToken);
        String tokenId = data.get("t");
        String userId = data.get("u");
        if (StringUtils.isBlank(tokenId) || StringUtils.isBlank(userId)) {
            throw new InvalidToken();
        }
        Optional<UserTokenEntity> token = userTokenRepository.findById(tokenId);
        if (!token.isPresent()) {
            throw new InvalidToken();
        }
        UserTokenEntity tokenEntity = token.get();
        if (tokenEntity.getUtilizedAt() < DateUtils.addDays(new Date(), -config.getUserTokenExpiryDays()).getTime()) {
            throw new ExpiredToken();
        }

        if (tokenEntity.getUtilizedAt() < System.currentTimeMillis() - 1000L * 60 * 3600) {
            tokenEntity.setUtilizedAt(System.currentTimeMillis());
            tokenEntity.setIp(contextHolder.ip());
            userTokenRepository.save(tokenEntity);
            userToken = getNewUserToken(userId, tokenId);
        }
        return userToken;
    }

    @Override
    public String generateToken(Map<String, String> data) {
        String strData = Base64Utils.encodeToUrlSafeString(SerializationUtils.serialize((Serializable) data));
        return allocateToken(strData).getKey();
    }

    @Override
    public Map<String, String> getTokenData(String token) {
        return SerializationUtils.deserialize(Base64Utils.decodeFromUrlSafeString(verifyToken(token).getExtendedInformation()));
    }

    @Override
    public Long getTokenCreationTime(String token) {
        Token t = verifyToken(token);
        return t.getKeyCreationTime();
    }

    @Override
    public void deleteUserToken(String token) {
        Map<String, String> data = getTokenData(token);
        String tokenId = data.get("t");
        userTokenRepository.deleteById(tokenId);
    }

    @Override
    public void deleteUserTokenById(String tokenId) {
        userTokenRepository.deleteById(tokenId);
    }

    @Override
    public void deleteAllOtherUserTokens(String token) {
        Map<String, String> data = getTokenData(token);
        String tokenId = data.get("t");
        String userId = data.get("u");
        Collection<UserTokenEntity> tokens = userTokenRepository.findAllByUserIdOrderByUtilizedAtDesc(userId);
        for (UserTokenEntity userTokenEntity : tokens) {
            if (!userTokenEntity.getId().equals(tokenId)) {
                userTokenRepository.deleteById(userTokenEntity.getId());
            }
        }
    }

    @Override
    public Collection<? extends UserToken> getAllSessions(String userId) {
        return userTokenRepository.findAllByUserIdOrderByUtilizedAtDesc(userId);
    }
}

package ir.headphone.users.service.impl;

import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import ir.headphone.messaging.MailService;
import ir.headphone.messaging.SmsService;
import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.user.model.Favorite;
import ir.headphone.spi.user.model.UserProfile;
import ir.headphone.spi.user.service.ContextHolder;
import ir.headphone.spi.user.service.TokenService;
import ir.headphone.spi.user.service.UserService;
import ir.headphone.users.config.UserExternalConfig;
import ir.headphone.users.error.EmailAlreadyExist;
import ir.headphone.users.error.ExpiredToken;
import ir.headphone.users.error.FavoriteNotFound;
import ir.headphone.users.error.InvalidCode;
import ir.headphone.users.error.InvalidCredential;
import ir.headphone.users.error.InvalidInput;
import ir.headphone.users.error.InvalidMobileNumber;
import ir.headphone.users.error.InvalidToken;
import ir.headphone.users.error.MobileAlreadyExist;
import ir.headphone.users.error.UserNotFound;
import ir.headphone.users.model.DefaultUserProfile;
import ir.headphone.users.model.entity.CredentialEntity;
import ir.headphone.users.model.entity.FavoriteEntity;
import ir.headphone.users.model.entity.UserEntity;
import ir.headphone.users.repository.CredentialRepository;
import ir.headphone.users.repository.FavoriteRepository;
import ir.headphone.users.repository.UserRepository;
import ir.headphone.users.repository.WalletRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.validator.routines.EmailValidator;
import org.apache.log4j.Logger;
import org.springframework.data.domain.PageRequest;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class DefaultUserService implements UserService {
    private final TokenService tokenService;
    private final SmsService smsService;
    private final MailService mailService;
    private final PhoneNumberUtil phoneNumberUtil;
    private final UserExternalConfig config;
    private final UserRepository userRepository;
    private final CredentialRepository credentialRepository;
    private final WalletRepository walletRepository;
    private final ContextHolder contextHolder;
    private final FavoriteRepository favoriteRepository;
    private final Logger logger = Logger.getLogger(DefaultUserService.class);

    public DefaultUserService(TokenService tokenService, SmsService smsService, MailService mailService
            , UserExternalConfig config, UserRepository userRepository,
                              CredentialRepository credentialRepository, WalletRepository walletRepository,
                              ContextHolder contextHolder, FavoriteRepository favoriteRepository) {
        this.tokenService = tokenService;
        this.smsService = smsService;
        this.mailService = mailService;
        this.favoriteRepository = favoriteRepository;
        this.phoneNumberUtil = PhoneNumberUtil.getInstance();
        this.config = config;
        this.userRepository = userRepository;
        this.credentialRepository = credentialRepository;
        this.walletRepository = walletRepository;
        this.contextHolder = contextHolder;
    }


    private String formatMobile(String mobile) {
        try {
            Phonenumber.PhoneNumber number = phoneNumberUtil.parse(mobile, "IR");
            if (phoneNumberUtil.isValidNumber(number)) {
                return phoneNumberUtil.format(number, PhoneNumberUtil.PhoneNumberFormat.E164);
            } else {
                throw new InvalidMobileNumber();
            }
        } catch (NumberParseException e) {
            throw new InvalidMobileNumber();
        }
    }

    private boolean isValidEmailAddress(String email) {
        return EmailValidator.getInstance().isValid(email);
    }

    @Override
    public String register(String principal) {
        boolean isMobile = false;
        if (!isValidEmailAddress(principal)) {
            principal = formatMobile(principal);
            isMobile = true;
        }
        if (isMobile) {
            if (userRepository.findByMobile(principal) != null) {
                return "";
            }
        } else {
            if (userRepository.findByEmail(principal) != null) {
                return "";
            }
        }
        return getResetPasswordToken(principal);
    }

    @Override
    public String getResetPasswordToken(String principal) {
        boolean isMobile = false;
        if (!isValidEmailAddress(principal)) {
            principal = formatMobile(principal);
            isMobile = true;
        }
        String code = RandomStringUtils.randomNumeric(5);
        HashMap<String, String> data = new HashMap<>();
        data.put("c", "1234");
        data.put("p", principal);
        data.put("type", "rp");
        String token = tokenService.generateToken(data);
        if (isMobile) {
            logger.info(String.format("try to sending %s to %s", code, principal));
            //smsService.verifyLookup(principal, code);
            smsService.send(principal, "verification-sms.ftl", Collections.singletonMap("code", code));
        } else {
            mailService.send(config.getRegistrationEmail(), principal, "Registration", "verification-email.ftl", Collections.singletonMap("code", code));
        }
        return token;
    }

    @Override
    public String authenticate(String principal, String credential) {
        boolean isMobile = false;
        if (!isValidEmailAddress(principal)) {
            try {
                principal = formatMobile(principal);
                isMobile = true;
            }catch (Exception ignored){
            }
        }
        UserEntity user;
        if (isMobile) {
            user = userRepository.findByMobile(principal);
        } else {
            user = userRepository.findByEmail(principal);
        }
        if (user == null) {
            throw new InvalidCredential();
        }
        CredentialEntity credentialEntity = credentialRepository.findByUserId(user.getId());
        if (credentialEntity == null || !DigestUtils.md5Hex(credential).equals(credentialEntity.getCredential())) {
            throw new InvalidCredential();
        }
        return tokenService.getUserToken(user.getId(), contextHolder.device(), contextHolder.ip(), contextHolder.os());
    }

    @Override
    public String getUserId(String token) {
        String t = tokenService.verifyUserToken(token);
        Map<String, String> data = tokenService.getTokenData(t);
        return data.get("u");
    }

    @Override
    public String verify(String principal, String code, String token) {
        if (tokenService.getTokenCreationTime(token) < System.currentTimeMillis() - config.getAccessTokenExpiryMinutes() * 60 * 1000) {
            throw new ExpiredToken();
        }
        Map<String, String> data = tokenService.getTokenData(token);
        String dataCode = "1234";
        String dataPrincipal = data.get("p");
        try {
            principal = formatMobile(principal);
        } catch (Exception ignored) {
        }
        if (!principal.equals(dataPrincipal) || (!code.equals(dataCode))) {
            throw new InvalidCode();
        }

        return tokenService.generateToken(Map.of("vp", principal));
    }

    @Override
    public String updateCredential(String token, String credential) {
        if (tokenService.getTokenCreationTime(token) < System.currentTimeMillis() - config.getAccessTokenExpiryMinutes() * 60 * 1000) {
            throw new ExpiredToken();
        }
        Map<String, String> tokenData = tokenService.getTokenData(token);
        String userId = tokenData.get("u");
        String principal = tokenData.get("vp");
        if (StringUtils.isBlank(principal) && StringUtils.isBlank(userId)) {
            throw new InvalidToken();
        }
        UserEntity user = UserEntity.builder().build();
        if (StringUtils.isNotBlank(userId)) {
            Optional<UserEntity> optional = userRepository.findById(userId);
            if (!optional.isPresent()) {
                throw new InvalidToken();
            }
            user = optional.get();
        } else {
            if (isValidEmailAddress(principal)) {
                UserEntity existedUser = userRepository.findByEmail(principal);
                if (existedUser == null) {
                    user.setEmail(principal);
                    user = userRepository.save(user);
                } else {
                    user = existedUser;
                }
            } else {
                UserEntity existedUser = userRepository.findByMobile(principal);
                if (existedUser == null) {
                    user.setMobile(formatMobile(principal));
                    user = userRepository.save(user);
                } else {
                    user = existedUser;
                }
            }
        }
        if (user.getId() == null) {
            throw new InvalidToken();
        }
        CredentialEntity credentialEntity = credentialRepository.findByUserId(user.getId());
        CredentialEntity c;
        if (credentialEntity == null) {
            c = CredentialEntity.builder()
                    .userId(user.getId())
                    .credential(DigestUtils.md5Hex(credential))
                    .build();
        } else {
            c = credentialEntity;
            c.setCredential(DigestUtils.md5Hex(credential));
        }
        credentialRepository.save(c);
        return tokenService.getUserToken(user.getId(), contextHolder.device(), contextHolder.ip(), contextHolder.os());
    }

    @Override
    public UserProfile getProfile(String userId) {
        Optional<UserEntity> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            throw new UserNotFound();
        }
        return DefaultUserProfile.builder()
                .name(user.get().getName())
                .email(user.get().getEmail())
                .mobile(user.get().getMobile())
                .build();

    }

    @Override
    public String requestUpdateEmail(String userId, String email) {
        getProfile(userId);
        Optional<UserEntity> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            throw new UserNotFound();
        }
        if (StringUtils.isNotBlank(email)) {
            if (!isValidEmailAddress(email)) {
                throw new InvalidInput();
            }
            if (user.get().getEmail() != null && !user.get().getEmail().equals(email)) {
                if (userRepository.findByEmail(email) != null) {
                    throw new EmailAlreadyExist();
                }
            }
        }
        String code = RandomStringUtils.randomNumeric(5);

        Map<String, String> data = new HashMap<>();
        data.put("e", email);
        data.put("u", userId);
        data.put("c", "1234");

        mailService.send(config.getRegistrationEmail(), email, "Password Reset", "verification-email.ftl", Collections.singletonMap("code", code));

        return tokenService.generateToken(data);
    }

    @Override
    public String requestUpdateMobile(String userId, String mobile) {
        getProfile(userId);
        Optional<UserEntity> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            throw new UserNotFound();
        }
        mobile = formatMobile(mobile);
        if (StringUtils.isNotBlank(mobile)) {
            if (user.get().getMobile() != null && !user.get().getMobile().equals(mobile)) {
                if (userRepository.findByMobile(mobile) != null) {
                    throw new MobileAlreadyExist();
                }
            }
        }
        String code = RandomStringUtils.randomNumeric(5);

        Map<String, String> data = new HashMap<>();
        data.put("m", mobile);
        data.put("u", userId);
        data.put("c", "1234");

//        smsService.verifyLookup(mobile, code);
        smsService.send(mobile, "verification-sms.ftl", Collections.singletonMap("code", code));
        return tokenService.generateToken(data);
    }

    @Override
    public String updatePrincipal(String userId, String token, String principal, String code) {
        if (tokenService.getTokenCreationTime(token) < System.currentTimeMillis() - config.getAccessTokenExpiryMinutes() * 60 * 1000) {
            throw new ExpiredToken();
        }
        Map<String, String> tokenData = tokenService.getTokenData(token);
        String codeData = tokenData.get("c");
        String userIdData = tokenData.get("u");
        String emailData = tokenData.get("e");
        String mobileData = tokenData.get("m");

        if (StringUtils.isBlank(userIdData) || !userId.equals(userIdData) ||
                (StringUtils.isBlank(emailData) && StringUtils.isBlank(mobileData)) ||
                StringUtils.isBlank(codeData) ||
                emailData != null ? !emailData.equals(principal) : !mobileData.equals(principal)) {
            throw new InvalidToken();
        }

        Optional<UserEntity> user = userRepository.findById(userIdData);
        if (!user.isPresent()) {
            throw new InvalidToken();
        }

        boolean isMobile = false;
        if (!isValidEmailAddress(principal)) {
            principal = formatMobile(principal);
            isMobile = true;
        }
        if (isMobile) {
            user.get().setMobile(principal);
        } else {
            user.get().setEmail(principal);
        }

        userRepository.save(user.get());
        return tokenService.getUserToken(user.get().getId(), contextHolder.device(), contextHolder.ip(), contextHolder.os());
    }

    @Override
    public UserProfile updateProfile(String userId, UserProfile userProfile) {
        getProfile(userId);
        Optional<UserEntity> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            throw new UserNotFound();
        }
        UserEntity userEntity = user.get();
        if (StringUtils.isNotBlank(userProfile.getName())) {
            userEntity.setName(userProfile.getName());
        }
        return new DefaultUserProfile(userRepository.save(userEntity));

    }

    @Override
    public void addToFavorites(String userId, String programId) {
        if (favoriteRepository.findByUserIdAndProgramId(userId, programId) == null) {
            favoriteRepository.save(FavoriteEntity.builder().userId(userId).programId(programId).build());
        }
    }

    @Override
    public void removeFromFavorites(String userId, String programId) {
        FavoriteEntity favorite = favoriteRepository.findByUserIdAndProgramId(userId, programId);
        if (favorite == null) {
            throw new FavoriteNotFound();
        }
        favoriteRepository.deleteById(favorite.getId());
    }

    @Override
    public Collection<? extends Favorite> getUserFavorites(String userId, String type, PageSize pageSize) {
        return favoriteRepository.findAllByUserIdAndType(userId, type, PageRequest.of(pageSize.getPage(), pageSize.getSize()));
    }

    @Override
    public Boolean isFavorite(String userId, String programId) {
        return favoriteRepository.findByUserIdAndProgramId(userId, programId) != null;
    }

}

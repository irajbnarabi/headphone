package ir.headphone.users.config;

import ir.headphone.messaging.MailService;
import ir.headphone.messaging.SmsService;
import ir.headphone.messaging.TemplateEngine;
import ir.headphone.messaging.conf.MessagingExternalConfig;
import ir.headphone.messaging.impl.DefaultMailService;
import ir.headphone.messaging.impl.FreemarkerTemplateEngine;
import ir.headphone.messaging.impl.KavehnegarSmsService;
import ir.headphone.spi.config.MongoConfiguration;
import ir.headphone.spi.user.service.AdminService;
import ir.headphone.spi.user.service.ContextHolder;
import ir.headphone.spi.user.service.DiscountService;
import ir.headphone.spi.user.service.SubscriptionService;
import ir.headphone.spi.user.service.TokenService;
import ir.headphone.spi.user.service.UserService;
import ir.headphone.users.repository.CredentialRepository;
import ir.headphone.users.repository.DiscountRepository;
import ir.headphone.users.repository.FavoriteRepository;
import ir.headphone.users.repository.RoleRepository;
import ir.headphone.users.repository.RuleRepository;
import ir.headphone.users.repository.SubscriptionPlanRepository;
import ir.headphone.users.repository.SubscriptionRepository;
import ir.headphone.users.repository.UserRepository;
import ir.headphone.users.repository.UserTokenRepository;
import ir.headphone.users.repository.WalletRepository;
import ir.headphone.users.repository.impl.mongodb.DefaultCredentialRepository;
import ir.headphone.users.repository.impl.mongodb.DefaultDiscountRepository;
import ir.headphone.users.repository.impl.mongodb.DefaultFavoriteRepository;
import ir.headphone.users.repository.impl.mongodb.DefaultRoleRepository;
import ir.headphone.users.repository.impl.mongodb.DefaultRuleRepository;
import ir.headphone.users.repository.impl.mongodb.DefaultSubscriptionPlanRepository;
import ir.headphone.users.repository.impl.mongodb.DefaultSubscriptionRepository;
import ir.headphone.users.repository.impl.mongodb.DefaultUserRepository;
import ir.headphone.users.repository.impl.mongodb.DefaultUserTokenRepository;
import ir.headphone.users.repository.impl.mongodb.DefaultWalletRepository;
import ir.headphone.users.service.impl.DefaultAdminService;
import ir.headphone.users.service.impl.DefaultDiscountService;
import ir.headphone.users.service.impl.DefaultSubscriptionService;
import ir.headphone.users.service.impl.DefaultTokenService;
import ir.headphone.users.service.impl.DefaultUserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import org.springframework.mail.javamail.JavaMailSender;

@Configuration
public class UserConfiguration {
    private static MongoDatabaseFactory mongoDatabaseFactory;

    @Bean
    public UserExternalConfig userExternalConfig(Environment environment) {
        return new UserExternalConfig(environment);
    }

    @Bean
    public MessagingExternalConfig messagingExternalConfig(Environment environment) {
        return new MessagingExternalConfig(environment);
    }

    @Bean
    public TokenService tokenService(UserTokenRepository userTokenRepository, AdminService adminService,
                                     UserExternalConfig userExternalConfig, ContextHolder contextHolder) {
        return new DefaultTokenService(userTokenRepository, adminService, userExternalConfig, contextHolder);
    }

    @Bean
    public SmsService smsService(MessagingExternalConfig messagingExternalConfig) {
        TemplateEngine templateEngine = new FreemarkerTemplateEngine();
        return new KavehnegarSmsService(templateEngine, messagingExternalConfig);
    }

    @Bean
    public MailService mailService(MessagingExternalConfig messagingExternalConfig, JavaMailSender javaMailSender) {
        TemplateEngine templateEngine = new FreemarkerTemplateEngine();
        return new DefaultMailService(javaMailSender, templateEngine, messagingExternalConfig);
    }


    @Bean
    public UserService userService(SmsService smsService,
                                   UserExternalConfig userExternalConfig, UserRepository userRepository,
                                   CredentialRepository credentialRepository, WalletRepository walletRepository,
                                   TokenService tokenService, ContextHolder contextHolder,
                                   FavoriteRepository favoriteRepository, MailService mailService) {
        return new DefaultUserService(tokenService, smsService, mailService, userExternalConfig, userRepository,
                credentialRepository, walletRepository, contextHolder, favoriteRepository);
    }

    @Bean
    public AdminService adminService(UserRepository userRepository,
                                     CredentialRepository credentialRepository, WalletRepository walletRepository,
                                     UserTokenRepository userTokenRepository, UserExternalConfig config, FavoriteRepository favoriteRepository) {
        RoleRepository roleRepository = new DefaultRoleRepository(mongoDatabaseFactory(config.getMongodb()));
        RuleRepository ruleRepository = new DefaultRuleRepository(mongoDatabaseFactory(config.getMongodb()));

        return new DefaultAdminService(userRepository, ruleRepository, roleRepository, credentialRepository,
                walletRepository, userTokenRepository, favoriteRepository);
    }

    @Bean
    public SubscriptionService subscriptionService(SubscriptionRepository subscriptionRepository,
                                                   SubscriptionPlanRepository subscriptionPlanRepository,
                                                   DiscountRepository discountRepository,
                                                   DiscountService discountService,
                                                   UserService userService, AdminService adminService,
                                                   SmsService smsService, MailService mailService) {
        return new DefaultSubscriptionService(subscriptionRepository, subscriptionPlanRepository, discountRepository,
                discountService, userService, adminService, smsService, mailService);
    }

    @Bean
    public DiscountService discountService(DiscountRepository discountRepository, SubscriptionRepository subscriptionRepository) {
        return new DefaultDiscountService(discountRepository, subscriptionRepository);
    }

    @Bean
    public UserTokenRepository userTokenRepository(UserExternalConfig config) {
        return new DefaultUserTokenRepository(mongoDatabaseFactory(config.getMongodb()));
    }

    @Bean
    public FavoriteRepository favoriteRepository(UserExternalConfig config) {
        return new DefaultFavoriteRepository(mongoDatabaseFactory(config.getMongodb()));
    }

    @Bean
    public UserRepository userRepository(UserExternalConfig config) {
        return new DefaultUserRepository(mongoDatabaseFactory(config.getMongodb()));
    }

    @Bean
    public CredentialRepository credentialRepository(UserExternalConfig config) {
        return new DefaultCredentialRepository(mongoDatabaseFactory(config.getMongodb()));
    }

    @Bean
    public WalletRepository walletRepository(UserExternalConfig config) {
        return new DefaultWalletRepository(mongoDatabaseFactory(config.getMongodb()));
    }

    @Bean
    public SubscriptionRepository subscriptionRepository(UserExternalConfig config) {
        return new DefaultSubscriptionRepository(mongoDatabaseFactory(config.getMongodb()));
    }

    @Bean
    public SubscriptionPlanRepository subscriptionPlanRepository(UserExternalConfig config) {
        return new DefaultSubscriptionPlanRepository(mongoDatabaseFactory(config.getMongodb()));
    }

    @Bean
    public DiscountRepository discountRepository(UserExternalConfig config) {
        return new DefaultDiscountRepository(mongoDatabaseFactory(config.getMongodb()));
    }

    private MongoDatabaseFactory mongoDatabaseFactory(MongoConfiguration configuration) {
        if (mongoDatabaseFactory != null) {
            return mongoDatabaseFactory;
        }
        String host = configuration.getHost();
        String port = String.valueOf(configuration.getPort());
        String database = configuration.getDatabase();
        String username = configuration.getUsername();
        String password = configuration.getPassword();
        port = StringUtils.isEmpty(port) ? "" : ":" + port;
        String credential = StringUtils.isEmpty(username) || StringUtils.isEmpty(password) ? "" : username + ":" + password + "@";
        String connectionString = String.format("mongodb://%s%s%s/%s?ssl=false", credential, host, port, database);
        mongoDatabaseFactory = new SimpleMongoClientDatabaseFactory(connectionString);
        return mongoDatabaseFactory;
    }

}

package ir.headphone.social.config;

import ir.headphone.social.repository.AvgRateRepository;
import ir.headphone.social.repository.LikeRepository;
import ir.headphone.social.repository.RateRepository;
import ir.headphone.social.repository.impl.DefaultAvgRateRepository;
import ir.headphone.social.repository.impl.DefaultLikeRepository;
import ir.headphone.social.repository.impl.DefaultRateRepository;
import ir.headphone.social.service.impl.DefaultSocialService;
import ir.headphone.spi.config.MongoConfiguration;
import ir.headphone.spi.social.SocialService;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import org.springframework.util.StringUtils;

public class SocialConfiguration {
    private static MongoDatabaseFactory mongoDatabaseFactory;

    @Bean
    public SocialExternalConfig socialExternalConfig(Environment environment) {
        return new SocialExternalConfig(environment);
    }

    @Bean
    public SocialService socialService(LikeRepository likeRepository, RateRepository rateRepository,
                                       AvgRateRepository avgRateRepository) {
        return new DefaultSocialService(likeRepository, rateRepository, avgRateRepository);
    }


    @Bean
    public LikeRepository likeRepository(SocialExternalConfig config) {
        return new DefaultLikeRepository(mongoDatabaseFactory(config.getMongodb()));
    }

    @Bean
    public RateRepository rateRepository(SocialExternalConfig config) {
        return new DefaultRateRepository(mongoDatabaseFactory(config.getMongodb()));
    }

    @Bean
    public AvgRateRepository avgRateRepository(SocialExternalConfig config) {
        return new DefaultAvgRateRepository(mongoDatabaseFactory(config.getMongodb()));
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

package ir.headphone.analytics.config;


import ir.headphone.analytics.repository.EventRepository;
import ir.headphone.analytics.repository.impl.mongodb.DefaultEventRepository;
import ir.headphone.analytics.service.impl.DefaultAnalyticsService;
import ir.headphone.spi.analytics.service.AnalyticsService;
import ir.headphone.spi.config.MongoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisClientConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.time.temporal.ChronoUnit;

public class AnalyticsConfiguration {

    private static MongoDatabaseFactory mongoDatabaseFactory;

    @Bean
    public RedisTemplate<String, String> redisTemplate(AnalyticsExternalConfig config) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(getConnectionFactory(config));
        return template;
    }

    @Bean
    public EventRepository eventRepository(AnalyticsExternalConfig config) {
        return new DefaultEventRepository(mongoDatabaseFactory(config.getMongodb()));
    }

    @Bean
    public AnalyticsService analyticsService(EventRepository eventRepository, RedisTemplate<String, String> redisTemplate) {
        return new DefaultAnalyticsService(eventRepository, redisTemplate);
    }

    @Bean
    public AnalyticsExternalConfig analyticsExternalConfig(Environment environment) {
        return new AnalyticsExternalConfig(environment);
    }

    private RedisConnectionFactory getConnectionFactory(AnalyticsExternalConfig config) {
        RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration();
        configuration.setDatabase(0);
        configuration.setHostName(config.getHost());
        configuration.setPort(config.getPort());
        configuration.setPassword(config.getPassword());
        JedisClientConfiguration jedisClientConfiguration = JedisClientConfiguration.builder()
                .connectTimeout(Duration.of(3, ChronoUnit.SECONDS))
                .readTimeout(Duration.of(2, ChronoUnit.SECONDS))
                .usePooling()
                .build();

        return new JedisConnectionFactory(configuration, jedisClientConfiguration);
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

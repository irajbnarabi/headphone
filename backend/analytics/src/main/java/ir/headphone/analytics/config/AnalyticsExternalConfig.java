package ir.headphone.analytics.config;

import ir.headphone.spi.config.MongoConfiguration;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
@Data
@ConfigurationProperties(prefix = "analytics")
public class AnalyticsExternalConfig {
    private String host;
    private Integer port;
    private String password;
    private MongoConfiguration mongodb;

    public AnalyticsExternalConfig(Environment environment) {
        this.host = environment.getProperty("analytics.redis.standalone.host");
        this.port = environment.getProperty("analytics.redis.standalone.port", Integer.class);
        this.password = environment.getProperty("analytics.redis.standalone.password");
        this.mongodb = new MongoConfiguration(
                environment.getProperty("analytics.mongodb.host", String.class),
                environment.getProperty("analytics.mongodb.port", Integer.class),
                environment.getProperty("analytics.mongodb.database", String.class),
                environment.getProperty("analytics.mongodb.username", String.class),
                environment.getProperty("analytics.mongodb.password", String.class));
    }
}

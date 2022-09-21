package ir.headphone.social.config;

import ir.headphone.spi.config.MongoConfiguration;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
@Data
@ConfigurationProperties(prefix = "social")
public class SocialExternalConfig {
    private MongoConfiguration mongodb;

    public SocialExternalConfig() {
    }

    public SocialExternalConfig(Environment environment) {
        this.mongodb = new MongoConfiguration(
                environment.getProperty("social.mongodb.host", String.class),
                environment.getProperty("social.mongodb.port", Integer.class),
                environment.getProperty("social.mongodb.database", String.class),
                environment.getProperty("social.mongodb.username", String.class),
                environment.getProperty("social.mongodb.password", String.class));
    }
}

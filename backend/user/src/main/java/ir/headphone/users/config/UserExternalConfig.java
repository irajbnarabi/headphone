package ir.headphone.users.config;

import ir.headphone.spi.config.MongoConfiguration;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
@Data
@ConfigurationProperties(prefix = "users")
public class UserExternalConfig {
    private Integer maxParallelLogin;
    private Integer userTokenExpiryDays;
    private Integer accessTokenExpiryMinutes;
    private String registrationEmail;
    private MongoConfiguration mongodb;

    public UserExternalConfig() {
    }

    public UserExternalConfig(Environment environment) {
        this.maxParallelLogin = environment.getProperty("users.maxParallelLogin", Integer.class);
        this.userTokenExpiryDays = environment.getProperty("users.userTokenExpiryDays", Integer.class);
        this.accessTokenExpiryMinutes = environment.getProperty("users.accessTokenExpiryMinutes", Integer.class);
        this.registrationEmail = environment.getProperty("users.registrationEmail", String.class);
        this.mongodb = new MongoConfiguration(
                environment.getProperty("users.mongodb.host", String.class),
                environment.getProperty("users.mongodb.port", Integer.class),
                environment.getProperty("users.mongodb.database", String.class),
                environment.getProperty("users.mongodb.username", String.class),
                environment.getProperty("users.mongodb.password", String.class));
    }
}

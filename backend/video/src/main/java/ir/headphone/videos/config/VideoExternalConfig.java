package ir.headphone.videos.config;

import ir.headphone.spi.config.MongoConfiguration;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
@Data
@ConfigurationProperties(prefix = "videos")
public class VideoExternalConfig {
    private MongoConfiguration mongodb;

    public VideoExternalConfig(Environment environment) {
        this.mongodb = new MongoConfiguration(
                environment.getProperty("videos.mongodb.host", String.class),
                environment.getProperty("videos.mongodb.port", Integer.class),
                environment.getProperty("videos.mongodb.database", String.class),
                environment.getProperty("videos.mongodb.username", String.class),
                environment.getProperty("videos.mongodb.password", String.class));
    }
}

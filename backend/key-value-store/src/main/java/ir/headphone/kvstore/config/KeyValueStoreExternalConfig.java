package ir.headphone.kvstore.config;

import ir.headphone.spi.config.MongoConfiguration;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
@Data
@ConfigurationProperties(prefix = "key-value-store")
public class KeyValueStoreExternalConfig {
    private MongoConfiguration mongodb;

    public KeyValueStoreExternalConfig() {
    }

    public KeyValueStoreExternalConfig(Environment environment) {
        this.mongodb = new MongoConfiguration(
                environment.getProperty("key-value-store.mongodb.host", String.class),
                environment.getProperty("key-value-store.mongodb.port", Integer.class),
                environment.getProperty("key-value-store.mongodb.database", String.class),
                environment.getProperty("key-value-store.mongodb.username", String.class),
                environment.getProperty("key-value-store.mongodb.password", String.class));
    }
}

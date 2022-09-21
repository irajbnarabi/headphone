package ir.headphone.kvstore.config;

import ir.headphone.kvstore.repository.KeyValueRepository;
import ir.headphone.kvstore.repository.impl.DefaultKeyValueRepository;
import ir.headphone.kvstore.service.impl.DefaultKeyValueStoreService;
import ir.headphone.spi.config.MongoConfiguration;
import ir.headphone.spi.kvstore.service.KeyValueStoreService;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import org.springframework.util.StringUtils;

public class KeyValueStoreConfiguration {
    private static MongoDatabaseFactory mongoDatabaseFactory;

    @Bean
    public KeyValueStoreExternalConfig keyValueStoreExternalConfig(Environment environment) {
        return new KeyValueStoreExternalConfig(environment);
    }

    @Bean
    public KeyValueStoreService keyValueStoreService(KeyValueRepository keyValueRepository) {
        return new DefaultKeyValueStoreService(keyValueRepository);
    }


    @Bean
    public KeyValueRepository keyValueRepository(KeyValueStoreExternalConfig config) {
        return new DefaultKeyValueRepository(mongoDatabaseFactory(config.getMongodb()));
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

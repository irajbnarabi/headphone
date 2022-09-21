package ir.headphone.videos.config;

import ir.headphone.spi.config.MongoConfiguration;
import ir.headphone.spi.video.service.TagService;
import ir.headphone.spi.video.service.VideoService;
import ir.headphone.videos.repository.TagBindingRepository;
import ir.headphone.videos.repository.TagDefinitionRepository;
import ir.headphone.videos.repository.TagRepository;
import ir.headphone.videos.repository.impl.mongodb.DefaultProgramRepository;
import ir.headphone.videos.repository.impl.mongodb.DefaultTagBindingRepository;
import ir.headphone.videos.repository.impl.mongodb.DefaultTagDefinitionRepository;
import ir.headphone.videos.repository.impl.mongodb.DefaultTagRepository;
import ir.headphone.videos.repository.impl.mongodb.DefaultVideoBindingRepository;
import ir.headphone.videos.service.DefaultTagService;
import ir.headphone.videos.service.DefaultVideoService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
@EnableConfigurationProperties
public class VideoConfiguration {
    private static MongoDatabaseFactory mongoDatabaseFactory;

    @Bean
    public VideoExternalConfig videoExternalConfig(Environment environment) {
        return new VideoExternalConfig(environment);
    }

    @Bean
    public TagService tagService(VideoExternalConfig config) {
        TagRepository tagRepository = new DefaultTagRepository(mongoDatabaseFactory(config.getMongodb()));
        TagDefinitionRepository tagDefinitionRepository = new DefaultTagDefinitionRepository(mongoDatabaseFactory(config.getMongodb()));
        TagBindingRepository tagBindingRepository = new DefaultTagBindingRepository(mongoDatabaseFactory(config.getMongodb()));

        return new DefaultTagService(tagRepository, tagDefinitionRepository, tagBindingRepository);
    }

    @Bean
    public VideoService videoService(VideoExternalConfig config, TagService tagService) {
        DefaultVideoBindingRepository episodeRepository = new DefaultVideoBindingRepository(mongoDatabaseFactory(config.getMongodb()));
        DefaultProgramRepository showRepository = new DefaultProgramRepository(mongoDatabaseFactory(config.getMongodb()));

        return new DefaultVideoService(episodeRepository, showRepository, tagService);
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

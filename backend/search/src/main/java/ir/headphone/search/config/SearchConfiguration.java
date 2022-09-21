package ir.headphone.search.config;

import ir.headphone.search.repository.ProgramRepository;
import ir.headphone.search.repository.TagRepository;
import ir.headphone.search.repository.impl.ElasticsearchProgramRepository;
import ir.headphone.search.repository.impl.ElasticsearchTagRepository;
import ir.headphone.search.service.ElasticSearchService;
import ir.headphone.spi.search.service.SearchService;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.RestClients;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableConfigurationProperties
@EnableScheduling
public class SearchConfiguration {
    @Bean
    public SearchService elasticsearchService(ProgramRepository programRepository, TagRepository tagRepository) {
        return new ElasticSearchService(programRepository, tagRepository);
    }

    @Bean
    public ProgramRepository elasticsearchProgramRepository(ElasticsearchOperations elasticsearchOperations) {
        return new ElasticsearchProgramRepository(elasticsearchOperations);
    }

    @Bean
    public TagRepository elasticsearchTagRepository(ElasticsearchOperations elasticsearchOperations) {
        return new ElasticsearchTagRepository(elasticsearchOperations);
    }

    @Bean
    public SearchExternalConfig searchExternalConfig(Environment environment) {
        return SearchExternalConfig.builder()
                .host(environment.getProperty("search.elastic.host"))
                .port(environment.getProperty("search.elastic.port", Integer.class))
                .build();
    }

    @Bean
    public RestHighLevelClient client(SearchExternalConfig config) {
        ClientConfiguration clientConfiguration
                = ClientConfiguration.builder()
                .connectedTo(String.format("%s:%d", config.getHost(), config.getPort()))
                .build();

        return RestClients.create(clientConfiguration).rest();
    }

    @Bean
    public ElasticsearchOperations elasticsearchTemplate(RestHighLevelClient client) {
        return new ElasticsearchRestTemplate(client);
    }
}

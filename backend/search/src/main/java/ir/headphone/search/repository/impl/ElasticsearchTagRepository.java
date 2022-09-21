package ir.headphone.search.repository.impl;

import ir.headphone.search.model.TagIndex;
import ir.headphone.search.repository.TagRepository;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.mapping.SimpleElasticsearchPersistentEntity;
import org.springframework.data.elasticsearch.repository.support.MappingElasticsearchEntityInformation;
import org.springframework.data.elasticsearch.repository.support.SimpleElasticsearchRepository;
import org.springframework.data.util.ClassTypeInformation;

public class ElasticsearchTagRepository extends SimpleElasticsearchRepository<TagIndex, String> implements TagRepository {
    public ElasticsearchTagRepository(ElasticsearchOperations elasticsearchOperations) {
        super(new MappingElasticsearchEntityInformation<>(
                new SimpleElasticsearchPersistentEntity<>(ClassTypeInformation.from(TagIndex.class))
        ), elasticsearchOperations);
    }
}

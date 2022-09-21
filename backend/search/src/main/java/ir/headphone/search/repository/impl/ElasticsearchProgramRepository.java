package ir.headphone.search.repository.impl;

import ir.headphone.search.model.ProgramIndex;
import ir.headphone.search.repository.ProgramRepository;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.mapping.SimpleElasticsearchPersistentEntity;
import org.springframework.data.elasticsearch.repository.support.MappingElasticsearchEntityInformation;
import org.springframework.data.elasticsearch.repository.support.SimpleElasticsearchRepository;
import org.springframework.data.util.ClassTypeInformation;

public class ElasticsearchProgramRepository extends SimpleElasticsearchRepository<ProgramIndex, String> implements ProgramRepository {
    public ElasticsearchProgramRepository(ElasticsearchOperations elasticsearchOperations) {
        super(new MappingElasticsearchEntityInformation<>(
                new SimpleElasticsearchPersistentEntity<>(ClassTypeInformation.from(ProgramIndex.class))
        ), elasticsearchOperations);
    }
}

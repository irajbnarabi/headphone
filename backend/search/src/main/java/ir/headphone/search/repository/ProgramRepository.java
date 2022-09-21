package ir.headphone.search.repository;

import ir.headphone.search.model.ProgramIndex;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public  interface ProgramRepository extends ElasticsearchRepository<ProgramIndex, String> {
}

package ir.headphone.search.repository;

import ir.headphone.search.model.TagIndex;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface TagRepository extends ElasticsearchRepository<TagIndex, String> {
}

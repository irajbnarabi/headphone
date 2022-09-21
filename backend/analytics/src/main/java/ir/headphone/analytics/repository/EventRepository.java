package ir.headphone.analytics.repository;

import ir.headphone.analytics.model.dentity.EventEntity;
import ir.headphone.helper.db.Repository;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Map;

public interface EventRepository extends Repository<EventEntity> {
    List<EventEntity> findEvents(String eventName, String device, Map<String, Object> data,
                                 Long from, Long to, PageRequest pageRequest);

    Long countEvents(String eventName, String device, Map<String, Object> data,
                     Long from, Long to);

}

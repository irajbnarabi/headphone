package ir.headphone.analytics.repository.impl.mongodb;

import ir.headphone.analytics.model.dentity.EventEntity;
import ir.headphone.analytics.model.dentity.QEventEntity;
import ir.headphone.analytics.repository.EventRepository;
import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.repository.support.SpringDataMongodbQuery;

import java.util.List;
import java.util.Map;

public class DefaultEventRepository extends AbstractMongodbRepository<EventEntity> implements EventRepository {
    private final QEventEntity q = QEventEntity.eventEntity;

    public DefaultEventRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, EventEntity.class);
    }

    @Override
    public <S extends EventEntity> S save(S entity) {
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(System.currentTimeMillis());
        }
        entity.setUpdatedAt(System.currentTimeMillis());
        return super.superSave(entity);
    }

    @Override
    public <S extends EventEntity> List<S> saveAll(Iterable<S> entities) {
        return super.superSaveAll(entities);
    }

    @Override
    public List<EventEntity> findEvents(String eventName, String device, Map<String, Object> data,
                                        Long from, Long to, PageRequest pageRequest) {
        return getQuery(eventName, device, data, from, to, pageRequest).fetch();

    }

    @Override
    public Long countEvents(String eventName, String device, Map<String, Object> data, Long from, Long to) {
        return getQuery(eventName, device, data, from, to, null).fetchCount();
    }

    private SpringDataMongodbQuery<EventEntity> getQuery(String eventName, String device, Map<String, Object> data,
                                                         Long from, Long to, PageRequest pageRequest) {
        SpringDataMongodbQuery<EventEntity> dsl = dsl(pageRequest).where(q.name.eq(eventName));
        if (StringUtils.isNotBlank(device)) {
            dsl.where(q.device.eq(device));
        }
        if (data != null) {
            for (String key : data.keySet()) {
                if (StringUtils.isNotBlank(String.valueOf(data.get(key)))) {
                    if (key.equals("genre")) {
                        dsl.where(q.extra.containsIgnoreCase((String) (data.get(key))));
                    } else {
                        dsl.where(q.data.contains(key, data.get(key)));
                    }
                }
            }
        }
        if (from != null) {
            dsl.where(q.createdAt.goe(from));
        }
        if (to != null) {
            dsl.where(q.createdAt.lt(to));
        }
        return dsl;
    }
}

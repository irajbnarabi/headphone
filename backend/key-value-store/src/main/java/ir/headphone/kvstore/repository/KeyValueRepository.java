package ir.headphone.kvstore.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.kvstore.model.entity.KeyValueEntity;

public interface KeyValueRepository extends Repository<KeyValueEntity> {
    KeyValueEntity getByKey(String key);
}

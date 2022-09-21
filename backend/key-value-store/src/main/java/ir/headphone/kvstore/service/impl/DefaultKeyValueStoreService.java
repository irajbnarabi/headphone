package ir.headphone.kvstore.service.impl;

import ir.headphone.kvstore.model.entity.KeyValueEntity;
import ir.headphone.kvstore.repository.KeyValueRepository;
import ir.headphone.spi.error.NotFound;
import ir.headphone.spi.kvstore.service.KeyValueStoreService;

public class DefaultKeyValueStoreService implements KeyValueStoreService {
    private final KeyValueRepository keyValueRepository;

    public DefaultKeyValueStoreService(KeyValueRepository keyValueRepository) {
        this.keyValueRepository = keyValueRepository;
    }

    @Override
    public void save(String key, String value) {
        KeyValueEntity entity;
        try {
            entity = findByKey(key);
            entity.setValue(value);
        } catch (NotFound e) {
            entity = KeyValueEntity.builder().key(key).value(value).build();
        }
        keyValueRepository.save(entity);
    }

    private KeyValueEntity findByKey(String key) {
        KeyValueEntity entity = keyValueRepository.getByKey(key);
        if (entity == null) {
            throw new NotFound("key is not found: " + key);
        }
        return entity;
    }

    @Override
    public void delete(String key) {
        keyValueRepository.deleteById(findByKey(key).getId());
    }

    @Override
    public String getValue(String key) {
        return findByKey(key).getValue();
    }
}

package ir.headphone.spi.kvstore.service;

public interface KeyValueStoreService {
    void save(String key, String value);

    void delete(String key);

    String getValue(String key);
}

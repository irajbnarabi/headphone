package ir.headphone.helper.db.mongodb;

import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.HashMap;
import java.util.Map;

public final class Utils {
    private static Map<MongoDatabaseFactory, MongoTemplate> mongoTemplates = new HashMap<>();

    public static MongoTemplate getMongoTemplate(MongoDatabaseFactory databaseFactory) {
        if (mongoTemplates.get(databaseFactory) == null) {
            MongoTemplate mongoTemplate = new MongoTemplate(databaseFactory);
            mongoTemplates.put(databaseFactory, mongoTemplate);
            return mongoTemplate;
        }
        return mongoTemplates.get(databaseFactory);
    }

}

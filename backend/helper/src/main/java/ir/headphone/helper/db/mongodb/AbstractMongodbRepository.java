package ir.headphone.helper.db.mongodb;

import com.mongodb.MongoException;
import ir.headphone.helper.db.Repository;
import ir.headphone.spi.model.Entity;
import org.apache.log4j.Logger;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.UncategorizedMongoDbException;
import org.springframework.data.mongodb.core.convert.DbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultDbRefResolver;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.data.mongodb.core.index.IndexDefinition;
import org.springframework.data.mongodb.core.index.IndexInfo;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.index.IndexResolver;
import org.springframework.data.mongodb.core.index.MongoPersistentEntityIndexResolver;
import org.springframework.data.mongodb.core.mapping.BasicMongoPersistentEntity;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.data.mongodb.core.mapping.MongoPersistentEntity;
import org.springframework.data.mongodb.repository.support.MappingMongoEntityInformation;
import org.springframework.data.mongodb.repository.support.SimpleMongoRepository;
import org.springframework.data.mongodb.repository.support.SpringDataMongodbQuery;
import org.springframework.data.mongodb.util.MongoDbErrorCodes;
import org.springframework.data.util.ClassTypeInformation;
import org.springframework.data.util.Streamable;
import org.springframework.lang.Nullable;
import org.springframework.util.ObjectUtils;

import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

public abstract class AbstractMongodbRepository<T extends Entity> extends SimpleMongoRepository<T, String> implements Repository<T> {
    private final Class<T> entity;
    private final MongoDatabaseFactory mongoDatabaseFactory;

    protected AbstractMongodbRepository(MongoDatabaseFactory mongoDatabaseFactory, Class<T> entity) {
        super(new EntityInfo<>(new BasicMongoPersistentEntity<>(ClassTypeInformation.from(entity))), Utils.getMongoTemplate(mongoDatabaseFactory));
        this.mongoDatabaseFactory = mongoDatabaseFactory;
        this.entity = entity;

        checkForAndCreateIndexes(new BasicMongoPersistentEntity<>(ClassTypeInformation.from(entity)));
    }

    protected SpringDataMongodbQuery<T> dsl() {
        return dsl(null);
    }

    protected SpringDataMongodbQuery<T> dsl(PageRequest pageRequest) {
        if (pageRequest != null) {
            return new SpringDataMongodbQuery<>(Utils.getMongoTemplate(mongoDatabaseFactory), entity).limit(pageRequest.getPageSize()).offset(pageRequest.getOffset());
        } else {
            return new SpringDataMongodbQuery<>(Utils.getMongoTemplate(mongoDatabaseFactory), entity);
        }
    }

    private MongoConverter getDefaultMongoConverter(MongoDatabaseFactory factory) {
        DbRefResolver dbRefResolver = new DefaultDbRefResolver(factory);
        MongoCustomConversions conversions = new MongoCustomConversions(Collections.emptyList());
        MongoMappingContext mappingContext = new MongoMappingContext();
        mappingContext.setSimpleTypeHolder(conversions.getSimpleTypeHolder());
        mappingContext.afterPropertiesSet();
        MappingMongoConverter converter = new MappingMongoConverter(dbRefResolver, mappingContext);
        converter.setCustomConversions(conversions);
        converter.setCodecRegistryProvider(factory);
        converter.afterPropertiesSet();
        return converter;
    }

    private void checkForAndCreateIndexes(MongoPersistentEntity<?> entity) {
        if (entity.isAnnotationPresent(Document.class)) {
            String collection = entity.getCollection();
            MongoConverter defaultMongoConverter = getDefaultMongoConverter(mongoDatabaseFactory);
            MongoMappingContext mappingContext = (MongoMappingContext) defaultMongoConverter.getMappingContext();
            IndexResolver indexResolver = IndexResolver.create(mappingContext);
            for (IndexDefinition indexDefinition : indexResolver.resolveIndexFor(entity.getTypeInformation())) {
                MongoPersistentEntityIndexResolver.IndexDefinitionHolder indexToCreate =
                        indexDefinition instanceof MongoPersistentEntityIndexResolver.IndexDefinitionHolder
                                ? (MongoPersistentEntityIndexResolver.IndexDefinitionHolder) indexDefinition
                                : new MongoPersistentEntityIndexResolver.IndexDefinitionHolder("", indexDefinition, collection);
                createIndex(indexToCreate);
            }
        }
    }

    private void createIndex(MongoPersistentEntityIndexResolver.IndexDefinitionHolder indexDefinition) {
        try {
            IndexOperations indexOperations = Utils.getMongoTemplate(mongoDatabaseFactory).indexOps(indexDefinition.getCollection());
            indexOperations.ensureIndex(indexDefinition);
        } catch (UncategorizedMongoDbException ex) {
            if (ex.getCause() instanceof MongoException
                    && MongoDbErrorCodes.isDataIntegrityViolationCode(((MongoException) ex.getCause()).getCode())) {
                IndexInfo existingIndex = fetchIndexInformation(indexDefinition);
                String message = "Cannot create index for '%s' in collection '%s' with keys '%s' and options '%s'.";
                if (existingIndex != null) {
                    message += " Index already defined as '%s'.";
                }
                throw new DataIntegrityViolationException(
                        String.format(message, indexDefinition.getPath(), indexDefinition.getCollection(),
                                indexDefinition.getIndexKeys(), indexDefinition.getIndexOptions(), existingIndex),
                        ex.getCause());
            }
            throw ex;
        }
    }

    private IndexInfo fetchIndexInformation(@Nullable MongoPersistentEntityIndexResolver.IndexDefinitionHolder indexDefinition) {
        if (indexDefinition == null) {
            return null;
        }
        try {
            IndexOperations indexOperations = Utils.getMongoTemplate(mongoDatabaseFactory).indexOps(indexDefinition.getCollection());
            Object indexNameToLookUp = indexDefinition.getIndexOptions().get("name");
            List<IndexInfo> existingIndexes = indexOperations.getIndexInfo();
            return existingIndexes.stream()
                    .filter(indexInfo -> ObjectUtils.nullSafeEquals(indexNameToLookUp, indexInfo.getName()))
                    .findFirst()
                    .orElse(null);
        } catch (Exception e) {
            Logger.getLogger(getClass()).debug(
                    String.format("Failed to load index information for collection '%s'.", indexDefinition.getCollection()), e);
        }
        return null;
    }

    public String randomId(int count) {
        Random random = new Random();
        final StringBuilder builder = new StringBuilder(count);
        final int end = 'z' + 1;
        final int start = ' ';
        final int gap = end - start;
        while (count-- != 0) {
            int codePoint;
            codePoint = random.nextInt(gap) + start;
            switch (Character.getType(codePoint)) {
                case Character.UNASSIGNED:
                case Character.PRIVATE_USE:
                case Character.SURROGATE:
                    count++;
                    continue;
            }

            final int numberOfChars = Character.charCount(codePoint);
            if (count == 0 && numberOfChars > 1) {
                count++;
                continue;
            }
            if (Character.isLetter(codePoint) || Character.isDigit(codePoint)) {
                builder.appendCodePoint(codePoint);
                if (numberOfChars == 2) {
                    count--;
                }

            } else {
                count++;
            }
        }
        return builder.toString();
    }

    protected int getIdLength() {
        return 8;
    }

    @Override
    public <S extends T> S save(S entity) {
        if (entity.getId() == null) {
            String id = randomId(getIdLength());
            while (findById(id).isPresent()) {
                id = randomId(getIdLength());
            }
            entity.setId(id);
        }
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(System.currentTimeMillis());
        }
        entity.setUpdatedAt(System.currentTimeMillis());
        return super.save(entity);
    }

    protected <S extends T> S superSave(S entity) {
        return super.save(entity);
    }

    @Override
    public <S extends T> List<S> saveAll(Iterable<S> entities) {
        Streamable<S> source = Streamable.of(entities);
        return source.stream().map(this::save).collect(Collectors.toList());
    }

    protected <S extends T> List<S> superSaveAll(Iterable<S> entities) {
        return super.saveAll(entities);
    }

    @Override
    public void deleteAll() {
        throw new RuntimeException("method not permitted");
    }

    @Override
    public void deleteById(String id) {
        findById(id).ifPresent(super::delete);
    }

    private static class EntityInfo<T, ID> extends MappingMongoEntityInformation<T, ID> {
        public EntityInfo(MongoPersistentEntity entity) {
            super(entity);
        }

        @Override
        public boolean isNew(Object entity) {
            return ((Entity) entity).getId() == null;
        }
    }
}

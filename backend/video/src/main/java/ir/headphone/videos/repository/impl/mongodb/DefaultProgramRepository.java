package ir.headphone.videos.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.spi.video.model.ProgramType;
import ir.headphone.videos.model.entity.ProgramEntity;
import ir.headphone.videos.model.entity.QProgramEntity;
import ir.headphone.videos.repository.ProgramRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.repository.support.SpringDataMongodbQuery;

import java.util.Collection;

public class DefaultProgramRepository extends AbstractMongodbRepository<ProgramEntity> implements ProgramRepository {
    private static final QProgramEntity q = QProgramEntity.programEntity;


    public DefaultProgramRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, ProgramEntity.class);
    }

    @Override
    protected int getIdLength() {
        return 5;
    }

    @Override
    public Collection<ProgramEntity> findAllByType(ProgramType type, PageRequest pageRequest) {
        return dsl(pageRequest)
                .where(q.type.eq(type.name()))
                .orderBy(q.updatedAt.desc())
                .fetch();
    }

    @Override
    public Collection<ProgramEntity> findAllByPrefixAndType(String prefix, ProgramType type, PageRequest pageRequest) {
        SpringDataMongodbQuery<ProgramEntity> query = dsl(pageRequest);
        if (type != null) {
            query.where(q.type.eq(type.name()));
        }
        return query
                .where(q.title.startsWithIgnoreCase(prefix))
                .fetch();
    }

    @Override
    public Collection<ProgramEntity> getLatest(ProgramType type, PageRequest pageRequest) {
        return dsl(pageRequest)
                .where(q.type.eq(type.name()), q.enabled.eq(true))
                .orderBy(q.updatedAt.desc())
                .limit(pageRequest.getPageSize()).offset(pageRequest.getOffset())
                .fetch();
    }

    @Override
    public Long getCountByType(ProgramType type) {
        return dsl()
                .where(q.type.eq(type.name()))
                .fetchCount();
    }
}

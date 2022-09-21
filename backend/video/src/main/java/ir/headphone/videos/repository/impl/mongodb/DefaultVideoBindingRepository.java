package ir.headphone.videos.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.videos.model.entity.QVideoBindingEntity;
import ir.headphone.videos.model.entity.VideoBindingEntity;
import ir.headphone.videos.repository.VideoBindingRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.MongoDatabaseFactory;

import java.util.Collection;

public class DefaultVideoBindingRepository extends AbstractMongodbRepository<VideoBindingEntity> implements VideoBindingRepository {
    private static final QVideoBindingEntity q = QVideoBindingEntity.videoBindingEntity;

    public DefaultVideoBindingRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, VideoBindingEntity.class);
    }

    @Override
    public VideoBindingEntity getVideoBinding(String programId, Integer seasonNumber, Integer episodeNumber) {
        return dsl()
                .where(
                        q.programId.eq(programId),
                        q.seasonNumber.eq(seasonNumber),
                        q.episodeNumber.eq(episodeNumber))
                .fetchOne();
    }

    @Override
    public VideoBindingEntity getVideoBinding(String videoId) {
        return dsl()
                .where(q.videoId.eq(videoId))
                .fetchOne();
    }

    @Override
    public Collection<VideoBindingEntity> getVideoBindings(String programId, PageRequest pageRequest) {
        return dsl(pageRequest)
                .where(q.programId.eq(programId))
                .fetch();
    }

    @Override
    public Collection<VideoBindingEntity> getVideoBindings(String programId, Integer seasonNumber, PageRequest pageRequest) {
        return dsl(pageRequest)
                .where(
                        q.programId.eq(programId),
                        q.seasonNumber.eq(seasonNumber))
                .fetch();
    }
}

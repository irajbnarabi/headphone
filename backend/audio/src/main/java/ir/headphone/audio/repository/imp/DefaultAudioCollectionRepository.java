package ir.headphone.audio.repository.imp;

import ir.headphone.audio.model.entity.AudioCollectionEntity;
import ir.headphone.audio.repository.AudioCollectionRepository;
import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.spi.audio.model.AudioCollectionType;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.MongoDatabaseFactory;

import java.util.Collection;

public class DefaultAudioCollectionRepository extends AbstractMongodbRepository<AudioCollectionEntity> implements AudioCollectionRepository {

    //private static final QAudio q = QAudio.programEntity;

    public DefaultAudioCollectionRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, AudioCollectionEntity.class);
    }

    @Override
    public Collection<AudioCollectionEntity> findAllByType(AudioCollectionType type, PageRequest pageRequest) {
        return null;
    }

    @Override
    public Collection<AudioCollectionEntity> findAllByPrefixAndType(String prefix, AudioCollectionType type, PageRequest pageRequest) {
        return null;
    }

    @Override
    public Collection<AudioCollectionEntity> getLatest(AudioCollectionType type, PageRequest pageRequest) {
        return null;
    }

    @Override
    public Long getCountByType(AudioCollectionType type) {
        return null;
    }
}

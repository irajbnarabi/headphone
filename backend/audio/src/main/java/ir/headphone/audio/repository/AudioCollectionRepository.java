package ir.headphone.audio.repository;

import ir.headphone.audio.model.entity.AudioCollectionEntity;
import ir.headphone.helper.db.Repository;
import ir.headphone.spi.audio.model.AudioCollectionType;
import org.springframework.data.domain.PageRequest;

import java.util.Collection;

public interface AudioCollectionRepository extends Repository<AudioCollectionEntity> {

    Collection<AudioCollectionEntity> findAllByType(AudioCollectionType type, PageRequest pageRequest);

    Collection<AudioCollectionEntity> findAllByPrefixAndType(String prefix, AudioCollectionType type, PageRequest pageRequest);

    Collection<AudioCollectionEntity> getLatest(AudioCollectionType type, PageRequest pageRequest);

    Long getCountByType(AudioCollectionType type);
}

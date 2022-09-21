package ir.headphone.videos.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.spi.video.model.ProgramType;
import ir.headphone.videos.model.entity.ProgramEntity;
import org.springframework.data.domain.PageRequest;

import java.util.Collection;

public interface ProgramRepository extends Repository<ProgramEntity> {
    Collection<ProgramEntity> findAllByType(ProgramType type, PageRequest pageRequest);

    Collection<ProgramEntity> findAllByPrefixAndType(String prefix, ProgramType type, PageRequest pageRequest);

    Collection<ProgramEntity> getLatest(ProgramType type, PageRequest pageRequest);

    Long getCountByType(ProgramType type);
}

package ir.headphone.videos.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.videos.model.entity.VideoBindingEntity;
import org.springframework.data.domain.PageRequest;

import java.util.Collection;

public interface VideoBindingRepository extends Repository<VideoBindingEntity> {
    VideoBindingEntity getVideoBinding(String programId, Integer seasonNumber, Integer episodeNumber);

    VideoBindingEntity getVideoBinding(String videoId);

    Collection<VideoBindingEntity> getVideoBindings(String programId, PageRequest pageRequest);

    Collection<VideoBindingEntity> getVideoBindings(String programId, Integer seasonNumber, PageRequest pageRequest);
}

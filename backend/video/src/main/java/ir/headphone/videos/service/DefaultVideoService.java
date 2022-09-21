package ir.headphone.videos.service;

import com.mongodb.lang.Nullable;
import ir.headphone.spi.error.NotFound;
import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.video.model.Program;
import ir.headphone.spi.video.model.ProgramType;
import ir.headphone.spi.video.model.VideoBinding;
import ir.headphone.spi.video.service.TagService;
import ir.headphone.spi.video.service.VideoService;
import ir.headphone.videos.error.VideoNotFound;
import ir.headphone.videos.model.entity.ProgramEntity;
import ir.headphone.videos.model.entity.VideoBindingEntity;
import ir.headphone.videos.repository.ProgramRepository;
import ir.headphone.videos.repository.VideoBindingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public class DefaultVideoService implements VideoService {
    private final VideoBindingRepository videoBindingRepository;
    private final ProgramRepository programRepository;
    private final TagService tagService;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    public DefaultVideoService(VideoBindingRepository videoBindingRepository, ProgramRepository programRepository, TagService tagService) {
        this.videoBindingRepository = videoBindingRepository;
        this.programRepository = programRepository;
        this.tagService = tagService;
    }

    public VideoBindingRepository getVideoBindingRepository() {
        return videoBindingRepository;
    }

    public ProgramRepository getProgramRepository() {
        return programRepository;
    }

    @Override
    public VideoBinding getVideoBinding(String id) {
        Optional<VideoBindingEntity> episodeEntity = videoBindingRepository.findById(id);
        if (!episodeEntity.isPresent()) {
            throw new VideoNotFound(id);
        }
        return episodeEntity.get();
    }

    @Override
    public VideoBinding createVideoBinding(VideoBinding videoBinding) {
        return videoBindingRepository.save(new VideoBindingEntity(videoBinding));
    }

    @Override
    public void unbindVideo(String id) {
        VideoBinding binding = getVideoBindingByVideoId(id);
        tagService.deleteTagBindingByEntityId(binding.getVideoId());
        deleteProgram(binding.getVideoId());
        videoBindingRepository.deleteById(binding.getId());
    }

    @Override
    public Collection<VideoBinding> getVideoBindings(String programId, @Nullable PageSize pageSize) {
        Collection<VideoBindingEntity> episodes = videoBindingRepository.getVideoBindings(programId,
                pageSize == null ? null : PageRequest.of(pageSize.getPage(), pageSize.getSize()));
        List<VideoBinding> result = new ArrayList<>();
        for (VideoBindingEntity episode : episodes) {
            result.add(new VideoBindingEntity(episode));
        }
        return result;
    }

    @Override
    public VideoBinding getVideoBindingByVideoId(String videoId) {
        return videoBindingRepository.getVideoBinding(videoId);
    }

    @Override
    public VideoBinding getVideoBindingByProgramId(String programId, Integer seasonNumber, Integer episodeNumber) {
        return videoBindingRepository.getVideoBinding(programId, seasonNumber, episodeNumber);
    }

    @Override
    public Collection<VideoBinding> getVideoBindings(String programId, Integer seasonNumber, PageSize pageSize) {
        Collection<VideoBindingEntity> episodes = videoBindingRepository.getVideoBindings(programId, seasonNumber,
                pageSize == null ? null : PageRequest.of(pageSize.getPage(), pageSize.getSize()));
        List<VideoBinding> result = new ArrayList<>();
        for (VideoBindingEntity episode : episodes) {
            result.add(new VideoBindingEntity(episode));
        }
        return result;
    }

    @Override
    public Program getProgram(String id) {
        Optional<ProgramEntity> entity = programRepository.findById(id);
        if (!entity.isPresent()) {
            throw new NotFound();
        }
        return entity.get();
    }

    @Override
    public Program createProgram(Program program) {
        ProgramEntity entity = new ProgramEntity(program);
        if (program.getEnabled() == null) {
            entity.setEnabled(false);
        }
        entity = programRepository.save(entity);
        eventPublisher.publishEvent("updateProgram|" + entity.getId());
        return entity;
    }

    @Override
    public Collection<Program> getPrograms(ProgramType type, PageSize pageSize) {
        if (type == null) {
            Page<ProgramEntity> programs = programRepository.findAll(PageRequest.of(pageSize.getPage(), pageSize.getSize()));
            List<Program> result = new ArrayList<>();
            for (ProgramEntity program : programs) {
                result.add(new ProgramEntity(program));
            }
            return result;
        }
        Collection<ProgramEntity> programs = programRepository.findAllByType(type, PageRequest.of(pageSize.getPage(), pageSize.getSize()));
        List<Program> result = new ArrayList<>();
        for (ProgramEntity program : programs) {
            result.add(new ProgramEntity(program));
        }
        return result;
    }

    @Override
    public Collection<Program> getProgramsByPrefix(String prefix, ProgramType type, PageSize pageSize) {
        Collection<ProgramEntity> programs = programRepository.findAllByPrefixAndType(prefix, type, PageRequest.of(pageSize.getPage(), pageSize.getSize()));
        List<Program> result = new ArrayList<>();
        for (ProgramEntity program : programs) {
            result.add(new ProgramEntity(program));
        }
        return result;
    }

    @Override
    public Collection<Program> getLatestPrograms(ProgramType type, PageSize pageSize) {
        Collection<ProgramEntity> programs = programRepository.getLatest(type, PageRequest.of(pageSize.getPage(), pageSize.getSize()));
        return new ArrayList<>(programs);
    }

    @Override
    public Collection<Program> getProgramsByTag(String tagId, ProgramType type, PageSize pageSize) {
        Collection<String> ids = tagService.getEntitiesByTagIdAndEntityType(tagId, type.name(), pageSize);
        List<Program> result = new ArrayList<>();
        for (String id : ids) {
            try {
                Program program = getProgram(id);
                if (program != null) {
                    result.add(new ProgramEntity(program));
                }
            } catch (Exception ignored404) {
            }
        }
        return result;
    }

    @Override
    public Long getCount(ProgramType type) {
        return programRepository.getCountByType(type);
    }

    @Override
    public void deleteProgram(String id) {
        Program program = getProgram(id);
        Collection<VideoBinding> bindings = getVideoBindings(id, null);
        for (VideoBinding binding : bindings) {
            unbindVideo(binding.getId());
        }

        tagService.deleteTagBindingByEntityId(id);
        programRepository.deleteById(program.getId());
        eventPublisher.publishEvent("deleteProgram|" + id);
    }
}

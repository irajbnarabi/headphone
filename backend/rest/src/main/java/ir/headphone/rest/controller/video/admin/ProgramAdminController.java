package ir.headphone.rest.controller.video.admin;

import ir.headphone.rest.controller.video.AbstractProgramController;
import ir.headphone.rest.controller.video.admin.model.ProgramEntity;
import ir.headphone.rest.controller.video.admin.model.TagBindingEntity;
import ir.headphone.rest.controller.video.admin.model.VideoBindingEntity;
import ir.headphone.rest.controller.video.dto.ProgramDto;
import ir.headphone.rest.controller.video.dto.ProgramPageDto;
import ir.headphone.rest.controller.video.dto.AlbumDto;
import ir.headphone.rest.i18n.Internationalization;
import ir.headphone.rest.service.impl.DefaultContextHolder;
import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.search.service.SearchService;
import ir.headphone.spi.user.service.AdminService;
import ir.headphone.spi.video.model.Program;
import ir.headphone.spi.video.model.ProgramType;
import ir.headphone.spi.video.model.Tag;
import ir.headphone.spi.video.model.TagBinding;
import ir.headphone.spi.video.model.VideoBinding;
import ir.headphone.spi.video.service.TagService;
import ir.headphone.spi.video.service.VideoService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/headphone/{type}")
public class ProgramAdminController extends AbstractProgramController {

    private final AdminService adminService;

    public ProgramAdminController(VideoService videoService, TagService tagService, SearchService searchService,
                                  Internationalization i18n, AdminService adminService) {
        super(videoService, tagService, searchService, i18n);
        this.adminService = adminService;
    }

    @GetMapping("/{id}")
    public ProgramPageDto get(@PathVariable String type, @PathVariable String id) {
        Program program = getProgramEntity(id, null);
        ProgramPageDto res = new ProgramPageDto(program, fileStorageService.prepareImages(program.getImage()));

        res.setTags(getTags(program.getId()));

        Collection<VideoBinding> bindings = videoService.getVideoBindings(program.getId(), PageSize.of(0, 1000));
        Map<Integer, List<AlbumDto>> seasons = new HashMap<>();
        for (VideoBinding binding : bindings) {
            Program v = getProgramEntity(binding.getVideoId(), getType(type));
            AlbumDto e = new AlbumDto(binding, v);
            e.setTags(getTags(e.getId()));
            seasons.putIfAbsent(binding.getSeasonNumber(), new ArrayList<>());
            seasons.get(binding.getSeasonNumber()).add(e);
        }
        res.setSeasons(seasons);

        return res;
    }

    @GetMapping("")
    public Collection<ProgramDto> getAll(@PathVariable String type,
                                         @RequestParam(defaultValue = "") String prefix) {
        Collection<Program> programs;
        ProgramType t;
        if (type.equals("typeless")) {
            t = null;
        } else {
            t = getType(type);
        }
        if (StringUtils.isNotBlank(prefix)) {
            programs = videoService.getProgramsByPrefix(prefix, t, context.pageSize());
        } else {
            programs = videoService.getPrograms(t, context.pageSize());
        }
        return getDtos(t, programs, context.pageSize());
    }

    private List<ProgramDto> getDtos(ProgramType type, Collection<Program> programs, PageSize pageSize) {
        List<ProgramDto> result = new ArrayList<>();
        for (Program program : programs) {
            result.add(new ProgramDto(program, fileStorageService.prepareImages(program.getImage())));
        }
        if (type != null) {
            DefaultContextHolder.getInstance().setPageCount(videoService.getCount(type) / pageSize.getSize() + 1);
        }
        return result;
    }

    @PostMapping("")
    public ProgramDto create(@PathVariable String type, @RequestBody ProgramDto programDto) {
        programDto.setId(null);
        ProgramEntity entity = new ProgramEntity(programDto);
        entity.setType(getType(type).name());
        Program program = videoService.createProgram(entity);
        return new ProgramDto(program, fileStorageService.prepareImages(program.getImage()));
    }

    @PutMapping("/{id}")
    public void update(@PathVariable String type, @PathVariable String id, @RequestBody ProgramDto dto) {
        ProgramEntity show = new ProgramEntity(getProgramEntity(id, null));
        if (dto.getTitle() != null) {
            show.setTitle(dto.getTitle());
        }
        if (dto.getDescription() != null) {
            show.setDescription(dto.getDescription());
        }
        if (dto.getImage() != null) {
            show.setImage(dto.getImage());
        }

        videoService.createProgram(show);
    }

    @PutMapping("/{id}/enable")
    public void enable(@PathVariable String type, @PathVariable String id) {
        Program program = videoService.getProgram(id);
        ProgramEntity entity = new ProgramEntity(program);
        entity.setEnabled(Boolean.TRUE);
        videoService.createProgram(entity);
    }

    @PutMapping("/{id}/disable")
    public void disable(@PathVariable String type, @PathVariable String id) {
        Program program = videoService.getProgram(id);
        ProgramEntity entity = new ProgramEntity(program);
        entity.setEnabled(Boolean.FALSE);
        videoService.createProgram(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String type, @PathVariable String id) {
        videoService.deleteProgram(getProgramEntity(id, null).getId());
        adminService.deleteFavoritesByProgramId(id);
    }

    @GetMapping("/{id}/videos/{videoId}")
    public AlbumDto getVideo(@PathVariable String type, @PathVariable String id, @PathVariable String videoId) {
        return new AlbumDto(videoService.getVideoBinding(videoId), getProgramEntity(id, null));
    }

    @PostMapping("/{id}/videos")
    public AlbumDto addVideo(@PathVariable String type, @PathVariable String id, @RequestBody AlbumDto AlbumDto) {
        if (AlbumDto.getEpisodeNumber() == null) {
            AlbumDto.setEpisodeNumber(1);
        }
        if (AlbumDto.getSeasonNumber() == null) {
            AlbumDto.setSeasonNumber(1);
        }
        ProgramEntity programEntity = new ProgramEntity(AlbumDto);
        programEntity.setId(null);
        Program video = videoService.createProgram(programEntity);
        VideoBindingEntity bindingEntity = new VideoBindingEntity(AlbumDto);
        bindingEntity.setVideoId(video.getId());
        bindingEntity.setProgramId(getProgramEntity(id, null).getId());
        VideoBinding binding = videoService.createVideoBinding(bindingEntity);
        AlbumDto.setId(binding.getVideoId());
        return AlbumDto;
    }

    @PutMapping("/{id}/videos")
    public AlbumDto updateVideo(@PathVariable String type, @PathVariable String id, @RequestBody AlbumDto AlbumDto) {
        VideoBinding binding = videoService.getVideoBindingByVideoId(getProgramEntity(AlbumDto.getId(), null).getId());
        Program program = getProgramEntity(binding.getVideoId(), ProgramType.VIDEO);
        ProgramEntity programEntity = new ProgramEntity(program);
        programEntity.setTitle(AlbumDto.getTitle());
        programEntity.setDescription(AlbumDto.getDescription());
        programEntity.setImage(AlbumDto.getImage());
        programEntity.setEnabled(AlbumDto.getEnabled());
        videoService.createProgram(programEntity);

        VideoBindingEntity bindingEntity = new VideoBindingEntity(binding);
        bindingEntity.setEpisodeNumber(AlbumDto.getEpisodeNumber());
        bindingEntity.setSeasonNumber(AlbumDto.getSeasonNumber());
        videoService.createVideoBinding(bindingEntity);
        return AlbumDto;
    }

    @DeleteMapping("/{id}/videos/{videoId}")
    public void deleteVideo(@PathVariable String type, @PathVariable String id, @PathVariable String videoId) {
        videoService.unbindVideo(videoId);
    }

    @DeleteMapping("/{id}/tags/{tagId}")
    public void removeTag(@PathVariable String type, @PathVariable String id, @PathVariable String tagId) {
        Program entity = getProgramEntity(id, null);
        Tag tag = tagService.getTag(tagId);
        tagService.deleteTagBindingByEntityIdAndTagId(entity.getId(), tag.getId());
    }

    @PutMapping("/{id}/tags/{tagId}")
    public void addTag(@PathVariable String type, @PathVariable String id, @PathVariable String tagId, @RequestBody(required = false) HashMap<String, Object> bindings) {
                    Program entity = getProgramEntity(id, null);
        Tag tag = tagService.getTag(tagId);
        TagBinding current = tagService.getTagBindingByEntityIdAndTagId(entity.getId(), tag.getId());
        TagBindingEntity tagBindingEntity;
        if (current != null) {
            tagBindingEntity = new TagBindingEntity(current);
            tagBindingEntity.setBindings(bindings);
        } else {
            tagBindingEntity = TagBindingEntity.builder()
                    .entityId(entity.getId())
                    .entityType(entity.getType())
                    .tagId(tag.getId())
                    .bindings(bindings)
                    .build();
        }
        tagService.createTagBinding(tagBindingEntity);
    }
}

package ir.headphone.rest.controller.video;

import ir.headphone.rest.controller.AbstractController;
import ir.headphone.rest.controller.video.dto.ProgramPageDto;
import ir.headphone.rest.controller.video.dto.TagDto;
import ir.headphone.rest.controller.video.dto.AlbumDto;
import ir.headphone.rest.error.RestError;
import ir.headphone.rest.i18n.Internationalization;
import ir.headphone.spi.error.NotFound;
import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.search.service.SearchService;
import ir.headphone.spi.video.model.Program;
import ir.headphone.spi.video.model.ProgramType;
import ir.headphone.spi.video.model.Tag;
import ir.headphone.spi.video.model.TagBinding;
import ir.headphone.spi.video.model.TagDefinition;
import ir.headphone.spi.video.model.VideoBinding;
import ir.headphone.spi.video.service.TagService;
import ir.headphone.spi.video.service.VideoService;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class AbstractProgramController extends AbstractController {
    protected final VideoService videoService;
    protected final TagService tagService;
    protected final SearchService searchService;
    protected final Internationalization i18n;

    protected AbstractProgramController(VideoService videoService, TagService tagService, SearchService searchService,
                                        Internationalization i18n) {
        this.videoService = videoService;
        this.tagService = tagService;
        this.searchService = searchService;
        this.i18n = i18n;
    }

    protected Program getProgramEntity(String id, ProgramType type) {
        Program program = videoService.getProgram(id);
        if (type != null && !program.getType().equals(type.name())) {
            throw new NotFound(type.name() + ": " + id);
        }
        return program;
    }


    public ProgramPageDto getProgram(String id, Boolean includeVideos, Boolean includeVideosTags) {
        Program program = getProgramEntity(id, null);
        ProgramPageDto res = new ProgramPageDto(program, fileStorageService.prepareImages(program.getImage()));

        res.setTags(getTags(program.getId()));
        if (includeVideos) {
            Collection<VideoBinding> bindings = videoService.getVideoBindings(program.getId(), PageSize.of(0, 1000));
            Map<Integer, List<AlbumDto>> seasons = new HashMap<>();
            for (VideoBinding binding : bindings) {
                Program v = getProgramEntity(binding.getVideoId(), ProgramType.ALBUM);
                AlbumDto e = new AlbumDto(binding, v);
                if (includeVideosTags) {
                    e.setTags(getTags(e.getId()));
                }
                seasons.putIfAbsent(binding.getSeasonNumber(), new ArrayList<>());
                seasons.get(binding.getSeasonNumber()).add(e);
            }
            res.setSeasons(seasons);
        }

        return res;
    }

    protected Map<String, List<TagDto>> getTags(String entityId) {
        Collection<? extends TagBinding> bindings = tagService.getTagBindingsByEntityId(entityId, PageSize.of(0, 20));
        Map<String, List<TagDto>> res = new HashMap<>();
        for (TagBinding binding : bindings) {
            Tag tag = tagService.getTag(binding.getTagId());
            TagDefinition definition = tagService.getTagDefinition(tag.getTagDefinitionId());
            res.computeIfAbsent(definition.getName(), l -> new ArrayList<>());
            res.computeIfPresent(definition.getName(), (k, v) -> {
                v.add(TagDto.builder()
                        .bindings(binding.getBindings())
                        .fields(tag.getFields())
                        .id(tag.getId())
                        .value(tag.getValue())
                        .build());
                return v;
            });
        }
        return res;
    }

    protected ProgramPageDto setDirector(Program program) {
        ProgramPageDto dto = new ProgramPageDto(program, fileStorageService.prepareImages(program.getImage()));
        Map<String, List<TagDto>> tags = getTags(program.getId());
        List<TagDto> crew = tags.get("crew");
        if (crew != null) {
            for (TagDto tag : crew) {
                if (tag.getBindings() != null && tag.getBindings().get("role") != null) {
                    String role;
                    if (tag.getBindings().get("role") instanceof Collection) {
                        role = ((String) (((Collection<?>) tag.getBindings().get("role")).stream().findFirst().get()));
                    } else {
                        role = (String) tag.getBindings().get("role");
                    }
                    if (role.equals(i18n.getMessage("director"))) { //TODO change this shitty name!
                        dto.setDirector(tag.getValue());
                    }
                }
            }
        }
        return dto;
    }

    public List<ProgramPageDto> getRelated(ProgramType type, String id, PageSize pageSize) {
        ProgramPageDto program = getProgram(id, false, false);
        Collection<Program> programs;
        List<TagDto> genre = program.getTags().get("genre");
        List<ProgramPageDto> result = new ArrayList<>();
        if (genre != null) {
            if (genre.size() > 0) {
                programs = videoService.getProgramsByTag(genre.get(0).getId(), type, pageSize);
                for (Program p : programs) {
                    result.add(setDirector(p));
                }
            }
        }
        return result;
    }

    protected ProgramType getType(String type) {
        switch (type.toLowerCase()) {
            case "albums":
            case "album":
                return ProgramType.ALBUM;
            case "playlist":
            case "playlists":
                return ProgramType.PLAYLIST;
            case "video":
            case "videos":
                return ProgramType.VIDEO;
            default:
                throw new RestError("path not found", 404);
        }
    }

}

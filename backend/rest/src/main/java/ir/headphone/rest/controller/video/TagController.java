package ir.headphone.rest.controller.video;

import ir.headphone.rest.controller.AbstractController;
import ir.headphone.rest.controller.home.Carousel;
import ir.headphone.rest.controller.video.dto.ProgramDto;
import ir.headphone.rest.controller.video.dto.ProgramPageDto;
import ir.headphone.rest.controller.video.dto.TagDto;
import ir.headphone.rest.i18n.Internationalization;
import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.social.SocialService;
import ir.headphone.spi.user.service.UserService;
import ir.headphone.spi.video.model.Program;
import ir.headphone.spi.video.model.ProgramType;
import ir.headphone.spi.video.model.Tag;
import ir.headphone.spi.video.model.TagBinding;
import ir.headphone.spi.video.model.TagDefinition;
import ir.headphone.spi.video.service.TagService;
import ir.headphone.spi.video.service.VideoService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tags")
public class TagController extends AbstractController {
    private final TagService tagService;
    private final VideoService videoService;
    private final Internationalization i18n;
    private final UserService userService;
    private final SocialService socialService;

    public TagController(TagService tagService, VideoService videoService, Internationalization i18n,
                         UserService userService, SocialService socialService) {
        this.tagService = tagService;
        this.videoService = videoService;
        this.i18n = i18n;
        this.userService = userService;
        this.socialService = socialService;
    }

    @GetMapping("/{id}/page")
    public TagDto getPage(@PathVariable String id) {
        Tag tag = tagService.getTag(id);
        TagDefinition tagDefinition = tagService.getTagDefinition(tag.getTagDefinitionId());
        List<Carousel> carousels = new ArrayList<>();
        Collection<Program> albums = videoService.getProgramsByTag(tag.getId(), ProgramType.ALBUM, PageSize.of(0, 10));
        List<ProgramDto> moviesObjects = new ArrayList<>();
        for (Program p : albums) {
            moviesObjects.add(new ProgramDto(p, fileStorageService.prepareImages(p.getImage())));
        }
        carousels.add(Carousel.builder()
                .title(i18n.getMessage("videos.movie"))
                .deepLink(String.format("/t/%s/%s/movies", tagDefinition.getName(), tag.getId()))
                .order(0)
                .moreTitle(i18n.getMessage("videos.seeAll"))
                .render(Carousel.Render.builder().type(Carousel.CarouselType.CAROUSEL).objectType(Carousel.Render.ObjectType.ALBUM).build())
                .objects(moviesObjects)
                .build());
        Collection<Program> playLists = videoService.getProgramsByTag(tag.getId(), ProgramType.PLAYLIST, PageSize.of(0, 10));
        List<ProgramDto> seriesObjects = new ArrayList<>();
        for (Program p : playLists) {
            seriesObjects.add(new ProgramDto(p, fileStorageService.prepareImages(p.getImage())));
        }
        carousels.add(Carousel.builder()
                .title(i18n.getMessage("videos.series"))
                .deepLink(String.format("/t/%s/%s/series", tagDefinition.getName(), tag.getId()))
                .order(0)
                .moreTitle(i18n.getMessage("videos.seeAll"))
                .render(Carousel.Render.builder().type(Carousel.CarouselType.CAROUSEL).objectType(Carousel.Render.ObjectType.PLAYLIST).build())
                .objects(seriesObjects)
                .build());
        TagDto tagDto = new TagDto(tag, tagDefinition.getName());
        prepareImages(tag, tagService.getTagDefinition(tag.getTagDefinitionId()));
        tagDto.setCarousels(carousels);
        return tagDto;
    }

    @GetMapping("/{id}/{type}")
    public List<ProgramPageDto> getPrograms(@PathVariable String id, @PathVariable String type) {
        if (type.toLowerCase().equals("albums")) {
            type = "album";
        }
        String userId = "";
        if (StringUtils.isNotBlank(context.userToken())) {
            try {
                userId = userService.getUserId(context.userToken());
            } catch (Exception ignored) {
            }
        }
        Collection<Program> programs;

        //TODO remove this exception
        if (id.equals("latest")) {
            programs = videoService.getLatestPrograms(ProgramType.valueOf(type.toUpperCase()), context.pageSize());
        } else {
            programs = videoService.getProgramsByTag(id, ProgramType.valueOf(type.toUpperCase()), context.pageSize());
        }
        List<ProgramPageDto> result = new ArrayList<>();
        for (Program p : programs) {
            if (!p.getEnabled()) {
                continue;
            }
            ProgramPageDto dto = new ProgramPageDto(p, fileStorageService.prepareImages(p.getImage()));
            Map<String, List<TagDto>> tags = getTags(p.getId());
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
            if (StringUtils.isNotBlank(userId)) {
                dto.setIsFavorite(userService.isFavorite(userId, dto.getId()));
                dto.setLiked(socialService.isLiked(userId, dto.getId()));
                dto.setDisliked(socialService.isDisliked(userId, dto.getId()));
            }

            result.add(dto);
        }
        return result;
    }


    protected Map<String, List<TagDto>> getTags(String entityId) {
        Collection<? extends TagBinding> bindings = tagService.getTagBindingsByEntityId(videoService.getProgram(entityId).getId(), PageSize.of(0, 20));
        Map<String, List<TagDto>> res = new HashMap<>();
        for (TagBinding binding : bindings) {
            Tag tag = tagService.getTag(binding.getTagId());
            prepareImages(tag, tagService.getTagDefinition(tag.getTagDefinitionId()));
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
}

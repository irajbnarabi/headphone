package ir.headphone.rest.controller.video;

import ir.headphone.rest.controller.home.Carousel;
import ir.headphone.rest.controller.video.dto.ProgramPageDto;
import ir.headphone.rest.controller.video.dto.TagDto;
import ir.headphone.rest.i18n.Internationalization;
import ir.headphone.search.model.TagIndex;
import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.search.service.SearchService;
import ir.headphone.spi.video.model.Program;
import ir.headphone.spi.video.model.ProgramType;
import ir.headphone.spi.video.model.Tag;
import ir.headphone.spi.video.service.TagService;
import ir.headphone.spi.video.service.VideoService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/headphone/search")
public class SearchController extends AbstractProgramController {

    protected SearchController(VideoService videoService, TagService tagService, SearchService searchService,
                               Internationalization i18n) {
        super(videoService, tagService, searchService, i18n);
    }

    @GetMapping("/intro/{type}")
    public List<Carousel> intro(@PathVariable String type) {
        List<Carousel> result = new ArrayList<>();
        String t = type;
        if (t.equals("movie")) {
            t = "movies";
        }
        if (type.equals("movies")) {
            type = "movie";
        }
        Collection<? extends Tag> genres = tagService.getTagsByDefinition("genre", PageSize.of(0, 20));
        for (Tag genre : genres) {
            Collection<Program> programs = videoService.getProgramsByTag(genre.getId(), ProgramType.valueOf(type.toUpperCase()), PageSize.of(0, 10));
            List<ProgramPageDto> objects = new ArrayList<>();
            for (Program program : programs) {
                objects.add(setDirector(program));
            }
            result.add(Carousel.builder()
                    .title(genre.getValue())
                    .objects(objects)
                    .render(Carousel.Render.builder().objectType(Carousel.Render.ObjectType.valueOf(type.toUpperCase())).type(Carousel.CarouselType.CAROUSEL).build())
                    .deepLink(String.format("/t/genre/%s/%s", genre.getId(), t))
                    .build());
        }
        return result;
    }

    @GetMapping("")
    public List<Carousel> search(@RequestParam String q, @RequestParam(required = false) String types) {
        try {
            saveEvent("search", Map.of("q", q));
        } catch (Exception ignored) {
        }
        List<Carousel.Render.ObjectType> objectTypes = new ArrayList<>();
        if (StringUtils.isBlank(types)) {
            types = "movie,series,show,tag";
        }
        String[] allTypes = types.split(",");
        for (String type : allTypes) {
            if (type.equals("movies")) {
                type = "movie";
            }
            if (type.equals("shows")) {
                type = "show";
            }
            if (type.equals("tags")) {
                type = "tag";
            }
            if (type.equals("series")) {
                type = "series";
            }
            objectTypes.add(Carousel.Render.ObjectType.valueOf(type.toUpperCase()));
        }

        List<Carousel> result = new ArrayList<>();

        for (Carousel.Render.ObjectType objectType : objectTypes) {
            Collection<Object> objects = new ArrayList<>();
            if (objectType.equals(Carousel.Render.ObjectType.TAG)) {
                Collection<? extends Tag> tags = searchService.searchTags(q, context.pageSize());
                for (Tag tag : tags) {
                    prepareImages(tag, tagService.getTagDefinition(tag.getTagDefinitionId()));
                    objects.add(new TagDto(tag, ((TagIndex) tag).getTagDefinitionName()));
                }
            } else {
                Collection<? extends Program> programs = searchService.searchPrograms(q, ProgramType.valueOf(objectType.name()), context.pageSize());
                for (Program program : programs) {
                    objects.add(setDirector(program));
                }
            }
            result.add(Carousel.builder()
                    .title(i18n.getMessage("videos." + objectType.name().toLowerCase()))
                    .objects(objects)
                    .render(Carousel.Render.builder().objectType(objectType).type(Carousel.CarouselType.CAROUSEL).build())
                    .build());
        }

        return result;
    }
}

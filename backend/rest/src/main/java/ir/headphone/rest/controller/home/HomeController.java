package ir.headphone.rest.controller.home;

import com.fasterxml.jackson.databind.ObjectMapper;
import ir.headphone.rest.controller.AbstractController;
import ir.headphone.rest.controller.video.ProgramController;
import ir.headphone.rest.controller.video.TagController;
import ir.headphone.rest.controller.video.admin.TagAdminController;
import ir.headphone.rest.controller.video.dto.ProgramDto;
import ir.headphone.rest.controller.video.dto.TagDto;
import ir.headphone.rest.i18n.Internationalization;
import ir.headphone.rest.service.impl.FileStorageService;
import ir.headphone.spi.kvstore.service.KeyValueStoreService;
import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.video.model.Program;
import ir.headphone.spi.video.model.ProgramType;
import ir.headphone.spi.video.model.Tag;
import ir.headphone.spi.video.service.TagService;
import ir.headphone.spi.video.service.VideoService;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HomeController extends AbstractController {
    private static final String HOMEPAGE_KEY_PREFIX = "homepage-";
    private final VideoService videoService;
    private final TagService tagService;
    private final ProgramController programController;
    private final TagController tagController;
    private final TagAdminController tagAdminController;
    private final ObjectMapper objectMapper;
    private final Internationalization i18n;
    private final KeyValueStoreService keyValueStoreService;
    private final FileStorageService fileStorageService;

    public HomeController(VideoService videoService, TagService tagService,
                          ProgramController programController, TagController tagController,
                          TagAdminController tagAdminController, Internationalization i18n,
                          KeyValueStoreService keyValueStoreService, FileStorageService fileStorageService) {
        this.videoService = videoService;
        this.tagService = tagService;
        this.programController = programController;
        this.tagController = tagController;
        this.tagAdminController = tagAdminController;
        this.i18n = i18n;
        this.keyValueStoreService = keyValueStoreService;
        this.objectMapper = new ObjectMapper();
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/home/{type}")
    public List<Carousel> getHomePage(@PathVariable String type) {
        HomePageConfig config = getHomePageConfig(type);
        for (Carousel carousel : config.getCarousels()) {
            carousel.setMoreTitle(i18n.getMessage("videos.seeAll"));
            if (carousel.getRender().getType().equals(Carousel.CarouselType.BANNER)) {
                fillCarouselBannerObjects(carousel);
            } else {
                fillCarouselListObjects(carousel);
            }
        }

        return config.getCarousels();
    }


    @GetMapping("/admin/home/{type}/config")
    public HomePageConfig getHomePageConfig(@PathVariable String type) {
        try {
            return readConfig(type);
        } catch (Exception e) {
            return new HomePageConfig(); //TODO handle default config
        }
    }


    @PostMapping("/admin/home/{type}/config")
    public HomePageConfig updateHomePageConfig(@PathVariable String type, @RequestBody HomePageConfig config) throws Exception {
        writeConfig(type, config);
        return config;
    }

    private void fillCarouselBannerObjects(Carousel carousel) {
        if (carousel.getObjects() == null || carousel.getObjects().size() == 0) {
            if (carousel.getRender().getObjectType().equals(Carousel.Render.ObjectType.ALBUM)) {
                carousel.setObjects(List.of(programController.getPage(ProgramType.ALBUM.name(), carousel.getRender().getFillValue())));
            }
            if (carousel.getRender().getObjectType().equals(Carousel.Render.ObjectType.PLAYLIST)) {
                carousel.setObjects(List.of(programController.getPage(ProgramType.PLAYLIST.name(), carousel.getRender().getFillValue())));
            }
            if (carousel.getRender().getObjectType().equals(Carousel.Render.ObjectType.TAG)) {
                TagDto tagDto = tagAdminController.get(carousel.getRender().getFillValue());
                List<Object> items = new ArrayList<>(tagController.getPrograms(carousel.getRender().getFillValue(), ProgramType.ALBUM.name()));
                tagDto.setItems(items);
                carousel.setObjects(List.of(tagDto));
            }
        }
    }

    private Collection<?> fillCarouselListObjects(Carousel carousel) {
        if (!carousel.getRender().getType().equals(Carousel.CarouselType.CAROUSEL)) {
            if (carousel.getObjects() != null && carousel.getObjects().size() > 0) {
                for (Object object : carousel.getObjects()) {
                    if (object instanceof Map && ((Map<String, Object>) object).get("title") != null && ((Map<String, Object>) object).get("objects") == null) {
                        Carousel c = objectMapper.convertValue(object, Carousel.class);
                        ((Map<String, Object>) object).put("objects", fillCarouselListObjects(c));
                    }
                }
//            } else {
//                carousel.setObjects(fillCarouselListObjects(carousel));
            }
            return carousel.getObjects();
        } else {
            Collection<Program> programs;
            List<Object> objects = new ArrayList<>();
            PageSize pageSize = PageSize.of(0, 20);
            if (carousel.getRender().getObjectType().equals(Carousel.Render.ObjectType.TAG)) {
                Collection<? extends Tag> tags1 = tagService.getTagsByDefinition(carousel.getRender().getFillValue(), PageSize.of(0, 1000));
                Object[] objects1 = tags1.toArray();
                ArrayUtils.shuffle(objects1);
                List<Tag> tags = new ArrayList<>();
                for (Object t : objects1) {
                    tags.add((Tag) t);
                }
                List<Object> list = new ArrayList<>();
                for (Tag tag : tags) {
                    list.add(tagAdminController.get(tag.getId()));
                }
                carousel.setObjects(list);
                carousel.setPageSize(pageSize);
                return list;
            } else {
                ProgramType programType = ProgramType.valueOf(carousel.getRender().getObjectType().name());

                if (carousel.getRender().getFillValue().equals("latest")) {
                    programs = videoService.getLatestPrograms(programType, pageSize);
                } else {
                    programs = videoService.getProgramsByTag(carousel.getRender().getFillValue(), programType, pageSize);
                }

                for (Program program : programs) {
                    objects.add(new ProgramDto(program, fileStorageService.prepareImages(program.getImage())));
                }
                carousel.setObjects(objects);
                carousel.setPageSize(pageSize);
                return objects;
            }
        }
    }

    private HomePageConfig readConfig(String type) throws Exception {
        String key = HOMEPAGE_KEY_PREFIX + type;
        String value = keyValueStoreService.getValue(key);
        return objectMapper.readValue(value, HomePageConfig.class);
    }

    private void writeConfig(String type, HomePageConfig config) throws Exception {
        String value = objectMapper.writeValueAsString(config);
        String key = HOMEPAGE_KEY_PREFIX + type;
        keyValueStoreService.save(key, value);
    }
}
package ir.headphone.rest.controller.video;

import ir.headphone.rest.controller.home.Carousel;
import ir.headphone.rest.controller.video.dto.LinkDto;
import ir.headphone.rest.controller.video.dto.ProgramDto;
import ir.headphone.rest.controller.video.dto.ProgramPageDto;
import ir.headphone.rest.controller.video.dto.TagDto;
import ir.headphone.rest.controller.video.dto.AlbumDto;
import ir.headphone.rest.error.SubscriptionRequired;
import ir.headphone.rest.error.TicketRequired;
import ir.headphone.rest.error.AlbumNotExist;
import ir.headphone.rest.i18n.Internationalization;
import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.search.service.SearchService;
import ir.headphone.spi.social.SocialService;
import ir.headphone.spi.social.model.AvgRate;
import ir.headphone.spi.user.model.Subscription;
import ir.headphone.spi.user.model.SubscriptionPlan;
import ir.headphone.spi.user.service.SubscriptionService;
import ir.headphone.spi.user.service.UserService;
import ir.headphone.spi.video.model.Program;
import ir.headphone.spi.video.model.ProgramType;
import ir.headphone.spi.video.model.Tag;
import ir.headphone.spi.video.model.TagBinding;
import ir.headphone.spi.video.model.VideoBinding;
import ir.headphone.spi.video.service.TagService;
import ir.headphone.spi.video.service.VideoService;
import ir.headphone.videos.error.ProgramNotFound;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/headphone/{type}")
public class ProgramController extends AbstractProgramController {
    private final UserService userService;
    private final SocialService socialService;
    private final SubscriptionService subscriptionService;

    public ProgramController(VideoService videoService, TagService tagService, SearchService searchService,
                             Internationalization i18n, UserService userService, SocialService socialService,
                             SubscriptionService subscriptionService) {
        super(videoService, tagService, searchService, i18n);
        this.userService = userService;
        this.socialService = socialService;
        this.subscriptionService = subscriptionService;
    }

    @GetMapping({"/{id}/page"})
    public ProgramPageDto getPage1(@PathVariable String type, @PathVariable String id) {
        return getPage(type, id);
    }

    @GetMapping({"/{id}"})
    public ProgramPageDto getPage(@PathVariable String type, @PathVariable String id) {
        Program program = getProgramEntity(id, getType(type));
        if (!program.getEnabled()) {
            throw new ProgramNotFound(id);
        }
        ProgramPageDto result = new ProgramPageDto(program, fileStorageService.prepareImages(program.getImage()));

        result.setTags(getTags(program.getId()));

        Collection<VideoBinding> bindings = videoService.getVideoBindings(program.getId(), PageSize.of(0, 1000));
        Map<Integer, List<AlbumDto>> seasons = new HashMap<>();
        for (VideoBinding binding : bindings) {
            Program v = getProgramEntity(binding.getVideoId(), null);
            AlbumDto e = new AlbumDto(binding, v);
//            e.setTags(getTags(e.getId()));
            seasons.putIfAbsent(binding.getSeasonNumber(), new ArrayList<>());
            seasons.get(binding.getSeasonNumber()).add(e);
        }
        result.setSeasons(seasons);

        Collection<Program> programs = null;
        List<Carousel> carousels = new ArrayList<>();
        PageSize pageSize = PageSize.of(0, 20);
        carousels.add(Carousel.builder()
                .title(i18n.getMessage("videos.related-" + type))
                .deepLink(String.format("/p/%s/%s/related", type, id))
                .order(0)
                .moreTitle(i18n.getMessage("videos.seeAll"))
                .render(Carousel.Render.builder().type(Carousel.CarouselType.CAROUSEL).objectType(Carousel.Render.ObjectType.valueOf(getType(type).name())).build())
                .objects(getRelated(getType(type), id, pageSize))
                .pageSize(pageSize)
                .build());
        List<TagDto> crew = result.getTags().get("crew");
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
                        programs = videoService.getProgramsByTag(tag.getId(), getType(type), pageSize);
                        List<ProgramDto> objects = new ArrayList<>();
                        for (Program p : programs) {
                            objects.add(new ProgramDto(p, fileStorageService.prepareImages(p.getImage())));
                        }
                        carousels.add(Carousel.builder()
                                .title(i18n.getMessage("videos.from-this.director"))
                                .deepLink(String.format("/t/crew/%s/%s", tag.getId(), type))
                                .order(1)
                                .moreTitle(i18n.getMessage("videos.seeAll"))
                                .render(Carousel.Render.builder().type(Carousel.CarouselType.CAROUSEL).objectType(Carousel.Render.ObjectType.valueOf(getType(type).name())).build())
                                .objects(objects)
                                .pageSize(pageSize)
                                .build());
                        break;
                    }
                }
            }
        }
        result.setCarousels(carousels);
        if (result.getSeasons().get(1) != null) {
            for (AlbumDto video : result.getSeasons().get(1)) {
                if (video.getEpisodeNumber().equals(1)) {
                    video.setTags(getTags(video.getId()));
                }
            }
        }
        String userId = "";
        if (StringUtils.isNotBlank(context.userToken())) {
            try {
                userId = userService.getUserId(context.userToken());
            } catch (Exception ignored) {
            }
        }
        setUserRelatedInfo(result, userId);
        try {
            List<TagDto> genre = result.getTags().get("genre");
            Map<String, Object> data = new HashMap<>();
            data.put("id", result.getId());
            data.put("title", result.getTitle());
            data.put("type", program.getType());
            StringBuilder genres = new StringBuilder();
            if (genre.size() > 0) {
                for (TagDto t : genre) {
                    genres.append(t.getValue());
                    genres.append(",");
                }
                saveEvent("view", data, genres.toString());
            } else {
                saveEvent("view", data);
            }
        } catch (Exception ignored) {
        }
        return setIsFavorite(result, userId);
    }

    private void setUserRelatedInfo(ProgramPageDto dto, String userId) {
        try {
            dto.setUserHasTicket(false);
            Long likeCount = socialService.getLikeCount(dto.getId());
            Long dislikeCount = socialService.getDislikeCount(dto.getId());
            dto.setLikeCount(likeCount + dislikeCount);
            if (likeCount == 0) {
                dto.setLikedPercent("0%");
            } else {
                dto.setLikedPercent(String.format("%.0f%%", (likeCount * 100f) / (likeCount + dislikeCount)));
            }
            AvgRate rate = socialService.getAvgRate(dto.getId());
            if (rate != null) {
                dto.setRate(rate.getRate());
                dto.setRateCount(rate.getRateCount());
            }
            if (StringUtils.isNotBlank(userId)) {
                dto.setLiked(socialService.isLiked(userId, dto.getId()));
                dto.setDisliked(socialService.isDisliked(userId, dto.getId()));
                TagBinding binding = hasTag(dto.getId(), "online");

                if (binding != null) {
                    String ticket = (String) binding.getBindings().get("ticket");
                    Subscription t = subscriptionService.getSubscription(userId, ticket, dto.getId());
                    if (t != null) {
                        dto.setUserHasTicket(true);
                        int timeScale = 24;
                        if (t.getTimeUnit().equals(SubscriptionPlan.SubscriptionTimeUnit.HOUR)) {
                            timeScale = 1;
                        }
                        Date expiry = DateUtils.addHours(new Date(t.getPaidDate()), t.getDuration() * timeScale);
                        dto.setTicketExpiry(expiry.getTime());
                    }
                }
                dto.setUserRate(socialService.getUserRate(userId, dto.getId()));
            }
        } catch (Exception ignored) {
        }
    }

    private ProgramPageDto setIsFavorite(ProgramPageDto dto, String userId) {
        if (StringUtils.isNotBlank(userId)) {
            dto.setIsFavorite(userService.isFavorite(userId, dto.getId()));
        }
        return dto;
    }

    private TagBinding hasTag(String programId, String tagValue) {
        Collection<? extends Tag> tags = tagService.getTagsByEntityId(programId, null);
        for (Tag tag : tags) {
            if (tag.getValue().equals(tagValue)) {
                return tagService.getTagBindingByEntityIdAndTagId(programId, tag.getId());
            }
        }
        return null;
    }

    @PutMapping("/{id}/like")
    public void addLike(@PathVariable String id) {
        socialService.like(userService.getUserId(context.userToken()), id, true);
    }

    @DeleteMapping("/{id}/like")
    public void removeLike(@PathVariable String id) {
        socialService.like(userService.getUserId(context.userToken()), id, false);
    }

    @PutMapping("/{id}/dislike")
    public void addDislike(@PathVariable String id) {
        socialService.dislike(userService.getUserId(context.userToken()), id, true);
    }

    @DeleteMapping("/{id}/dislike")
    public void removeDislike(@PathVariable String id) {
        socialService.dislike(userService.getUserId(context.userToken()), id, false);
    }

    @PutMapping("/{id}/rate")
    public void rate(@PathVariable String id, @RequestParam Integer rate) {
        socialService.rate(userService.getUserId(context.userToken()), id, rate);
    }

    @GetMapping("/{id}/link")
    public LinkDto getLink(@PathVariable String id) {
        String userId = "";
        if (StringUtils.isNotBlank(context.userToken())) {
            try {
                userId = userService.getUserId(context.userToken());
            } catch (Exception ignored) {
            }
        }

        Program entity = getProgramEntity(id, null);
        VideoBinding binding;
        binding = videoService.getVideoBindingByVideoId(entity.getId());
        if (binding != null) {
            Map<String, List<TagDto>> tags = getTags(id);
            if (tags.get("online") != null) {
                TagDto ticketTag = tags.get("online").get(0);
                String ticket = (String) ticketTag.getBindings().get("ticket");
                if (StringUtils.isBlank(userId)) {
                    throw new TicketRequired(Map.of("ticket", ticket));
                }
                Subscription subscription = subscriptionService.getSubscription(userId, ticket, id);
                if (subscription == null) {
                    throw new TicketRequired(Map.of("ticket", ticket));
                }
                return new LinkDto(entity.getTitle(), binding.getLink(), tags);
            }
            if (tags.get("free") != null) {
                return new LinkDto(entity.getTitle(), binding.getLink(), tags);
            }
            if (StringUtils.isBlank(userId)) {
                throw new SubscriptionRequired();
            }
            Long remained = subscriptionService.getRemainedSubscriptionDays(userId);
            if (remained == 0) {
                throw new SubscriptionRequired();
            }
            return new LinkDto(entity.getTitle(), binding.getLink(), tags);
        }
        throw new AlbumNotExist();
    }

    @GetMapping({"/{id}/{season}/{episode}"})
    public ProgramPageDto getEpisodePage(@PathVariable String type, @PathVariable String id, @PathVariable Integer season, @PathVariable Integer episode) {
        ProgramPageDto result = getPage(type, id);
        if (result.getSeasons().get(season) != null) {
            for (AlbumDto video : result.getSeasons().get(season)) {
                if (video.getEpisodeNumber().equals(episode)) {
                    video.setTags(getTags(video.getId()));
                }
            }
        }
        String userId = "";
        if (StringUtils.isNotBlank(context.userToken())) {
            try {
                userId = userService.getUserId(context.userToken());
            } catch (Exception ignored) {
            }
        }
        setUserRelatedInfo(result, userId);
        return setIsFavorite(result, userId);
    }

    @GetMapping("/{id}/related")
    public List<ProgramPageDto> getRelated(@PathVariable String type, @PathVariable String id) {
        ProgramPageDto program = getProgram(id, false, false);
        Collection<Program> programs;
        List<TagDto> genre = program.getTags().get("genre");
        if (genre != null) {
            if (genre.size() > 0) {
                programs = videoService.getProgramsByTag(genre.get(0).getId(), getType(type), context.pageSize());
                return toDtoList(programs);
            }
        }
        return List.of();
    }

    @GetMapping("/items/latest")
    public List<ProgramPageDto> getLatest1(@PathVariable String type) {
        return getLatest(type);
    }

    @GetMapping("/latest")
    public List<ProgramPageDto> getLatest(@PathVariable String type) {
        Collection<Program> programs = videoService.getLatestPrograms(getType(type), context.pageSize());
        return toDtoList(programs);
    }

    private List<ProgramPageDto> toDtoList(Collection<Program> programs) {
        List<ProgramPageDto> result = new ArrayList<>();
        String userId = "";
        if (StringUtils.isNotBlank(context.userToken())) {
            try {
                userId = userService.getUserId(context.userToken());
            } catch (Exception ignored) {
            }
        }
        for (Program p : programs) {
            if (!p.getEnabled()) {
                continue;
            }
            result.add(setIsFavorite(setDirector(p), userId));
        }
        return result;
    }


}

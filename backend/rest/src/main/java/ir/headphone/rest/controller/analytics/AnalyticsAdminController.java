package ir.headphone.rest.controller.analytics;

import ir.headphone.rest.controller.AbstractController;
import ir.headphone.rest.controller.analytics.dto.HotView;
import ir.headphone.rest.service.impl.DefaultContextHolder;
import ir.headphone.spi.analytics.service.AnalyticsService;
import ir.headphone.spi.user.service.SubscriptionService;
import ir.headphone.spi.video.service.VideoService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/analytics")
public class AnalyticsAdminController extends AbstractController {
    private final AnalyticsService analyticsService;
    private final SubscriptionService subscriptionService;
    private final VideoService videoService;

    public AnalyticsAdminController(AnalyticsService analyticsService, SubscriptionService subscriptionService,
                                    VideoService videoService) {
        this.analyticsService = analyticsService;
        this.subscriptionService = subscriptionService;
        this.videoService = videoService;
    }

    @PostMapping("/{eventName}")
    public Map<String, Long> info(@RequestBody(required = false) Map<String, Object> data,
                                  @PathVariable String eventName,
                                  @RequestParam(required = false) String device,
                                  @RequestParam(defaultValue = "0") Long from,
                                  @RequestParam(defaultValue = "0") Long to) {
        return analyticsService.statistics(eventName, device, data, from, to);
    }

    @PostMapping("/hot/{event}")
    public List<HotView> getHotViews(@PathVariable String event,
                                     @RequestParam(defaultValue = "0") Long from,
                                     @RequestParam(defaultValue = "0") Long to,
                                     @RequestBody(required = false) Map<String, Object> data) {
        if (data == null) {
            data = new HashMap<>();
        }
        if (data.get("type") != null && StringUtils.isNotBlank((String) data.get("type"))) {
            data.put("type", ((String) data.get("type")).toUpperCase());
        }
        String device = null;
        if (data.get("device") != null && StringUtils.isNotBlank((String) data.get("device"))) {
            device = (String) data.get("device");
        }
        Map<String, Long> hots = analyticsService.getHots(event, device, data, from, to);
        DefaultContextHolder.getInstance().setPageCount((long) (hots.size() / context.pageSize().getSize())
                + (hots.size() % context.pageSize().getSize() == 0 ? 0L : 1L));
        Map<String, Long> sorted = hots.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .skip(context.pageSize().getPage() * context.pageSize().getSize()).limit(context.pageSize().getSize())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));

        List<HotView> result = new ArrayList<>();
        for (String key : sorted.keySet()) {
            String title = key;
            try {
                title = videoService.getProgram(key).getTitle();
            } catch (Exception ignored) {
            }
            result.add(HotView.builder().id(key).count(sorted.get(key)).title(title).build());
        }
        return result;
    }

}

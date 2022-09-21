package ir.headphone.rest.controller.analytics;

import ir.headphone.analytics.error.AnalyticsException;
import ir.headphone.rest.controller.AbstractController;
import ir.headphone.rest.controller.analytics.dto.EventDto;
import ir.headphone.spi.analytics.service.AnalyticsService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController extends AbstractController {
    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @PostMapping(value = "")
    public void logEvent(@RequestBody EventDto event) {
        if (StringUtils.isBlank(event.getName())) {
            throw new AnalyticsException("invalid name", 400);
        }
        save(event);
    }

    @PostMapping(value = "/{eventName}")
    public void logEvent(@PathVariable String eventName,
                         @RequestBody Map<String, Object> data) {
        EventDto event = EventDto.builder().name(eventName).data(data).build();
        save(event);
    }

    @GetMapping(value = "/{eventName}")
    public void logEvent(@PathVariable String eventName) {
        EventDto event = EventDto.builder().name(eventName).build();
        save(event);
    }

    private void save(EventDto event) {
        event.setDevice(context.device());
        event.setOs(context.os());
        event.setIp(context.ip());
        analyticsService.save(event);
    }


}

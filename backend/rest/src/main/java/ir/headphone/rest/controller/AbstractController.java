package ir.headphone.rest.controller;

import ir.headphone.rest.controller.analytics.dto.EventDto;
import ir.headphone.rest.service.impl.DefaultContextHolder;
import ir.headphone.rest.service.impl.FileStorageService;
import ir.headphone.spi.analytics.service.AnalyticsService;
import ir.headphone.spi.user.service.ContextHolder;
import ir.headphone.spi.user.service.UserService;
import ir.headphone.spi.video.model.Field;
import ir.headphone.spi.video.model.Tag;
import ir.headphone.spi.video.model.TagDefinition;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

public abstract class AbstractController {
    protected final ContextHolder context = DefaultContextHolder.getInstance();
    @Autowired
    protected FileStorageService fileStorageService;
    @Autowired
    private AnalyticsService analyticsService;
    @Autowired
    private UserService userService;

    protected void saveEvent(String name, Map<String, Object> data) {
        saveEvent(name, data, null);
    }

    protected void saveEvent(String name, Map<String, Object> data, String extra) {
        if (StringUtils.isBlank(name)) {
            return;
        }
        EventDto event = new EventDto();
        event.setName(name);
        String userId = "anonymous";
        if (StringUtils.isNotBlank(context.userToken())) {
            try {
                userId = userService.getUserId(context.userToken());
            } catch (Exception ignored) {
            }
        }
        event.setUserId(userId);
        event.setData(data);
        event.setDevice(context.device());
        event.setIp(context.ip());
        event.setOs(context.os());
        event.setExtra(extra);
        analyticsService.save(event);
    }


    protected void saveEvent(String name) {
        saveEvent(name, null);
    }

    protected void prepareImages(Tag tag, TagDefinition definition) {
        if (definition == null || definition.getFields() == null) {
            return;
        }
        for (Field field : definition.getFields()) {
            if (field.getType().equals(Field.FieldType.IMAGE)) {
                tag.getFields().computeIfPresent(field.getName(), (s, v) -> fileStorageService.prepareImages(String.valueOf(v)));
            }
        }
    }
}

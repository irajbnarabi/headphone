package ir.headphone.rest.controller.analytics.dto;

import ir.headphone.spi.analytics.model.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventDto implements Event {
    private String id;
    private Long createdAt;
    private Long updatedAt;
    private String name;
    private String device;
    private String os;
    private String ip;
    private String userId;
    private Map<String, Object> data;
    private String extra;

    public EventDto(Event event) {
        this.id = event.getId();
        this.createdAt = event.getCreatedAt();
        this.updatedAt = event.getUpdatedAt();
        this.name = event.getName();
        this.device = event.getDevice();
        this.os = event.getOs();
        this.ip = event.getIp();
        this.data = event.getData();
        this.userId = event.getUserId();
        this.extra = event.getExtra();
    }
}

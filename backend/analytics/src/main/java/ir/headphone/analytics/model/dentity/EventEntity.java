package ir.headphone.analytics.model.dentity;

import ir.headphone.helper.db.mongodb.AbstractEntity;
import ir.headphone.spi.analytics.model.Event;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Document(collection = "events")
public class EventEntity extends AbstractEntity implements Event {
    private String name;
    private String device;
    private String os;
    private String ip;
    private String userId;
    private Map<String, Object> data;
    private String extra;

    public EventEntity(Event event) {
        super(event);
        this.name = event.getName();
        this.device = event.getDevice();
        this.os = event.getOs();
        this.ip = event.getIp();
        this.userId = event.getUserId();
        this.data = event.getData();
        this.extra = event.getExtra();
    }
}

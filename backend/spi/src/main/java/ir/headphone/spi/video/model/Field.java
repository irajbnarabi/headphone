package ir.headphone.spi.video.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Field {
    private String name;
    private String description;
    private FieldType type;
    private Set<String> constraints;

    public enum FieldType {
        ENUM, TEXT, NUMBER, IMAGE, VIDEO, DATE, UNIQUE, MULTILINE, TICKET
    }
}
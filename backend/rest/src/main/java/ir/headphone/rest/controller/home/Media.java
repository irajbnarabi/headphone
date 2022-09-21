package ir.headphone.rest.controller.home;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class    Media {
    private String id;
    private String image;
    private MediaType type;
    private String deepLink;

    public enum MediaType {
        PICTURE,
        VIDEO
    }
}
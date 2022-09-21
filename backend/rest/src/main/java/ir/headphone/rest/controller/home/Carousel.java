package ir.headphone.rest.controller.home;

import ir.headphone.spi.model.PageSize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Carousel {
    private String title;
    private String moreTitle;
    private String icon;
    private String deepLink;
    private Integer order;
    private Render render;
    private Collection<?> objects;
    private PageSize pageSize;

    public enum CarouselType {
        CAROUSEL, BANNER, HORIZONTAL, VERTICAL
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Render {
        private CarouselType type;
        private ObjectType objectType;
        private String fillValue;

        public enum ObjectType {
            ALBUM, PLAYLIST, TAG, MEDIA
        }

    }
}
package ir.headphone.spi.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PageSize {
    private Integer page;
    private Integer size;

    public static PageSize of(int page, int size) {
        return new PageSize(page, size);
    }
}

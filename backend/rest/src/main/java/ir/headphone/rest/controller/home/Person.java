package ir.headphone.rest.controller.home;

import ir.headphone.spi.video.model.Program;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class Person {
    private String id;
    private String name;
    private String title;
    private String image;
    private String deepLink;
    private List<Program> movies;
}

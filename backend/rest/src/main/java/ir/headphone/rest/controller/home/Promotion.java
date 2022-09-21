package ir.headphone.rest.controller.home;

import ir.headphone.rest.controller.video.dto.ProgramDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class Promotion {
    private String id;
    private String name;
    private String title;
    private String image;
    private String deepLink;
    private List<ProgramDto> programs;

    public Promotion() {
    }
}

package ir.headphone.rest.controller.user.dto;

import ir.headphone.rest.controller.video.dto.ProgramDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FavoriteListDto {
    private List<ProgramDto> movies;
    private List<ProgramDto> series;
}

package ir.headphone.rest.controller.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SessionDto {
    private String id;
    private String device;
    private Long lastUsage;
    private Boolean current;
    private String ip;
}

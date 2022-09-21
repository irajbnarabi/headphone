package ir.headphone.search.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@Data
@ConfigurationProperties(prefix = "search")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchExternalConfig {
    private String host;
    private Integer port;
}

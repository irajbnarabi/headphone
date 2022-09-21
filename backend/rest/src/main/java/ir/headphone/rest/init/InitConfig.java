package ir.headphone.rest.init;

import ir.headphone.videos.model.entity.TagDefinitionEntity;
import ir.headphone.videos.model.entity.TagEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties("init")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InitConfig {
    private List<TagDefinitionEntity> definitions;
    private List<TagEntity> tags;
}
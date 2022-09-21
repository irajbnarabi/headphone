package ir.headphone.rest.controller.video;

import ir.headphone.rest.controller.AbstractController;
import ir.headphone.rest.controller.video.dto.TagDto;
import ir.headphone.spi.video.model.Tag;
import ir.headphone.spi.video.service.TagService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tag-definitions")
public class TagDefinitionController extends AbstractController {
    private final TagService tagService;

    public TagDefinitionController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping("/{id}/tags")
    public List<TagDto> get(@PathVariable String id) {
        Collection<? extends Tag> tags = tagService.getTagsByDefinition(id, context.pageSize());
        List<TagDto> result = new ArrayList<>();
        for (Tag tag : tags) {
            result.add(TagDto.builder().id(tag.getId()).value(tag.getValue()).fields(tag.getFields()).build());
        }
        return result;
    }
}

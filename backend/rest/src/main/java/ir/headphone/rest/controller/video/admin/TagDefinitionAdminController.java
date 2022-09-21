package ir.headphone.rest.controller.video.admin;

import ir.headphone.rest.controller.AbstractController;
import ir.headphone.rest.controller.video.admin.model.TagDefinitionEntity;
import ir.headphone.rest.controller.video.dto.TagDefinitionDto;
import ir.headphone.rest.controller.video.dto.TagDto;
import ir.headphone.rest.service.impl.DefaultContextHolder;
import ir.headphone.spi.video.model.Tag;
import ir.headphone.spi.video.model.TagDefinition;
import ir.headphone.spi.video.service.TagService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/tag-definitions")
public class TagDefinitionAdminController extends AbstractController {
    private final TagService tagService;

    public TagDefinitionAdminController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping("")
    public Collection<TagDefinitionDto> get() {
        Collection<? extends TagDefinition> tagDefinitions = tagService.getTagDefinitions(context.pageSize());
        List<TagDefinitionDto> result = new ArrayList<>();
        for (TagDefinition definition : tagDefinitions) {
            result.add(new TagDefinitionDto(definition));
        }
        DefaultContextHolder.getInstance().setPageCount(tagService.getTagDefinitionsCount() / context.pageSize().getSize() + 1);
        return result;
    }

    @GetMapping("/{id}")
    public TagDefinitionDto get(@PathVariable String id) {
        return new TagDefinitionDto(tagService.getTagDefinition(id));
    }

    @GetMapping("/{id}/tags")
    public Collection<TagDto> getTags(@PathVariable String id) {
        TagDefinitionDto dto = get(id);
        Collection<? extends Tag> tags = tagService.getTagsByDefinition(id, context.pageSize());
        List<TagDto> result = new ArrayList<>();
        for (Tag tag : tags) {
            prepareImages(tag, tagService.getTagDefinition(tag.getTagDefinitionId()));
            result.add(new TagDto(tag, dto.getName()));
        }
        DefaultContextHolder.getInstance().setPageCount(tagService.getTagsByDefinitionCount(id) / context.pageSize().getSize() + 1);
        return result;
    }

    @GetMapping("/{id}/tags/prefix/{prefix}")
    public Collection<TagDto> getTagsByValuePrefix(@PathVariable String id, @PathVariable String prefix) {
        TagDefinitionDto dto = get(id);
        Collection<? extends Tag> tags = tagService.getTagsByPrefix(id,prefix, context.pageSize());
        List<TagDto> result = new ArrayList<>();
        for (Tag tag : tags) {
            prepareImages(tag, tagService.getTagDefinition(tag.getTagDefinitionId()));
            result.add(new TagDto(tag, dto.getName()));
        }
        return result;
    }

    @PostMapping("")
    public TagDefinitionDto create(@RequestBody TagDefinitionDto dto) {
        dto.setId(null);
        return new TagDefinitionDto(tagService.createTagDefinition(new TagDefinitionEntity(dto)));
    }

    @PutMapping("/{id}")
    public TagDefinitionDto update(@PathVariable String id, @RequestBody TagDefinitionDto dto) {
        get(id);
        dto.setId(id);
        return new TagDefinitionDto(tagService.updateTagDefinition(new TagDefinitionEntity(dto)));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        tagService.deleteTagDefinition(id);
    }
}

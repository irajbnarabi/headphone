package ir.headphone.rest.controller.video.admin;

import ir.headphone.rest.controller.AbstractController;
import ir.headphone.rest.controller.video.admin.model.TagEntity;
import ir.headphone.rest.controller.video.dto.TagDto;
import ir.headphone.rest.service.impl.DefaultContextHolder;
import ir.headphone.spi.video.model.Tag;
import ir.headphone.spi.video.model.TagDefinition;
import ir.headphone.spi.video.service.TagService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/tags")
public class TagAdminController extends AbstractController {
    private final TagService tagService;

    public TagAdminController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping("")
    public List<TagDto> getAll(@RequestParam(defaultValue = "") String prefix,
                               @RequestParam(defaultValue = "") String definition) {

        String defId = null;
        if (StringUtils.isNotBlank(definition)) {
            defId = tagService.getTagDefinitionByName(definition).getId();
        }

        Collection<? extends Tag> tags;
        tags = tagService.getTagsByPrefix(defId, prefix, context.pageSize());

        return getDtos(tags);
    }

    private List<TagDto> getDtos(Collection<? extends Tag> tags) {
        List<TagDto> result = new ArrayList<>();
        for (Tag tag : tags) {
            prepareImages(tag, tagService.getTagDefinition(tag.getTagDefinitionId()));
            TagDefinition definition = tagService.getTagDefinition(tag.getTagDefinitionId());
            result.add(new TagDto(tag, definition.getName()));
        }
        DefaultContextHolder.getInstance().setPageCount(tagService.getTagsCount() / context.pageSize().getSize() + 1);
        return result;
    }

    @GetMapping("/{id}")
    public TagDto get(@PathVariable String id) {
        Tag tag = tagService.getTag(id);
        prepareImages(tag, tagService.getTagDefinition(tag.getTagDefinitionId()));
        TagDefinition tagDefinition = tagService.getTagDefinition(tag.getTagDefinitionId());
        return new TagDto(tag, tagDefinition.getName());
    }

    @PostMapping("")
    public TagDto create(@RequestBody TagDto dto) {
        dto.setId(null);
        Tag tag = tagService.createTag(new TagEntity(dto));
        prepareImages(tag, tagService.getTagDefinition(tag.getTagDefinitionId()));
        dto.setId(tag.getId());
        return dto;
    }

    @PutMapping("/{id}")
    public TagDto update(@PathVariable String id, @RequestBody TagDto dto) {
        Tag t = tagService.getTag(id);
        TagEntity tag = new TagEntity();
        tag.setId(t.getId());
        tag.setCreatedAt(t.getCreatedAt());
        tag.setTagDefinitionId(t.getTagDefinitionId());
        tag.setValue(dto.getValue());
        tag.setFields(dto.getFields());
        tagService.updateTag(tag);
        prepareImages(tag, tagService.getTagDefinition(tag.getTagDefinitionId()));
        return dto;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        tagService.deleteTag(id);
    }
}

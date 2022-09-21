package ir.headphone.videos.error;

import ir.headphone.spi.error.NotFound;

public class TagNotFound extends NotFound {
    public TagNotFound(String tagId) {
        super("tag is not found. id: " + tagId);
    }

    public TagNotFound(String tagDefinitionId, String value) {
        super("tag is not found. definitionId: " + tagDefinitionId + " and value: " + value);
    }
}

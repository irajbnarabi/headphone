package ir.headphone.videos.error;

import ir.headphone.spi.error.NotFound;

public class TagDefinitionNotFound extends NotFound {
    public TagDefinitionNotFound(String identifier) {
        super("tag definition is not found:  " + identifier);
    }
}

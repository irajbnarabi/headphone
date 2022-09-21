package ir.headphone.videos.error;

import ir.headphone.spi.error.NotFound;

public class TagBindingNotFound extends NotFound {
    public TagBindingNotFound(String tagBindingId) {
        super("tag binding is not found. id: " + tagBindingId);
    }
}

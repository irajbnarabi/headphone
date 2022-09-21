package ir.headphone.videos.error;

import ir.headphone.spi.error.NotFound;

public class VideoNotFound extends NotFound {
    public VideoNotFound(String episodeId) {
        super("episode is not found. id: " + episodeId);
    }

    public VideoNotFound() {
        super("episode is not found");
    }
}

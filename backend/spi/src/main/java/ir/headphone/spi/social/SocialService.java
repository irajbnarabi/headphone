package ir.headphone.spi.social;

import ir.headphone.spi.social.model.AvgRate;

public interface SocialService {
    void like(String userId, String entityId, boolean set);

    void dislike(String userId, String entityId, boolean set);

    Long getLikeCount(String entityId);

    Long getDislikeCount(String entityId);

    Boolean isLiked(String userId, String entityId);

    Boolean isDisliked(String userId, String entityId);

    void rate(String userId, String entityId, Integer rate);

    AvgRate getAvgRate(String entityId);

    Integer getUserRate(String userId, String entityId);
}

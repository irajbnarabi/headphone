package ir.headphone.social.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.social.model.entity.LikeEntity;

public interface LikeRepository extends Repository<LikeEntity> {
    Long countByEntityIdAndDislike(String entityId, Boolean dislike);

    LikeEntity getByUserIdAndEntityId(String userId, String entityId);
}

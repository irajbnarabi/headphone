package ir.headphone.social.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.social.model.entity.RateEntity;

public interface RateRepository extends Repository<RateEntity> {
    Long countByEntityId(String entityId);

    RateEntity getByUserIdAndEntityId(String userId, String entityId);
}

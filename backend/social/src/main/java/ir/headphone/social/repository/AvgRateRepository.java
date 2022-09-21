package ir.headphone.social.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.social.model.entity.AvgRateEntity;

public interface AvgRateRepository extends Repository<AvgRateEntity> {
    AvgRateEntity getAvgRateByEntityId(String entityId);
}

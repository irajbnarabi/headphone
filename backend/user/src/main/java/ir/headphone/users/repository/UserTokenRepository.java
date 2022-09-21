package ir.headphone.users.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.users.model.entity.UserTokenEntity;

import java.util.Collection;

public interface UserTokenRepository extends Repository<UserTokenEntity> {
    Collection<UserTokenEntity> findAllByUserIdOrderByUtilizedAtDesc(String userId);
}

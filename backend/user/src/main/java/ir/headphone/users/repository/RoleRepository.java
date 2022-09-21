package ir.headphone.users.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.users.model.entity.RoleEntity;

public interface RoleRepository extends Repository<RoleEntity> {
    RoleEntity findByName(String name);
}

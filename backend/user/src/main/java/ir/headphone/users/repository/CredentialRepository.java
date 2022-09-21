package ir.headphone.users.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.users.model.entity.CredentialEntity;

public interface CredentialRepository extends Repository<CredentialEntity> {
    CredentialEntity findByUserId(String userId);
}

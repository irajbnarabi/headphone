package ir.headphone.users.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.users.model.entity.WalletEntity;

public interface WalletRepository extends Repository<WalletEntity> {
    WalletEntity findByUserId(String userId);
}

package ir.headphone.users.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.users.model.entity.FavoriteEntity;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface FavoriteRepository extends Repository<FavoriteEntity> {
    FavoriteEntity findByUserIdAndProgramId(String userId, String programId);

    List<FavoriteEntity> findAllByUserIdAndType(String userId, String type, PageRequest pageRequest);

    void deleteByProgramId(String programId);
}

package ir.headphone.users.repository;

import ir.headphone.helper.db.Repository;
import ir.headphone.users.model.entity.UserEntity;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface UserRepository extends Repository<UserEntity> {
    UserEntity findByEmail(String email);

    List<UserEntity> findByEmailLike(String email, PageRequest pageRequest);

    UserEntity findByMobile(String mobile);

    List<UserEntity> findByMobileLike(String mobile, PageRequest pageRequest);
}
